import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerService<T> {

  private baseApiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getAll(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseApiUrl}/${endpoint}/all`);
  }

  getById(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseApiUrl}/${endpoint}/${id}`);
  }

  searchByName(endpoint: string, nameParam: string, value: string): Observable<T[]> {
    const params = new HttpParams().set(nameParam, value);
    return this.http.get<T[]>(`${this.baseApiUrl}/${endpoint}/name`, { params });
  }

  create(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseApiUrl}/${endpoint}/form`, data);
  }

  update(endpoint: string, id: number, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseApiUrl}/${endpoint}/update/${id}`, data);
  }

  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/${endpoint}/delete/${id}`);
  }

  importFile(endpoint: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.baseApiUrl}/${endpoint}/import`, formData);
  }

  export(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.baseApiUrl}/${endpoint}/export`, { responseType: 'blob' });
  }
}
