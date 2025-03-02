import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageListOptions } from "../../core/page-list.model";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
  SortEvent,
} from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { Observable, Subject, combineLatest, debounceTime } from "rxjs";
import { ErrorHandlerService } from "src/app/core/service/error-handler.service";
import { DynamicFormDialogComponent } from "../dynamic-form-dialog/dynamic-form-dialog.component";
import { ApiService } from "src/app/core/service/api.service";
import { ApiOrdersConditionsValue, ApiQueryDto } from "src/app/core/model/http-response.model";

@Component({
  selector: "app-page-list-core",
  templateUrl: "./page-list-core.component.html",
  styles: [],
})
export class PageListCoreComponent implements OnInit, OnDestroy {
  pageConfig!: PageListOptions;
  pageIndex: number = 1;
  searchQ = "";
  filters: any;
  orders: any;
  _getData: Subject<void> = new Subject();
  getData$: Observable<void> = this._getData.asObservable();
  ref!: DynamicDialogRef;

  constructor(
    // private pageListService: PageListService,
    private router: Router,
    private route: ActivatedRoute,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private apiService: ApiService,
    public dialogService: DialogService
  ) {
    // get data from route
    this.route.data.subscribe((data) => {
      this.pageConfig = data["pageConfig"];
      console.log(this.pageConfig);
      this.apiService._initService(
        this.pageConfig.module,
        this.pageConfig.entity,
        // this.pageConfig.version
      );
      this.subscribeToData();
    });
  }
  ngOnInit(): void {
    if ((this.pageConfig?.headerOptions?.actions?.length ?? -1) > 0) {
      const addActions = this.pageConfig?.headerOptions?.actions?.filter(
        (action) => action?.isAdd == true
      );
      if ((addActions?.length ?? -1) > 0) {
        this.pageConfig?.headerOptions?.actions
          ?.filter((action) => action?.isAdd == true)
          .map((action) => {
            action.onClick = () => this.addItem();
            return action;
          });
      }
    }
    if (this.pageConfig.tableConfig.actionButtons?.length ?? -1 > 0) {
      this.pageConfig.tableConfig.actionButtons?.map((action) => {
        if (action.type == "Delete") {
          action.onClick = (item) => this.deleteItem(item);
        } else if (action.type == "Edit") {
          action.onClick = (item) => this.editItem(item);
        }
        return action;
      });
    }
    if (!this.pageConfig.tableConfig.onPageChanged) {
        this.pageConfig.tableConfig.onPageChanged = (event) => this.pageChanged(event);
    }
    if (!this.pageConfig.tableConfig.onSorting) {
        this.pageConfig.tableConfig.onSorting = (event) => this.customSort(event);
    }
    this._getData.next();
  }
  subscribeToData() {
    this.getData$.pipe(debounceTime(500)).subscribe(() => {
      const query: ApiQueryDto = {
        pageIndex: this.pageIndex,
        pageSize: this.pageConfig?.tableConfig?.pageSize ?? 10,
      };
      if (this.searchQ != null || this.searchQ != undefined) {
        query["search"] = this.searchQ;
      }
        if (this.filters) {
            query["filters"] = this.filters.reduce((obj: any, item: any) => {
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        obj[key] = item[key];
                    }
                }
                return obj;
              }, {});
        }
        if (this.orders) {
          query["orders"] = this.orders;
        }
      this.apiService.getPaged(query).subscribe({
        next: (res) => {
            console.log(res);
            if (!res.pageInfo && res.page) {
                res.pageInfo = res.page;
            }
          this.pageConfig.tableConfig.totalRecords = res.pageInfo.totalItems;
          this.pageConfig.tableConfig.data = res.items ?? [];
        },
        error: (error) => {
          this.errorHandlerService.handleError(error, this.messageService);
        },
      });
    });
  }
  addItem() {
    console.log("Add Item From the page list component");
    if (this.pageConfig?.formConfig?.type == "route") {
      this.router.navigate(["add"], { relativeTo: this.route });
    } else {
      this.addItemDialog();
    }
  }
  editItem(item: any) {
    console.log("Update Item From the page list component");
    if (this.pageConfig?.formConfig?.type == "route") {
        this.router.navigate(["edit", item.id], { relativeTo: this.route });
    } else {
      this.editItemDialog(item);
    }
  }
  deleteItem(item: any) {
    console.log("Delete Item From the page list component");
    this.deleteItemDialog(item);
  }
  addItemDialog() {
    this.ref = this.dialogService.open(DynamicFormDialogComponent, {
      header:
        this.pageConfig?.formConfig?.dialogOptions?.addHeaderTitle ??
        "Add New Item",
      width: "40%",
      data: {
        pageConfig: this.pageConfig,
      },
      footer: "-",
      ...this.pageConfig?.formConfig?.dialogOptions?.dynamicDialogConfig,
    });

    this.ref.onClose.subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.resetPage();
        this._getData.next();
        this.messageService.add({
          severity: "info",
          summary: "successful",
          detail: "Item Added Successfully",
        });
      }
    });
  }
  editItemDialog(item: any) {
    this.ref = this.dialogService.open(DynamicFormDialogComponent, {
      header: "Edit Item",
      width: "40%",
      data: {
        pageConfig: this.pageConfig,
        item: item,
      },
      footer: "-",
    });

    this.ref.onClose.subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.resetPage();
        this._getData.next();
        this.messageService.add({
          severity: "info",
          summary: "successful",
          detail: "Item Updated Successfully",
        });
      }
    });
  }
  deleteItemDialog(item: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Item`,
      header: "Delete Item",
      icon: "pi pi-info-circle",
      accept: () => {
        this.apiService.delete(item.id ?? "").subscribe({
          next: (res) => {
            this.resetPage();
            this._getData.next();
            this.messageService.add({
              severity: "info",
              summary: "successful",
              detail: "Item deleted Successfully",
            });
          },
          error: (error) => {
            this.errorHandlerService.handleError(error, this.messageService);
          },
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: "error",
              summary: "Rejected",
              detail: "You have rejected",
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: "warn",
              summary: "Cancelled",
              detail: "You have cancelled",
            });
            break;
        }
      },
    });
  }
  customSort(sort: SortEvent) {
    const order =
      sort.order == 1
        ? ApiOrdersConditionsValue.ASEC
        : ApiOrdersConditionsValue.DESC;
        console.log('page-list-core',sort);
    if (!this.orders) {
        this.orders = {};
    }
    if (sort?.field && (this.orders && this.orders[sort?.field] != order)) {
      this.orders[sort.field] = order;
      this.orders = Object.fromEntries(
        Object.entries(this.orders).filter(([key]) => [sort?.field].includes(key))
      );
      this._getData.next();
    }
  }

  pageChanged(event: any) {
    console.log('page-list-core', event);
    if (
      event.first != this.pageConfig.tableConfig.first ||
      event.rows != this.pageConfig?.tableConfig?.pageSize
    ) {
      this.pageConfig.tableConfig.first = event.first;
      this.pageConfig.tableConfig.pageSize = event.rows;
      this.pageIndex = event.page + 1;
      console.log(event);
      this._getData.next();
    } else {
      console.log("No Change in Page");
    }
  }
  onFilter(event: any) {
    console.log('page-list-core', event);
    // console.log(event);
    this.filters = event;
    this._getData.next();
  }
  resetFilter() {
    console.log('page-list-core', "reset-filter");
    this.filters = null;
    this._getData.next();
  }
  search(event: any) {
    console.log('page-list-core', "search", event);
    this.resetPage();
    this._getData.next();
  }
  resetPage() {
    this.pageConfig.tableConfig.selectedItems = [];
    this.pageConfig.tableConfig.first = 0;
    this.pageIndex = 1;
    this.pageConfig.tableConfig.pageSize = 10;
  }
  clearSearch() {
    console.log('page-list-core', "search", event);
    this.searchQ = "";
    this._getData.next();
  }
  ngOnDestroy(): void {}
}
