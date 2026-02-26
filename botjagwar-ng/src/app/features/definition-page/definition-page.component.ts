import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Definition } from '../../core/models/definition.model';
import { Word } from '../../core/models/word.model';
import { normalizeWordForSave } from '../../core/helpers/edit-workflow.helpers';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { WordEditService } from '../../core/services/word-edit.service';

@Component({
  selector: 'app-definition-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './definition-page.component.html'
})
export class DefinitionPageComponent implements OnInit {
  words: Word[] = [];
  definition: Definition & { id: number } = { id: 0, definition: '', language: '' };
  stagedWordUpdates: Word[] = [];
  saveState: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  message = 'Ready.';
  languageMapping: Partial<Record<string, string>> = {};
  private definitionId = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService,
    private readonly wordEditService: WordEditService
  ) {}

  ngOnInit(): void {
    this.languageService.getLanguageMapping().subscribe((mapping) => (this.languageMapping = mapping));

    this.route.queryParamMap.subscribe((params) => {
      this.definitionId = Number(params.get('defid'));
      if (!this.definitionId) {
        return;
      }

      this.reloadDefinitionData();
    });
  }

  deleteWord(word: Word): void {
    this.words = this.words.filter((item) => item.id !== word.id);

    this.dictionaryService.getWordById(word.id).subscribe((fetchedWord) => {
      const updatedWord = {
        ...fetchedWord,
        definitions: fetchedWord.definitions.filter((item) => item.id !== this.definition.id)
      };
      this.stagedWordUpdates = [...this.stagedWordUpdates.filter((item) => item.id !== word.id), updatedWord];
    });
  }

  cancelChanges(): void {
    this.reloadDefinitionData();
    this.stagedWordUpdates = [];
    this.saveState = 'idle';
    this.message = 'Ready.';
  }

  saveChanges(): void {
    if (!this.definition.definition.trim()) {
      this.saveState = 'error';
      this.message = 'Definition text is required.';
      return;
    }

    this.saveState = 'saving';
    this.message = 'Saving...';

    const normalizedDefinition = {
      ...this.definition,
      definition_language: this.definition.definition_language ?? this.definition.language
    };

    forkJoin([
      this.wordEditService.updateDefinition(normalizedDefinition),
      ...this.stagedWordUpdates.map((word) => this.wordEditService.updateWord(normalizeWordForSave(word)))
    ]).subscribe({
      next: () => {
        this.stagedWordUpdates = [];
        this.saveState = 'success';
        this.message = 'Success!';
      },
      error: () => {
        this.saveState = 'error';
        this.message = 'An error occurred!';
      }
    });
  }

  private reloadDefinitionData(): void {
    this.dictionaryService.getDefinitionWords(this.definitionId).subscribe((definitionWords) => {
      this.words = definitionWords[0]?.words ?? [];
    });

    this.dictionaryService.getDefinitionById(this.definitionId).subscribe((definitions) => {
      const definition = definitions[0];
      this.definition = {
        id: definition.id ?? this.definitionId,
        definition: definition.definition,
        language: definition.language,
        definition_language: definition.definition_language
      };
    });
  }
}
