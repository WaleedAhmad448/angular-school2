import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServices<T> {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private formatEndpoint(endpoint: string): string {
    return endpoint.replace(/^\/+|\/+$/g, ''); // يزيل / من البداية والنهاية
  }

  private getFullUrl(endpoint: string): string {
    return `${this.baseUrl}/${this.formatEndpoint(endpoint)}`;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ غير متوقع';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ في الشبكة: ${error.error.message}`;
    } else {
      errorMessage = `رمز الخطأ: ${error.status}\nالرسالة: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }

  getAll(endpoint: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.getFullUrl(endpoint), { params })
      .pipe(catchError(this.handleError));
  }

  getById(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.getFullUrl(endpoint)}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(this.getFullUrl(endpoint), data)
      .pipe(catchError(this.handleError));
  }

  update(endpoint: string, id: number | string, data: T): Observable<T> {
    return this.http.put<T>(`${this.getFullUrl(endpoint)}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  delete(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.getFullUrl(endpoint)}/${id}`)
      .pipe(catchError(this.handleError));
  }

  uploadFile(endpoint: string, file: File, extraData?: { [key: string]: any }): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    return this.http.post(this.getFullUrl(endpoint), formData)
      .pipe(catchError(this.handleError));
  }

  downloadFile(endpoint: string): Observable<Blob> {
    return this.http.get(this.getFullUrl(endpoint), { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  getWithHeaders(endpoint: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(this.getFullUrl(endpoint), { headers })
      .pipe(catchError(this.handleError));
  }

  postWithHeaders(endpoint: string, data: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(this.getFullUrl(endpoint), data, { headers })
      .pipe(catchError(this.handleError));
  }

  request<R>(method: string, endpoint: string, data?: any, options?: {
    headers?: HttpHeaders,
    params?: HttpParams
  }): Observable<R> {
    return this.http.request<R>(method, this.getFullUrl(endpoint), {
      body: data,
      headers: options?.headers,
      params: options?.params
    }).pipe(catchError(this.handleError));
  }

  getWithParams<R>(endpoint: string, params: { [key: string]: any }): Observable<R> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.request<R>('GET', endpoint, null, { params: httpParams });
  }
}
