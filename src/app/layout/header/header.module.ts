import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModule } from 'src/app/common/user/user.module';
import { LanguageModule } from 'src/app/common/language/language.module';
import { NotificationModule } from 'src/app/common/notification/notification.module';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    UserModule,
    LanguageModule,
    NotificationModule,
    ButtonModule,
    MenuModule,
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
