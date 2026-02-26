import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { DictionaryPageComponent } from './dictionary-page.component';

describe('DictionaryPageComponent', () => {
  let fixture: ComponentFixture<DictionaryPageComponent>;

  const queryParamMap$ = new BehaviorSubject(convertToParamMap({ language: 'eng' }));
  const dictionaryService = {
    getWordsForLanguage: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.getWordsForLanguage.mockReturnValue(
      of([{ id: 1, word: 'cat', language: 'eng', definitions: [] }])
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));

    await TestBed.configureTestingModule({
      imports: [DictionaryPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DictionaryPageComponent);
    fixture.detectChanges();
  });

  it('loads the query-param language and fetches words', () => {
    const component = fixture.componentInstance;
    expect(component.language).toBe('eng');
    expect(dictionaryService.getWordsForLanguage).toHaveBeenCalledWith('eng');
    expect(component.words.length).toBe(1);
  });

  it('clears list when fetching with empty language', () => {
    const component = fixture.componentInstance;
    component.language = '';
    component.fetchWords();
    expect(component.words).toEqual([]);
  });
});
