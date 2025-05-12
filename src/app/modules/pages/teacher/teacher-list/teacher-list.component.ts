import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Teacher } from 'src/app/core/model/teacher.model';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngTableFactoryModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
  providers: [MessageService],
})
export class TeacherListComponent implements OnInit {
  teacherService = inject(TeacherService);
  router = inject(Router);

  teachers: Teacher[] = [];
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
      this.fetchTeachersData();
    });
    this._getData.next();
  }

  ngOnDestroy(): void {
    this._getData.unsubscribe();
  }
  fetchTeachersData() {
    this.teacherService.getAllTeachers().subscribe({
      next: (response: Teacher[]) => {
        if (this.query) {
          const q = this.query.toLowerCase();
          this.tableConfig.data = response.filter(teacher =>
            teacher.fullName.toLowerCase().includes(q) ||
              teacher.teacherNumber.toString().includes(q) ||
                teacher.email.toLowerCase().includes(q)
          );
        } else {
          this.tableConfig.data = response;
        }
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
      title: 'Teachers',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Teachers' },
      ],
      actions: [
        {
          label: 'Add Teacher',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['teacher', 'add']);
          },
        }
      ],
    };
  }

  initTableConfig() {
    this.tableConfig = {
      columns: [
        { field: 'fullName', header: 'Full Name' },
        { field: 'dateOfBirth', header: 'Date of Birth' },
        { field: 'teacherNumber', header: 'Teacher Number' },
        { field: 'address', header: 'Address' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'email', header: 'Email' },
        { field: 'subject', header: 'Subject' },
        { field: 'qualification', header: 'Qualification' },
        { field: 'hireDate', header: 'Hire Date' },
        { field: 'profileImagePath', header: 'Profile Image' },
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
          onClick: (teacher: Teacher) => {
              this.router.navigate([ 'teacher','edit', teacher.id]);
          },
          colorClass: 'p-button-info',
        }
      ],
      onSelectedItems: (e) => {
        console.log('Selected teachers', e);
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
