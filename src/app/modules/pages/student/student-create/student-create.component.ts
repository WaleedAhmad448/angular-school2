import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    KitsngFormFactoryModel,
    KitsngFormFactoryModule,
    KitsngFormFactoryService,
    KitsngFormGroupFactoryModel,
} from 'kitsng-form-factory';
import { cloneDeep } from 'lodash';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import {
    PageHeadeingOptions,
    PageHeading,
} from 'src/app/common/page-heading/page-heading.component';

import { Student } from 'src/app/core/model/student.model';
import { getBaseUrl } from 'src/app/core/model/http-response.model';
import { ApiService } from 'src/app/core/service/api.service';
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
    
    apiService : ApiService = inject(ApiService);
    router: Router= inject(Router);
    activeRoute: ActivatedRoute = inject(ActivatedRoute);

    pageUrl : "edit" | "add" | null = null;
    student !: Student ;
    _arrayFormLength : number = 0;
    // periodsSettingData! : PeriodsSetting | undefined;

    form!: FormGroup;
    formFields: KitsngFormFactoryModel[] = [];
    headerOptions!: PageHeadeingOptions;
    constructor(public formFactory: KitsngFormFactoryService , private studentService: StudentService,
        private errorHandlerService: ErrorHandlerService, private messageService: MessageService) {
        this.checkPageUrl();
        this.initHeaderOptions();
        this.subscribeToFinancialSettings();
       
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
    private subscribeToFinancialSettings(){
        this.financialSettingService.settings$.subscribe({
            next: (response) => {
                console.log('response periodsSetting', response.periodsSetting);
                this.periodsSettingData = response.periodsSetting;
                this.initForm();
                if(this.pageUrl == 'edit'){
                    this.getItems();
                }
            }
        })
    }
    getItems(){
        // this.financialPeriodData = window.history.state;
        // this._arrayFormLength = this.getNumberOfPeriodsByType(this.financialPeriodData.periodType)
        // const data = this.mapFromApi(this.financialPeriodData);
        // console.log("data form api", data)
        // this.initForm();
        // this.form.patchValue(this.financialPeriodData);
        // this.form.updateValueAndValidity();
        // console.log("Form Value", this.form.getRawValue())
    }
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
        // this.apiService._initService(ModulesNames.SanedFinancialPeriods, SanedFinancialPeriodsEntitiesNames.YearTypePeriods,'v1');
        this.form.disable()
         this.apiService.add(data).pipe(finalize(() => this.form.enable())).subscribe({
            next: (response) => {
                console.log('Data',response);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Your data have been added successfully' });
                this.router.navigate(['finance','financial-periods'])
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
        // this.apiService._initService(ModulesNames.SanedFinancialPeriods, SanedFinancialPeriodsEntitiesNames.YearTypePeriods,'v1');
        this.form.disable()
         this.apiService.edit(data).pipe(finalize(() => this.form.enable())).subscribe({
            next: (response) => {
                console.log('Data',response);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Your data have been updated successfully' });
                this.router.navigate(['finance','financial-periods'])
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
                    dropdownOptions: [
                    //   {id:PeriodTypes.Fiscal, text: PeriodTypes[PeriodTypes.Fiscal]},
                    //   {id:PeriodTypes.Tax, text: PeriodTypes[PeriodTypes.Tax] , disabled : !this.periodsSettingData?.isTaxPeriods? true : false },
                    //   {id:PeriodTypes.Reporting, text: PeriodTypes[PeriodTypes.Reporting],disabled : !this.periodsSettingData?.isReportingPeriods? true : false},
                    ],
                    placeholder: 'Select Type',
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                    ngModelChange:(event)=> {
                      if(event){
                        console.log(event);
                        // this._arrayFormLength = this.getNumberOfPeriodsByType(event);
                        console.log('arrayLenght',this._arrayFormLength);
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
                    // module: ModulesNames.SanedFinancialPeriods,
                    // entity: SanedFinancialPeriodsEntitiesNames.Years,
                    version: 'v1',
                    apiBaseUrl: getBaseUrl(),
                    containerClass: 'align-items-center pl-4 sm:pl-6',
                    controlLayout: 'horizontal',
                    labelColSize: 'col-4',
                    controlColSize: 'col-8',
                    ngModelChange:(event, parentFormGroup,selectedOption)=> {
                        console.log(selectedOption);
                        const endDateField = this.formFields.find((f) => f.id == 'endDateField');
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
            {
                colSize: 'col-12',
                id: 'periodYears',
                array: Array.from({ length:this._arrayFormLength }, (_, j) => {
                    const group = cloneDeep(defaultArrayGroup);
                    const period: any = group.group?.at(1);
                    period.options.value = j + 1;
                    return group;
                }),
                options: {
                    label: 'Periods',
                    formControlName: 'periods',
                    formControlType: 'array',
                    arrayLayout: 'table',
                    arrayTableClass:
                        'p-datatable-gridlines border-round-2xl overflow-hidden border-1 border-gray-200',
                    arrayTableStyle: {
                        'min-width': '50rem',
                        'border-color': 'var(--surface-border) !important',
                    },
                    arrayTableColumns: [
                        { field: 'no', header: 'Period', cellClass:'bg-bluegray-300 text-0 border-round-xs w-1',},
                        { field: 'startDate', header: 'Start Date',cellClass:'bg-bluegray-300 text-0 border-round-xs w-1' },
                        // { field: 'endPeriod', header: 'End Period',cellClass:'bg-gray-200' },
                        { field: 'isCorrectionPeriod',header: 'Correction Period',cellClass:'bg-bluegray-300 text-0 border-round-xs w-1',},
                    ],
                    class: 'border-0 gap-2 mb-5 m-1',
                    showArrayAddButton: false,
                    showArrayRemoveButton: false,
                    defaultArrayGroup:
                        defaultArrayGroup as KitsngFormGroupFactoryModel,
                },
            },
        ];
        this.form = this.formFactory.createForm(this.formFields);
    }
    
}
const defaultArrayGroup: KitsngFormFactoryModel = {
    colSize: 'col-12',
    group: [
        {
            controlType: 'input',
            colSize: 'col-12 md:col-6',
            options: {
                formControlName: 'id',
                readonly: true,
                isHidden: true,
            },
        },
        {
            controlType: 'input-number',
            colSize: 'col-12 md:col-6',
            options: {
                // label: 'Period',
                formControlName: 'no',
                validators: {
                    required: true,
                },
                // min: 1,
                // max: arrayLenght,
                readonly: true,
                ngModelChange(event, parentFormGroup) {
                    // const arrayForm = parentFormGroup?.parent as FormArray;
                    // const currentArrayIndex = arrayForm?.controls?.findIndex(
                    //     (group: any) => group === parentFormGroup
                    // );
                    // // console.log('currentArrayIndex',currentArrayIndex);
                    // const periods = (arrayForm.value as Array<any>)
                    //     .map((f) => f.period)
                    //     .filter((item, i) => item && i != currentArrayIndex);
                    // console.log('periods', periods);
                    // if (periods.find((value) => value == event)) {
                    //     parentFormGroup
                    //         ?.get('period')
                    //         ?.addValidators(Validators.pattern(/^[^\d]*$/));
                    //     // parentFormGroup?.setErrors();
                    //     parentFormGroup
                    //         ?.get('period')
                    //         ?.updateValueAndValidity();
                    // } else {
                    //     parentFormGroup?.get('period')?.clearValidators();
                    //     parentFormGroup
                    //         ?.get('period')
                    //         ?.addValidators(Validators.required);
                    // }
                },
                errorMessage: 'This period already exists, enter other period',
                // containerClass:"w-5 justify-content-center",
            },
        },
        {
          id:'startPeriodField',
          controlType: 'calendar-picker',
          colSize: 'col-12 md:col-6',
          options: {
              // label: 'End Date',
              formControlName: 'startDate',
              placeholder:'mm/dd/yyyy',
              class:'w-15rem',
              // validators: {
              //     required: true,
              // },
              ngModelChange:(event, parentFormGroup, selectedOption, field)=> {
                // const fields : any = field?.parent?.parent
                // console.log('field?.parent',parentFormGroup?.parent)
                const arrayLength : any = parentFormGroup?.parent?.controls.length;
                console.log('arrayLength',arrayLength)
                const arrayForm = parentFormGroup?.parent as FormArray;
                const currentArrayIndex = arrayForm?.controls?.findIndex(
                    (group: any) => group === parentFormGroup
                );
                // if(currentArrayIndex+1  < _arrayFormLength){

                // }
                if(currentArrayIndex < (arrayLength-1 as number) ){
                    const nextField :  any = (field?.parent?.parent as any).array[currentArrayIndex +1].group.find((f: any) => f.id === 'startPeriodField');
                    nextField.options.minDate = new Date(event);
                    console.log("Hello")
                }
                // const nextField :  any = (field?.parent?.parent as any).array[currentArrayIndex +1].group.find((f: any) => f.id === 'startPeriodField');
                // nextField.options.minDate = new Date(event);

                // console.log('field',nextField);
                console.log('currentArrayIndex',currentArrayIndex);
              },
              showIcon: false,
          },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12 md:col-6',
            options: {
                // label: 'Is Open',
                formControlName: 'isCorrectionPeriod',
                binary: true,
                value: false,
                ngModelChange(event, parentFormGroup,selectedOption,fields) {
                  console.log(event);
                  const startDateControl = parentFormGroup?.get('startDate');
                  console.log(startDateControl);
                  // const startPeriodField : any = fields?.parent?.group?.find((f)=> f.id == 'startPeriodField');
                  if(event == true){
                    // startPeriodField.options.hidden = true;
                    startDateControl?.disable();
                  }else if(event == false){
                    startDateControl?.enable();
                    // startPeriodField.options.disabled = false;
                  }
                    
                },
            },
        },
        
    ],
    options: {
        showArrayRemoveButton: false,
    },
};

