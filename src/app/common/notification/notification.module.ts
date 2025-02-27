import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { NotificationToastComponent } from './notification-toast/notification-toast.component';
import { ScrollerModule } from 'primeng/scroller';



@NgModule({
  declarations: [
    NotificationComponent,
    NotificationToastComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    SidebarModule,
    AppRoutingModule,
    ScrollerModule
  ],
  exports:[
    NotificationToastComponent,
    NotificationComponent
  ]
})
export class NotificationModule { }
