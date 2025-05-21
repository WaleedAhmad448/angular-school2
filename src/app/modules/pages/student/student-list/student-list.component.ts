import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Student } from 'src/app/core/model/student.model';
import { StudentService } from 'src/app/core/service/student.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngTableFactoryModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  providers: [MessageService],
})
export class StudentListComponent implements OnInit {
  studentService = inject(StudentService);
  router = inject(Router);
  @ViewChild('ImageField', { static: true }) imageTemplate!: TemplateRef<any>; 
  @ViewChild('importFileInput') importFileInput!: ElementRef;

  students: Student[] = [];
  query: string = '';
  serverBaseUrl: string = environment.baseUrl;
  _getData: Subject<void> = new Subject();
  getData$: Observable<void> = this._getData.asObservable();

  tableConfig!: KitsngTableConfig;
  headerOptions!: PageHeadeingOptions;
  photoTemplate: TemplateRef<any> | undefined;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService
  ) {
    this.initHeaderOptions();
  }
  
  ngOnInit(): void {
    this.initTableConfig();
    // this._getData.pipe(debounceTime(500)).subscribe(() => {
    //   this.fetchStudentsData();
    // });
    // this._getData.next();
  }

  ngOnDestroy(): void {
    this._getData.unsubscribe();
  }

  // fetchStudentsData() {
  //   this.studentService.getAllStudents().subscribe({
  //     next: (response: Student[]) => {
  //       this.students = response;
  //       this.tableConfig.data = response;
  //     },
  //     error: (error) => {
  //       this.errorHandlerService.handleError(error, this.messageService);
  //     }
  //   });
  // }
fetchStudentsData() {
  this.studentService.getAllStudents().subscribe({
    next: (response: Student[]) => {
      this.students = response;

      this.tableConfig.data = [...this.students]; // 🔁 نسخ البيانات
      this.tableConfig.totalRecords = this.students.length; // 🔢 تحديد عدد السجلات

      console.log('Students loaded:', this.students); // ✅ تحقق من البيانات
    },
    error: (error) => {
      this.errorHandlerService.handleError(error, this.messageService);
    }
  });
}



  clearSearch() {
    this.query = '';
    this._getData.next();
  }

  search(event: any) {
    this._getData.next();
  }

  triggerFileInput(): void {
    this.importFileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    this.studentService.import(file).subscribe({
      next: (response: any) => {
        console.log(response);
        this._getData.next();
        swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'File uploaded successfully',
        });
      },
      error: (error) => console.error(error)
    });
  }

  exportToExcel(): void {
    if (!this.students || this.students.length === 0) {
      console.error('No data available for export.');
      return;
    }

    const data = this.students.map(student => {
      const studentData: { [key: string]: any } = {
        'ID': student.studentId,
        'Name': student.studentName,
        'Nrc No': student.studentNrc,
        'Age': student.age,
        'Gender': student.gender,
        'Photo': student.photo,
      };
      return studentData;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student');

    XLSX.writeFile(wb, 'student_data.xlsx');
  }

  initHeaderOptions() {
    this.headerOptions = {
      title: 'Student',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Student' },
      ],
      actions: [
        {
          label: 'Add Student',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['student', 'add']);
          },
        },
        {
          label: 'Import',
          icon: 'pi pi-upload',
          onClick: () => {
            this.triggerFileInput();
          }
        },
        {
          label: 'Export',
          icon: 'pi pi-download',
          onClick: () => {
            this.exportToExcel();
          }
        }
      ],
    };
  }

initTableConfig() {
  this.tableConfig = {
    columns: [
      { field: 'studentId', header: 'ID' },
      { field: 'studentName', header: 'Name' },
      { field: 'studentNrc', header: 'NRC No' },
      { field: 'age', header: 'Age' },
      { field: 'gender', header: 'Gender' },
      {
        field: 'photo',
        header: 'Photo',
        template: this.imageTemplate,
      },

    ],
    data: [],
    rowHover: true,
    pageSize: 10,
    first: 0,
    showPaginator: true,
    totalRecords: 0,
    class: 'border-0',
    actionButtons: [
      {
        icon: 'pi pi-pencil',
        onClick: (student: Student) => {
          this.router.navigate(['student', 'edit', student.studentId]);
        },
        colorClass: 'p-button-info',
      },
      {
        icon: 'pi pi-trash',
        onClick: (student: Student) => {
          if (confirm(`Are you sure you want to delete ${student.studentName}?`)) {
            this.studentService.deleteStudent(student.studentId).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Deleted',
                  detail: `Student ${student.studentName} deleted successfully.`,
                });
                this._getData.next();
              },
              error: (error) => {
                this.errorHandlerService.handleError(error, this.messageService);
              }
            });
          }
        },
        colorClass: 'p-button-danger',
      },
    ],
    fetchApiInfo:{
      module: 'student',
      entity: 'get',
      path: 'all',
      version: '',
      baseUri: this.serverBaseUrl,
      _getData: new Subject<void>(),
    },
    onSelectedItems: (e) => {
      console.log('Selected students', e);
    },
    onSorting: (e) => {
      console.log('Sorting', e);
    },
    onPageChanged: (e) => {
      console.log('Page changed', e);
    },
  };
}


}
