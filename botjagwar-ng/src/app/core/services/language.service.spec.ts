import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('retrieves languages from /langs', () => {
    const payload = [{ iso_code: 'eng', english_name: 'English', malagasy_name: null }];

    service.getLanguages().subscribe((languages) => {
      expect(languages).toEqual(payload);
    });

    const request = httpMock.expectOne(`${window.location.origin}/langs`);
    expect(request.request.method).toBe('GET');
    request.flush(payload);
  });

  it('builds language mapping with english, then malagasy, then Unknown fallback', () => {
    const payload = [
      { iso_code: 'eng', english_name: 'English', malagasy_name: null },
      { iso_code: 'mlg', english_name: null, malagasy_name: 'Malagasy' },
      { iso_code: 'zzz', english_name: null, malagasy_name: null }
    ];

    service.getLanguageMapping().subscribe((mapping) => {
      expect(mapping).toEqual({
        eng: 'English',
        mlg: 'Malagasy',
        zzz: 'Unknown (zzz)'
      });
    });

    const request = httpMock.expectOne(`${window.location.origin}/langs`);
    expect(request.request.method).toBe('GET');
    request.flush(payload);
  });

  it('retrieves dictionary language list from /dict/list', () => {
    const payload = ['eng', 'mlg'];

    service.getDictionaryLanguageList().subscribe((languages) => {
      expect(languages).toEqual(payload);
    });

    const request = httpMock.expectOne(`${window.location.origin}/dict/list`);
    expect(request.request.method).toBe('GET');
    request.flush(payload);
  });
});
