import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomColor'
})
export class RandomColorPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    let classes = '';
    let random = Math.floor((Math.random() * 1000) / 100);
    switch (random) {
      case 0:
        classes = 'bg-primary' ;
        break;
      case 1:
        classes = 'bg-teal-900' ;
        break;
      case 2:
        classes = 'bg-gray-700' ;
        break;
      case 3:
        classes = 'bg-red-600' ;
        break;
      case 4:
        classes = 'bg-black-alpha-50' ;
        break;
      case 5:
        classes = 'bg-yellow-600'
        break;
      case 6:
        classes = 'bg-cyan-700'
        break;
      case 7:
        classes = 'bg-bluegray-600'
        break;
      case 8:
        classes = 'bg-blue-700'
        break;
      case 9:
        classes = 'bg-yellow-900'
        break;
      default:
        classes = 'bg-teal-600' ;
        break;
    }
    return classes;
  }

}
