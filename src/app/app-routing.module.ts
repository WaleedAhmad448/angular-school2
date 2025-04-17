import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DimensionsResolver } from './modules/pages/dimensions/dimensions.resolver';
import { DocTypesResolver } from './modules/pages/docTypes/doc-types.resolver';
import { DocTypeAgesResolver } from './modules/pages/docTypeAges/doc-type-ages.resolver';
import { ArchiveTypesResolver } from './modules/pages/archiveTypes/archive-types.resolver';
// import { StudentResolver } from './modules/pages/student/student.resolver';
import { StudentComponent } from './modules/pages/student/student.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dimensions',
                pathMatch: 'full',
            },
            {
                path: 'dimensions',
                loadChildren: () =>
                    import(
                        './modules/page-list-factory/page-list-factory.module'
                    ).then((m) => m.PageListFactoryModule),
                resolve: { pageConfig: DimensionsResolver },
            },

            {
                path: 'docTypes',
                loadChildren: () =>
                    import(
                        './modules/page-list-factory/page-list-factory.module'
                    ).then((m) => m.PageListFactoryModule),
                resolve: { pageConfig: DocTypesResolver },
            },
                        
            // {
            //     path: 'student',
            //     loadChildren: () =>
            //         import(
            //             './modules/page-list-factory/page-list-factory.module'
            //         ).then((m) => m.PageListFactoryModule),
            //     resolve: { pageConfig: StudentResolver },
            // },

            //   {
            //     path: 'students',
            //     component: StudentComponent,
            //     resolve: {
            //     pageConfig: StudentResolver
            //     }
            // },

            {
                path: 'doc-type-ages',
                loadChildren: () =>
                    import(
                        './modules/page-list-factory/page-list-factory.module'
                    ).then((m) => m.PageListFactoryModule),
                resolve: { pageConfig: DocTypeAgesResolver },
            },

            {
                path: 'archive-types',
                loadChildren: () =>
                    import(
                        './modules/page-list-factory/page-list-factory.module'
                    ).then((m) => m.PageListFactoryModule),
                resolve: { pageConfig: ArchiveTypesResolver },
            },
        ],
    },
    {
        path: 'empty',
        loadChildren: () =>
            import('./modules/empty/emptydemo.module').then(
                (m) => m.EmptyDemoModule
            ),
    },

    {
        path: 'auth',
        data: { breadcrumb: 'Auth' },
        loadChildren: () =>
            import('./demo/components/auth/auth.module').then(
                (m) => m.AuthModule
            ),
    },
    {
        path: 'notfound',
        loadChildren: () =>
            import('./demo/components/notfound/notfound.module').then(
                (m) => m.NotfoundModule
            ),
    },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
