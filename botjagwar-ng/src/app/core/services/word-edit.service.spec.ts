import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WordEditService } from './word-edit.service';

describe('WordEditService', () => {
  let service: WordEditService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(WordEditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('updates a word via /dict/entry/:id/edit', () => {
    const word = {
      id: 99,
      word: 'test',
      language: 'eng',
      definitions: []
    };

    service.updateWord(word).subscribe();

    const request = httpMock.expectOne(`${window.location.origin}/dict/entry/99/edit`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(word);
    request.flush(word);
  });

  it('updates a definition via /defn/:id/edit', () => {
    const definition = {
      id: 12,
      definition: 'meaning',
      definition_language: 'eng'
    };

    service.updateDefinition(definition).subscribe();

    const request = httpMock.expectOne(`${window.location.origin}/defn/12/edit`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(definition);
    request.flush(definition);
  });
});
