import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

import { Definition } from '../../core/models/definition.model';
import { Word } from '../../core/models/word.model';
import {
  isKnownLanguageCode,
  normalizeWordForSave,
  removeDefinitionFromWord
} from '../../core/helpers/edit-workflow.helpers';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { WordEditService } from '../../core/services/word-edit.service';

interface DefinitionDraft {
  definition: string;
  language: string;
}

@Component({
  selector: 'app-word-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './word-page.component.html'
})
export class WordPageComponent implements OnInit, OnDestroy {
  term = '';
  words: Word[] = [];
  saveState: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  saveMessage = 'Ready.';
  isLoading = false;

  newDefinitions: Record<number, Definition[]> = {};
  newDefinitionDrafts: Record<number, DefinitionDraft> = {};
  deletedDefinitions: Definition[] = [];
  languageMapping: Partial<Record<string, string>> = {};
  posMapping: Partial<Record<string, string>> = {};

  private readonly destroy$ = new Subject<void>();

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
    this.languageService
      .getLanguageMapping()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapping) => (this.languageMapping = mapping));

    this.dictionaryService
      .getPartOfSpeechMapping()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapping) => (this.posMapping = mapping));

    this.route.queryParamMap
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          const wordId = params.get('word');
          const term = params.get('term') ?? '';
          const wordIdNum = Number(wordId);

          this.term = term;
          const request$: Observable<Word | Word[]> = Number.isFinite(wordIdNum) && wordId?.trim()
            ? this.dictionaryService.getWordById(wordIdNum)
            : term
              ? this.dictionaryService.getWordsByTerm(term)
              : of([] as Word[]);

          return request$.pipe(
            tap((result) => {
              const words = Array.isArray(result) ? result : [result];
              this.words = words;
              this.term = Number.isFinite(wordIdNum) && words.length ? words[0].word : term;
              this.resetStagedChanges();
              this.resetDrafts();
            }),
            finalize(() => {
              this.isLoading = false;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        error: () => {
          this.saveState = 'error';
          this.saveMessage = 'Could not load word entries.';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addDefinition(wordId: number): void {
    const draft = this.newDefinitionDrafts[wordId] ?? { definition: '', language: '' };
    const payload = {
      type: 'Definition',
      definition: draft.definition.trim(),
      language: draft.language.trim()
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
    this.newDefinitionDrafts[wordId] = { definition: '', language: '' };
    this.saveState = 'idle';
    this.saveMessage = 'Ready.';
  }

  updateDefinitionDraft(wordId: number, field: keyof DefinitionDraft, value: string): void {
    const current = this.newDefinitionDrafts[wordId] ?? { definition: '', language: '' };
    this.newDefinitionDrafts[wordId] = { ...current, [field]: value };
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.resetStagedChanges();
          this.saveState = 'success';
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

  private resetDrafts(): void {
    this.newDefinitionDrafts = this.words.reduce<Record<number, DefinitionDraft>>((acc, word) => {
      acc[word.id] = { definition: '', language: '' };
      return acc;
    }, {});
  }
}
