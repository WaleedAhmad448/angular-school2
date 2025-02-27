import { TemplateRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { KitsngFormFactoryModel } from "kitsng-form-factory";
import { KitsngTableConfig } from "kitsng-table-factory";
import { MenuItem } from "primeng/api";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

export interface PageHeaderOptions {
  title: string;
  titleTemplate?: TemplateRef<any>;
  description?: string;
  breadcrumbs?: MenuItem[];
  actions?: HeaderAction[];
  actionsTemplate?: TemplateRef<any>;
  status?: HeaderStatus[];
  statusTemplate?: TemplateRef<any>;
  filtersTemplate?: TemplateRef<any>;
  statusClass?: string;
  actionsClass?: string;
  filterClass?: string;
  containerClass?: string;
}

export interface HeaderAction {
  icon?: string;
  iconPos?: "left" | "right" | "top" | "bottom";
  label?: string;
  onClick?(event: any): void;
  class?: string;
  isAdd?: boolean;
}

export interface HeaderStatus {
  icon?: string;
  label?: string;
}

export interface FiltersOptions {
  id: string; // field name,
  name: string;
  type: "" | "dropdown" | "lookup" | "date"; // type of filter
  options?: { id: any; name: string }[];
  module?: string;
  entity?: string;
  version?: string;
}

export interface PageListOptions<T = any> {
  id: string;
  route: string;
  module: string;
  entity: string;
  version: string;
  headerOptions: PageHeaderOptions;
  tableConfig: KitsngTableConfig;
  formConfig: FormConfig<T>;
  filters?: FiltersOptions[];
  tableHeaderOptions?: TableHeaderOptions;
  onInit?(): void;
  onDestroy?(): void;
  onDataUpdated?(data: T): void;
}

export interface TableHeaderOptions {
  showSearch?: boolean;
  showFilter?: boolean;
  title?: string;
  description?: string;
  class?: string;
  continarClass?: string;
}

export interface FormHeaderOptions extends PageHeaderOptions {
  editTitle?: string;
  editDescription?: string;
  editBreadcrumbs?: MenuItem[];
}

export interface FormConfig<T = any> {
  fields: KitsngFormFactoryModel[];
  type: "dialog" | "route";
  dialogOptions?: {
    addHeaderTitle?: string;
    editHeaderTitle?: string;
    dynamicDialogConfig?: DynamicDialogConfig;
  };
  continarClass?: string; // for type = route
  headerOptions?: FormHeaderOptions;
  saveDataType?: "Json" | "formData";
  updateDataType?: "Json" | "formData";
  init?(): void;
  mapToApi?(data: any): T;
  addMapToApi?(data: any): T;
  editMapToApi?(data: any, item: any): T;
  mapFromApi?(data: T, fields: KitsngFormFactoryModel[]): any;
  beforeSubmit?(form: FormGroup): void;
  afterSubmit?(form: FormGroup): void;
  afterSave?(response: any, form?: FormGroup): void;
  afterUpdate?(response: any, form?: FormGroup): void;
  backUrl?: any[];
}
