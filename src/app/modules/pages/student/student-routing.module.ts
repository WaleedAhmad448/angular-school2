import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./student-list/student-list.component').then(m => m.StudentListComponent),
        
    },
    {
        path: 'add',
        loadComponent: () => import('./student-create/student-create.component').then(m => m.StudentCreateComponent)
        
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./student-create/student-create.component').then(m => m.StudentCreateComponent),
        
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
