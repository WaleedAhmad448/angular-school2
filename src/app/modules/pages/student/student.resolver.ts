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
import { StudentService } from 'src/app/core/service/student.service';

export const StudentResolver: ResolveFn<PageListOptions> = (route, state) => {
    const ctxService = inject(ContextService);
    const studentService = inject(StudentService); // استدعاء خدمة الطلاب

    // إعداد حقول النموذج
    let formFields: KitsngFormFactoryModel[] = [
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Student Name',
                id: 1,
                formControlName: 'name',
                validators: {
                    required: true,
                },
            },
        },
        {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Age',
                id: 2,
                formControlName: 'age',
                validators: {
                    required: true,
                },
            },
        },
           {
            controlType: 'input',
            colSize: 'col-12',
            options: {
                label: 'Address',
                id: 2,
                formControlName: 'address',
                validators: {
                    required: true,
                },
            },
        },
    ];

    let formConfig: FormConfig = {
        fields: formFields,
        saveDataType: 'formData',
        updateDataType: 'formData',
        type: 'dialog',
        dialogOptions: {
            addHeaderTitle: 'Add New Student',
            editHeaderTitle: 'Update Student',
            dynamicDialogConfig: {
                width: '40%',
                dismissableMask: true,
            },
        },
    };

    let headerOptions: PageHeaderOptions = {
        title: 'Students',
        containerClass: 'card mb-3 pb-3',
        breadcrumbs: [
            {
                label: 'Students',
            },
        ],
        actions: [
            {
                icon: 'pi pi-plus',
                label: 'Add New Student',
                isAdd: true,
            },
        ],
    };

    let tableHeaderOptions: TableHeaderOptions = {
        showFilter: true,
        showSearch: true,
        title: 'List of Students',
        description: 'This is the paged list of Students in the system',
    };

    let tableConfig: KitsngTableConfig = {
        columns: [
            { field: 'name', header: 'Student Name', sortable: true },
            { field: 'age', header: 'Age', sortable: true },
            {
                field: 'isActive',
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
        { id: 'name', name: 'Student Name', type: '' },
        { id: 'age', name: 'Age', type: '' },
        {
            id: 'isActive',
            name: 'Status',
            type: 'dropdown',
            options: [
                { id: 'true', name: 'Active' },
                { id: 'false', name: 'Inactive' },
            ],
        },
    ];

    let pageConfig: PageListOptions = {
        id: 'students',
        route: 'students',
        
        module: ModulesNames.Student,
        entity: EntitiesNames.studentService,

        filters: filters,
        headerOptions: headerOptions,
        formConfig: formConfig,
        tableHeaderOptions: tableHeaderOptions,
        tableConfig: tableConfig,
    };

    return pageConfig;
};