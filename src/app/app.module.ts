import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CustomTemplatesModule } from './modules/custom-templates/custom-templates.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
      
    ],
    imports: [
        AppRoutingModule,
        FormsModule,
        AppLayoutModule,
        CustomTemplatesModule,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}