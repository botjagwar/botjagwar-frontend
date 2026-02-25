import { Routes } from '@angular/router';

import { HomePageComponent } from './features/home-page/home-page.component';
import { LegacyRouteStubComponent } from './features/legacy-route-stub/legacy-route-stub.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'search',
    component: LegacyRouteStubComponent,
    data: {
      title: 'Search',
      description: 'Search view placeholder. Query parameter support will be added in Phase 3.'
    }
  },
  {
    path: 'dictionary',
    component: LegacyRouteStubComponent,
    data: {
      title: 'Dictionary',
      description: 'Dictionary view placeholder. Porting is planned in the read-only migration phase.'
    }
  },
  {
    path: 'recent-changes',
    component: LegacyRouteStubComponent,
    data: {
      title: 'Recent Changes',
      description: 'Recent changes view placeholder. Porting is planned in the read-only migration phase.'
    }
  },
  {
    path: 'inconsistent-definitions',
    component: LegacyRouteStubComponent,
    data: {
      title: 'Inconsistent Definitions',
      description:
        'Inconsistent definitions view placeholder. Porting is planned in the read-only migration phase.'
    }
  },
  {
    path: 'convergent-translations',
    component: LegacyRouteStubComponent,
    data: {
      title: 'Convergent Translations',
      description:
        'Convergent translations view placeholder. Porting is planned in the read-only migration phase.'
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
