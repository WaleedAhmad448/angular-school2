import { Injectable } from '@angular/core';
import { GenerService } from '../service/gener.service';
import { Teacher } from '../model/teachers.model'; // تأكد من مسار الاستيراد الصحيح

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
private endpoint = 'api/default/school/teacher/v1';

  constructor(private api: GenerService<Teacher>) {}

  getAll() {
    return this.api.getAll(this.endpoint);
  }

  getById(id: number) {
    return this.api.getById(this.endpoint, id);
  }

  searchByName(name: string) {
    return this.api.searchByName(this.endpoint, 'fullName', name);
  }

  // create(teacher: Teacher) {
  //   return this.api.create(this.endpoint, teacher);
  // }
  create(teacher: Teacher, imageFile?: File) {
  const formData = new FormData();
  
  // أضف الحقول العادية (غير الصورة) إلى formData كـ JSON string
  formData.append('teacher', new Blob([JSON.stringify(teacher)], { type: 'application/json' }));

  // أضف الصورة إذا موجودة
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return this.api.createFormData(this.endpoint, formData);
}


  update(id: number, teacher: Teacher) {
    return this.api.update(this.endpoint, id, teacher);
  }

  delete(id: number) {
    return this.api.delete(this.endpoint, id);
  }

  importTeachers(file: File) {
    return this.api.importFile(this.endpoint, file);
  }

  exportTeachers() {
    return this.api.export(this.endpoint);
  }
}
