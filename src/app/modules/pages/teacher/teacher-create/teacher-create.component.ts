import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  KitsngFormFactoryModel,
  KitsngFormFactoryModule,
  KitsngFormFactoryService,
  KitsngFormGroupFactoryModel,
} from 'kitsng-form-factory';
import { MessageService } from 'primeng/api';
import { finalize, Observable, Subject } from 'rxjs';
import {
  PageHeadeingOptions,
  PageHeading,
} from 'src/app/common/page-heading/page-heading.component';
import { EntitiesNames, ModulesNames } from 'src/app/core/model/enums.model';
import { ApiService } from 'src/app/core/service/api.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-teacher-create',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngFormFactoryModule],
  providers: [MessageService],
  templateUrl: './teacher-create.component.html',
  styleUrl: './teacher-create.component.scss',
})
export class TeacherCreateComponent {
   @ViewChild("formContainerRef", { static: false })
      formContainerRef!: ElementRef;
    
    apiService : ApiService = inject(ApiService);
    router: Router= inject(Router);
    activeRoute: ActivatedRoute = inject(ActivatedRoute);

    pageUrl : "edit" | "add" | null = null;
    _arrayFormLength : number = 0;

    teatherId!: number;
    teacherData: any;
    @ViewChild('ImageField', { static: true }) imageTemplate!: TemplateRef<any>;
    @ViewChild('importFileInput') importFileInput!: ElementRef;
    serverBaseUrl: string = 'http://localhost:8080';
    query: string = '';
    _getData: Subject<void> = new Subject();
    getData$: Observable<void> = this._getData.asObservable();
    
    form!: FormGroup;
    formFields: KitsngFormFactoryModel[] = [];
    headerOptions!: PageHeadeingOptions;
    constructor(public formFactory: KitsngFormFactoryService,private teacherService : TeacherService,
        private errorHandlerService: ErrorHandlerService, private messageService: MessageService) {
        this.checkPageUrl();
       
    }
    checkPageUrl() {
    this.activeRoute.url.subscribe({
      next: (value) => {
        const urlPath = value.map((url) => url.path)[0];
        switch (urlPath) {
          case 'edit':
            this.pageUrl = 'edit';
            this.activeRoute.params.subscribe((params) => {
              this.teatherId = +params['id'];
              this.fetchTeacherData(); // 🟢 Load data for editing
            });
            break;
          case 'add':
            this.pageUrl = 'add';
            this.initForm(); // 🟢 Init form for add
            break;
          default:
            this.pageUrl = null;
        }
            this.initHeaderOptions();
      },
    });
  }
      fetchTeacherData() {
    this.teacherService.getAll().subscribe({
      next: (teacher) => {
        this.initForm();
        this.mapFromApi(teacher);
      },
      error: (err) => {
        this.errorHandlerService.handleError(err, this.messageService);
      },
    });
  }
    submit(){
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      if(this.form.invalid){
        this.scrollToFirstError();
       }else{
        if(this.pageUrl == 'edit'){
            this.update();
        }else{
            this.create();
        }
       }
    }
    create(){
        const data = this.addMapToApi(this.form.getRawValue());
        console.log(data)
        this.apiService._initService(ModulesNames.school, EntitiesNames.teacher,'v1');
        this.form.disable()
         this.apiService.add(data).pipe(finalize(() => this.form.enable())).subscribe({
            next: (response) => {
                console.log('Data',response);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Your data have been added successfully' });
                this.router.navigate(['student','add'])
            },
            error:(error) =>{
                this.form.enable()
                console.log('Error Fetching Data',error);
                this.errorHandlerService.handleError(error,this.messageService);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error Add Data`,
                });
            }
         });
    }
    update(){
        const data = this.editMapToApi(this.form.getRawValue());
        console.log(data)
        this.apiService._initService(ModulesNames.school, EntitiesNames.teacher,'v1');
        this.form.disable()
         this.apiService.edit(data).pipe(finalize(() => this.form.enable())).subscribe({
            next: (response) => {
                console.log('Data',response);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Your data have been updated successfully' });
                this.router.navigate(['teacher','edit',response.id])
            },
            error:(error) =>{
                this.form.enable()
                console.log('Error Update Data',error);
                this.errorHandlerService.handleError(error,this.messageService);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error Update Data`,
                });
            }
         });
    }
    editMapToApi(data: any){
        delete data['periodTotal'];
        // data['id'] = this.financialPeriodData.yearId;
        return data;
    }
    addMapToApi(data: any){
     delete data['periodTotal'];
     data['endDate'] = data['endDate'] ? new Date(data['endDate']).toISOString() : '';
     data['periods']= data['periods'].map((item: any) =>{
        return {
            ...item,
            startDate: item.startDate ? new Date(item.startDate).toISOString() : '',
            // code: "Azaam"
        }
     })
     return data;
    }
    mapFromApi(data : any){
       data['periodTotal'] = this._arrayFormLength;
       data['periods'] = data['periods'].map((item:any)=>{
        return{
            ...item,
            id: item.id,
            startDate: item.startDate ? new Date(item.startDate) : null,

        }
       })
        return data;
       }
    scrollToFirstError() {
        const invalidElements =
          this.formContainerRef?.nativeElement?.querySelectorAll(":not(form).ng-invalid");
        if (invalidElements?.length > 0) {
          invalidElements?.[0]?.scrollIntoView({ behavior: "smooth" });
        }
      }
      back(){
        window.history.back()
      }
    initHeaderOptions() {
        let self = this;

        this.headerOptions = {
            title:this.pageUrl == 'edit' ? 'Update Financial Period' : 'Create New Financial Period',
            description: 'fill all required fields',
            containerClass: 'card mb-3 pb-3',
            breadcrumbs: [
                {
                  label: "Financial Periods",
                  routerLink: "/finance/financial-periods"
                },
                {
                    label: this.pageUrl=='edit' ? 'Update Financial Period' :'Create New Financial Period',
                },
            ],
            actions: [],
        };
    }
    initForm() {
        this.formFields = [
            {
                colSize: 'col-12 md:col-6',
                controlType: 'dropdown',
                options: {
                    label: 'Period Type',
                    formControlName: 'periodType',
                    validators: { required: true },
                    placeholder: 'Select Type',
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                },
            },

            {
                colSize: 'col-12 md:col-6',
                controlType: 'lookup-select',
                options: {
                    label: 'Year',
                    formControlName: 'yearId',
                    validators: { required: true },
                    placeholder: 'Select Year',
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                    
                },
            },
            {
                controlType: 'calendar-picker',
                colSize: 'col-12 md:col-6',
                options: {
                    label: 'End Date',
                    formControlName: 'endDate',
                    placeholder:'mm/dd/yyyy',
                    disabled: true,
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                },
            },
            {
                controlType: 'input-number',
                colSize: 'col-12 md:col-6',
                options: {
                    label: 'Periods Total',
                    formControlName: 'periodTotal',
                    readonly: true,
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                },
            },
            {
                controlType: 'input',
                colSize: 'col-12',
                options: {
                    label: 'Periods',
                    formControlName: 'periods',
                    formControlType: 'array',
                    arrayLayout: 'table',
                    
                },
            },
        ];
        this.form = this.formFactory.createForm(this.formFields);
    }
    
}

