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

export const ArchiveTypesResolver: ResolveFn<PageListOptions> = (
    route,
    state
) => {
    // const templateService = inject(TemplateService);
    const ctxService = inject(ContextService);
    let formFields: KitsngFormFactoryModel[] = [
        {
            controlType: 'input',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Archive Type Code',
                id: 1,
                formControlName: 'archiveTypeCode',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Archive Type Name',
                id: 2,
                formControlName: 'archiveTypeName',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Save Role No',
                id: 3,
                formControlName: 'saveRoleNo',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'lookup-select',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Dimension',
                id: 4,
                formControlName: 'dimensionId',
                ngModelChange(event) {
                    console.log(event);
                },
                filter: true,
                module: ModulesNames.school,
                entity: EntitiesNames.dimensions,
                version: 'v1',
                apiBaseUrl: getBaseUrl(),
                query: {},
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Has Physical Place',
                id: 5,
                formControlName: 'hasPhysicalPlace',
                binary: true,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Physical Saving by Folder',
                id: 6,
                formControlName: 'physicalSavingByFolder',
                binary: true,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Physical Saving by Document',
                id: 7,
                formControlName: 'physicalSavingByDoc',
                binary: true,
            },
        },
        {
            controlType: 'lookup-select',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Default Physical Place Id',
                id: 8,
                formControlName: 'defaultPhysicalPlaceId',
                ngModelChange(event) {
                    console.log(event);
                },
                filter: true,
                module: '',
                entity: '',
                version: 'v1',
                apiBaseUrl: getBaseUrl(),
                query: {},
            },
        },

        {
            controlType: 'checkbox',
            colSize: 'col-12',
            options: {
                label: 'Get Folders From External Source',
                id: 9,
                formControlName: 'getFoldersFromExternalSource',
                binary: true,
            },
        },
        {
            controlType: 'lookup-select',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Base Dimension Id for Folders',
                id: 10,
                formControlName: 'baseDimensionIdForFolders',
                ngModelChange(event) {
                    console.log(event);
                },
                filter: true,
                module: ModulesNames.school,
                entity: EntitiesNames.dimensions,
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
                id: 11,
                formControlName: 'notes',
                rows: 3,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'Is Enabled',
                id: 12,
                formControlName: 'isEnabled',
                value: true,
                binary: true,
            },
        },
        {
            controlType: 'checkbox',
            colSize: 'col-12 xl:col-6',
            options: {
                label: 'For External Use',
                id: 13,
                formControlName: 'forExternalUse',
                binary: true,
            },
        },

        {
            colSize: 'col-12',
            array: [],
            options: {
                label: 'Archive Type Document Types',
                formControlName: 'archiveTypeDocTypes',
                formControlType: 'array',
                id: 14,
                class: 'border-0 gap-2',
                defaultArrayGroup: {
                    colSize: 'col-12',
                    group: [
                        {
                            controlType: 'lookup-select',
                            colSize: 'col-12 xl:col-6',
                            options: {
                                label: 'Select Document Type',
                                id: 1,
                                formControlName: 'docTypeId',
                                ngModelChange(event) {
                                    console.log(event);
                                },
                                filter: true,
                                module: ModulesNames.school,
                                entity: EntitiesNames.docTypes,
                                version: 'v1',
                                apiBaseUrl: getBaseUrl(),
                                query: {},
                            },
                        },
                    ],
                    options: {},
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
        type: 'route',
        dialogOptions: {
            addHeaderTitle: 'Add New Archive Type',
            editHeaderTitle: 'Update Archive Type',
            dynamicDialogConfig: {
                width: '40%',
                dismissableMask: true,
            },
        },
        headerOptions: {
            containerClass: 'card mb-3 pb-3',
            title: 'Create New Archive Type',
            description: 'fill all required fields',
            breadcrumbs: [
                {
                    label: 'Archive Types',
                    routerLink: '/archive-types',
                },
                {
                    label: 'Create Archive Type',
                },
            ],
            editTitle: 'Update Archive Type',
            editDescription: 'fill all required fields',
            editBreadcrumbs: [
                {
                    label: 'Archive Types',
                    routerLink: '/archive-types',
                },
                {
                    label: 'Update Archive Type',
                },
            ],
        },
    };

    let headerOptions: PageHeaderOptions = {
        title: 'Archive Types',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
            {
                label: 'Archive Types',
            },
        ],
        actions: [
            {
                icon: 'pi pi-plus',
                label: 'Add New Archive Type',
                isAdd: true,
            },
        ],
    };

    let tableHeaderOptions: TableHeaderOptions = {
        showFilter: true,
        showSearch: true,
        title: 'List of Archive Types',
        description: 'This is the paged list of Archive Types in the system',
    };

    let tableConfig: KitsngTableConfig = {
        columns: [
            {
                field: 'archiveTypeCode',
                header: 'Archive Type Code',
                sortable: true,
            },
            {
                field: 'archiveTypeName',
                header: 'Archive Type Name',
                sortable: true,
                pipes: [{ pipe: TitleCasePipe }],
            },
            { field: 'saveRoleNo', header: 'Archive Role No', sortable: true },
            { field: 'dimensionId', header: 'Dimension Id', sortable: true },
            {
                field: 'hasPhysicalPlace',
                header: 'Has Physical Place',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'physicalSavingByFolder',
                header: 'Physical Saving by Folder',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'physicalSavingByDoc',
                header: 'Physical Saving by Document',
                sortable: true,
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'defaultPhysicalPlaceId',
                header: 'Default Physical Place Id',
                sortable: true,
            },
            {
                field: 'getFoldersFromExternalSource',
                header: 'Get Folders From External Source',
                template: ctxService.get('CUSTOM_TEMPLATE:clinicYesNoTempRef'),
            },
            {
                field: 'baseDimensionIdForFolders',
                header: 'Base Dimension Id for Folders',
                sortable: true,
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
            {
                field: 'forExternalUse',
                header: 'For External Use',
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
        // { id: 'typeCode', name: 'Document Type Code', type: '' },
        // { id: 'typeName', name: 'Document Type Name', type: '' },
        // {
        //     id: 'isEnabled',
        //     name: 'Status',
        //     type: 'dropdown',
        //     options: [
        //         { id: 'true', name: 'Enabled' },
        //         { id: 'false', name: 'Disabled' },
        //     ],
        // },
    ];

    let pageConfig: PageListOptions = {
        id: 'archiveTypes',
        route: 'archive-types',
        module: ModulesNames.school,
        entity: EntitiesNames.archiveTypes,
        version: 'v1',
        filters: filters,
        headerOptions: headerOptions,
        formConfig: formConfig,
        tableHeaderOptions: tableHeaderOptions,
        tableConfig: tableConfig,
    };

    return pageConfig;
};

export interface ArchiveTypes {
    id: string;
    archiveTypeCode: string;
    archiveTypeName: string;
    saveRoleNo: string;
    dimensionId: string;
    hasPhysicalPlace: boolean;
    physicalSavingByFolder: boolean;
    physicalSavingByDoc: boolean;
    defaultPhysicalPlaceId: string;
    getFoldersFromExternalSource: boolean;
    baseDimensionIdForFolders: string;
    notes: string;
    isEnabled: boolean;
    forExternalUse: boolean;
    archiveTypeDocTypes: any[];
    docCode: string;
}
