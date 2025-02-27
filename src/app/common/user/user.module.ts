import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';



@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChipModule,
    AvatarModule
  ],
  exports:[
    UserComponent
  ]
})
export class UserModule {

  
 }
