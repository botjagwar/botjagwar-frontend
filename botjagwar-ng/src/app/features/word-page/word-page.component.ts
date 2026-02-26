import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, finalize, forkJoin, of } from 'rxjs';

import { Definition } from '../../core/models/definition.model';
import { Word } from '../../core/models/word.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { WordEditService } from '../../core/services/word-edit.service';
import {
  isKnownLanguageCode,
  normalizeWordForSave,
  removeDefinitionFromWord
} from '../../core/helpers/edit-workflow.helpers';

@Component({
  selector: 'app-word-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './word-page.component.html'
})
export class WordPageComponent implements OnInit {
  term = '';
  words: Word[] = [];
  newDefinition = { definition: '', language: '' };
  saveState: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  saveMessage = 'Ready.';
  isLoading = false;

  newDefinitions: Record<number, Definition[]> = {};
  deletedDefinitions: Definition[] = [];
  languageMapping: Partial<Record<string, string>> = {};
  posMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService,
    private readonly wordEditService: WordEditService
  ) {}

  get editCount(): number {
    return this.deletedDefinitions.length + Object.values(this.newDefinitions).flat().length;
  }

  ngOnInit(): void {
    this.languageService.getLanguageMapping().subscribe((mapping) => (this.languageMapping = mapping));
    this.dictionaryService.getPartOfSpeechMapping().subscribe((mapping) => (this.posMapping = mapping));

    this.route.queryParamMap.subscribe((params) => {
      const wordId = params.get('word');
      const term = params.get('term');

      this.isLoading = true;
      const request$: Observable<Word | Word[]> = wordId
        ? this.dictionaryService.getWordById(Number(wordId))
        : term
          ? this.dictionaryService.getWordsByTerm(term)
          : of([] as Word[]);

      request$.subscribe({
        next: (result) => {
          const words = Array.isArray(result) ? result : [result];
          this.words = words;
          this.term = wordId && words.length ? words[0].word : term ?? '';
          this.resetStagedChanges();
        },
        complete: () => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    });
  }

  addDefinition(wordId: number): void {
    const payload = {
      type: 'Definition',
      definition: this.newDefinition.definition.trim(),
      language: this.newDefinition.language.trim()
    } as Definition;

    if (!payload.definition || !payload.language) {
      this.saveState = 'error';
      this.saveMessage = 'Definition text and language are required.';
      return;
    }

    if (!isKnownLanguageCode(payload.language, this.languageMapping)) {
      this.saveState = 'error';
      this.saveMessage = `Unknown language code: ${payload.language}`;
      return;
    }

    this.newDefinitions[wordId] = [...(this.newDefinitions[wordId] ?? []), payload];
    this.words = this.words.map((word) =>
      word.id === wordId ? { ...word, definitions: [...word.definitions, payload] } : word
    );
    this.newDefinition = { definition: '', language: '' };
    this.saveState = 'idle';
    this.saveMessage = 'Ready.';
  }

  deleteDefinition(wordId: number, definition: Definition): void {
    this.words = this.words.map((word) =>
      word.id === wordId ? removeDefinitionFromWord(word, definition) : word
    );

    this.newDefinitions[wordId] = (this.newDefinitions[wordId] ?? []).filter((item) => item !== definition);

    if (definition.id && !this.deletedDefinitions.includes(definition)) {
      this.deletedDefinitions.push(definition);
    }
  }

  saveChanges(): void {
    const invalidLanguage = this.words
      .flatMap((word) => word.definitions)
      .find((definition) => !definition.language || !isKnownLanguageCode(definition.language, this.languageMapping));

    if (invalidLanguage) {
      this.saveState = 'error';
      this.saveMessage = `Invalid language code on definition: "${invalidLanguage.definition}"`;
      return;
    }

    this.saveState = 'saving';
    this.saveMessage = 'Saving...';

    forkJoin(this.words.map((word) => this.wordEditService.updateWord(normalizeWordForSave(word))))
      .pipe(finalize(() => (this.saveState = this.saveState === 'error' ? 'error' : 'success')))
      .subscribe({
        next: () => {
          this.resetStagedChanges();
          this.saveMessage = 'Success!';
        },
        error: () => {
          this.saveState = 'error';
          this.saveMessage = 'An error occurred while saving.';
        }
      });
  }

  private resetStagedChanges(): void {
    this.newDefinitions = {};
    this.deletedDefinitions = [];
  }
}
