import { Injectable } from '@angular/core';
import { ApiServices } from './api.services';
import { Teacher, PagedResult, TeacherRegistrationDto } from '../model/teacher.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private endpoint = 'Teacher';

  constructor(private api: ApiServices<Teacher>,
              private http: HttpClient

  ) {}

  // الحصول على المدرسين مع تقسيم الصفحات + البحث
  getPagedTeachers(page = 1, pageSize = 10, search: string = ''): Observable<PagedResult<Teacher>> {
    const params: any = {
      page: page,
      pageSize: pageSize,
    };
    if (search) {
      params.search = search;
    }

    return this.api.getWithParams<PagedResult<Teacher>>(this.endpoint, params);
  }

  // الحصول على جميع المدرسين
  getAllTeachers(): Observable<Teacher[]> {
    return this.api.getAll(this.endpoint);
  }
  // الحصول على مدرس واحد
  getTeacherById(id: number): Observable<Teacher> {
    return this.api.getById(this.endpoint, id);
  }

  // تسجيل مدرس جديد
  registerTeacher(data: TeacherRegistrationDto): Observable<Teacher> {
    return this.api.create(this.endpoint, data as unknown as Teacher);
  }

  // تعديل بيانات مدرس
  updateTeacher(id: number, data: TeacherRegistrationDto): Observable<Teacher> {
    return this.api.update(this.endpoint, id, data as unknown as Teacher);
  }

  // حذف مدرس
  deleteTeacher(id: number): Observable<void> {
    return this.api.delete(this.endpoint, id);
  }

  // رفع صورة (اختياري)
  uploadProfileImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.postFormData(`${this.endpoint}/${id}/upload-image`, formData);
  }

uploadTeacherImage(fileData: FormData): Observable<{ imagePath: string }> {
  const url = `${this.api.getBaseUrl()}/Teacher/upload-profile-image`;
  return this.http.post<{ imagePath: string }>(url, fileData);
}


  // حذف صورة (اختياري)
  deleteProfileImage(id: number): Observable<void> {
    return this.api.delete(`${this.endpoint}/delete-image`, id);
  }
}
