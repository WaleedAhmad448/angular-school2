import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AvatarModule } from 'primeng/avatar';



@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AvatarModule
  ],
  exports: [
    LogoutComponent
  ]
})
export class LogoutModule { }
