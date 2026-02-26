import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LanguageService } from '../../core/services/language.service';

interface DictionaryLanguageItem {
  language: string;
  entries?: number;
}

@Component({
  selector: 'app-main-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  isLoading = true;
  languageMapping: Partial<Record<string, string>> = {};
  languages: DictionaryLanguageItem[] = [];

  constructor(private readonly languageService: LanguageService) {}

  ngOnInit(): void {
    forkJoin({
      // /dict/list and /langs are loaded together to keep the page consistent.
      dictionaryList: this.languageService.getDictionaryLanguageList(),
      languageMapping: this.languageService.getLanguageMapping()
    }).subscribe(({ dictionaryList, languageMapping }) => {
      this.languages = dictionaryList.map((item) =>
        typeof item === 'string' ? { language: item } : { language: item.language, entries: item.entries }
      );
      this.languageMapping = languageMapping;
      this.isLoading = false;
    });
  }
}
