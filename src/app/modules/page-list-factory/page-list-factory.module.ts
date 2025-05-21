import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageListFactoryRoutingModule } from './page-list-factory-routing.module';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PageListCoreComponent } from './components/page-list-core/page-list-core.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { KitsngFormFactoryModule } from 'kitsng-form-factory';
import { KitsngFilterModule, KitsngSearch, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicFormDialogComponent } from './components/dynamic-form-dialog/dynamic-form-dialog.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiService } from 'src/app/core/service/api.service';


@NgModule({
  declarations: [
    PageListCoreComponent,
    PageHeaderComponent,
    DynamicFormComponent,
    DynamicFormDialogComponent
  ],
  imports: [
    CommonModule,
    PageListFactoryRoutingModule,
    ButtonModule,
    BreadcrumbModule,
    KitsngFormFactoryModule,
    KitsngTableFactoryModule,
    KitsngSearch,
    KitsngFilterModule,
    ToastModule,
    MessagesModule,
    DynamicDialogModule,
    ConfirmDialogModule,
  ],
  providers: [DialogService, ConfirmationService, MessageService, ApiService]
})
export class PageListFactoryModule { }
