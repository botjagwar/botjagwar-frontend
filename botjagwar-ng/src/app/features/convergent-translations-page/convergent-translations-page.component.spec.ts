import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { ConvergentTranslationsPageComponent } from './convergent-translations-page.component';

describe('ConvergentTranslationsPageComponent', () => {
  let fixture: ComponentFixture<ConvergentTranslationsPageComponent>;

  const dictionaryService = {
    getConvergentTranslations: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.getConvergentTranslations.mockReturnValue(
      of([{ en_definition_id: 1, fr_definition_id: 2, suggested_definition: 'x' }])
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));

    await TestBed.configureTestingModule({
      imports: [ConvergentTranslationsPageComponent],
      providers: [
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService },
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ language: 'eng' })) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConvergentTranslationsPageComponent);
    fixture.detectChanges();
  });

  it('loads convergent translations report and optional language query param', () => {
    const component = fixture.componentInstance;
    expect(component.language).toBe('eng');
    expect(component.words.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });
});
