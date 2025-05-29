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
import { Teacher } from 'src/app/core/model/teacher.model';
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
    query: string = '';
    _getData: Subject<void> = new Subject();
    getData$: Observable<void> = this._getData.asObservable();
    
    form!: FormGroup;
    formFields: KitsngFormFactoryModel[] = [];
    headerOptions!: PageHeadeingOptions;
  selectedImageFile: any;
    constructor(public formFactory: KitsngFormFactoryService,private teacherService : TeacherService,
       private errorHandlerService: ErrorHandlerService, private messageService: MessageService) {
        this.checkPageUrl();
        this.initHeaderOptions();
        // this.subscribeToFinancialSettings();
       
    }

    checkPageUrl() {
        this.activeRoute.url.subscribe({
          next: (value) => {
            const urlPath = value.map((url) => url.path)[0];
            switch (urlPath) {
              case 'edit':
                this.pageUrl = 'edit';
                break;
              case 'add':
                this.pageUrl = 'add';
                break;
              default:
                this.pageUrl = null ; // Handle unexpected URLs
                console.warn('Unknown URL:', urlPath);
            }
            console.log('Current page URL:', this.pageUrl);
          },
        });
      }
    // private subscribeToFinancialSettings(){
    //     this.financialSettingService.settings$.subscribe({
    //         next: (response) => {
    //             console.log('response periodsSetting', response.periodsSetting);
    //             this.periodsSettingData = response.periodsSetting;
    //             this.initForm();
    //             if(this.pageUrl == 'edit'){
    //                 this.getItems();
    //             }
    //         }
    //     })
    // }
    // getItems(){
    //     this.financialPeriodData = window.history.state;
    //     this._arrayFormLength = this.getNumberOfPeriodsByType(this.financialPeriodData.periodType)
    //     const data = this.mapFromApi(this.financialPeriodData);
    //     console.log("data form api", data)
    //     this.initForm();
    //     this.form.patchValue(this.financialPeriodData);
    //     this.form.updateValueAndValidity();
    //     console.log("Form Value", this.form.getRawValue())
    // }
    // getNumberOfPeriodsByType(type: PeriodTypes): number {
    //     let number: number = 0;
    //     if (type === PeriodTypes.Fiscal) {
    //         return this.periodsSettingData?.numberOfFiscalPeriods ?? 0 as number;
    //     } else if (type === PeriodTypes.Tax) {
    //         return this.periodsSettingData?.numberOfTaxPeriods ?? 0 as number;
    //     } else if (type === PeriodTypes.Reporting) {
    //         return this.periodsSettingData?.numberOfReportingPeriods ?? 0 as number;
    //     } else {
    //         return number; // This will return 0 by default
    //     }
    // }
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
                this.router.navigate(['teacher','add'])
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
                this.router.navigate(['teacher','edite'])
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
  addMapToApi(data: any) {
      // تحويل التاريخ لصيغة ISO
      data['birthDate'] = data['birthDate'] ? new Date(data['birthDate']).toISOString() : '';
      return data;
    }

  editMapToApi(data: any) {
      data['id'] = this.teatherId;
      data['birthDate'] = data['birthDate'] ? new Date(data['birthDate']).toISOString() : '';
      return data;
    }

  mapFromApi(data: any) {
    this.form.patchValue({
      fullName: data.fullName,
      email: data.email,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      phoneNumber: data.phoneNumber,
      address: data.address,
      image: data.image,
    });
    this.teatherId = data.id;
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
      this.headerOptions = {
        title: this.pageUrl == 'edit' ? 'Update Teacher' : 'Add New Teacher',
        description: 'Fill all required fields',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
          {
            label: "Teachers",
            routerLink: "/teacher/list"
          },
          {
            label: this.pageUrl == 'edit' ? 'Update Teacher' : 'Add Teacher',
          },
        ],
        actions: [],
      };
    }

    initForm() {
      this.formFields = [
        {
          colSize: 'col-12 md:col-6',
          controlType: 'input',
          options: {
            label: 'Full Name',
            formControlName: 'fullName',
            validators: { required: true },
            placeholder: 'Enter full name',
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-4',
            controlColSize: 'col-8',
          },
        },
        {
          colSize: 'col-12 md:col-6',
          controlType: 'input',
          options: {
            label: 'Email',
            formControlName: 'email',
            validators: { required: true },
            placeholder: 'Enter email',
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-4',
            controlColSize: 'col-8',
          },
        },
        {
          colSize: 'col-12 md:col-6',
          controlType: 'calendar-picker',
          options: {
            label: 'Birth Date',
            formControlName: 'birthDate',
            placeholder: 'mm/dd/yyyy',
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-4',
            controlColSize: 'col-8',
          },
        },
        {
          colSize: 'col-12 md:col-6',
          controlType: 'input',
          options: {
            label: 'Phone Number',
            formControlName: 'phoneNumber',
            placeholder: 'Enter phone number',
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-4',
            controlColSize: 'col-8',
          },
        },
        {
          colSize: 'col-12',
          controlType: 'textarea',
          options: {
            label: 'Address',
            formControlName: 'address',
            placeholder: 'Enter address',
            rows: 3,
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-2',
            controlColSize: 'col-10',
          },
        },
        {
          controlType: 'file-upload', // أو يمكن استخدام 'input' مع نوع 'file' حسب المكتبة
          colSize: 'col-12 md:col-6',
          options: {
            label: 'Teacher Image',
            formControlName: 'image',
            accept: 'image/*',  // قبول الصور فقط
            placeholder: 'Upload Image',
            containerClass: 'align-items-center pl-4 sm:pl-6',
            controlLayout: 'horizontal',
            labelColSize: 'col-4',
            controlColSize: 'col-8',
          },
        },
      ];
      this.form = this.formFactory.createForm(this.formFields);
      this.form.addControl('image', new FormControl(null));
    }

    onFileSelected(event: any) {
      const file: File = event?.target?.files?.[0];
      if (file) {
        this.selectedImageFile = file;
        this.form.patchValue({ image: file });
        this.form.get('image')?.markAsDirty();
      }
    }

}

