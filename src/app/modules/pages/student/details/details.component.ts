import { Component,OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../../../core/model/student.model';
import { Mark } from '../../../../core/model/Mark.model';
import { StudentService } from '../../../../core/service/student.service';
import { faArrowLeft,faPencil } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Gender } from '../../../../core/model/gender.enum';
// import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  showDialog: boolean = false;
  showAdditional: boolean = false;
  genderEnum = Gender;
  selectedGender: Gender = Gender.MALE;
  marks: Mark[] = [];

@Input() currentStudent: Student ={
   date: new Date(),
   studentName: '',
   studentNrc: '',
   age: 0,
   dateOfBirth: new Date(),
   fatherName: '',
   gender: Gender.MALE ,
   township: '',
   address: '',
   photo: '',
   mark: []
}

  localdomain =  'http://localhost:8080';

  faArrowLeft = faArrowLeft;
  pencil = faPencil;

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
    mark:[]
  }
  constructor(private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
   private dialog: MatDialog,
) { }

async ngOnInit(): Promise<void> {
  const id = this.route.snapshot.paramMap.get('studentId');
  const studentId = parseInt(id ?? '-1', 10);

  this.studentService.getStudentById(studentId).subscribe({
    next: (student: Student | null) => { 
      if (student) {
        this.student = student;
        this.imagePreviewUrl = 'http://localhost:8080' + student.photo;
      }
    }
  });
}  
  goTo(): void{
    this.router.navigate(['']);
  }

// ------------------------------------------------------------------------------------------
 
updateStudent(): void {
  if (!this.student || !this.student.studentId) {
    console.error('No student selected or student ID missing');
    return;
  }
  if (this.selectedFile) {
    this.studentService.updateFile(this.selectedFile, 'photo', `students/${this.student.studentId}`).subscribe({
      next: (photoUrl: string) => {
        if (this.student) { 
          this.student.photo = photoUrl;
          // this.performStudentUpdate();
          this.showDialog = false;
        }
      },
      error: (error) => {
        console.error('Error updating photo:', error);
      }
    });
  } else {
    // this.performStudentUpdate();
  }
}

// performStudentUpdate(): void {
//   if (!this.student) {
//     return;
//   }
//   this.student.gender = this.selectedGender;
//   this.studentService.updateStudent(this.student.studentId, this.student).subscribe({
//     next: (response: any) => {
//       console.log('Student updated successfully:', response);
//       this.showDialog = false;
//     },
//     error: (error) => {
//       console.error('Error updating student:', error);
//     }
//   });
// }

onFileSelected(event: any): void {
  console.log('Current student:', this.student);
  this.selectedFile = event.target.files[0];

  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  } 
} 
  toggleDialog(): void {
    this.showDialog = !this.showDialog;
  }

  // calculateTotal(mark: Mark): void {
  //  mark.total = (mark.mark1 || 0) + (mark.mark2 || 0) + (mark.mark3 || 0);
  // }
  showAdditionalFields() {
    this.showAdditional = !this.showAdditional;
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
  remove(index: number): void {
    this.student.mark?.splice(index, 1);
  }
  calculateTotal(index: number): void {
    const mark = this.student.mark?.[index];
    if (mark && mark.mark1 !== undefined && mark.mark2 !== undefined && mark.mark3 !== undefined) {
      mark.total = mark.mark1 + mark.mark2 + mark.mark3;
    }
  }

}
