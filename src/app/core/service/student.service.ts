import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiListDto } from '../model/http-response.model'; // ✅ استيراد النوع

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private apiService: ApiService<any>) {
    this.apiService._initService('students', '');
  }

  // جلب جميع الطلاب
  getStudents(): Observable<any[]> {
    return this.apiService.getAll({}).pipe(
      map((response: ApiListDto<any>) => response.items) // ✅ تحويل ApiListDto إلى any[]
    );
  }

  // جلب طالب واحد بواسطة الـ ID
  getStudentById(id: number): Observable<any> {
    return this.apiService.getById(id.toString());
  }

  // إضافة طالب جديد
  addStudent(student: any): Observable<any> {
      const formData = new FormData();
      formData.append('name', student.name);
      formData.append('age', student.age);

      return this.apiService.fetchData('POST', 'students', formData, 'FormData'); // ✅ المسار الصحيح
  }

  addStudentWithImage(student: any, imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', student.name);
    formData.append('age', student.age);
    formData.append('image', imageFile); // ✅ إضافة الصورة

    return this.apiService.fetchData('POST', 'students', formData, 'FormData'); // ✅ المسار الصحيح
  }
  // تحديث بيانات طالب
  updateStudent(id: number, student: any): Observable<any> {
    return this.apiService.edit(student);
  }

  // حذف طالب
  deleteStudent(id: number): Observable<any> {
    return this.apiService.delete(id.toString());
  }
}