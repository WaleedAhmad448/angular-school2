// import { ResolveFn } from '@angular/router';
// import {
//   FiltersOptions,
//   FormConfig,
//   PageHeaderOptions,
//   PageListOptions,
//   TableHeaderOptions,
// } from '../../page-list-factory/core/page-list.model';

// import { KitsngFormFactoryModel } from 'kitsng-form-factory';
// import { KitsngTableConfig } from 'kitsng-table-factory';
// import { inject } from '@angular/core';
// import { TitleCasePipe } from '@angular/common';
// import { ContextService } from 'src/app/core/service/context.service';
// import { ModulesNames, EntitiesNames } from 'src/app/core/model/enums.model';

// export const StudentResolver: ResolveFn<PageListOptions> = () => {
//   const ctxService = inject(ContextService);

//   const formFields: KitsngFormFactoryModel[] = [
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Full Name',
//         formControlName: 'fullName',
//         id: 1,
//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'calendar-picker',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Date of Birth',
//         formControlName: 'dateOfBirth',
//         id: 2,
//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Phone Number',
//         formControlName: 'phoneNumber',
//         id: 3,
//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Email',
//         formControlName: 'email',
//         id: 4,
//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12',
//       options: {
//         label: 'Address',
//         formControlName: 'address',
//         id: 5,
//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Grade Level',
//         formControlName: 'gradeLevel',
//         id: 6,

//         validators: { required: true },
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Student Number',
//         formControlName: 'studentNumber',
//         id: 7,
//         // disabled: true, // نعرضه فقط عند القراءة
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Parent Name',
//         formControlName: 'parentName',
//         id: 8,
//       },
//     },
//     {
//       controlType: 'input',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Parent Phone Number',
//         formControlName: 'parentPhoneNumber',
//         id: 9,
//       },
//     },
//     {
//       controlType: 'calendar-picker',
//       colSize: 'col-12 md:col-6',
//       options: {
//         label: 'Registration Date',
//         formControlName: 'registrationDate',
//         id: 10,
//         // disabled: true,
//       },
//     },
//   ];

//   const formConfig: FormConfig = {
//     fields: formFields,
//     saveDataType: 'formData',
//     updateDataType: 'formData',
//     type: 'dialog',
//     dialogOptions: {
//       addHeaderTitle: 'Register New Student',
//       editHeaderTitle: 'Edit Student',
//       dynamicDialogConfig: {
//         width: '50%',
//         dismissableMask: true,
//       },
//     },
//     headerOptions: {
//       containerClass: 'card mb-3 pb-3',
//       title: 'Register Student',
//       description: 'Please fill out all required fields',
//       breadcrumbs: [
//         { label: 'Students', routerLink: '/students' },
//         { label: 'Register' },
//       ],
//       editTitle: 'Edit Student',
//       editDescription: 'You can update the student information below',
//       editBreadcrumbs: [
//         { label: 'Students', routerLink: '/students' },
//         { label: 'Edit Student' },
//       ],
//     },
//   };

//   const headerOptions: PageHeaderOptions = {
//     title: 'Students',
//     containerClass: 'card mb-3 pb-3',
//     breadcrumbs: [{ label: 'Students' }],
//     actions: [
//       {
//         icon: 'pi pi-plus',
//         label: 'Register Student',
//         isAdd: true,
//       },
//     ],
//   };

//   const tableHeaderOptions: TableHeaderOptions = {
//     showFilter: true,
//     showSearch: true,
//     title: 'List of Students',
//     description: 'This is the paginated list of registered students',
//   };

//   const tableConfig: KitsngTableConfig = {
//     columns: [
//       { field: 'fullName', header: 'Full Name', sortable: true, pipes: [{ pipe: TitleCasePipe }] },
//       { field: 'studentNumber', header: 'Student Number', sortable: true },
//       { field: 'email', header: 'Email', sortable: true },
//       { field: 'gradeLevel', header: 'Grade', sortable: true },
//       { field: 'phoneNumber', header: 'Phone', sortable: true },
//     ],
//     data: [],
//     class: 'border-round-2xl overflow-hidden',
//     paginatorClass: 'border-round-2xl mt-3',
//     pageSize: 10,
//     first: 0,
//     totalRecords: 0,
//     actionButtons: [
//       {
//         icon: 'pi pi-pencil',
//         type: 'Edit',
//         colorClass: 'p-button-info',
//       },
//       {
//         icon: 'pi pi-trash',
//         type: 'Delete',
//         colorClass: 'p-button-danger',
//       },
//     ],
//   };

//   const filters: FiltersOptions[] = [
//     { id: 'fullName', name: 'Full Name', type: '' },
//     { id: 'gradeLevel', name: 'Grade', type: '' },
//     { id: 'studentNumber', name: 'Student Number', type: '' },
//   ];

//   const pageConfig: PageListOptions = {
//     id: 'student',
//     route: 'student',
//     module: ModulesNames.School,
//     entity: EntitiesNames.student,
//     filters,
//     headerOptions,
//     formConfig,
//     tableHeaderOptions,
//     tableConfig,
//   };

//   return pageConfig;
// };
