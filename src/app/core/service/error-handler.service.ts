import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  /**
   * Constructor
   */
  constructor(
  ) {
  }

  handleError(error: any, messageService: MessageService, form?: FormGroup){
    //
    const errors = error?.errors;
    if (errors) {
      for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
          //
          const validationErrors = errors[key];
          const message = Array.isArray(validationErrors)?validationErrors[0]:validationErrors;
          let formControl;
          if (form) {
            formControl = form.get(key);
              formControl?.setErrors({ serverError: validationErrors });
            form.get(key)?.updateValueAndValidity();
          }
          messageService.add({
            severity: "error",
            summary: formControl?`Validation Error on Field ${key}`: key,
            detail: message,
          });
        }
      }
    }else{
      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error?.detail,
      });
    }
  }
}
