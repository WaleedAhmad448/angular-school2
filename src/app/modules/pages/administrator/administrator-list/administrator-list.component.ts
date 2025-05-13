import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild , AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { MessageService } from 'primeng/api';
import { debounceTime, Observable, Subject } from 'rxjs';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Administrator } from 'src/app/core/model/administrator.model';
import { AdministratorService } from 'src/app/core/service/administrator.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administrator-list',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngTableFactoryModule],
  templateUrl: './administrator-list.component.html',
  styleUrl: './administrator-list.component.scss',
  providers: [MessageService],
})
export class AdministratorComponent implements OnInit , AfterViewInit {
  @ViewChild('imageTemplate', { static: true }) imageTemplate!: TemplateRef<any>;

  administratorService = inject(AdministratorService);
  router = inject(Router);

  administrators: Administrator[] = [];
  query: string = '';

  _getData: Subject<void> = new Subject();
  getData$: Observable<void> = this._getData.asObservable();

  tableConfig!: KitsngTableConfig;
  headerOptions!: PageHeadeingOptions;

  showImageDialog: boolean = false;
  imageToShow: string = '';

  environment = environment;

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService,
  ) {
    this.initHeaderOptions();
    this.initTableConfig(); // تأجيل التهيئة إلى هنا

  }

  ngOnInit(): void {
    this._getData.pipe(debounceTime(500)).subscribe(() => {
      this.fetchAdministratorsData();
    });
    this._getData.next();
  }
  ngAfterViewInit(): void {
    // this.initTableConfig(); // تأجيل التهيئة إلى هنا
  }
  ngOnDestroy(): void {
    this._getData.unsubscribe();
  }
 
  // fetchAdministratorsData() {
  //   this.administratorService.getAllAdministrator().subscribe({
  //     next: (response: Administrator[]) => {
  //       if (this.query) {
  //         const q = this.query.toLowerCase();
  //         this.tableConfig.data = response.filter(administrator =>
  //           administrator.fullName?.toLowerCase().includes(q) ||
  //           administrator.administratorNumber.toLowerCase().includes(q)
  //         );
  //       } else {
  //         this.tableConfig.data = response;
  //       }
  //     },
  //     error: (error) => {
  //       this.errorHandlerService.handleError(error, this.messageService);
  //     }
  //   });
  // }
fetchAdministratorsData() {
  this.administratorService.getAllAdministrator().subscribe({
    next: (response: Administrator[]) => {
      console.log(response); // تحقق من البيانات المستلمة
      this.tableConfig.data = response; // تأكد من أن البيانات تحتوي على imagePath
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
      title: 'Administrator',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Administrator' },
      ],
      actions: [
        {
          label: 'Add Administrator',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['administrator', 'add']);
          },
        }
      ],
    };
  }

  initTableConfig() {
    this.tableConfig = {
      columns: [
        { field: 'fullName', header: 'Full Name' },
        { field: 'phoneNumber', header: 'Phone' },
        { field: 'email', header: 'Email' },
        { field: 'administratorNumber', header: 'Administrator Number' },
        { field: 'qualification', header: 'Qualification' },
        { field: 'address', header: 'Address' },
        { field: 'dateOfBirth', header: 'Date of Birth' },
        { field: 'hireDate', header: 'Hire Date' },
        {
          field: 'imagePath',
          header: 'Image',
          template: this.imageTemplate
        }

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
          onClick: (administrator: Administrator) => {
            this.router.navigate(['administrator', 'edit', administrator.id]);
          },
          colorClass: 'p-button-info',
        },
        {
          icon: 'pi pi-trash',
          onClick: (administrator: Administrator) => {
            if (confirm(`Are you sure you want to delete ${administrator.fullName }?`)) {
              this.administratorService.deleteAdministrator(administrator.id).subscribe({
                next: () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Deleted',
                    detail: `Administrator ${administrator.fullName } deleted successfully.`,
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
        }
      ],
      onSelectedItems: (e) => {
        console.log('Selected administrator', e);
      },
      onSorting: (e) => {
        console.log('Sorting', e);
      },
      onPageChanged: (e) => {
        console.log('Page changed', e);
      },
    };
  }

openImageDialog(imageUrl: string): void {
  this.imageToShow = imageUrl;
  this.showImageDialog = true;
}

}
