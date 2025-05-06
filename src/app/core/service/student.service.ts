import { Injectable } from '@angular/core';
import { ApiServices } from './api.services';
import { Student } from '../model/student.model';
import { StudentRegistrationDto } from '../model/student.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private endpoint = 'StudentRegistration'; // تأكد أنه يطابق مسار الـ API في الباكند
  constructor(private api: ApiServices<Student>, private http: HttpClient) {}
  private apiUrl = environment.baseUrl;
  // this.http.get(`${environment.apiUrl}/OAuth/userinfo`)

  getAllStudents(): Observable<Student[]> {
    return this.api.getAll(this.endpoint);
  }

  getStudentById(id: number): Observable<Student> {
    return this.api.getById(this.endpoint, id);
  }

  registerStudent(data: StudentRegistrationDto): Observable<Student> {
    return this.api.create(this.endpoint, data as unknown as Student);
  }
  createStudent(payload: any) {
    // return this.api.create('/api/StudentRegistration', payload);
    // return this.http.get(`${this.apiUrl}/OAuth/userinfo`);
    return this.http.post(`${this.apiUrl}/StudentRegistration`, payload);

  }
  
  updateStudent(id: number, data: StudentRegistrationDto): Observable<Student> {
    return this.api.update(this.endpoint, id, data as unknown as Student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.api.delete(this.endpoint, id);
  }

  uploadStudentPhoto(studentId: number, file: File): Observable<any> {
    return this.api.uploadFile(`${this.endpoint}/upload-photo`, file, { studentId });
  }
}
