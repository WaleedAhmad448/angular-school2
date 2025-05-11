import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import { HelperService } from 'src/app/core/service/helper.service';
import { StudentService } from 'src/app/core/service/student.service';
import { TemplateService } from 'src/app/core/service/template.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-student-create',
    standalone: true,
    imports: [CommonModule, SharedModule, PageHeading,KitsngFormFactoryModule],
    providers:[MessageService],
    templateUrl: './student-create.component.html',
    styleUrl: './student-create.component.scss',
})
export class StudentCreateComponent {
    @ViewChild("formContainerRef", { static: false })
      formContainerRef!: ElementRef;
    
    router: Router= inject(Router);
    activeRoute: ActivatedRoute = inject(ActivatedRoute);

    pageUrl : "edit" | "add" | null = null;
    _arrayFormLength : number = 0;

    form!: FormGroup;
    formFields: KitsngFormFactoryModel[] = [];
    headerOptions!: PageHeadeingOptions;
    constructor(public formFactory: KitsngFormFactoryService,private studentService : StudentService,
        private errorHandlerService: ErrorHandlerService, private messageService: MessageService,
    ) {
        this.checkPageUrl();
        this.initHeaderOptions();
        this.subscribeToStudentServices();
       
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
    private subscribeToStudentServices(){
        this.studentService.getAllStudents().subscribe({
            next:(response)=>{
                this._arrayFormLength = response.length;
                console.log(this._arrayFormLength);
                this.initForm();
            },
            error:(error)=>{
                this.errorHandlerService.handleError(error, this.messageService);
            }
        })
      
    
    }
    getItems(){
        this.studentService.getAllStudents().subscribe({
            next:(response)=>{
                this._arrayFormLength = response.length;
                console.log(this._arrayFormLength);
                this.initForm();
            },
            error:(error)=>{
                this.errorHandlerService.handleError(error, this.messageService);
            }
        })
      
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
    create() {
        const request = this.addMapToApi(this.form.value);
        this.studentService.registerStudent(request).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student created successfully' });
            this.router.navigate(['/student/student-list']);
          },
          error: (error) => {
            this.errorHandlerService.handleError(error, this.messageService);
          }
        });
      }
      
    update() {
        const request = this.editMapToApi(this.form.value);
        this.studentService.updateStudent(this.form.value.id, request).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student updated successfully' });
            this.router.navigate(['/student/student-list']);
          },
          error: (error) => {
            this.errorHandlerService.handleError(error, this.messageService);
          }
        });
      }
      
    addMapToApi(data: any) {
        return {
          ...data,
          createdAt: new Date().toISOString() // حسب ما يحتاجه الـ backend
        };
      }
      
      editMapToApi(data: any) {
        return {
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      
      mapFromApi(data: any) {
        this.form.patchValue({
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
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
            title:this.pageUrl == 'edit' ? 'Update Student' : 'Create New Student',
            description: 'fill all required fields',
            containerClass: 'card mb-3 pb-3',
            breadcrumbs: [
                {
                  label: "Student",
                  routerLink: "/student/student-list",
                },
                {
                    label: this.pageUrl=='edit' ? 'Update Student' :'Create New Student',
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
                    id: 5,
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
    }
    
}

