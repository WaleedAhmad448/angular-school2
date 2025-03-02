import { ResolveFn } from '@angular/router';
import {
    FiltersOptions,
    FormConfig,
    PageHeaderOptions,
    PageListOptions,
    TableHeaderOptions,
} from '../../page-list-factory/core/page-list.model';
import { KitsngFormFactoryModel } from 'kitsng-form-factory';
import { KitsngTableConfig } from 'kitsng-table-factory';
import { EntitiesNames, ModulesNames } from 'src/app/core/model/enums.model';
import { inject } from '@angular/core';

import { TitleCasePipe } from '@angular/common';
import { getBaseUrl } from 'src/app/core/model/http-response.model';
import { ContextService } from 'src/app/core/service/context.service';

export const DocTypesResolver: ResolveFn<PageListOptions> = (route, state) => {
    const ctxService = inject(ContextService);
    let formFields: KitsngFormFactoryModel[] = [
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Document Type Code',
                id: 1,
                formControlName: 'typeCode',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Document Type Name',
                id: 2,
                formControlName: 'typeName',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Cat by Month',
                id: 3,
                formControlName: 'catByMonth',
                binary: true,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Has end Month',
                id: 4,
                formControlName: 'hasEndMonth',
                binary: true,
            },
        },
        {
            controlType: 'lookup-select',
            colSize: 'col-12',
            options: {
                label: 'Document Age',
                id: 5,
                formControlName: 'docAgeId',
                ngModelChange(event) {
                    console.log(event);
                },
                filter: true,
                module: ModulesNames.FileWare,
                entity: EntitiesNames.docTypeAges,
                version: 'v1',
                apiBaseUrl: getBaseUrl(),
                query: {},
            },
        },

        {
            controlType: 'textarea',
            colSize: 'col-12',
            options: {
                label: 'Notes',
                id: 6,
                formControlName: 'notes',
                rows: 3,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Is Enabled',
                id: 7,
                formControlName: 'isEnabled',
                value: true,
                binary: true,
            },
        },
    ];

    let formConfig: FormConfig = {
        fields: formFields,
        saveDataType: 'formData',
        updateDataType: 'formData',
        editMapToApi: (data, item) => {
            data['id'] = item.id;
            return data;
        },
        type: 'dialog',
        dialogOptions: {
            addHeaderTitle: 'Add New Document Type',
            editHeaderTitle: 'Update Document Type',
            dynamicDialogConfig: {
                width: '40%',
                dismissableMask: true,
            },
        },
        headerOptions: {
            containerClass: 'card mb-3 pb-3',
            title: 'Create New Document Type',
            description: 'fill all required fields',
            breadcrumbs: [
                {
                    label: 'Document Types',
                    routerLink: '/docTypes',
                },
                {
                    label: 'Create Document Type',
                },
            ],
            editTitle: 'Update Document Type',
            editDescription: 'fill all required fields',
            editBreadcrumbs: [
                {
                    label: 'Document Types',
                    routerLink: '/docTypes',
                },
                {
                    label: 'Update Document Type',
                },
            ],
        },
    };

    let headerOptions: PageHeaderOptions = {
        title: 'Document Types',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
            {
                label: 'Document Types',
            },
        ],
        actions: [
            {
                icon: 'pi pi-plus',
                label: 'Add New Document Type',
                isAdd: true,
            },
        ],
    };

    let tableHeaderOptions: TableHeaderOptions = {
        showFilter: true,
        showSearch: true,
        title: 'List of Document Types',
        description: 'This is the paged list of Document Types in the system',
    };

    let tableConfig: KitsngTableConfig = {
        columns: [
            { field: 'typeCode', header: 'Document Type Code', sortable: true },
            {
                field: 'typeName',
                header: 'Document Type Name',
                sortable: true,
                pipes: [{ pipe: TitleCasePipe }],
            },
            {
                field: 'catByMonth',
                header: 'Cat by Month',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'hasEndMonth',
                header: 'Has end Month',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'notes',
                header: 'Notes',
                sortable: true,
                template: ctxService.get(
                    'CUSTOM_TEMPLATE:clinicNullValueTempRef'
                ),
            },
            {
                field: 'isEnabled',
                header: 'Status',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
        ],
        data: [],
        class: 'border-round-2xl overflow-hidden',
        paginatorClass: 'border-round-2xl mt-3',
        pageSize: 10,
        first: 0,
        totalRecords: 0,
        actionButtons: [
            {
                icon: 'pi pi-pencil',
                type: 'Edit',
                colorClass: 'p-button-info',
            },
            {
                icon: 'pi pi-trash',
                type: 'Delete',
                colorClass: 'p-button-info',
            },
        ],
    };
    let filters: FiltersOptions[] = [
        { id: 'typeCode', name: 'Document Type Code', type: '' },
        { id: 'typeName', name: 'Document Type Name', type: '' },
        {
            id: 'isEnabled',
            name: 'Status',
            type: 'dropdown',
            options: [
                { id: 'true', name: 'Enabled' },
                { id: 'false', name: 'Disabled' },
            ],
        },
    ];

    let pageConfig: PageListOptions = {
        id: 'docTypes',
        route: 'docTypes',
        module: ModulesNames.FileWare,
        entity: EntitiesNames.docTypes,
        // version: 'v1',
        filters: filters,
        headerOptions: headerOptions,
        formConfig: formConfig,
        tableHeaderOptions: tableHeaderOptions,
        tableConfig: tableConfig,
    };

    return pageConfig;
};

export interface DocTypes {
    id: number;
    typeCode: string;
    typeName: string;
    catByMonth: boolean;
    hasEndMonth: boolean;
    docAgeId: any;
    notes: any;
    isEnabled: boolean;
    docCode: string;
}
