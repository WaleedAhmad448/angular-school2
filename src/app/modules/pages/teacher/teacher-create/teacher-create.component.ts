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
  @ViewChild('formContainerRef', { static: false })
  formContainerRef!: ElementRef;

  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  pageUrl: 'edit' | 'add' | null = null;
  _arrayFormLength: number = 0;
  teacherId!: number;

  form!: FormGroup;
  formFields: KitsngFormFactoryModel[] = [];
  headerOptions!: PageHeadeingOptions;
  constructor(
    public formFactory: KitsngFormFactoryService,
    private teacherService: TeacherService,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService
  ) {
    this.checkPageUrl();
    this.initHeaderOptions();
  }

  checkPageUrl() {
    this.activeRoute.url.subscribe({
      next: (value) => {
        const urlPath = value.map((url) => url.path)[0];
        switch (urlPath) {
          case 'edit':
            this.pageUrl = 'edit';
            this.activeRoute.params.subscribe((params) => {
              this.teacherId = +params['id'];
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
      },
    });
  }

  fetchTeacherData() {
    this.teacherService.getTeacherById(this.teacherId).subscribe({
      next: (teacher) => {
        this.initForm();
        this.mapFromApi(teacher);
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
// create() {
//   const formData = new FormData();
//   const rawData = this.form.value;
//   const imageFile = rawData.profileImagePath; // هذا هو كائن الصورة
//   if (imageFile && imageFile instanceof File) {
//     formData.append('file', imageFile);
//     // 1. رفع الصورة أولاً
//     this.teacherService.uploadTeacherImage(formData).subscribe({
//       next: (uploadRes) => {
//         // 2. استخدم مسار الصورة بعد رفعها
//         const request = this.addMapToApi({
//           ...rawData,
//           profileImagePath: uploadRes.imagePath // مثلا: "uploads/teachers/img123.jpg"
//         });

//         // 3. إرسال الطلب لإنشاء المدرّس
//         this.teacherService.registerTeacher(request).subscribe({
//           next: () => {
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Success',
//               detail: 'Teacher created successfully',
//             });
//             this.router.navigate(['teacher']);
//           },
//           error: (error) => {
//             this.errorHandlerService.handleError(error, this.messageService);
//           }
//         });
//       },
//       error: (uploadError) => {
//         this.errorHandlerService.handleError(uploadError, this.messageService);
//       }
//     });
//   } else {
//     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Profile image is required.' });
//   }
// }

  create() {
    const request = this.addMapToApi(this.form.value);
    this.teacherService.registerTeacher(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Teacher created successfully',
        });
        this.router.navigate(['teacher']);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
      },
    });
  }

  update() {
    const request = this.editMapToApi(this.form.value);
    this.teacherService
      .updateTeacher(this.form.value.id, request)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'teacher updated successfully',
          });
          this.router.navigate(['teacher']);
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
      updatedAt: new Date().toISOString(),
    };
  }

  mapFromApi(data: any) {
    this.form.patchValue({
      id: data.id,
      fullName: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth), // ✅ مهم لتحويل التاريخ
      teacherNumber: data.teacherNumber,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      gradeLevel: data.gradeLevel,
      parentName: data.parentName,
      parentPhoneNumber: data.parentPhoneNumber,
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
        this.pageUrl === 'edit' ? 'Update teacher' : 'Create New teacher',
      description: 'Fill all required fields',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        {
          label: 'teacher',
          routerLink: '/teacher',
        },
        {
          label:
            this.pageUrl === 'edit'
              ? 'Update teacher'
              : 'Create New teacher',
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
        controlType: 'calendar-picker',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Date of Birth',
          formControlName: 'dateOfBirth',
          validators: { required: true },
        },
      },
          {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Teacher Number',
          formControlName: 'teacherNumber',
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
          label: 'Phone Number',
          formControlName: 'phoneNumber',
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
          label: 'Subject',
          formControlName: 'subject',
          validators: { required: true },
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Qualification',
          formControlName: 'qualification',
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
          label: 'Profile Image',
          formControlName: 'profileImagePath',
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
