import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Word } from '../../core/models/word.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-dictionary-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dictionary-page.component.html'
})
export class DictionaryPageComponent implements OnInit {
  title = 'Dictionary';
  language = '';
  isLoading = false;
  words: Word[] = [];
  languageMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageService.getLanguageMapping().subscribe((mapping) => {
      this.languageMapping = mapping;
    });

    this.route.queryParamMap.subscribe((params) => {
      this.language = params.get('language') ?? '';
      if (this.language) {
        this.fetchWords();
      }
    });
  }

  fetchWords(): void {
    if (!this.language) {
      this.words = [];
      return;
    }

    this.isLoading = true;
    this.dictionaryService
      .getWordsForLanguage(this.language)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((words) => {
        this.words = words;
      });
  }
}
