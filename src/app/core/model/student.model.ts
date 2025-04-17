export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: Date;
  studentNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  gradeLevel: number;
  parentName?: string;
  parentPhoneNumber?: string;
  registrationDate: Date;
}

export interface StudentRegistrationDto {
  fullName: string;
  dateOfBirth: Date;
  address: string;
  phoneNumber: string;
  email: string;
  gradeLevel: number;
  parentName?: string;
  parentPhoneNumber?: string;
}