import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { KitsngFormFactoryModel, KitsngFormFactoryService } from 'kitsng-form-factory';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { FormConfig, PageListOptions } from '../../core/page-list.model';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/service/api.service';

@Component({
    selector: 'app-dynamic-form-dialog',
    templateUrl: './dynamic-form-dialog.component.html',
    styles: [
    ]
})
export class DynamicFormDialogComponent implements OnInit {
  item!: any;
  formConfig!: FormConfig;
  pageConfig!: PageListOptions;
  fields: KitsngFormFactoryModel[] = [];
  form!: FormGroup;
  isSubmitted: boolean = false;
  constructor(
      private refConfig: DynamicDialogConfig,
      public ref: DynamicDialogRef,
      private messageService: MessageService,
      private errorHandlerService: ErrorHandlerService,
      private apiService: ApiService,
      public formFactory: KitsngFormFactoryService,
  ) {
  }
  ngOnInit(): void {
    console.log(this.refConfig.data);
    this.pageConfig = this.refConfig.data.pageConfig;
    this.formConfig = this.pageConfig.formConfig;
    if (this.formConfig?.init) {
        this.formConfig?.init();
    }
    this.fields = this.formConfig.fields ?? [];
    this.form = this.formFactory.createForm(this.fields);
    if (this.refConfig.data?.item) {
      this.item = this.refConfig.data?.item;
      this.updateFormValue();
    }
    this.apiService._initService(this.pageConfig.module,this.pageConfig.entity, this.pageConfig.version);
  }
  submit(event: any){
    if (this.formConfig?.beforeSubmit) {
        this.formConfig?.beforeSubmit(this.form);
    }
    this.isSubmitted = true;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
    if (this.item) {
      this.update();
    } else {
      this.create();
    }
    if (this.formConfig?.afterSubmit) {
        this.formConfig?.afterSubmit(this.form);
    }
  }
  create(){
    let data = this.form.value;
    if (this.formConfig?.addMapToApi) {
        data = this.formConfig?.addMapToApi(data);
    }
    console.log(data)
    this.form.disable();
    this.apiService[this.formConfig?.saveDataType == "formData"? "addForm" : "add"](data)
    .pipe(finalize(()=>this.form.enable()))
    .subscribe({
      next: (res) => {
        if (this.formConfig?.afterSave) {
            this.formConfig?.afterSave(res, this.form);
        }
        this.ref.close(res);
      },
      error: (error)=>{
        this.errorHandlerService.handleError(error,this.messageService, this.form);
        console.log(error)
      }
    });
  }
  update(){
    let data = this.form.value;
    if (this.formConfig?.editMapToApi) {
        data = this.formConfig?.editMapToApi(data, this.item);
    }
    console.log(data);
    this.form.disable();
    this.apiService[this.formConfig?.updateDataType == "formData"? "editForm" : "edit"](data)
    .pipe(finalize(()=>this.form.enable()))
    .subscribe({
      next: (res) => {
        if (this.formConfig?.afterUpdate) {
            this.formConfig?.afterUpdate(res, this.form);
        }
        this.ref.close(res);
      },
      error: (error)=>{
        this.errorHandlerService.handleError(error,this.messageService, this.form);
      }
    });
  }
  updateFormValue(){
      if (this.item) {
        console.log(this.item);
        let data = this.item;
        if (this.formConfig?.mapFromApi) {
            data = this.formConfig?.mapFromApi(this.item, this.fields);
        }
        this.form.patchValue(data);
        this.form.updateValueAndValidity();
    }
  }
}
