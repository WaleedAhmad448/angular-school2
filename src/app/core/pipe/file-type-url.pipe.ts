import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileTypeUrl'
})
export class FileTypeUrlPipe implements PipeTransform {

  transform(type: string, showText: boolean= false): string {
    const subtype = type.split('/');
    const extension = subtype.length > 1 ? subtype[1]: subtype[0];
    if (showText) {
        return extension.substring(0,6);
    }
    return `assets/images/files/${extension}.svg`;
  }

}
