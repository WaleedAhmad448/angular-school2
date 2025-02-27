import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomBgColor'
})
export class RandomBgColorPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let classes = '';
    let random = Math.floor((Math.random() * 1000) / 100);
    switch (random) {
      case 0:
        classes = 'bg-primary text-0' ;
        break;
      case 1:
        classes = 'bg-teal-900 text-0' ;
        break;
      case 2:
        classes = 'bg-gray-700 text-0' ;
        break;
      case 3:
        classes = 'bg-red-600 text-0' ;
        break;
      case 4:
        classes = 'bg-black-alpha-50 text-0' ;
        break;
      case 5:
        classes = 'bg-yellow-600 text-0'
        break;
      case 6:
        classes = 'bg-cyan-700 text-0'
        break;
      case 7:
        classes = 'bg-bluegray-600 text-0'
        break;
      case 8:
        classes = 'bg-blue-700 text-0'
        break;
      case 9:
        classes = 'bg-yellow-900 text-0'
        break;
      default:
        classes = 'bg-teal-600 text-0' ;
        break;
    }
    return classes;
  }

}
