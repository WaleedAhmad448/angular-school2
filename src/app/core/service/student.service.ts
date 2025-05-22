import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../model/student.model';
import { environment } from '../../../environments/environment';

const endpoint = 'student';
const baseUrl = `${environment.baseUrl}/${endpoint}`;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${baseUrl}/get/all`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${baseUrl}/get/${id}`);
  }

  getAllByStudentName(studentName: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${baseUrl}/name?studentName=${studentName}`);
  }
   createStudent(student: Student, photo?: File): Observable<Student> {
    const formData = new FormData();
    
    // إضافة البيانات
    formData.append('student', JSON.stringify(student));
    
    // إضافة الصورة إذا كانت موجودة
    if (photo) {
      formData.append('photo', photo);
    }
    
    return this.http.post<Student>(`${baseUrl}/create`, formData);
  }

  updateStudent(id: number, student: Student, photo?: File): Observable<Student> {
    const formData = new FormData();
    
    // إضافة البيانات
    formData.append('student', JSON.stringify(student));
    
    // إضافة الصورة إذا كانت موجودة
    if (photo) {
      formData.append('photo', photo);
    }
    
    return this.http.put<Student>(`${baseUrl}/update/${id}`, formData);
  }


  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${baseUrl}/delete/${id}`);
  }

  import(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${baseUrl}/import`, formData);
  }

  createFile(file: File, fileType: string, options: any = {}): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    const requestOptions = { responseType: 'text' as 'json' };
    return this.http.post<string>(`${baseUrl}/file/create`, formData, requestOptions);
  }

  updateFile(file: File, fileType: string, filePath: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('filePath', filePath);
    const requestOptions = { responseType: 'text' as 'json' };
    return this.http.put<string>(`${baseUrl}/file/update`, formData, requestOptions);
  }

  export(): Observable<Blob> {
    return this.http.get(`${baseUrl}/export`, { responseType: 'blob' });
  }
}
