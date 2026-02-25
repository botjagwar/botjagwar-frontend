import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-legacy-route-stub',
  template: `
    <section class="card">
      <div class="card-body">
        <h1 class="h4 mb-2">{{ title }}</h1>
        <p class="mb-0">{{ description }}</p>
      </div>
    </section>
  `
})
export class LegacyRouteStubComponent {
  readonly title: string;
  readonly description: string;

  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'] as string;
    this.description = route.snapshot.data['description'] as string;
  }
}
