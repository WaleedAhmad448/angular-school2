import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentsComponent } from './students.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: StudentsComponent },
		{
			path: 'students',
			children: [
				{ path: '', component: StudentsComponent },
				{ path: ':id', component: StudentsComponent },
				]
		}
	])],
	exports: [RouterModule]
})
export class StudentsRoutingModule { }
