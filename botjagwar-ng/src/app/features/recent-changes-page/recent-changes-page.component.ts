import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Definition } from '../../core/models/definition.model';
import { RecentWordChange } from '../../core/models/dictionary-report.model';
import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-recent-changes-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './recent-changes-page.component.html'
})
export class RecentChangesPageComponent implements OnInit {
  isLoading = true;
  words: RecentWordChange[] = [];
  definitions: Definition[] = [];
  languageMapping: Partial<Record<string, string>> = {};

  constructor(
    private readonly dictionaryService: DictionaryService,
    private readonly languageService: LanguageService
  ) {}

  ngOnInit(): void {
    forkJoin({
      words: this.dictionaryService.getRecentWordChanges(),
      definitions: this.dictionaryService.getRecentDefinitionChanges(),
      languageMapping: this.languageService.getLanguageMapping()
    }).subscribe(({ words, definitions, languageMapping }) => {
      this.words = words;
      this.definitions = definitions;
      this.languageMapping = languageMapping;
      this.isLoading = false;
    });
  }
}
