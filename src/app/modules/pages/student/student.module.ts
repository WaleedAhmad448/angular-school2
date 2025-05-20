
import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { ListComponent } from './list/list.component';

import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './home/home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { DetailsComponent } from './details/details.component';

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
        MatDialogModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
})
export class StudentModule {}