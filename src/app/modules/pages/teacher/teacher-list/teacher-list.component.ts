import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/core/service/api.service';
import { ContextService } from 'src/app/core/service/context.service';
import { EntitiesNames, ModulesNames } from 'src/app/core/model/enums.model';
import { ApiQueryDto } from 'src/app/core/model/http-response.model';

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

ctxService = inject(ContextService);
apiService : ApiService = inject(ApiService);
router: Router = inject(Router);

serverBaseUrl: string = environment.apiBaseUrl;

teacherData: any[] = [];
query!: string;

_getData: Subject<void> = new Subject();
getData$: Observable<void> = this._getData.asObservable();

tableConfig!: KitsngTableConfig;
headerOptions!: PageHeadeingOptions;
constructor(private errorHandlerService: ErrorHandlerService, private messageService: MessageService){
  this.initHeaderOptions();
  this.initTableConfig();
}

ngOnInit(): void {
  this.fetchTeacherData();
  this._getData.next();
}

 fetchTeacherData() {
  this.apiService._initService(ModulesNames.school, EntitiesNames.teacher,'v1');
   this.getData$.pipe(debounceTime(500)).subscribe(() => {
    const query: ApiQueryDto | any = {};
      if (this.query != null || this.query != undefined) {
        query['search'] = this.query;
      }
      this.apiService.getPaged(query).subscribe({
        next: (response : any) => {
          console.log('teacherData',response)
          this.tableConfig.data = response.items;
        },
        error: (error) =>{
          console.log('Error Fetching teacher Data', error);
          this.errorHandlerService.handleError(error,this.messageService);
        } 
      }) 
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
