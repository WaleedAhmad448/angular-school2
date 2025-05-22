import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./teacher-list/teacher-list.component').then(m => m.TeacherListComponent),
        
    },
    {
        path: 'add',
        loadComponent: () => import('./teacher-create/teacher-create.component').then(m => m.TeacherCreateComponent)
        
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./teacher-create/teacher-create.component').then(m => m.TeacherCreateComponent)        
    },
    {
        path: 'delete/:id',
        loadComponent: () => import('./teacher-create/teacher-create.component').then(m => m.TeacherCreateComponent)
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
