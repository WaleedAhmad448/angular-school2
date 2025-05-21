import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../../../core/model/student.model';
import { StudentService } from '../../../../core/service/student.service';
import { faTrash, faUser, faPencil } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2';
import { HomeComponent } from '../home/home/home.component';
import { DetailsComponent } from '../details/details.component';
import { Gender } from '../../../../core/model/gender.enum';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{

  @ViewChild('importFileInput') importFileInput: any;
  @ViewChild(DetailsComponent,{static : true}) detailsComponent!: DetailsComponent;
  
  faTrash = faTrash;
  faClipboard = faUser;
  faPencil = faPencil

  showDialog: boolean = false;
  selectedFile: File | null = null;
  selectedGender: Gender = Gender.MALE;

  isAddingStudent = false;

  localDomain = 'http://localhost:8080';
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

 Search: string = '';
  students?: Student[];
  currentStudent: Student = { mark: [] };
  currentIndex = -1;
  search= {
    studentId:'',
    studentName :''
  
  }
  constructor(private studentService: StudentService ,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.retrieveStudents();
  };

  retrieveStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        // console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  refreshList(): void {
    this.retrieveStudents();
    this.currentStudent = {mark:[]};
    this.currentIndex = -1;
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeStudent(id);
      }
    });
  }

  removeStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: (res) => {
        console.log("student delete successfully",res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }
  searchTitle(): void {
    this.currentStudent = {mark:[]};
    this.currentIndex = -1;

    this.studentService.getAllByStudentName(this.Search).subscribe({
      next: (data) => {
        this.students = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  searchStudentId(id: number): void {
    this.currentStudent = {mark:[]};
    this.currentIndex = -1;

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.students = [data];
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  onSearch(): void {
    if (this.Search.trim().length === 0) {
      this.retrieveStudents();
      return;
    }

    if (!isNaN(Number(this.Search))) {
      this.searchStudentId(Number(this.Search));
    } else {
      this.searchTitle();
    }
  }
  exportToExcel(): void {
    if (!this.students || this.students.length === 0) {
      console.error('No data available for export.');
      return;
    }
  
    const data = this.students.map(student => {
      const studentData: { [key: string]: any } = {
        'Date': student.date,
        'ID': student.studentId,
        'Name': student.studentName,
        'Nrc No': student.studentNrc,
        'Age': student.age,
        'Date of Birth': student.dateOfBirth,
        'Gender': student.gender,
        'Father Name': student.fatherName,
        'Township': student.township,
        'Address': student.address,
        'Photo': student.photo,
      };
  
      student.mark.forEach((mark, index) => {
        studentData[`Mark Date ${index + 1}`] = mark.date;
        studentData[`Mark 1-${index + 1}`] = mark.mark1;
        studentData[`Mark 2-${index + 1}`] = mark.mark2;
        studentData[`Mark 3-${index + 1}`] = mark.mark3;
        studentData[`Total ${index + 1}`] = mark.total;
      });
  
      return studentData;
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
  
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }
  triggerFileInput(): void {
    this.importFileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    this.studentService.import(file).subscribe({
      next: (response: any) => {
        console.log(response);
        this.retrieveStudents();
        window.location.reload();
        
         swal.fire({
          icon: 'success',
          title: 'success!',
          text: 'File uploaded successfully',
        });
      },
      error: (error) =>   console.error(error)
    });
  }
  openCreateDialog(): void {
    this.isAddingStudent = true;
    const dialogRef = this.dialog.open(HomeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
       console.log('open dialog')
      }
    });
  }
  onEditStudent(student: Student): void {
  this.student = { ...student }; 
  this.selectedGender!= student.gender; 
  this.showDialog = true; 
}
  toggleDialog(): void {
    this.showDialog = !this.showDialog;
  }

}


