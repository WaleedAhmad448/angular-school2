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
import { StudentService } from 'src/app/core/service/student.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, SharedModule, PageHeading, KitsngFormFactoryModule],
  providers: [MessageService],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.scss',
})
export class StudentCreateComponent {
  @ViewChild('formContainerRef', { static: false })
  formContainerRef!: ElementRef;

  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  pageUrl: 'edit' | 'add' | null = null;
  _arrayFormLength: number = 0;
  studentId!: number;

  form!: FormGroup;
  formFields: KitsngFormFactoryModel[] = [];
  headerOptions!: PageHeadeingOptions;

  constructor(
    public formFactory: KitsngFormFactoryService,
    private studentService: StudentService,
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
              this.studentId = +params['id'];
              this.fetchStudentData(); // 🟢 Load data for editing
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

  fetchStudentData() {
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.initForm();
        this.mapFromApi(student);
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
    const request = this.addMapToApi(this.form.value);
    this.studentService.registerStudent(request).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student created successfully',
        });
        this.router.navigate(['student','add']);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
      },
    });
  }

  update() {
    const request = this.editMapToApi(this.form.value);
    this.studentService
      .updateStudent(this.form.value.id, request)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Student updated successfully',
          });
          this.router.navigate(['student' , 'student','edit']);
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
      studentNumber: data.studentNumber,
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
        this.pageUrl === 'edit' ? 'Update Student' : 'Create New Student',
      description: 'Fill all required fields',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        {
          label: 'Student',
          routerLink: '/student',
        },
        {
          label:
            this.pageUrl === 'edit'
              ? 'Update Student'
              : 'Create New Student',
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
          label: 'Address',
          formControlName: 'address',
          validators: { required: true },
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Grade Level',
          formControlName: 'gradeLevel',
          validators: { required: true },
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Student Number',
          formControlName: 'studentNumber',
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Parent Name',
          formControlName: 'parentName',
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Parent Phone Number',
          formControlName: 'parentPhoneNumber',
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
