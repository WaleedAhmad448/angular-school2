import { Injectable } from '@angular/core';
import { ApiServices } from './api.services';
import { Student } from '../model/student.model';
import { StudentRegistrationDto } from '../model/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private endpoint = 'StudentRegistration'; // تأكد أنه يطابق مسار الـ API في الباكند

  constructor(private api: ApiServices<Student>) {}
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
