import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { SearchPageComponent } from './search-page.component';

describe('SearchPageComponent', () => {
  let fixture: ComponentFixture<SearchPageComponent>;

  const queryParamMap$ = new BehaviorSubject(convertToParamMap({ term: 'cat' }));
  const dictionaryService = {
    searchWords: vi.fn(),
    searchDefinitions: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.searchWords.mockReturnValue(
      of([{ id: 1, word: 'cat', language: 'eng', definitions: [] }])
    );
    dictionaryService.searchDefinitions.mockReturnValue(
      of([{ id: 2, definition: 'cat', definition_language: 'eng' }])
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));

    await TestBed.configureTestingModule({
      imports: [SearchPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    fixture.detectChanges();
  });

  it('reads term from query params and fetches words and definitions', () => {
    const component = fixture.componentInstance;
    expect(component.term).toBe('cat');
    expect(dictionaryService.searchWords).toHaveBeenCalledWith('cat');
    expect(dictionaryService.searchDefinitions).toHaveBeenCalledWith('cat');
    expect(component.words.length).toBe(1);
    expect(component.definitions.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('keeps legacy API parity for empty term by still issuing search requests', () => {
    queryParamMap$.next(convertToParamMap({}));

    expect(dictionaryService.searchWords).toHaveBeenLastCalledWith('');
    expect(dictionaryService.searchDefinitions).toHaveBeenLastCalledWith('');
  });
});
