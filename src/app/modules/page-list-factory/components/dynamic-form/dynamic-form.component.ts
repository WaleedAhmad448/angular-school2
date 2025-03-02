import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormConfig,
  FormHeaderOptions,
  PageListOptions,
} from "../../core/page-list.model";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ErrorHandlerService } from "src/app/core/service/error-handler.service";
import {
  KitsngFormFactoryModel,
  KitsngFormFactoryService,
} from "kitsng-form-factory";
import { FormGroup } from "@angular/forms";
import { finalize } from "rxjs";
import { ApiService } from "src/app/core/service/api.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styles: [],
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  pageConfig!: PageListOptions;
  item!: any;
  formConfig!: FormConfig;
  headerOptions: FormHeaderOptions | undefined;
  fields: KitsngFormFactoryModel[] = [];
  form!: FormGroup;
  isSubmitted: boolean = false;
  constructor(
    // private pageListService: PageListService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorHandlerService: ErrorHandlerService,
    private apiService: ApiService,
    public formFactory: KitsngFormFactoryService
  ) {
    // get data from route or parent route data
    this.route.data.subscribe((data) => {
      this.pageConfig = data["pageConfig"];
      console.log(this.pageConfig);
    });
  }
  initProperties() {
    this.formConfig = this.pageConfig.formConfig;
    this.fields = this.formConfig.fields ?? [];
    this.form = this.formFactory.createForm(this.fields);
    this.headerOptions = this.formConfig.headerOptions;
    this.apiService._initService(
      this.pageConfig.module,
      this.pageConfig.entity,
      // this.pageConfig.version
    );
    this.getItem();
  }
  ngOnInit(): void {
    this.initProperties();
  }
  getItem() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        if (this.headerOptions) {
          this.headerOptions.title =
            this.formConfig.headerOptions?.editTitle ??
            this.formConfig.headerOptions?.title ??
            "";
          this.headerOptions.description =
            this.formConfig.headerOptions?.editDescription ??
            this.formConfig.headerOptions?.description ??
            "";
          this.headerOptions.breadcrumbs =
            this.formConfig.headerOptions?.editBreadcrumbs ??
            this.formConfig.headerOptions?.breadcrumbs ??
            [];
        }
        this.apiService.getById(id).subscribe((data) => {
          console.log(data);
          this.item = cloneDeep(data);
          let dataDto = this.item;
          if (this.formConfig?.mapFromApi) {
            dataDto = this.formConfig?.mapFromApi(this.item, this.fields);
          }
          this.form.patchValue(dataDto);
          this.form.updateValueAndValidity();
          console.log(this.form.value);
        });
      }
    });
  }
  submit(event: any) {
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
  create() {
    let data = this.form.value;
    if (this.formConfig?.addMapToApi) {
      data = this.formConfig?.addMapToApi(data);
    }
    console.log(data);
    this.form.disable();
    this.apiService[
      this.formConfig?.saveDataType == "formData" ? "addForm" : "add"
    ](data)
      .pipe(finalize(() => this.form.enable()))
      .subscribe({
        next: (res) => {
          if (this.formConfig?.afterSave) {
            this.formConfig?.afterSave(res, this.form);
          }
          this.back();
        },
        error: (error) => {
          this.errorHandlerService.handleError(
            error,
            this.messageService,
            this.form
          );
          console.log(error);
        },
      });
  }
  update() {
    console.log(this.form.value);
    let data = this.form.value;
    if (this.formConfig?.editMapToApi) {
      data = this.formConfig?.editMapToApi(data, this.item);
    }
    console.log(data);
    this.form.disable();
    this.apiService[
      this.formConfig?.updateDataType == "formData" ? "editForm" : "edit"
    ](data)
      .pipe(finalize(() => this.form.enable()))
      .subscribe({
        next: (res) => {
          if (this.formConfig?.afterUpdate) {
            this.formConfig?.afterUpdate(res, this.form);
          }
          this.back();
        },
        error: (error) => {
          this.errorHandlerService.handleError(
            error,
            this.messageService,
            this.form
          );
        },
      });
  }
  back() {
    if ((this.formConfig?.backUrl?.length ?? -1) > 0) {
      this.router.navigate([...(this.formConfig?.backUrl ?? [])]);
    } else {
      if (this.item) {
        this.router.navigate(["../../"], { relativeTo: this.route });
      } else {
        this.router.navigate(["../"], { relativeTo: this.route });
      }
    }
  }
  ngOnDestroy(): void {}
}
