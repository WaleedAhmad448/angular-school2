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

export const DimensionsResolver: ResolveFn<PageListOptions> = (
    route,
    state
) => {
    const ctxService = inject(ContextService);
    let formFields: KitsngFormFactoryModel[] = [
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Dimension Code',
                id: 1,
                formControlName: 'dimCode',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Dimension Name',
                id: 2,
                formControlName: 'dimName',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'textarea',
            colSize: 'col-12',
            options: {
                label: 'Notes',
                id: 3,
                formControlName: 'notes',
                rows: 3,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Is Enabled',
                id: 4,
                formControlName: 'isEnabled',
                value: true,
                binary: true,
            },
        },
        {
            colSize: 'col-12',
            array: [],
            options: {
                label: 'Dimension Items',
                formControlName: 'dimensionItems',
                formControlType: 'array',
                id: 5,
                class: 'border-0 gap-2',
                defaultArrayGroup: {
                    colSize: 'col-12',
                    group: [
                        {
                            controlType: 'input',
                            colSize: 'col-12 md:col-6',
                            options: {
                                label: 'Item Code',
                                id: 1,
                                formControlName: 'itemCode',
                                validators: {
                                    required: true,
                                },
                            },
                        },
                        {
                            controlType: 'input',
                            colSize: 'col-12 md:col-6',
                            options: {
                                label: 'Item Name',
                                id: 2,
                                formControlName: 'itemName',
                                validators: {
                                    required: true,
                                },
                                class: 'mx-3',
                            },
                        },
                    ],
                    options: {
                        // label: 'Dimension Items',
                        // class: 'border-0 gap-2',
                    },
                },
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
            addHeaderTitle: 'Add New Dimension',
            editHeaderTitle: 'Update Dimension',
            dynamicDialogConfig: {
                width: '40%',
                dismissableMask: true,
            },
        },
        headerOptions: {
            containerClass: 'card mb-3 pb-3',
            title: 'Create New Dimension',
            description: 'fill all required fields',
            breadcrumbs: [
                {
                    label: 'Dimensions',
                    routerLink: '/dimensions',
                },
                {
                    label: 'Create Dimension',
                },
            ],
            editTitle: 'Update Dimension',
            editDescription: 'fill all required fields',
            editBreadcrumbs: [
                {
                    label: 'Dimensions',
                    routerLink: '/dimensions',
                },
                {
                    label: 'Update Dimension',
                },
            ],
        },
    };

    let headerOptions: PageHeaderOptions = {
        title: 'Dimensions',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
            {
                label: 'Dimensions',
            },
        ],
        actions: [
            {
                icon: 'pi pi-plus',
                label: 'Add New Dimension',
                isAdd: true,
            },
        ],
    };

    let tableHeaderOptions: TableHeaderOptions = {
        showFilter: true,
        showSearch: true,
        title: 'List of Dimensions',
        description: 'This is the paged list of Dimensions in the system',
    };

    let tableConfig: KitsngTableConfig = {
        columns: [
            { field: 'dimCode', header: 'Dimension Code', sortable: true },
            {
                field: 'dimName',
                header: 'Dimension Name',
                sortable: true,
                pipes: [{ pipe: TitleCasePipe }],
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
        { id: 'dimCode', name: 'Dimension Code', type: '' },
        { id: 'dimName', name: 'Dimension Name', type: '' },
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
        id: 'dimensions',
        route: 'dimensions',
        module: ModulesNames.FileWare,
        entity: EntitiesNames.dimensions,
        // version: 'v1',
        filters: filters,
        headerOptions: headerOptions,
        formConfig: formConfig,
        tableHeaderOptions: tableHeaderOptions,
        tableConfig: tableConfig,
    };

    return pageConfig;
};

export interface Dimensions {
    dimCode: string;
    dimName: string;
    notes: any;
    isEnabled: boolean;
    dimensionItems: any[];
}
