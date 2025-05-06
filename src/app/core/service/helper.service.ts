import { Injectable } from '@angular/core';
import { KitsngFormFactoryModel } from 'kitsng-form-factory';

@Injectable({
    providedIn: 'root',
})
export class HelperService {
    getFormFieldIndexByControlName(
        formFields: KitsngFormFactoryModel[],
        formControlName: string
    ) {
        return formFields.findIndex((field) => {
            if (!field.options?.formControlName) {
                return false;
            }
            return field.options.formControlName === formControlName;
        });
    }
}
