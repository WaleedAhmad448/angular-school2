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
import { Gender } from 'src/app/core/model/gender.enum';
import { Student } from 'src/app/core/model/student.model';
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
  imagePreviewUrl: string | null = null;
  @ViewChild('photoInput') photoInput!: ElementRef;

  formContainerRef!: ElementRef;
  selectedFile: File | null = null;

  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);

  pageUrl: 'edit' | 'add' | null = null;
  _arrayFormLength: number = 0;
  studentId!: number;

  genderEnum = Gender;
  selectedGender: Gender = Gender.MALE;
    
  form!: FormGroup;
  formFields: KitsngFormFactoryModel[] = [];
  headerOptions!: PageHeadeingOptions;
 student: Student = {
    date: new Date(),
    studentId: 0,
    studentName: '',
    studentNrc: '',
    age: 0,
    dateOfBirth: new Date(),
    fatherName: '',
    gender: Gender.MALE,
    address: '',
    township: '',
    photo: '',
    mark: [{
      date: new Date(),
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0
    }]
  };
  submitted = false;

  constructor(
    public formFactory: KitsngFormFactoryService,
    private studentService: StudentService,
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
            this.initHeaderOptions();
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
    if (this.form.invalid) {
      this.scrollToFirstError();
      return;
    }

    const formValue = this.form.value;
    const photoFile = this.form.get('photo')?.value;

    // تحويل البيانات إلى نموذج Student
    const studentData: Student = {
      id: formValue.id,
      studentName: formValue.studentName,
      studentNrc: formValue.studentNrc,
      age: formValue.age,
      dateOfBirth: formValue.dateOfBirth,
      fatherName: formValue.fatherName,
      gender: formValue.gender,
      township: formValue.township,
      address: formValue.address,
      date: formValue.date,
      photo: formValue.photo, 
     mark: [{
      date: new Date(),
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0
    }]
    };

    if (this.pageUrl === 'edit') {
      this.update(studentData);
    } else {
      this.create(studentData);
    }
  }

  private create(student: Student) {
    this.studentService.createStudent(student).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student created successfully'
        });
        this.router.navigate(['student']);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
      }
    });
  }

  private update(student: Student, photo?: File) {
    this.studentService.updateStudent(this.studentId, student).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student updated successfully'
        });
        this.router.navigate(['student']);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
      }
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
      studentName: data.studentName,
      studentNrc: data.studentNrc,
      age: data.age,
      dateOfBirth: new Date(data.dateOfBirth), // ✅ مهم لتحويل التاريخ
      fatherName: data.fatherName,
      gender: data.gender,
      township: data.township,
      address: data.address,
      date: new Date(data.date),
      photo: data.photo,
      mark: data.mark || [{
        date: new Date(),
        mark1: 0,
        mark2: 0,
        mark3: 0,
        total: 0
      }]
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
          label: 'Name',
          formControlName: 'studentName',
          validators: { required: true },
        },
      },  
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'NRC No',
          formControlName: 'studentNrc',
          validators: { required: true },
        },
      }, 
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Age',
          formControlName: 'age',
          validators: { required: true },
        },
      },
      {
        controlType: 'calendar-picker',
        colSize: 'col-12 md:col-6',
        id: 'dateOfBirth',
        options: {
          label: 'Date of Birth',
          formControlName: 'dateOfBirth',
          dateFormat: 'yy-mm-dd',
          placeholder: 'select date',
          validators: {
            required: true
          }
        }
      },

      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Father Name',
          formControlName: 'fatherName',
          validators: { required: true },
        },
      },

      {
        controlType: "dropdown",
        colSize: "col-12 md:col-6",
        options: {
          label: "Gender",
          id: 1,
          formControlName: "gender",
          ngModelChange: (e) => {
            console.log(e);
          },
          // controlLayout: "horizontal",
          validators: {
            required: true,
          },
          placeholder: "Select Gender",
          filter: true,
          dropdownOptions: [
            { id: "0", text: "Male" , value: "MALE"},
            { id: "1", text: "Female" , value: "FEMALE"},
          ],
        },
      },
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Township',
          formControlName: 'township',
        },
      },  
      {
        controlType: 'input',
        colSize: 'col-12 md:col-6',
        options: {
          label: 'Address',
          formControlName: 'address',
        },
      },
      {
        controlType: 'calendar-picker',
        colSize: 'col-12 md:col-6',
        id: 'date',
        options: {
          label: 'Date',
          formControlName: 'date',
          dateFormat: 'yy-mm-dd',
          placeholder: 'select date',
          validators: {
            required: true
          }
        }
      }, 
  
  ];
    this.form = this.formFactory.createForm(this.formFields);
    if (!this.form.contains('id')) {
      this.form.addControl('id', new FormControl(null));
    }
  }
    onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {

        this.student.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      const options = { responseType: 'text' as 'json' };;
      this.studentService.createFile(file, 'image',options).subscribe({
        next: (response: any) => {
          const filePath = response; 
          if (filePath) {
            console.log('File uploaded successfully:', filePath);
            this.student.photo = filePath;
          }
        },
        error: (error) => {
          
          console.error('Error uploading file:', error);
        }
      });

      this.imagePreviewUrl = imageUrl;
    }
  }
}
