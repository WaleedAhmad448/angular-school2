// home.component.ts
import { Component } from '@angular/core';
import { Student } from '../../../../core/model/student.model';
import { Gender } from '../../../../core/model/gender.enum';
import { StudentService } from '../../../../core/service/student.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { KitsngFormFactoryModule } from 'kitsng-form-factory';
import { PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, SharedModule, KitsngFormFactoryModule],
  providers: [MessageService],
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.scss',
})
export class StudentCreateComponent {
  serverBaseUrl: string = environment.baseUrl;
  imagePreviewUrl: string | undefined;
  genderEnum = Gender;
  selectedGender: Gender = Gender.MALE;
  showDialog: boolean = true;

  private dialogSubscription: Subscription = Subscription.EMPTY;

  student: Student = {
    date: new Date(),
    studentId: 0,
    studentName: '',
    studentNrc: '',
    age: 0,
    dateOfBirth: new Date(),
    fatherName: '',
    gender: Gender.MALE,
    address: '',
    township: '',
    photo: '',
    mark: [{ date: new Date(), mark1: 0, mark2: 0, mark3: 0, total: 0 }]
  };

  constructor(
    private studentService: StudentService,
    private messageService: MessageService
  ) { }

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe();
  }

   saveStudent(): void {
      const data = {
        date: this.student.date,
        studentName: this.student.studentName,
        studentNrc: this.student.studentNrc,
        age: this.student.age,
        dateOfBirth: this.student.dateOfBirth,
        fatherName: this.student.fatherName,
        gender: this.student.gender = this.selectedGender,
        address: this.student.address,
        township: this.student.township,
        photo: this.student.photo,
        mark: this.student.mark
      };
    
      if (!this.student.studentName || !this.student.studentNrc) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields!' });
      return;
    }
    
      this.studentService.createStudent(data).subscribe({
        next: (response) => {
         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student created successfully.' });
        this.showDialog = false;
        },
        error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create student.' });
        }
      });
    }  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imagePreviewUrl = URL.createObjectURL(file);

      this.studentService.createFile(file, 'image', { responseType: 'text' as 'json' }).subscribe({
        next: (response: any) => {
          this.student.photo = response;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Image upload failed.' });
        }
      });
    }
  }

  calculateTotal(index: number): void {
    const mark = this.student.mark?.[index];
    if (mark && mark.mark1 !== undefined && mark.mark2 !== undefined && mark.mark3 !== undefined) {
      mark.total = mark.mark1 + mark.mark2 + mark.mark3;
    }
  }

  addMark() {
    this.student.mark.push({ date: new Date(), mark1: 0, mark2: 0, mark3: 0, total: 0 });
  }

  removeMark(index: number) {
    this.student.mark.splice(index, 1);
  }

  closeDialog() {
    RouterLink
    
    this.showDialog = false;

  }
}