import { Component } from '@angular/core';
import { Student } from '../../../../../core/model/student.model';
import { Mark } from '../../../../../core/model/Mark.model';
import { StudentService } from '../../../../../core/service/student.service';
import { Gender } from '../../../../../core/model/gender.enum';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import {MatDialogRef} from '@angular/material/dialog';
import {faArrowLeft,faTimes} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  faArrowLeft = faArrowLeft;
  faDelete =faTimes;

  localDomain = 'http://localhost:8080';

  showDialog: boolean = true;

  fieldsFilled: boolean = true;

  showAdditional: boolean = false;

  private dialogSubscription: Subscription =  Subscription.EMPTY;

  imagePreviewUrl: string | undefined;

  genderEnum = Gender;
  selectedGender: Gender = Gender.MALE;
  

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
    mark: [{
      date: new Date(),
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0
    }]
  };
  submitted = false;

  constructor (
    private studentService: StudentService,
    public dialogRef: MatDialogRef<HomeComponent>,
  ) { 
    this.student.mark = [{
      date: new Date(),
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0
    }];
   }

  
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
  
    // console.log('Data to be sent:', data);
  
    if (!this.student.studentName || !this.student.studentNrc) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }
  
    this.studentService.createStudent(data).subscribe({
      next: (response) => {
        this.submitted = true;
        this.dialogRef.close();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error creating student:', error);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while creating the student.',
        });
      }
    });
  }  
  onCancel(): void {
    this.submitted = false;
    this.dialogRef.close();
    window.location.reload();
  };

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {

        this.student.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
      
      const options = { responseType: 'text' as 'json' };;
      this.studentService.createFile(file, 'image',options).subscribe({
        next: (response: any) => {
          const filePath = response; 
          if (filePath) {
            console.log('File uploaded successfully:', filePath);
            this.student.photo = filePath;
          }
        },
        error: (error) => {
          
          console.error('Error uploading file:', error);
        }
      });

      this.imagePreviewUrl = imageUrl;
    }
  }
  showAdditionalFields() {
    this.showAdditional = !this.showAdditional;
  }

  calculateTotal(index: number): void {
    const mark = this.student.mark?.[index];
    if (mark && mark.mark1 !== undefined && mark.mark2 !== undefined && mark.mark3 !== undefined) {
      mark.total = mark.mark1 + mark.mark2 + mark.mark3;
    }
  }
  
  close(){
    this.showDialog = false;
    window.location.reload();
  }
  add() {
    console.log('Add button clicked');
    this.student.mark?.push({
      date: new Date(),
      mark1: 0,
      mark2: 0,
      mark3: 0,
      total: 0
    });
  }
  remove(index: number) {
    this.student.mark?.splice(index, 1);
  }
}


