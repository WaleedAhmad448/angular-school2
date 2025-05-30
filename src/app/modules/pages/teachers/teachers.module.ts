import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachersRoutingModule } from './teachers-routing.module';
import { TeachersComponent } from '../teachers/teachers.component';
import { SharedModule } from 'primeng/api';
import { CardModule } from 'primeng/card';

@NgModule({
	imports: [
		CommonModule,
		TeachersRoutingModule,
		SharedModule,
		CardModule
	],

})
export class TeachersModule { }
