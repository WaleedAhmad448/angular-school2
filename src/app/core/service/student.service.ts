import { Injectable } from '@angular/core';
import { ApiServices } from './api.services';
import { Student, StudentRegistrationDto } from '../model/student.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private endpoint = 'StudentRegistration';

  constructor(private apiService: ApiServices<Student>, private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.apiService.getAll(this.endpoint);
  }

  getStudentById(id: number): Observable<Student> {
    return this.apiService.getById(this.endpoint, id);
  }

  registerStudent(data: StudentRegistrationDto): Observable<Student> {
    return this.apiService.create(this.endpoint, data as Student);
  }

  updateStudent(id: number, data: StudentRegistrationDto): Observable<Student> {
    return this.apiService.update(this.endpoint, id, data as Student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  getPagedStudents(page: number, pageSize: number, search: string = ''): Observable<Student[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);
    return this.apiService.getAll(this.endpoint, params);
  }

  uploadStudentPhoto(studentId: number, file: File): Observable<any> {
    return this.apiService.uploadFile(`${this.endpoint}/upload-photo`, file, { studentId });
  }
}
