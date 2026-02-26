import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private readonly baseUrl = window.location.origin;

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    const url = this.buildUrl(path);
    const normalizedParams = this.normalizeParams(params);
    return this.http.get<T>(url, { params: normalizedParams });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  delete<T>(path: string, body?: unknown): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path), { body });
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return path.startsWith('/') ? `${this.baseUrl}${path}` : `${this.baseUrl}/${path}`;
  }

  private normalizeParams(
    params?: HttpParams | Record<string, string | number | boolean>
  ): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    if (params instanceof HttpParams) {
      return params;
    }

    let normalized = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      normalized = normalized.set(key, String(value));
    }
    return normalized;
  }
}
