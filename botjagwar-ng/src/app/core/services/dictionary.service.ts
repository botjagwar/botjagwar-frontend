import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Definition } from '../models/definition.model';
import { Word } from '../models/word.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private readonly api: ApiClientService) {}

  getWordsForLanguage(languageCode: string): Observable<Word[]> {
    return this.api.get<Word[]>(`/dict/${languageCode}`);
  }

  searchWords(term: string, limit = 100): Observable<Word[]> {
    return this.api.get<Word[]>('/api/json_dictionary', {
      word: `like.${term}`,
      limit
    });
  }

  getWordById(wordId: number): Observable<Word> {
    return this.api.get<Word>(`/wrd/${wordId}`);
  }

  getWordsByTerm(term: string): Observable<Word[]> {
    return this.api.get<Word[]>('/api/vw_json_dictionary', {
      word: `like.${term}`
    });
  }

  searchDefinitions(term: string, limit = 100): Observable<Definition[]> {
    return this.api.get<Definition[]>('/api/definitions', {
      definition: `like.${term}%`,
      limit
    });
  }

  getDefinitionById(definitionId: number): Observable<Definition[]> {
    return this.api.get<Definition[]>(`/defn/${definitionId}`);
  }

  getDefinitionWords(definitionId: number): Observable<Array<{ words: Word[] }>> {
    return this.api.get<Array<{ words: Word[] }>>(`/defw/${definitionId}`);
  }

  getRecentWordChanges(limit = 100): Observable<Word[]> {
    return this.api.get<Word[]>('/api/json_dictionary', {
      limit,
      select: 'id,word,language,part_of_speech,last_modified',
      order: 'id.desc'
    });
  }

  getRecentDefinitionChanges(limit = 100): Observable<Definition[]> {
    return this.api.get<Definition[]>('/api/definitions', {
      limit,
      select: 'id,definition,definition_language,date_changed',
      order: 'id.desc'
    });
  }

  getInconsistentDefinitions(limit = 1000): Observable<Word[]> {
    return this.api.get<Word[]>('/api/matview_inconsistent_definitions', { limit });
  }

  getConvergentTranslations(limit = 1000): Observable<Word[]> {
    return this.api.get<Word[]>('/api/convergent_translations', { limit });
  }

  getPartOfSpeechMapping(): Observable<Record<string, string>> {
    return this.api.get<Record<string, string>>('/pos.json');
  }
}
