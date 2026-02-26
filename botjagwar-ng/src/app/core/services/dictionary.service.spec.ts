import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(DictionaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls key read-only endpoints with expected query params', () => {
    service.searchWords('cat', 50).subscribe();
    service.searchDefinitions('desc', 25).subscribe();
    service.getRecentWordChanges(10).subscribe();
    service.getRecentDefinitionChanges(20).subscribe();
    service.getInconsistentDefinitions(1000).subscribe();
    service.getConvergentTranslations(500).subscribe();

    const wordsRequest = httpMock.expectOne(
      `${window.location.origin}/api/json_dictionary?word=like.cat&limit=50`
    );
    expect(wordsRequest.request.method).toBe('GET');
    wordsRequest.flush([]);

    const defsRequest = httpMock.expectOne(
      `${window.location.origin}/api/definitions?definition=like.desc%25&limit=25`
    );
    expect(defsRequest.request.method).toBe('GET');
    defsRequest.flush([]);

    const recentWordsRequest = httpMock.expectOne(
      `${window.location.origin}/api/json_dictionary?limit=10&select=id,word,language,part_of_speech,last_modified&order=id.desc`
    );
    expect(recentWordsRequest.request.method).toBe('GET');
    recentWordsRequest.flush([]);

    const recentDefsRequest = httpMock.expectOne(
      `${window.location.origin}/api/definitions?limit=20&select=id,definition,definition_language,date_changed&order=id.desc`
    );
    expect(recentDefsRequest.request.method).toBe('GET');
    recentDefsRequest.flush([]);

    const inconsistentRequest = httpMock.expectOne(
      `${window.location.origin}/api/matview_inconsistent_definitions?limit=1000`
    );
    expect(inconsistentRequest.request.method).toBe('GET');
    inconsistentRequest.flush([]);

    const convergentRequest = httpMock.expectOne(
      `${window.location.origin}/api/convergent_translations?limit=500`
    );
    expect(convergentRequest.request.method).toBe('GET');
    convergentRequest.flush([]);
  });

  it('calls lookup endpoints that use path params', () => {
    service.getWordsForLanguage('eng').subscribe();
    service.getWordById(4).subscribe();
    service.getWordsByTerm('foo').subscribe();
    service.getDefinitionById(3).subscribe();
    service.getDefinitionWords(3).subscribe();
    service.getPartOfSpeechMapping().subscribe();

    const dictRequest = httpMock.expectOne(`${window.location.origin}/dict/eng`);
    expect(dictRequest.request.method).toBe('GET');
    dictRequest.flush([]);

    const wordRequest = httpMock.expectOne(`${window.location.origin}/wrd/4`);
    expect(wordRequest.request.method).toBe('GET');
    wordRequest.flush({});

    const termRequest = httpMock.expectOne(`${window.location.origin}/api/vw_json_dictionary?word=like.foo`);
    expect(termRequest.request.method).toBe('GET');
    termRequest.flush([]);

    const defRequest = httpMock.expectOne(`${window.location.origin}/defn/3`);
    expect(defRequest.request.method).toBe('GET');
    defRequest.flush([]);

    const defWordsRequest = httpMock.expectOne(`${window.location.origin}/defw/3`);
    expect(defWordsRequest.request.method).toBe('GET');
    defWordsRequest.flush([]);

    const posRequest = httpMock.expectOne(`${window.location.origin}/pos.json`);
    expect(posRequest.request.method).toBe('GET');
    posRequest.flush({});
  });
});
