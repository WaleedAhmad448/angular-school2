import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../../core/model/student.model';
import { StudentService } from '../../../core/service/student.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as XLSX from 'xlsx';
import { MenuItem, MessageService } from 'primeng/api';
import { HomeComponent } from '../../pages/student/home/home/home.component';
import { DetailsComponent } from '../../pages/student/details/details.component';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PageHeadeingOptions, PageHeading } from 'src/app/common/page-heading/page-heading.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Router } from '@angular/router';
// import { KitsngTableFactoryModule } from 'kitsng-table-factory/lib/kitsng-table-factory/kitsng-table-factory.module';

@Component({
  selector: 'app-Students',
  standalone: true,
    imports: [CommonModule, SharedModule, 
      // PageHeading, 
      // KitsngTableFactoryModule,
      BreadcrumbModule
    ],
  templateUrl: './Students.component.html',
  styleUrls: ['./Students.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class StudentsComponent implements OnInit {

  @ViewChild('importFileInput') importFileInput: any;
    headerOptions!: PageHeadeingOptions;

    isAddingStudent = false;
    localDomain = 'http://localhost:8080';
    module?: any;

    Search: string = '';
    students?: Student[];
    currentStudent: Student = { mark: [] };
    currentIndex = -1;
    search = {
      studentId: '',
      studentName: ''
    }
    ref: DynamicDialogRef | undefined;
    items: MenuItem[] | undefined;

    home: MenuItem | undefined;

  constructor(
    private studentService: StudentService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,

  ) {
    this.initHeaderOptions();
  }

  ngOnInit(): void {
    this.retrieveStudents();
            this.items = [{ icon: 'pi pi-home', route: '/installation' }, { label: 'Components' }, { label: 'Form' }, { label: 'InputText', route: '/inputtext' }];

  };
 initHeaderOptions() {
        let self = this;
        this.headerOptions = {
            title: 'Approvel Matrix Definition',
            //   // containerClass: 'card mb-3 pb-3',
            breadcrumbs: [
                {
                    label: this.module?.label ?? 'Home',
                    routerLink: '../students',
                },
                {
                    label: 'Approvel Matrix List',
                },
            ],
            actions: [
                {
                    label: 'New Approvel Matrix',
                    icon: 'pi pi-plus',
                    class: 'fs-5',
                    isAdd: true,
                    onClick() {
                        self.addItem();
                    },
                },
            ],
        };
    }

       addItem() {
        this.router.navigate(['workflow', 'approvelMatrix', 'add']);
    }
  retrieveStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
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
    this.isAddingStudent = true;
    const dialogRef = this.openCreateDialog()

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === true) {
    //    console.log('open dialog')
    //   }
    // });
  
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeStudent(id);
      }
    });
  }

  removeStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: (res) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Student deleted successfully'});
        this.refreshList();
      },
      error: (e) => {
        console.error(e);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete student'});
      }
    });
  }

  searchTitle(): void {
    this.currentStudent = {mark:[]};
    this.currentIndex = -1;

    this.studentService.getAllByStudentName(this.Search).subscribe({
      next: (data) => {
        this.students = data;
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
      this.messageService.add({severity:'warn', summary:'Warning', detail:'No data available for export'});
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
  
    XLSX.writeFile(wb, 'students_data.xlsx');
  }

  triggerFileInput(): void {
    this.importFileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      this.messageService.add({severity:'error', summary:'Error', detail:'No file selected'});
      return;
    }

    this.studentService.import(file).subscribe({
      next: (response: any) => {
        this.messageService.add({severity:'success', summary:'Success', detail:'File imported successfully'});
        this.retrieveStudents();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to import file'});
      }
    });
  }

  openCreateDialog(): void {
    this.isAddingStudent = true;
    this.ref = this.dialogService.open(HomeComponent, {
      header: 'Add New Student',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe(() => {
      this.isAddingStudent = false;
      this.retrieveStudents();
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}