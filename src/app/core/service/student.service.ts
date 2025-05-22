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

  // createStudent(student: Student): Observable<Student> {
  //   return this.http.post<Student>(`${baseUrl}/create`, student);
  // }
  createStudent(studentData: any, photoFile?: File): Observable<Student> {
    const formData = new FormData();
    
    // أضف جميع الحقول النصية
    formData.append('studentName', studentData.studentName);
    formData.append('studentNrc', studentData.studentNrc);
    formData.append('age', studentData.age.toString());
    formData.append('dateOfBirth', this.formatDate(studentData.dateOfBirth));
    formData.append('fatherName', studentData.fatherName);
    formData.append('gender', studentData.gender);
    formData.append('address', studentData.address);
    formData.append('township', studentData.township);
    formData.append('date', this.formatDate(studentData.date));
    
    // أضف ملف الصورة إذا كان موجودًا
    if (photoFile) {
      formData.append('file', photoFile);
    }

    return this.http.post<Student>('http://localhost:8080/student/create', formData);
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${baseUrl}/update/${id}`, student);
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
