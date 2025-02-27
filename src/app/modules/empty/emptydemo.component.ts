import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { KitsngFormFactoryModel, KitsngFormFactoryService } from 'kitsng-form-factory';
import { getBaseUrl } from 'src/app/core/model/http-response.model';

@Component({
    templateUrl: './emptydemo.component.html'
})
export class EmptyDemoComponent implements OnInit {
    form!: FormGroup;
    fields: KitsngFormFactoryModel[] = [];
    constructor(public formFactory: KitsngFormFactoryService) {}
    ngOnInit(): void {
        this.fields = [
            {
                colSize: 'col-12',
                group: [
                    {
                        controlType: 'calendar-picker',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: ' Date ',
                            id: 91,
                            formControlName: 'date',
                            calendarType: 'dateTime',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'transecion type',
                            id: 1,
                            formControlName: 'trshipment',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select transecion type',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'one' },
                                { id: '0', text: 'two' },
                            ],
                        },
                    },

                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'pakage type',
                            id: 1,
                            formControlName: 'pakshipment',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select pakage type',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'one' },
                                { id: '0', text: 'two' },
                            ],
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'shipment Number',
                            id: 7,
                            formControlName: 'inputNumber1',

                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'col-3',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-12',
                        options: {
                            label: 'pakage descrpicion',
                            id: 1,
                            formControlName: 'pakagedescrpicion',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            //   class: "rr",
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-3',
                        options: {
                            label: 'pakage weight',
                            id: 7,
                            formControlName: 'pakageweight',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            min: 0,
                            showButtons: true,
                            buttonLayout: 'horizontal',
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-2',
                        options: {
                            label: 'weight',
                            id: 9,
                            formControlName: 'weight',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            min: 0,

                            showButtons: true,
                            buttonLayout: 'horizontal',
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-2',

                        options: {
                            label: 'leight',
                            id: 8,
                            formControlName: 'leight',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            min: 0,
                            showButtons: true,
                            buttonLayout: 'horizontal',
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-2',

                        options: {
                            label: 'heigt',
                            id: 8,
                            formControlName: 'heigt',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            min: 0,
                            showButtons: true,
                            buttonLayout: 'horizontal',
                        },
                    },
                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-2',

                        options: {
                            label: 'picees',
                            id: 8,
                            formControlName: 'picees',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            min: 0,
                            showButtons: true,
                            buttonLayout: 'horizontal',
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'paymenet type',
                            id: 1,
                            formControlName: 'paymenttype',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select payment type',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'one' },
                                { id: '0', text: 'two' },
                            ],
                        },
                    },

                    {
                        controlType: 'input-number',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'pakage amoant',
                            id: 7,
                            formControlName: 'pakageamoant',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            prefix: '$',
                            min: 0,
                        },
                    },
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Refrence',
                            id: 1,
                            formControlName: 'refrence',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'rr',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Allow openning package',
                            id: 1,
                            formControlName: 'allowopenningpackage',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Allow openning package',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'yes' },
                                { id: '0', text: 'no' },
                            ],
                        },
                    },
                    {
                        controlType: 'textarea',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Notes',
                            id: 4,
                            rows: 3,
                            formControlName: 'notes',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Write down.....',
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'transecion type',
                            id: 1,
                            formControlName: 'trshipment',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select transecion type',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'one' },
                                { id: '0', text: 'two' },
                            ],
                        },
                    },
                ],
                options: {
                    formControlName: 'name',
                    class: '',
                    label: 'Shipment details',
                },
            },
            {
                colSize: 'col-6',
                group: [
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'customer',
                            id: 1,
                            formControlName: 'customer',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select customer ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'mohmed' },
                                { id: '0', text: 'kaled' },
                            ],
                        },
                    },
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Sender name',
                            id: 1,
                            formControlName: 'sendername',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'rr',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Service',
                            id: 20,
                            formControlName: 'service',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select Service ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'Service 1' },
                                { id: '0', text: 'Service 2' },
                            ],
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Zone',
                            id: 20,
                            formControlName: 'zone',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select Zone ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'Zone 1' },
                                { id: '0', text: 'Zone 2' },
                            ],
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Region',
                            id: 20,
                            formControlName: 'region',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select Region ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'Region 1' },
                                { id: '0', text: 'Region 2' },
                            ],
                        },
                    },
                    {
                        controlType: 'input-phone',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Mobile',
                            id: 1,
                            formControlName: 'mobile',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            apiBaseUrl: getBaseUrl(),
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            value: '',
                        },
                    },
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'address',
                            id: 1,
                            formControlName: 'address',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'rr',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                ],
                options: {
                    formControlName: 'details',
                    class: 'h-full',
                    label: 'Sender details',
                },
            },
            {
                colSize: 'col-6',
                group: [
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'consignee ',
                            id: 1,
                            formControlName: 'consignee',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'rr',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },

                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Zone',
                            id: 20,
                            formControlName: 'zoneco',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select Zone ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'Zone 1' },
                                { id: '0', text: 'Zone 2' },
                            ],
                        },
                    },
                    {
                        controlType: 'dropdown',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Region',
                            id: 20,
                            formControlName: 'regionco',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                            placeholder: 'Select Region ',
                            filter: true,
                            dropdownOptions: [
                                { id: '1', text: 'Region 1' },
                                { id: '0', text: 'Region 2' },
                            ],
                        },
                    },
                    {
                        controlType: 'input-phone',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'Mobile',
                            id: 1,
                            formControlName: 'mobileco',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            controlLayout: 'horizontal',
                            apiBaseUrl: getBaseUrl(),
                            validators: {
                                required: true,
                            },
                            value: '',
                        },
                    },
                    {
                        controlType: 'input',
                        colSize: 'col-12 sm:col-6',
                        options: {
                            label: 'address',
                            id: 1,
                            formControlName: 'addressco',
                            ngModelChange: (e) => {
                                console.log(e);
                            },
                            class: 'rr',
                            controlLayout: 'horizontal',
                            validators: {
                                required: true,
                            },
                        },
                    },
                ],
                options: {
                    formControlName: 'consignee ',
                    class: 'h-full',
                    label: 'consignee details',
                },
            },
        ];
        this.form = this.formFactory.createForm(this.fields);
    }
    handelAction(event: any) {
        console.log(event);
        console.log(this.form.value);
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            return;
        }
    }
 }
