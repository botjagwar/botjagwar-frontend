import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConvergentTranslationReportRow } from '../../core/models/dictionary-report.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-convergent-translations-page',
  imports: [CommonModule],
  templateUrl: './convergent-translations-page.component.html'
})
export class ConvergentTranslationsPageComponent implements OnInit {
  title = 'Convergent translations';
  language = '';
  isLoading = true;
  words: ConvergentTranslationReportRow[] = [];
  languageMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.language = params.get('language') ?? '';
    });

    this.languageService.getLanguageMapping().subscribe((mapping) => {
      this.languageMapping = mapping;
    });

    this.dictionaryService.getConvergentTranslations().subscribe((rows) => {
      this.words = rows;
      this.isLoading = false;
    });
  }
}
