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
import { Teacher } from 'src/app/core/model/teachers.model';
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

    onSubmit() {
  const teacherData: Teacher = this.form.value;  // بيانات النموذج عدا الصورة
  const imageFile = this.selectedImageFile;      // ملف الصورة المختار من input file
  
  this.teacherService.create(teacherData, imageFile).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', detail: 'Teacher created' });
    },
    error: (err) => {
      console.error('Error Add Data full object:', err);
      this.messageService.add({ severity: 'error', detail: 'Error Add Data' });
    }
  });
}

 create() {
  const formData = new FormData();
  const data = this.form.getRawValue();

  // أضف بيانات الفورم ما عدا الصورة
  Object.keys(data).forEach(key => {
    if (key !== 'image') {
      let value = data[key];
      // لو القيم مصفوفة أو كائنات تحتاج تحويل
      if (Array.isArray(value) || typeof value === 'object') {
        value = JSON.stringify(value);
      }
      formData.append(key, value);
    }
  });

  // أضف الصورة لو موجودة
  if (data.image && data.image instanceof File) {
    formData.append('image', data.image, data.image.name);
  }

  this.apiService._initService(ModulesNames.school, EntitiesNames.teacher, 'v1');
  this.form.disable();

  this.apiService.add(formData).pipe(finalize(() => this.form.enable())).subscribe({
    next: (response) => {
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Your data have been added successfully' });
      this.router.navigate(['teacher', 'add']);
    },
    error: (error) => {
      console.error('Error Add Data:', error);
      this.form.enable();
      this.errorHandlerService.handleError(error, this.messageService);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Add Data' });
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
      this.form = this.formFactory.createForm(this.formFields);
      this.form.addControl('image', new FormControl(null));

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
    }

    
}

