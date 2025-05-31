import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { KitsngTableConfig, KitsngTableFactoryModule } from 'kitsng-table-factory';
import { Gender } from 'src/app/core/model/gender.enum';
import { debounceTime, Subject } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/service/error-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-Students',
  standalone: true,
    imports: [CommonModule, SharedModule, 
      PageHeading, 
      KitsngTableFactoryModule,
      BreadcrumbModule
    ],
  templateUrl: './Students.component.html',
  styleUrls: ['./Students.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class StudentsComponent implements OnInit {
  @ViewChild('ImageField', { static: true }) imageTemplate!: TemplateRef<any>; 
  @ViewChild('importFileInput') importFileInput!: ElementRef;
  @ViewChild(DetailsComponent,{static : true}) detailsComponent!: DetailsComponent;
  
  tableConfig!: KitsngTableConfig;
  headerOptions!: PageHeadeingOptions;
  
  selectedFile: File | null = null;
  selectedGender: Gender = Gender.MALE;
  
  isAddingStudent = false;
  _getData: Subject<void> = new Subject();
  serverBaseUrl: string = environment.baseUrl;
  
  showDialog: boolean = false;
  ref: DynamicDialogRef | undefined;

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

  constructor(
    private studentService: StudentService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
     private errorHandlerService: ErrorHandlerService,
  ) {
    this.initHeaderOptions();
  }

 ngOnInit(): void {
    this.retrieveStudents();
     this.initTableConfig();
        this._getData.pipe(debounceTime(500)).subscribe(() => {
          this.fetchStudentsData();
        });
        this._getData.next();
  };
  fetchStudentsData() {
  this.studentService.getAllStudents().subscribe({
    next: (response: Student[]) => {
      this.students = response;

      this.tableConfig.data = [...this.students]; // 🔁 نسخ البيانات
      this.tableConfig.totalRecords = this.students.length; // 🔢 تحديد عدد السجلات

      console.log('Students loaded:', this.students); // ✅ تحقق من البيانات
    },
    error: (error) => {
      this.errorHandlerService.handleError(error, this.messageService);
    }
  });
}

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

  initHeaderOptions() {
    this.headerOptions = {
      title: 'Student',
      containerClass: 'card mb-3 pb-3',
      breadcrumbs: [
        { label: 'Student' },
      ],
      actions: [
        {
          label: 'Add Student',
          icon: 'pi pi-plus',
          onClick: () => {
            this.router.navigate(['student', 'add']);
          },
        },
        {
          label: 'Import',
          icon: 'pi pi-upload',
          onClick: () => {
            this.triggerFileInput();
          }
        },
        {
          label: 'Export',
          icon: 'pi pi-download',
          onClick: () => {
            this.exportToExcel();
          }
        }
      ],
    };
  }

       addItem() {
        this.router.navigate(['workflow', 'approvelMatrix', 'add']);
    }

  openDeleteDialog(id: number): void {
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
  // onFileChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.error('No file selected');
  //     return;
  //   }

  //   this.studentService.import(file).subscribe({
  //     next: (response: any) => {
  //       console.log(response);
  //       this.retrieveStudents();
  //       window.location.reload();
        
  //        swal.fire({
  //         icon: 'success',
  //         title: 'success!',
  //         text: 'File uploaded successfully',
  //       });
  //     },
  //     error: (error) =>   console.error(error)
  //   });
  // }
  
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
  onEditStudent(student: Student): void {
  this.student = { ...student }; 
  this.selectedGender!= student.gender; 
  this.showDialog = true; 
}
  initTableConfig() {
  this.tableConfig = {
    columns: [
      { field: 'studentId', header: 'ID' },
      { field: 'studentName', header: 'Name' },
      { field: 'dateOfBirth', header: 'Date Birth' },
      { field: 'studentNrc', header: 'NRC No' },
      { field: 'age', header: 'Age' },
      { field: 'gender', header: 'Gender' },
      {
        field: 'photo',
        header: 'Photo',
        template: this.imageTemplate,
      },

    ],
    data: [],
    rowHover: true,
    pageSize: 10,
    first: 0,
    showPaginator: true,
    totalRecords: 0,
    class: 'border-0',
    actionButtons: [
      {
        icon: 'pi pi-eye',
        // tooltip: 'View',
        onClick: (student: Student) => {
          this.router.navigate(['../student/details/details.component.ts']);
        },
      },


      {
        icon: 'pi pi-pencil',
        onClick: (student: Student) => {
          this.router.navigate(['student', 'edit', student.studentId]);
        },
        colorClass: 'p-button-info',
      },
      {
        icon: 'pi pi-trash',
        onClick: (student: Student) => {
          if (confirm(`Are you sure you want to delete ${student.studentName}?`)) {
            this.studentService.deleteStudent(student.studentId).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Deleted',
                  detail: `Student ${student.studentName} deleted successfully.`,
                });
                this._getData.next();
              },
              error: (error) => {
                this.errorHandlerService.handleError(error, this.messageService);
              }
            });
          }
        },
        colorClass: 'p-button-danger',
      },
    ],
    // fetchApiInfo:{
    //   module: 'student',
    //   entity: 'get',
    //   path: 'all',
    //   version: '',
    //   baseUri: this.serverBaseUrl,
    //   _getData: new Subject<void>(),
    // },
    onSelectedItems: (e) => {
      console.log('Selected students', e);
    },
    onSorting: (e) => {
      console.log('Sorting', e);
    },
    onPageChanged: (e) => {
      console.log('Page changed', e);
    },
  };
}

}