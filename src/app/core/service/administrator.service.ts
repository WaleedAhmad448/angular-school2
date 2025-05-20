import { Injectable } from '@angular/core';
import { ApiServices } from './api.services'; // تأكد من مسار الاستيراد الصحيح
import { Administrator , AdministratorRegistrationDto } from '../model/administrator.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdministratorService {
  private endpoint = 'Administrator';

  constructor(private apiService: ApiServices<Administrator>, private http: HttpClient) {}
  
    getAllAdministrator(): Observable<Administrator[]> {
        return this.apiService.getAll(this.endpoint);
    }

    getAdministratorById(id: number): Observable<Administrator> {
        return this.apiService.getById(this.endpoint, id);
    }


    registerAdministrator(data: FormData): Observable<any> {
      return this.http.post(`${this.apiService.getFullUrl(this.endpoint)}`, data);
    }

    updateAdministrator(id: number, formData: FormData) {
      return this.http.put(`${this.apiService.getFullUrl(this.endpoint)}/${id}`, formData);
    }

    deleteAdministrator(id: number): Observable<void> {
      return this.apiService.delete(this.endpoint, id);
    }
  
    getPagedAdministrators(page: number, pageSize: number, search: string = ''): Observable<Administrator[]> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('pageSize', pageSize.toString())
        .set('search', search);
      return this.apiService.getAll(this.endpoint, params);
    }
    getImageUrl(imagePath: string): string {
      return this.apiService.getFullUrl(imagePath);
    }

}
