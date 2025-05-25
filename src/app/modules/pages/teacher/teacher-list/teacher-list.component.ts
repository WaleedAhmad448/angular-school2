import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { environment } from 'src/environments/environment';
import { Teacher } from 'src/app/core/model/teachers.model';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngTableFactoryModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
  providers: [MessageService],
})
export class TeacherListComponent implements OnInit {
  @ViewChild('ImageField', { static: true }) imageTemplate!: TemplateRef<any>;

  teacherService = inject(TeacherService);
  router = inject(Router);

  serverBaseUrl: string = environment.apiBaseUrl;
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
    this.fetchTeacherData();
  }

  ngOnInit(): void {
    this._getData.next();
  }

  ngOnDestroy(): void {
    this._getData.unsubscribe();
  }

  fetchTeacherData() {
    this.getData$.pipe(debounceTime(500)).subscribe(() => {
      if (this.query?.trim()) {
        this.teacherService.searchByName(this.query).subscribe({
          next: (teachers: Teacher[]) => {
            this.tableConfig.data = teachers;
          },
          error: (error) => {
            this.errorHandlerService.handleError(error, this.messageService);
          }
        });
      } else {
        this.teacherService.getAll().subscribe({
          next: (teachers: Teacher[]) => {
            this.tableConfig.data = teachers;
          },
          error: (error) => {
            this.errorHandlerService.handleError(error, this.messageService);
          }
        });
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
      breadcrumbs: [{ label: 'Teachers' }],
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
        { field: 'email', header: 'Email' },
        { field: 'address', header: 'Address' },
        { field: 'phone', header: 'Phone' },
        { field: 'dateOfBirth', header: 'Date of Birth' },
        {
          field: 'photo',
          header: 'Photo',
          template: this.imageTemplate,
        },
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
          onClick: (teacher) => {
            this.router.navigate(['teacher', 'edit', teacher.id]);
          },
          colorClass: 'p-button-info',
        },
        {
          icon: 'pi pi-trash',
          onClick: (teacher) => {
            this.router.navigate(['teacher', 'delete', teacher.id]);
          },
          colorClass: 'p-button-danger',
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
