import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Student } from 'src/app/core/model/student.model';
import { StudentService } from 'src/app/core/service/student.service';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { environment } from 'src/environments/environment';
import { PageHeadeingOptions } from 'src/app/common/page-heading/page-heading.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PageHeading } from 'src/app/common/page-heading/page-heading.component';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    ButtonModule,
    PageHeading
  ],
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class StudentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private errorHandlerService = inject(ErrorHandlerService);

  student: Student | undefined;
  serverBaseUrl: string = environment.baseUrl;
  headerOptions!: PageHeadeingOptions;

  ngOnInit(): void {
    this.initHeaderOptions();
    this.loadStudentDetails();
  }

  private loadStudentDetails(): void {
    const id = this.route.snapshot.params['id'];
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.student = student;
        this.updateHeaderOptions();
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
        this.router.navigate(['/students']);
      }
    });
  }

  private initHeaderOptions(): void {
    this.headerOptions = {
      title: 'Student Details',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Students', routerLink: '/students' },
        { label: 'Details' }
      ],
      actions: []
    };
  }

  private updateHeaderOptions(): void {
    if (this.student) {
      this.headerOptions.title = `Details: ${this.student.studentName}`;
    }
  }

  editStudent(): void {
    if (this.student) {
      this.router.navigate(['/student/edit', this.student.studentId]);
    }
  }

  confirmDelete(): void {
    if (!this.student) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.student.studentName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStudent();
      }
    });
  }

  private deleteStudent(): void {
    if (!this.student) return;

    this.studentService.deleteStudent(this.student.studentId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Student deleted successfully'
        });
        this.router.navigate(['/students']);
      },
      error: (error) => {
        this.errorHandlerService.handleError(error, this.messageService);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}