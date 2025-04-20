import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Student, StudentRegistrationDto } from '../model/student.model';
import { ApiListDto, ApiQueryDto } from '../model/http-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private api: ApiService<Student>) {
    this.api._initService('school', 'students'); // وحدة: school | الكيان: students
  }

  getAll(query: ApiQueryDto): Observable<ApiListDto<Student>> {
    return this.api.getAll(query);
  }

  getPaged(query: ApiQueryDto): Observable<ApiListDto<Student>> {
    return this.api.getPaged(query);
  }

  getLookup(): Observable<ApiListDto<Student>> {
    return this.api.getAsList();
  }

  getById(id: string): Observable<Student> {
    return this.api.getById(id);
  }

  add(student: StudentRegistrationDto): Observable<Student> {
    return this.api.add(student as any);
  }

  update(student: Student): Observable<Student> {
    return this.api.edit(student);
  }

  delete(id: string): Observable<Student> {
    return this.api.delete(id);
  }

  addForm(student: StudentRegistrationDto): Observable<Student> {
    return this.api.addForm(student as any);
  }

  updateForm(student: Student): Observable<Student> {
    return this.api.editForm(student);
  }
}
