import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Definition } from '../models/definition.model';
import { Word } from '../models/word.model';
import { ApiClientService } from './api-client.service';

@Injectable({
  providedIn: 'root'
})
export class WordEditService {
  constructor(private readonly api: ApiClientService) {}

  updateWord(word: Word): Observable<Word> {
    return this.api.put<Word>(`/dict/entry/${word.id}/edit`, word);
  }

  updateDefinition(definition: Definition & { id: number }): Observable<Definition> {
    return this.api.put<Definition>(`/defn/${definition.id}/edit`, definition);
  }
}
