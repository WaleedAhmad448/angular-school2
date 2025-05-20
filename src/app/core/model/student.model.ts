import { Gender } from './gender.enum';
import { Mark } from './Mark.model';
export class Student {

    date?: Date;
    studentId?: any;
    studentName ?: string;
    studentNrc?: string;
    age?: number;
    dateOfBirth?: Date;
    fatherName?: string;    
    gender?: Gender;
    address?: string;
    township?: string;
    photo?: string;
    mark!: Mark[];
}
