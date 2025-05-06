import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServices<T> {
  private baseUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) {}

  // GET: Get all items
  getAll(endpoint: string, params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}${endpoint}`, { params });
  }

  // GET: Get single item by ID
  getById(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}/${id}`);
  }

  // POST: Create item
  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  // PUT: Update item
  update(endpoint: string, id: number | string, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}/${id}`, data);
  }

  // DELETE: Delete item
  delete(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${endpoint}/${id}`);
  }

  // POST: Upload single file with optional extra data
  uploadFile(endpoint: string, file: File, extraData?: { [key: string]: any }): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    if (extraData) {
      Object.keys(extraData).forEach(key => {
        formData.append(key, extraData[key]);
      });
    }

    return this.http.post(`${this.baseUrl}${endpoint}`, formData);
  }

  // POST: Upload multiple files
  uploadFiles(endpoint: string, files: File[], extraData?: { [key: string]: any }): Observable<any> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    if (extraData) {
      Object.keys(extraData).forEach(key => {
        formData.append(key, extraData[key]);
      });
    }

    return this.http.post(`${this.baseUrl}${endpoint}`, formData);
  }

  // GET: Download file
  downloadFile(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${endpoint}`, { responseType: 'blob' });
  }

  // POST: Send form data (مثلاً بيانات تسجيل أو أي شيء بفورم داتا غير ملفات)
  postFormData(endpoint: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, formData);
  }

  // GET: With custom headers
  getWithHeaders(endpoint: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.baseUrl}${endpoint}`, { headers });
  }

  // POST: With custom headers
  postWithHeaders(endpoint: string, data: any, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, data, { headers });
  }
}
