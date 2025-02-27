import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {
  transform(fullName: string): any {
    console.log("initials pipe",fullName);
    const splittedName = fullName?.trim()?.split(' ');
    if (splittedName?.length > 1) {
      const fName = splittedName[0].charAt(0).toUpperCase();
      const lName = splittedName[splittedName.length - 1].charAt(0).toUpperCase();
      return fName+lName;
    }else{
      return fullName?.trim()?.charAt(0)?.toUpperCase() ?? "";
    }
  }
}
