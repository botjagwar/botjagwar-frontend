import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { WordEditService } from '../../core/services/word-edit.service';
import { DefinitionPageComponent } from './definition-page.component';

describe('DefinitionPageComponent', () => {
  let fixture: ComponentFixture<DefinitionPageComponent>;

  const queryParamMap$ = new BehaviorSubject(convertToParamMap({ defid: '44' }));
  const dictionaryService = {
    getDefinitionWords: vi.fn(),
    getDefinitionById: vi.fn(),
    getWordById: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };
  const wordEditService = {
    updateDefinition: vi.fn(),
    updateWord: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.getDefinitionWords.mockReturnValue(
      of([{ words: [{ id: 7, word: 'saka', language: 'mg', definitions: [{ id: 44, definition: 'cat', language: 'eng' }] }] }])
    );
    dictionaryService.getDefinitionById.mockReturnValue(
      of([{ id: 44, definition: 'cat', language: 'eng' }])
    );
    dictionaryService.getWordById.mockReturnValue(
      of({ id: 7, word: 'saka', language: 'mg', definitions: [{ id: 44, definition: 'cat', language: 'eng' }] })
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));
    wordEditService.updateDefinition.mockReturnValue(of({}));
    wordEditService.updateWord.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [DefinitionPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        { provide: WordEditService, useValue: wordEditService },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DefinitionPageComponent);
    fixture.detectChanges();
  });

  it('loads definition details and linked words from query params', () => {
    expect(dictionaryService.getDefinitionById).toHaveBeenCalledWith(44);
    expect(fixture.componentInstance.words).toHaveLength(1);
    expect(fixture.componentInstance.definition.id).toBe(44);
  });

  it('stages a dissociated word before save', () => {
    const component = fixture.componentInstance;

    component.deleteWord(component.words[0]);

    expect(component.words).toHaveLength(0);
    expect(component.stagedWordUpdates).toHaveLength(1);
  });

  it('rejects save when definition text is empty', () => {
    const component = fixture.componentInstance;
    component.definition.definition = '   ';

    component.saveChanges();

    expect(component.saveState).toBe('error');
    expect(wordEditService.updateDefinition).not.toHaveBeenCalled();
  });

  it('sets error state when definition update fails', () => {
    const component = fixture.componentInstance;
    wordEditService.updateDefinition.mockReturnValueOnce(throwError(() => new Error('boom')));

    component.saveChanges();

    expect(component.saveState).toBe('error');
  });
});
