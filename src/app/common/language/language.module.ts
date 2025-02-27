import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageComponent } from './language.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LanguageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    LanguageComponent
  ]
})
export class LanguageModule { }
