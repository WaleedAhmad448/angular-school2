import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { ApiQueryDto, ContextService } from 'saned-shared-lib';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { StudentService } from 'src/app/core/service/student.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngTableFactoryModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
  providers: [MessageService],
})
export class StudentListComponent implements OnInit {
  ctxService = inject(ContextService);
  studentService: StudentService = inject(StudentService);
  router: Router = inject(Router);

  query!: string;
  _getData: Subject<void> = new Subject();
  getData$: Observable<void> = this._getData.asObservable();

  tableConfig!: KitsngTableConfig;
  headerOptions!: PageHeadeingOptions;

  constructor(private errorHandlerService: ErrorHandlerService, private messageService: MessageService) {
    this.initHeaderOptions();
    this.initTableConfig();
    this.fetchStudentData();
  }

  ngOnInit(): void {
    this._getData.next();
  }

  fetchStudentData() {
    this.getData$.pipe(debounceTime(500)).subscribe(() => {
      const query: ApiQueryDto | any = {};
      if (this.query != null || this.query != undefined) {
        query['search'] = this.query;
      }

      this.studentService.getPaged(query).subscribe({
        next: (response: any) => {
          console.log('StudentData', response);
          this.tableConfig.data = response.items;
        },
        error: (error) => {
          console.log('Error Student Data', error);
          this.errorHandlerService.handleError(error, this.messageService);
        },
      });
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
      title: 'Student',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [{ label: 'Student' }],
      actions: [
        {
          label: 'Add Student',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['student', 'add']);
          },
        },
      ],
    };
  }

  initTableConfig() {
    this.tableConfig = {
      columns: [
        { field: 'studentNumber', header: 'Student No.' },
        { field: 'fullName', header: 'Full Name' },
        { field: 'gradeLevel', header: 'Grade' },
        { field: 'email', header: 'Email' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'registrationDate', header: 'Registered At' },
      ],
      data: [],
      pageSize: 5,
      first: 0,
      showPaginator: false,
      totalRecords: 0,
      class: 'border-0',
      actionButtons: [
        {
          icon: 'pi pi-pencil',
          onClick: (e) => {
            this.router.navigate(['student', 'edit'], { state: e });
          },
          colorClass: 'p-button-info',
        },
      ],
      onSelectedItems: (e) => {
        console.log('onSelectedItems', e);
      },
      onSorting: (e) => {
        console.log('onSorting', e);
      },
      onPageChanged: (e) => {
        console.log('onPageChanged', e);
      },
    };
  }
}
