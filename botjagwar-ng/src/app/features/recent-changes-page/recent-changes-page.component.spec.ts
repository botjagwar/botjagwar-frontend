import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DictionaryService } from '../../core/services/dictionary.service';
import { LanguageService } from '../../core/services/language.service';
import { RecentChangesPageComponent } from './recent-changes-page.component';

describe('RecentChangesPageComponent', () => {
  let fixture: ComponentFixture<RecentChangesPageComponent>;

  const dictionaryService = {
    getRecentWordChanges: vi.fn(),
    getRecentDefinitionChanges: vi.fn()
  };
  const languageService = {
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    dictionaryService.getRecentWordChanges.mockReturnValue(of([{ id: 1, word: 'cat', language: 'eng' }]));
    dictionaryService.getRecentDefinitionChanges.mockReturnValue(
      of([{ id: 2, definition: 'cat', definition_language: 'eng' }])
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English' }));

    await TestBed.configureTestingModule({
      imports: [RecentChangesPageComponent],
      providers: [provideRouter([]), 
        { provide: DictionaryService, useValue: dictionaryService },
        { provide: LanguageService, useValue: languageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentChangesPageComponent);
    fixture.detectChanges();
  });

  it('loads recent word and definition changes', () => {
    const component = fixture.componentInstance;
    expect(component.words.length).toBe(1);
    expect(component.definitions.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });
});
