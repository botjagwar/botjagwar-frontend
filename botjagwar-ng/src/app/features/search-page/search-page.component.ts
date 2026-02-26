import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Definition } from '../../core/models/definition.model';
import { Word } from '../../core/models/word.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent implements OnInit {
  term = '';
  isLoading = true;
  words: Word[] = [];
  definitions: Definition[] = [];
  languageMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.term = params.get('term') ?? '';
      this.isLoading = true;

      // Keep request parity with legacy: always call APIs even for an empty term.
      forkJoin({
        words: this.dictionaryService.searchWords(this.term),
        definitions: this.dictionaryService.searchDefinitions(this.term),
        languageMapping: this.languageService.getLanguageMapping()
      }).subscribe(({ words, definitions, languageMapping }) => {
        this.words = words;
        this.definitions = definitions;
        this.languageMapping = languageMapping;
        this.isLoading = false;
      });
    });
  }
}
