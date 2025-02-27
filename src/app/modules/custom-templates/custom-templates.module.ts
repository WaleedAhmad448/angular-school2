import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { PipeModule } from 'src/app/core/pipe/pipe.module';
import { MessageModule } from 'primeng/message';
import { CustomTemplatesComponent } from './custom-templates.component';
import { TagModule } from 'primeng/tag';



@NgModule({
  declarations: [
    CustomTemplatesComponent
    ],
  imports: [
    CommonModule,
    AvatarModule,
    PipeModule,
    MessageModule,
    TagModule
  ],
  exports: [
    CustomTemplatesComponent
  ],
})
export class CustomTemplatesModule {
}
