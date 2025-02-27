import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permision'
})
export class PermisionPipe implements PipeTransform {

  transform(type: number): string {
    let permission = '';
    switch (type) {
        case 1:
            permission = 'Admin'
            break;
        case 2:
            permission = 'Member'
            break;
        case 4:
            permission = 'Observer'
            break;
        default:
            permission = 'Unknown'
            break;
    }
    return permission;
  }

}
