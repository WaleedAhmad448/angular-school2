
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./administrator-list/administrator-list.component').then(m => m.AdministratorComponent),
        
    },
    {
        path: 'add',
        loadComponent: () => import('./administrator-create/administrator-create.component').then(m => m.AdministratorCreateComponent)
        
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./administrator-create/administrator-create.component').then(m => m.AdministratorCreateComponent),
        
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
