
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from 'src/app/core/service/student.service';
import { PageListOptions } from '../../page-list-factory/core/page-list.model';
import { Student } from 'src/app/core/model/student.model';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  pageConfig!: PageListOptions;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.pageConfig = data['pageConfig']; // الحصول على إعدادات الصفحة
      // this.loadStudents();
    });
  }

  // loadStudents() {
  //   this.studentService.getAll().subscribe(data => {
  //     this.students = data;
  //     this.pageConfig.tableConfig.data = this.students; // تحديث البيانات في تكوين الجدول
  //     this.pageConfig.tableConfig.totalRecords = this.students.length; // تحديث العدد الكلي للسجلات
  //   });
  // }
}