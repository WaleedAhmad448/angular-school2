import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentsComponent } from './students.component';
import { DetailsComponent } from '../student/details/details.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: StudentsComponent },
		{
			path: 'details/:studentId',
			component: DetailsComponent,
		}
	])],
	exports: [RouterModule]
})
export class StudentsRoutingModule { }
