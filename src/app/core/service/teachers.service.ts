import { Injectable } from '@angular/core';
import { ApiServices } from './api.services'; // تأكد من مسار الاستيراد الصحيح
import { Teacher, TeacherRegistrationDto, PagedResult } from '../model/teachers.model'; // تأكد من مسار الاستيراد الصحيح
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private endpoint = 'Teacher'; // تأكد من أن هذا هو الـ endpoint الصحيح

  constructor(private apiService: ApiServices<Teacher>, private http: HttpClient) {}

  getAllTeacher(): Observable<Teacher[]> {
    return this.apiService.getAll(this.endpoint);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.apiService.getById(this.endpoint, id);
  }

  registerTeacher(data: TeacherRegistrationDto): Observable<Teacher> {
    return this.apiService.create(this.endpoint, data as Teacher);
  }

  updateTeacher(id: number, data: TeacherRegistrationDto): Observable<Teacher> {
    return this.apiService.update(this.endpoint, id, data as Teacher);
  }

  deleteTeacher(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  getPagedTeachers(page: number, pageSize: number, search: string = ''): Observable<Teacher[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);
    return this.apiService.getAll(this.endpoint, params);
  }

  uploadTeacherPhoto(TeacherId: number, file: File): Observable<any> {
    return this.apiService.uploadFile(`${this.endpoint}/upload-photo`, file, { TeacherId });
  }
}