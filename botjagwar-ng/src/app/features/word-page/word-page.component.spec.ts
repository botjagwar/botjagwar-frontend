import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { WordEditService } from '../../core/services/word-edit.service';
import { WordPageComponent } from './word-page.component';

describe('WordPageComponent', () => {
  let fixture: ComponentFixture<WordPageComponent>;

  const queryParamMap$ = new BehaviorSubject(convertToParamMap({ word: '1' }));
  const dictionaryService = {
    getWordById: vi.fn(),
    getWordsByTerm: vi.fn(),
    getPartOfSpeechMapping: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };
  const wordEditService = {
    updateWord: vi.fn()
  };

  beforeEach(async () => {
    queryParamMap$.next(convertToParamMap({ word: '1' }));
    dictionaryService.getWordById.mockReturnValue(
      of({
        id: 1,
        word: 'saka',
        language: 'mg',
        definitions: [{ id: 9, definition: 'cat', language: 'eng' }]
      })
    );
    dictionaryService.getWordsByTerm.mockReturnValue(of([]));
    dictionaryService.getPartOfSpeechMapping.mockReturnValue(of({ n: 'noun' }));
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English', mg: 'Malagasy' }));
    wordEditService.updateWord.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [WordPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        { provide: WordEditService, useValue: wordEditService },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WordPageComponent);
    fixture.detectChanges();
  });

  it('loads a word using the query param', () => {
    expect(dictionaryService.getWordById).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.words).toHaveLength(1);
  });

  it('uses term search when word query param is invalid', () => {
    queryParamMap$.next(convertToParamMap({ word: 'abc', term: 'saka' }));

    expect(dictionaryService.getWordsByTerm).toHaveBeenCalledWith('saka');
    expect(dictionaryService.getWordById).not.toHaveBeenCalledWith(Number.NaN);
  });

  it('keeps new-definition drafts scoped per word', () => {
    const component = fixture.componentInstance;
    component.words = [
      ...component.words,
      { id: 2, word: 'alika', language: 'mg', definitions: [] }
    ];

    component.updateDefinitionDraft(1, 'definition', 'cat');
    component.updateDefinitionDraft(2, 'definition', 'dog');

    expect(component.newDefinitionDrafts[1].definition).toBe('cat');
    expect(component.newDefinitionDrafts[2].definition).toBe('dog');
  });

  it('stages and removes new definitions before save', () => {
    const component = fixture.componentInstance;
    component.updateDefinitionDraft(1, 'definition', 'feline');
    component.updateDefinitionDraft(1, 'language', 'eng');

    component.addDefinition(1);
    expect(component.words[0].definitions).toHaveLength(2);

    const inserted = component.words[0].definitions[1];
    component.deleteDefinition(1, inserted);
    expect(component.words[0].definitions).toHaveLength(1);
  });

  it('blocks save when definitions contain invalid language code', () => {
    const component = fixture.componentInstance;
    component.words[0].definitions.push({ definition: 'bad', language: 'zzz' });

    component.saveChanges();

    expect(wordEditService.updateWord).not.toHaveBeenCalled();
    expect(component.saveState).toBe('error');
  });

  it('sets error state when update fails', () => {
    const component = fixture.componentInstance;
    wordEditService.updateWord.mockReturnValueOnce(throwError(() => new Error('boom')));

    component.saveChanges();

    expect(component.saveState).toBe('error');
  });
});
