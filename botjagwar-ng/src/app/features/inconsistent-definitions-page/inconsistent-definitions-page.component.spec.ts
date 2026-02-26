import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { InconsistentDefinitionsPageComponent } from './inconsistent-definitions-page.component';

describe('InconsistentDefinitionsPageComponent', () => {
  let fixture: ComponentFixture<InconsistentDefinitionsPageComponent>;

  const dictionaryService = {
    getInconsistentDefinitions: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.getInconsistentDefinitions.mockReturnValue(of([{ w_id: 1, w1: 'a', w2: 'b' }]));
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));

    await TestBed.configureTestingModule({
      imports: [InconsistentDefinitionsPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ language: 'eng' })) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InconsistentDefinitionsPageComponent);
    fixture.detectChanges();
  });

  it('loads inconsistent definition report and optional language query param', () => {
    const component = fixture.componentInstance;
    expect(component.language).toBe('eng');
    expect(component.words.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('builds legacy-compatible links with defid query param and encoded term fallback', () => {
    const component = fixture.componentInstance;

    expect(component.getWordLink(4, 'feline test')).toBe('/word.html?word=4');
    expect(component.getWordLink(undefined, 'feline test')).toBe('/word.html?term=feline%20test');
    expect(component.getDefinitionLink(9, 'unused')).toBe('/definition.html?defid=9');
    expect(component.getDefinitionLink(undefined, 'with space')).toBe(
      '/definition.html?defid=with%20space'
    );
  });
});
