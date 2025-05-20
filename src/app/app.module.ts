import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CustomTemplatesModule } from './modules/custom-templates/custom-templates.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './modules/pages/student/home/home/home.component';
import { ListComponent } from './modules/pages/student/list/list.component';
import { DialogComponent } from './modules/pages/student/dialog/dialog.component';
import { DetailsComponent } from './modules/pages/student/details/details.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ListComponent,
        DialogComponent,
        DetailsComponent,
    ],
    imports: [
        AppRoutingModule,
        FormsModule,
        AppLayoutModule,
        CustomTemplatesModule,
        FontAwesomeModule,
        MatDialogModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}