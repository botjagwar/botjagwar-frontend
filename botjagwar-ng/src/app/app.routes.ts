import { Routes } from '@angular/router';

import { ConvergentTranslationsPageComponent } from './features/convergent-translations-page/convergent-translations-page.component';
import { DefinitionPageComponent } from './features/definition-page/definition-page.component';
import { DictionaryPageComponent } from './features/dictionary-page/dictionary-page.component';
import { InconsistentDefinitionsPageComponent } from './features/inconsistent-definitions-page/inconsistent-definitions-page.component';
import { MainPageComponent } from './features/main-page/main-page.component';
import { RecentChangesPageComponent } from './features/recent-changes-page/recent-changes-page.component';
import { SearchPageComponent } from './features/search-page/search-page.component';
import { WordPageComponent } from './features/word-page/word-page.component';

export const legacyToModernRouteMap: Readonly<Record<string, string>> = {
  'index.html': '',
  'search.html': 'search',
  'dictionary.html': 'dictionary',
  'word.html': 'word',
  'definition.html': 'definition',
  'recent_changes.html': 'recent-changes',
  'inconsistent_definitions.html': 'inconsistent-definitions',
  'convergent_translations.html': 'convergent-translations'
};

const legacyRoutes: Routes = Object.entries(legacyToModernRouteMap).map(([legacyPath, modernPath]) => ({
  path: legacyPath,
  redirectTo: modernPath,
  pathMatch: 'full'
}));

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'search',
    component: SearchPageComponent
  },
  {
    path: 'dictionary',
    component: DictionaryPageComponent
  },
  {
    path: 'word',
    component: WordPageComponent
  },
  {
    path: 'definition',
    component: DefinitionPageComponent
  },
  {
    path: 'recent-changes',
    component: RecentChangesPageComponent
  },
  {
    path: 'inconsistent-definitions',
    component: InconsistentDefinitionsPageComponent
  },
  {
    path: 'convergent-translations',
    component: ConvergentTranslationsPageComponent
  },
  ...legacyRoutes,
  {
    path: '**',
    redirectTo: ''
  }
];
