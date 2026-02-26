import { HttpParams, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('builds absolute URL for relative paths and serializes object params', () => {
    service.get('/api/json_dictionary', { word: 'like.test', limit: 100 }).subscribe();

    const request = httpMock.expectOne(
      `${window.location.origin}/api/json_dictionary?word=like.test&limit=100`
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('accepts HttpParams directly', () => {
    const params = new HttpParams().set('definition', 'like.abc%').set('limit', '5');

    service.get('/api/definitions', params).subscribe();

    const request = httpMock.expectOne(
      `${window.location.origin}/api/definitions?definition=like.abc%25&limit=5`
    );
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('keeps fully-qualified URLs unchanged', () => {
    const url = 'https://example.com/health';

    service.get(url).subscribe();

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush({ ok: true });
  });

  it('uses expected HTTP methods for post/put/delete', () => {
    service.post('/api/resource', { a: 1 }).subscribe();
    service.put('/api/resource/1', { b: 2 }).subscribe();
    service.delete('/api/resource/1', { hard: true }).subscribe();

    const postRequest = httpMock.expectOne((request) =>
      request.url === `${window.location.origin}/api/resource` && request.method === 'POST'
    );
    expect(postRequest.request.method).toBe('POST');
    expect(postRequest.request.body).toEqual({ a: 1 });
    postRequest.flush({});

    const putRequest = httpMock.expectOne((request) =>
      request.url === `${window.location.origin}/api/resource/1` && request.method === 'PUT'
    );
    expect(putRequest.request.method).toBe('PUT');
    expect(putRequest.request.body).toEqual({ b: 2 });
    putRequest.flush({});

    const deleteRequest = httpMock.expectOne((request) =>
      request.url === `${window.location.origin}/api/resource/1` && request.method === 'DELETE'
    );
    expect(deleteRequest.request.method).toBe('DELETE');
    expect(deleteRequest.request.body).toEqual({ hard: true });
    deleteRequest.flush({});
  });
});
