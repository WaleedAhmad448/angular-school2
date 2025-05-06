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

import { getBaseUrl } from 'src/app/core/model/http-response.model';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { StudentService } from 'src/app/core/service/student.service';
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
        private errorHandlerService: ErrorHandlerService, private messageService: MessageService) {
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
      
    
    }
    getItems(){
      
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
        this.form.patchValue({
            periodTotal:this._arrayFormLength,
            periodType: this.form.value.periodType
        });
        this.studentService.registerStudent(this.form.value).subscribe({
            next:(response)=>{
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Created Successfully' });
                this.router.navigate(['student']);
            },
            error:(error)=>{
                this.errorHandlerService.handleError(error, this.messageService);
            }
        })

  
      
    }
    update(){
        this.form.patchValue({
            periodTotal:this._arrayFormLength,
            periodType: this.form.value.periodType
        });
        const studentId = this.form.value.id; // Assuming the form contains the student ID
        this.studentService.updateStudent(studentId, this.form.value).subscribe({
            next:(response)=>{
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Updated Successfully' });
                this.router.navigate(['student']);
            },
            error:(error)=>{
                this.errorHandlerService.handleError(error, this.messageService);
            }
        })
       
    }
    editMapToApi(data: any){
       
    }
    addMapToApi(data: any){
     
    }
    mapFromApi(data : any){
     
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
                  routerLink: "/finance/financial-periods"
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
                    ngModelChange:(event)=> {
                      if(event){
                        this.initForm();
                        this.form.patchValue({
                        periodTotal:this._arrayFormLength,
                        periodType: event
                        });
                        this.form.updateValueAndValidity();
                      }
                        
                    },
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
                    entity: 'students',
                    apiBaseUrl: getBaseUrl(),
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                    ngModelChange:(event, parentFormGroup,selectedOption)=> {
                        console.log(selectedOption);
                        const endDateControl = parentFormGroup?.get('endDate');
                        if(event){
                          endDateControl?.setValue(new Date(selectedOption?.endDate));
                          endDateControl?.updateValueAndValidity();
                        }
                    },
                },
            },
            {
                id: "endDateField",
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
        ];
        this.form = this.formFactory.createForm(this.formFields);
    }
    
}

