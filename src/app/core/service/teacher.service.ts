import { Injectable } from '@angular/core';
import { ApiServices } from './api.services'; // تأكد من مسار الاستيراد الصحيح
import { Teacher, TeacherRegistrationDto, PagedResult } from '../model/teacher.model'; // تأكد من مسار الاستيراد الصحيح
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private endpoint = 'Teacher'; // تأكد من أن هذا هو الـ endpoint الصحيح

  constructor(private apiService: ApiServices<Teacher>) {}

  
  // الحصول على جميع المعلمين
  getAllTeachers(): Observable<Teacher[]> {
    return this.apiService.getAll(this.endpoint);
  }

  // الحصول على معلم واحد حسب الـ ID
  getTeacherById(id: number): Observable<Teacher> {
    return this.apiService.getById(this.endpoint, id);
  }

  // تسجيل معلم جديد
  registerTeacher(data: TeacherRegistrationDto): Observable<Teacher> {
    const newTeacher: Teacher = {
      id: 0,  // أو استخدم أي قيمة افتراضية مناسبة
      teacherNumber: '',  // يجب أن يكون قيمة افتراضية
      hireDate: '',  // يجب أن يكون قيمة افتراضية
      ...data
    };
    return this.apiService.create(this.endpoint, newTeacher);
  }

  // تحديث بيانات معلم
  updateTeacher(id: number, data: TeacherRegistrationDto): Observable<Teacher> {
    const updatedTeacher: Teacher = {
      id: id,  // استخدم الـ id الذي تم تمريره
      teacherNumber: '',  // يجب أن يكون قيمة صحيحة
      hireDate: '',  // يجب أن يكون قيمة صحيحة
      ...data
    };
    return this.apiService.update(this.endpoint, id, updatedTeacher);
  }

  // حذف معلم
  deleteTeacher(id: number): Observable<void> {
    return this.apiService.delete(this.endpoint, id);
  }

  // الحصول على المعلمين مع تقسيم الصفحات
  getPagedTeachers(page: number, pageSize: number, search: string = ''): Observable<PagedResult<Teacher>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);

    return this.apiService.getWithParams<PagedResult<Teacher>>(this.endpoint, params);
  }
}