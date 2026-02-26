import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InconsistentDefinitionReportRow } from '../../core/models/dictionary-report.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-inconsistent-definitions-page',
  imports: [CommonModule],
  templateUrl: './inconsistent-definitions-page.component.html'
})
export class InconsistentDefinitionsPageComponent implements OnInit {
  title = 'Inconsistent definitions';
  language = '';
  isLoading = true;
  words: InconsistentDefinitionReportRow[] = [];
  languageMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService
  ) {}

  getWordLink(wordId: number | undefined, fallbackTerm: string): string {
    return wordId ? `/word.html?word=${wordId}` : `/word.html?term=${encodeURIComponent(fallbackTerm)}`;
  }

  getDefinitionLink(definitionId: number | undefined, fallbackDefinition: string | undefined): string {
    return definitionId
      ? `/definition.html?defid=${definitionId}`
      : `/definition.html?defid=${encodeURIComponent(fallbackDefinition ?? '')}`;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.language = params.get('language') ?? '';
    });

    this.languageService.getLanguageMapping().subscribe((mapping) => {
      this.languageMapping = mapping;
    });

    this.dictionaryService.getInconsistentDefinitions().subscribe((rows) => {
      this.words = rows;
      this.isLoading = false;
    });
  }
}
