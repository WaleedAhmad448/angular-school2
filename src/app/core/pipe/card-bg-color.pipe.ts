import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardBgColor'
})
export class CardBgColorPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let classes = '';
    let random = this.generateRandomNumber();
    switch (random) {
      case 1:
        classes = 'tw-card-00AECC text-light' ;
        break;
      case 2:
        classes = 'tw-card-0971CE text-light' ;
        break;
      case 3:
        classes = 'tw-card-44546F text-light' ;
        break;
      case 4:
        classes = 'tw-card-273362 text-light' ;
        break;
      default:
        classes = 'tw-card-00AECC text-light' ;
        break;
    }
    return classes;
  }
  generateRandomNumber() {
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    return randomNumber;
  }

}
