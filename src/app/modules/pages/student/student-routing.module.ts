import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { HomeComponent } from './home/home/home.component';
import { DetailsComponent } from './details/details.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentModule } from './student.module';
import { CommonModule } from '@angular/common';


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
    exports: [RouterModule],
})
export class StudentRoutingModule { }