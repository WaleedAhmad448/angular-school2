import { NgModule } from '@angular/core';
import { RandomBgColorPipe } from './random-bg-color.pipe';
import { InitialsPipe } from './initials.pipe';
import { FileTypeUrlPipe } from './file-type-url.pipe';
import { CardBgColorPipe } from './card-bg-color.pipe';
import { PermisionPipe } from './permision.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { InverseColorPipe } from './inverse-color.pipe';
import { RandomColorPipe } from './random-color.pipe';
import { PaymentTypePipe } from './payment-type.pipe';



@NgModule({
  declarations: [
    RandomBgColorPipe,
    InitialsPipe,
    FileTypeUrlPipe,
    CardBgColorPipe,
    PermisionPipe,
    DateAgoPipe,
    InverseColorPipe,
    RandomColorPipe,
    PaymentTypePipe
  ],
  exports: [
    RandomBgColorPipe,
    InitialsPipe,
    FileTypeUrlPipe,
    CardBgColorPipe,
    PermisionPipe,
    DateAgoPipe,
    InverseColorPipe,
    RandomColorPipe
  ]
})
export class PipeModule { }
