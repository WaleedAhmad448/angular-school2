import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  KitsngFormFactoryModel,
  KitsngFormFactoryModule,
  KitsngFormFactoryService,
} from 'kitsng-form-factory';
import { MessageService } from 'primeng/api';
import {
  PageHeadeingOptions,
  PageHeading,
} from 'src/app/common/page-heading/page-heading.component';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { AdministratorService } from 'src/app/core/service/administrator.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-administrator-create',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngFormFactoryModule],
  providers: [MessageService],
  templateUrl: './administrator-create.component.html',
  styleUrl: './administrator-create.component.scss',
})
export class AdministratorCreateComponent {
  @ViewChild('formContainerRef', { static: false })
  formContainerRef!: ElementRef;

  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  pageUrl: 'edit' | 'add' | null = null;
  _arrayFormLength: number = 0;
  administratorId!: number;

  form!: FormGroup;
  formFields: KitsngFormFactoryModel[] = [];
  headerOptions!: PageHeadeingOptions;
  constructor(
    public formFactory: KitsngFormFactoryService,
    private administratorService: AdministratorService,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService
  ) {
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
              this.administratorId = +params['id'];
              this.fetchAdministratorData(); // 🟢 Load data for editing
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

  fetchAdministratorData() {
    this.administratorService.getAdministratorById(this.administratorId).subscribe({
      next: (administrator) => {
        this.initForm();
        this.mapFromApi(administrator);
      },
      error: (err) => {
        this.errorHandlerService.handleError(err, this.messageService);
      },
    });
  }

  submit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.scrollToFirstError();
    } else {
      if (this.pageUrl === 'edit') {
        this.update();
      } else {
        this.create();
      }
    }
  }
create() {
  const formData = new FormData();
  const rawData = this.form.getRawValue(); // استخدم getRawValue للحصول على كل البيانات حتى لو disabled

  formData.append('FullName', rawData.fullName || '');
  formData.append('Email', rawData.email || '');
  formData.append('PhoneNumber', rawData.phoneNumber || '');
  formData.append('Address', rawData.address || '');
  formData.append('Qualification', rawData.qualification || '');
  formData.append('AdministratorNumber', rawData.administratorNumber || '');
  formData.append('DateOfBirth', new Date(rawData.dateOfBirth).toISOString());
  formData.append('HireDate', new Date(rawData.hireDate).toISOString());

  const file: File = rawData.imagePath;

  if (file && file instanceof File && file.size > 0) {
    formData.append('ImagePath', file);
  }
  this.administratorService.registerAdministrator(formData).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Administrator created successfully',
      });
      this.router.navigate(['administrator']);
    },
    error: (error) => {
      this.errorHandlerService.handleError(error, this.messageService);
    },
  });
}

 update() {
  const rawData = this.form.getRawValue();
  const formData = new FormData();

  formData.append('FullName', rawData.fullName || '');
  formData.append('Email', rawData.email || '');
  formData.append('PhoneNumber', rawData.phoneNumber || '');
  formData.append('Address', rawData.address || '');
  formData.append('Qualification', rawData.qualification || '');
  formData.append('AdministratorNumber', rawData.administratorNumber || '');
  formData.append('DateOfBirth', new Date(rawData.dateOfBirth).toISOString());
  formData.append('HireDate', new Date(rawData.hireDate).toISOString());
  formData.append('UpdatedAt', new Date().toISOString());

  const file: File = rawData.imagePath;
  if (file && file instanceof File && file.size > 0) {
    formData.append('ImagePath', file);
  }

  this.administratorService.updateAdministrator(this.form.value.id, formData).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Administrator updated successfully',
      });
      this.router.navigate(['administrator']);
    },
    error: (error) => {
      this.errorHandlerService.handleError(error, this.messageService);
    },
  });
}

  addMapToApi(data: any) {
    return {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(), // ✅ التحويل الصحيح
        createdAt: new Date().toISOString()
        };
    }


  editMapToApi(data: any) {
    return {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString(), // ✅ التحويل الصحيح
      updatedAt: new Date().toISOString(),
    };
  }

  mapFromApi(data: any) {
    this.form.patchValue({
      id: data.id,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,      
      email: data.email,
      address: data.address,
      qualification: data.qualification,
      hireDate: data.hireDate,
      administratorNumber: data.administratorNumber,
      dateOfBirth: new Date(data.dateOfBirth),
      imagePath: data.imagePath,
    });
  }

  scrollToFirstError() {
    const invalidElements = this.formContainerRef?.nativeElement?.querySelectorAll(
      ':not(form).ng-invalid'
    );
    if (invalidElements?.length > 0) {
      invalidElements?.[0]?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  back() {
    window.history.back();
  }

  initHeaderOptions() {
    this.headerOptions = {
      title:
        this.pageUrl === 'edit' ? 'Update Administrator' : 'Create New Administrator',
      description: 'Fill all required fields',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        {
          label: 'Administrator',
          routerLink: '/administrator',
        },
        {
          label:
            this.pageUrl === 'edit'
              ? 'Update Administrator'
              : 'Create New Administrator',
        },
      ],
      actions: [],
    };
  }

  initForm() {
    this.formFields = [
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Full Name',
          formControlName: 'fullName',
          validators: { required: true },
        },
      },      
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Email',
          formControlName: 'email',
          validators: { required: true },
        },
      },      
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Phone Number',
          formControlName: 'phoneNumber',
          validators: { required: true },
        },
      },
            {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Address',
          formControlName: 'address',
          validators: { required: true },
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Qualification',
          formControlName: 'qualification',
          validators: { required: true },
        },
      },
         {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'administrator Number',
          formControlName: 'administratorNumber',
        },
      },
      {
        controlType: 'calendar-picker',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Date of Birth',
          formControlName: 'dateOfBirth',
          validators: { required: true },
        },
      },
         {
        controlType: 'calendar-picker',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Hire Date',
          formControlName: 'hireDate',
          validators: { required: true },
        },
      },
      {
        controlType: 'file-upload',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Image Path',
          formControlName: 'imagePath',
          validators: { required: true },
          multiple: false,
          accept: 'image/*',
        },    
      },
    ];

    this.form = this.formFactory.createForm(this.formFields);
    // إضافة id بشكل يدوي إذا لم يكن موجود
    if (!this.form.contains('id')) {
      this.form.addControl('id', new FormControl(null));
    }
  }
}
