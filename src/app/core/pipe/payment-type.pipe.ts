import { Pipe, PipeTransform } from '@angular/core';
// import { PaymentTypeText } from 'src/app/modules/pages/paymentMethods/paymentMethods.resolver';

@Pipe({
    name: 'paymentType',
})
export class PaymentTypePipe implements PipeTransform {
    transform(value: number, ...args: unknown[]): unknown {
        // return PaymentTypeText[value] ?? "__Unknown__";
        return '' ?? '__Unknown__';
    }
}
