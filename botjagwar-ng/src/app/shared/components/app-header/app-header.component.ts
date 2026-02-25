import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  constructor(private readonly router: Router) {}

  onSearch(term: string): void {
    const trimmed = term.trim();

    void this.router.navigate(['/search'], {
      queryParams: trimmed ? { term: trimmed } : {}
    });
  }
}
