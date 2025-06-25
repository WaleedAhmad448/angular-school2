
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { ListComponent } from './list/list.component';

import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { DetailsComponent } from './details/details.component';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api/confirmationservice';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [
        HomeComponent,
        ListComponent,
        DialogComponent,
        DetailsComponent,
    ],
    imports: [
        CommonModule,
        StudentRoutingModule,
        FormsModule,
        FontAwesomeModule,
        MatDialogModule,
        TableModule,
        // SharedModule,
        ConfirmDialogModule, 
        ToastModule,
        DialogModule, 
        DropdownModule
        
    ],
    providers: [
        ConfirmationService  
    ],
})
export class StudentModule {}