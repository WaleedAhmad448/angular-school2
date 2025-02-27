import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageListCoreComponent } from './components/page-list-core/page-list-core.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';

const routes: Routes = [
    {
        path: '',
        component: PageListCoreComponent
    },
    {
        path: 'add',
        component: DynamicFormComponent
    },
    {
        path: 'edit/:id',
        component: DynamicFormComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageListFactoryRoutingModule { }
