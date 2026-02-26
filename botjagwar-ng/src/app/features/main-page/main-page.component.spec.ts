import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LanguageService } from '../../core/services/language.service';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
  let fixture: ComponentFixture<MainPageComponent>;
  const languageService = {
    getDictionaryLanguageList: vi.fn(),
    getLanguageMapping: vi.fn()
  };

  beforeEach(async () => {
    languageService.getDictionaryLanguageList.mockReturnValue(
      of([{ language: 'eng', entries: 10 }, 'mlg'])
    );
    languageService.getLanguageMapping.mockReturnValue(of({ eng: 'English', mlg: 'Malagasy' }));

    await TestBed.configureTestingModule({
      imports: [MainPageComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: languageService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    fixture.detectChanges();
  });

  it('loads language list and mapping', () => {
    const component = fixture.componentInstance;
    expect(component.isLoading).toBe(false);
    expect(component.languages).toEqual([
      { language: 'eng', entries: 10 },
      { language: 'mlg' }
    ]);
    expect(component.languageMapping['eng']).toBe('English');
  });
});
