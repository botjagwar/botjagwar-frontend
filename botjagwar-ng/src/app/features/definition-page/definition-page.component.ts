import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class DefinitionPageComponent implements OnInit, OnDestroy {
  words: Word[] = [];
  definition: Definition & { id: number } = { id: 0, definition: '', language: '' };
  stagedWordUpdates: Word[] = [];
  saveState: 'idle' | 'saving' | 'success' | 'error' = 'idle';
  message = 'Ready.';
  languageMapping: Partial<Record<string, string>> = {};
  private definitionId = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService,
    private readonly wordEditService: WordEditService
  ) {}

  ngOnInit(): void {
    this.languageService
      .getLanguageMapping()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapping) => (this.languageMapping = mapping));

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.definitionId = Number(params.get('defid'));
      if (!Number.isFinite(this.definitionId) || this.definitionId <= 0) {
        return;
      }

      this.reloadDefinitionData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteWord(word: Word): void {
    this.words = this.words.filter((item) => item.id !== word.id);

    this.dictionaryService
      .getWordById(word.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fetchedWord) => {
        this.stageWordUpdate(word.id, fetchedWord);
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
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
    forkJoin({
      definitionWords: this.dictionaryService.getDefinitionWords(this.definitionId),
      definitions: this.dictionaryService.getDefinitionById(this.definitionId)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ definitionWords, definitions }) => {
          this.words = definitionWords[0]?.words ?? [];

          const definition = definitions[0];
          this.definition = {
            id: definition.id ?? this.definitionId,
            definition: definition.definition,
            language: definition.language,
            definition_language: definition.definition_language
          };
        },
        error: () => {
          this.saveState = 'error';
          this.message = 'Could not load definition details.';
        }
      });
  }

  private stageWordUpdate(wordId: number, fullWord: Word): void {
    const updatedWord: Word = {
      ...fullWord,
      definitions: fullWord.definitions.filter((item) => item.id !== this.definition.id)
    };

    this.stagedWordUpdates = [
      ...this.stagedWordUpdates.filter((item) => item.id !== wordId),
      updatedWord
    ];
  }
}
