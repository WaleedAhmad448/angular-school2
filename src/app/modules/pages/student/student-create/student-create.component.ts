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
import { EntitiesNames, ModulesNames } from 'src/app/core/model/enums.model';
import { getBaseUrl } from 'src/app/core/model/http-response.model';

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
    // const templateService = inject(TemplateService);
    // const helperService = inject(HelperService);
    constructor(public formFactory: KitsngFormFactoryService,private studentService : StudentService,
        private errorHandlerService: ErrorHandlerService, private messageService: MessageService,
      private templateService: TemplateService,
      private helperService: HelperService
    ) {
        this.checkPageUrl();
        this.initHeaderOptions();
        this.subscribeToStudentServices();
       
    }
    checkPageUrl() {
        // if (this.pageUrl === 'edit') {
        //     const studentData = history.state as any;
        //     if (studentData && Object.keys(studentData).length > 0) {
        //       this.mapFromApi(studentData);
        //     } else {
        //       this.router.navigate(['/student/student-list']); // رجوع لو ما في بيانات
        //     }
        //   }
        // this.activeRoute.params.subscribe((params) => {
        //     const studentId = params['id'];
        //     if (studentId) {
        //         this.studentService.getStudentById(studentId).subscribe({
        //             next: (response) => {
        //                 this.mapFromApi(response);
        //             },
        //             error: (error) => {
        //                 this.errorHandlerService.handleError(error, this.messageService);
        //             }
        //         });
        //     } 
        // });
        // Subscribe to the URL changes
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
    // create() {
    //     const request = this.addMapToApi(this.form.value);
    //     this.studentService.registerStudent(request).subscribe({
    //       next: () => {
    //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student created successfully' });
    //         this.router.navigate(['/student/student-list']);
    //       },
    //       error: (error) => {
    //         this.errorHandlerService.handleError(error, this.messageService);
    //       }
    //     });
    //   }
    create() {
        const formData = this.form.value;
      
        const payload = {
          registrationDto: {
            ...formData,
            dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            registrationDate: new Date(formData.registrationDate).toISOString()
          }
        };
      
        this.form.disable(); // منع التعديل أثناء الإرسال
      
        this.studentService.createStudent(payload).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Student Created',
              detail: 'Student has been registered successfully.'
            });
            this.router.navigate(['/student/student-list']);
          },
          error: (err) => {
            this.form.enable(); // إعادة تفعيل النموذج إذا حصل خطأ
            this.errorHandlerService.handleError(err, this.messageService);
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
          registrationDate: data.registrationDate
        });
      }
        // ngOnInit() {
        //     this.initForm();
        //     this.initHeaderOptions();
        //     if (this.pageUrl == 'edit') {
        //     this.activeRoute.params.subscribe((params) => {
        //         const studentId = params['id'];
        //         this.studentService.getStudentById(studentId).subscribe({
        //         next: (response) => {
        //             this.mapFromApi(response);
        //         },
        //         error: (error) => {
        //             this.errorHandlerService.handleError(error, this.messageService);
        //         }
        //         });
        //     });
        //     }
        // }      
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
                        placeholder: 'Enter Full Name',
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                        validators: {
                            required: true,
                        },
                    },
                },
                {
                    controlType: 'calendar-picker',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Date Of Birth',
                        formControlName: 'dateOfBirth',
                        placeholder:'mm/dd/yyyy',
                        // disabled: true,
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                    },
                },
                {
                  controlType: 'lookup-select',
                  colSize: 'col-12 md:col-6',
                  options: {
                      label: 'Countries',
                      formControlName: 'countryId',
                      validators: {
                          required: true,
                      },
                      placeholder: 'Select Country',
                      filter: true,
                      // module: ModulesNames.sanedSharedData,
                      // entity: EntitiesNames.countries,
                      version: 'v1.2',
                      apiBaseUrl: getBaseUrl(),
                      query: {},
                      containerClass: "align-items-center pl-4 sm:pl-6",
                      controlLayout: "horizontal",
                      labelColSize: "col-4",
                      controlColSize: "col-8",
                      ngModelChange: (event, formGroup) => {
                          console.log(event);
                          const cityIndex =
                              this.helperService.getFormFieldIndexByControlName(
                                  this.formFields,
                                  'cityId'
                              );
                          const cityControl = formGroup?.get('cityId');
                          if (
                              cityIndex !== -1 &&
                              this.formFields[cityIndex] &&
                              this.formFields[cityIndex].options
                          ) {
                              const cityField: any = this.formFields[cityIndex];
      
                              cityField.options['isVisible'] = false;
                              cityField.options['query'] = {
                                  filters: {
                                      countryId: { value: event },
                                  },
                              };
                              setTimeout(() => {
                                  cityField.options['isVisible'] = true;
                              }, 100);
                              cityControl?.setValue(null);
                              cityControl?.updateValueAndValidity();
                          }
                      },
                  },
              },
              {
                  controlType: 'lookup-select',
                  colSize: 'col-12 md:col-6',
                  options: {
                      label: 'Cities',
                      formControlName: 'cityId',
                      validators: {
                          required: true,
                      },
                      ngModelChange: (e) => {
                          console.log(e);
                      },
                      placeholder: 'Select City',
                      filter: true,
                      // module: ModulesNames.sanedSharedData,
                      // entity: EntitiesNames.cities,
                      version: 'v1.2',
                      apiBaseUrl: getBaseUrl(),
                      query: {
                          filters: {
                              countryId: { value: null },
                          },
                      },
                      containerClass: "align-items-center pl-4 sm:pl-6",
                      controlLayout: "horizontal",
                      labelColSize: "col-4",
                      controlColSize: "col-8"
                  },
              },
      
                {
                  controlType: 'lookup-select',
                  colSize: 'col-12 md:col-6',
                  options: {
                      label: 'Zone Name',
                      formControlName: 'regionId',
                      validators: {
                          required: true,
                      },
                      placeholder: 'Select zoneId',
                      // module: ModulesNames.logisticSystem,
                      // entity: EntitiesNames.zones,
                      version: 'v1',
                      apiBaseUrl: getBaseUrl(),
                      containerClass: "align-items-center pl-4 sm:pl-6",
                      controlLayout: "horizontal",
                      labelColSize: "col-4",
                      controlColSize: "col-8"
                  },
              },
                {
                    controlType: 'input-number',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Student Number',
                        formControlName: 'studentNumber',
                        // readonly: true,
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                    },
                },
                {
                    controlType: 'input',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Address',
                        formControlName: 'address',
                        placeholder: 'Enter Address',
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                        validators: {
                            required: true,
                        },
                    },
                },
                {
                    controlType: "input-number",
                    colSize: "col-12 md:col-6",
                    options: {
                      label: "Phone Number",
                      formControlName: "phoneNumber",
                      validators: {
                        required: true
                      },
                      apiBaseUrl: getBaseUrl(),
                      containerClass: 'align-items-center pl-4 sm:pl-6',
                      controlLayout: "horizontal",
                        labelColSize: "col-4",
                        controlColSize: "col-8",
                    },
                  },
                {
                    controlType: 'input',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Email',
                        formControlName: 'email',
                        placeholder: 'Enter Email',
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                        validators: {
                            required: true,
                        },
                    },
                },
                {
                    controlType: 'input',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Grade Level',
                        formControlName: 'gradeLevel',
                        placeholder: 'Enter Grade Level',
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                        validators: {
                            required: true,
                        },
                    },
                },
                {
                    controlType: 'input',
                    colSize: 'col-12 md:col-6',
                    options: {
                        label: 'Parent Name',
                        formControlName: 'parentName',
                        placeholder: 'Enter Parent Name',
                        containerClass: 'align-items-center pl-4 sm:pl-6',
                        controlLayout: 'horizontal',
                        labelColSize: 'col-4',
                        controlColSize: 'col-8',
                        validators: {
                            required: true,
                        },
                    },
                },
                {
                    controlType: "input-number",
                    colSize: "col-12 md:col-6",
                    options: {
                      label: "Parent Phone Number",
                      formControlName: "parentPhoneNumber",
                      validators: {
                        required: true
                      },
                      apiBaseUrl: getBaseUrl(),
                      containerClass: 'align-items-center pl-4 sm:pl-6',
                      controlLayout: "horizontal",
                      labelColSize: "col-4",
                      controlColSize: "col-8",
                    },
                  },
                {
                    controlType: "calendar-picker",
                    colSize: "col-12 md:col-6",
                    options: {
                    label: "Registration Date",
                    id: 91,
                    formControlName: "registrationDate",
                    calendarType: "dateTime",
                        placeholder: "Enter Registration Date",
                        containerClass: "align-items-center pl-4 sm:pl-6",
                        controlLayout: "horizontal",
                        labelColSize: "col-4",
                        controlColSize: "col-8",
                    validators: {
                        required: true,
                    },
                    ngModelChange: (e) => {
                        console.log(e);
                    },
                    },
                },
           
           
        ];
        this.form = this.formFactory.createForm(this.formFields);
    }
    
}

