import { Routes } from '@angular/router';

import { ConvergentTranslationsPageComponent } from './features/convergent-translations-page/convergent-translations-page.component';
import { DictionaryPageComponent } from './features/dictionary-page/dictionary-page.component';
import { InconsistentDefinitionsPageComponent } from './features/inconsistent-definitions-page/inconsistent-definitions-page.component';
import { MainPageComponent } from './features/main-page/main-page.component';
import { RecentChangesPageComponent } from './features/recent-changes-page/recent-changes-page.component';
import { SearchPageComponent } from './features/search-page/search-page.component';

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
  {
    path: '**',
    redirectTo: ''
  }
];
