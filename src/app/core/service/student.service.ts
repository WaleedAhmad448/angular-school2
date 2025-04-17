import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Student, StudentRegistrationDto } from '../model/student.model';
import { ApiQueryDto, ApiListDto } from '../model/http-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private service: ApiService<Student>;

  constructor(private api: ApiService<Student>) {
    this.service = api;
    this.service._initService('school', 'student'); // مسار: /api/default/school/student
  }

  getAllStudents(query: ApiQueryDto): Observable<ApiListDto<Student>> {
    return this.service.getAll(query);
  }

  getPagedStudents(query: ApiQueryDto): Observable<ApiListDto<Student>> {
    return this.service.getPaged(query);
  }

  getStudentById(id: number): Observable<Student> {
    return this.service.getById(id.toString());
  }

  addStudent(data: StudentRegistrationDto): Observable<Student> {
    const student: Student = {
      ...data,
      id: 0, // Assign a default value or handle appropriately
      studentNumber: '', // Assign a default value or handle appropriately
      registrationDate: new Date(), // Assign a default value or handle appropriately
    };
    return this.api.add(student); // ملاحظة: هنا نستخدم api مباشرة لأن `data` من نوع DTO
  }

  updateStudent(id: number, data: StudentRegistrationDto): Observable<Student> {
    const student: Student = {
      ...data,
      id: id, // Assign the ID from the parameter
      studentNumber: '', // Assign a default value or handle appropriately
      registrationDate: new Date(), // Assign a default value or handle appropriately
    }
    return this.api.edit(student); // ملاحظة: هنا نستخدم api مباشرة لأن `data` من نوع DTO
  }

  deleteStudent(id: number) {
    return this.service.delete(id.toString());
  }

  getLookupList(): Observable<ApiListDto<Student>> {
    return this.service.getAsList();
  }
}
