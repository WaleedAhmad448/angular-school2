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

export const DocTypeAgesResolver: ResolveFn<PageListOptions> = (
    route,
    state
) => {
    // const templateService = inject(TemplateService);
    let formFields: KitsngFormFactoryModel[] = [
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Document Type Age Code',
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
                label: 'Document Type Age Name',
                id: 2,
                formControlName: 'typeName',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input-number',
            colSize: 'col-12 md:col-6',
            options: {
                label: 'Age by Days',
                id: 3,
                formControlName: 'ageByDays',
                ngModelChange: (e) => {
                    console.log(e);
                },
                validators: {
                    required: true,
                },
                placeholder: 'Age by Days',
                filter: true,
                min: 0,
                showButtons: true,
                apiBaseUrl: getBaseUrl(),
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
            addHeaderTitle: 'Add New Document Type Age',
            editHeaderTitle: 'Update Document Type Age',
            dynamicDialogConfig: {
                width: '40%',
                dismissableMask: true,
            },
        },
        headerOptions: {
            containerClass: 'card mb-3 pb-3',
            title: 'Create New DocType Age',
            description: 'fill all required fields',
            breadcrumbs: [
                {
                    label: 'Document Type Ages',
                    routerLink: '/doc-type-ages',
                },
                {
                    label: 'Create Document Type Age',
                },
            ],
            editTitle: 'Update Document Type Age',
            editDescription: 'fill all required fields',
            editBreadcrumbs: [
                {
                    label: 'Document Type Ages',
                    routerLink: '/doc-type-ages',
                },
                {
                    label: 'Update Document Type Age',
                },
            ],
        },
    };

    let headerOptions: PageHeaderOptions = {
        title: 'Document Type Ages',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
            {
                label: 'Document Type Ages',
            },
        ],
        actions: [
            {
                icon: 'pi pi-plus',
                label: 'Add New Document Type Age',
                isAdd: true,
            },
        ],
    };

    let tableHeaderOptions: TableHeaderOptions = {
        showFilter: true,
        showSearch: true,
        title: 'List of Document Type Ages',
        description:
            'This is the paged list of Document Type Ages in the system',
    };

    let tableConfig: KitsngTableConfig = {
        columns: [
            {
                field: 'typeCode',
                header: 'Document Type Age Code',
                sortable: true,
            },
            {
                field: 'typeName',
                header: 'Document Type Age Name',
                sortable: true,
                pipes: [{ pipe: TitleCasePipe }],
            },
            { field: 'ageByDays', header: 'Age by Days', sortable: true },
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
        { id: 'typeCode', name: 'Document Type Age Code', type: '' },
        { id: 'typeName', name: 'Document Type Age Name', type: '' },
    ];

    let pageConfig: PageListOptions = {
        id: 'docTypeAges',
        route: 'doc-type-ages',
        module: ModulesNames.FileWare,
        entity: EntitiesNames.docTypeAges,
        version: 'v1',
        filters: filters,
        headerOptions: headerOptions,
        formConfig: formConfig,
        tableHeaderOptions: tableHeaderOptions,
        tableConfig: tableConfig,
    };

    return pageConfig;
};

export interface DocTypeAges {
    id: number;
    typeCode: string;
    typeName: string;
    ageByDays: number;
    docCode: string;
}
