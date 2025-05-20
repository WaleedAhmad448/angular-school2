import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home/home.component';
import { DetailsComponent } from './details/details.component';


const routes: Routes = [
    // {
    //     path: '',
    //     loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent),
        
    // },
    // {
    //     path: 'add',
    //     loadComponent: () => import('./student-create/student-create.component').then(m => m.StudentCreateComponent)
        
    // },
    // {
    //     path: 'edit/:id',
    //     loadComponent: () => import('./student-create/student-create.component').then(m => m.StudentCreateComponent),
        
    // },
    // {
    //     path: '',
    //     loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
    // },
    // {
    //     path: 'add',
    //     loadComponent: () => import('./home/home/home.component').then(m => m.HomeComponent),
    // },
    // {
    //     path: 'details/:studentId',
    //     loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
    // },
     {
    path: '',
    component: ListComponent,
    // redirectTo: '/add',
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: HomeComponent,
  },
  {
    path: 'details/:studentId',
    component: DetailsComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
