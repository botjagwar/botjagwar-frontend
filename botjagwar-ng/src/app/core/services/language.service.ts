import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Language } from '../models/language.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private readonly api: ApiClientService) {}

  getLanguages(): Observable<Language[]> {
    return this.api.get<Language[]>('/langs');
  }

  getLanguageMapping(): Observable<Record<string, string>> {
    return this.getLanguages().pipe(
      map((languages) =>
        languages.reduce<Record<string, string>>((mapping, language) => {
          const name =
            language.english_name ??
            language.malagasy_name ??
            `Unknown (${language.iso_code})`;
          mapping[language.iso_code] = name;
          return mapping;
        }, {})
      )
    );
  }

  getDictionaryLanguageList(): Observable<Array<string | { language: string; entries?: number }>> {
    return this.api.get<Array<string | { language: string; entries?: number }>>('/dict/list');
  }
}
