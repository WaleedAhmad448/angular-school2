import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Student } from 'src/app/core/model/student.model';
import { StudentService } from 'src/app/core/service/student.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';

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

  students: Student[] = [];
  query: string = '';

  _getData: Subject<void> = new Subject();
  getData$: Observable<void> = this._getData.asObservable();

  tableConfig!: KitsngTableConfig;
  headerOptions!: PageHeadeingOptions;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService
  ) {
    this.initHeaderOptions();
    this.initTableConfig();
  }

  ngOnInit(): void {
    this._getData.pipe(debounceTime(500)).subscribe(() => {
      this.fetchStudentsData();
    });
    this._getData.next();
  }

  fetchStudentsData() {
    this.studentService.getAllStudents().subscribe({
      next: (response: Student[]) => {
        this.tableConfig.data = response;
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

  initHeaderOptions() {
    this.headerOptions = {
      title: 'Students',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Students' },
      ],
      actions: [
        {
          label: 'Add Student',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['student', 'add']);
          },
        }
      ],
    };
  }

  initTableConfig() {
    this.tableConfig = {
      columns: [
        { field: 'fullName', header: 'Full Name' },
        { field: 'email', header: 'Email' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'gradeLevel', header: 'Grade' },
        { field: 'parentName', header: 'Parent Name' },
        { field: 'parentPhoneNumber', header: 'Parent Phone' },
        { field: 'address', header: 'Address' },
        { field: 'registrationDate', header: 'Registration Date' },
        { field: 'studentNumber', header: 'Student Number' },
        { field: 'dateOfBirth', header: 'Date of Birth' },
      ],
      data: [],
      pageSize: 10,
      first: 0,
      showPaginator: false,
      totalRecords: 0,
      class: 'border-0',
      actionButtons: [
        {
          icon: 'pi pi-pencil',
          onClick: (student: Student) => {
            this.router.navigate(['student', 'edit'], { state: student });
          },
          colorClass: 'p-button-info',
        }
      ],
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
