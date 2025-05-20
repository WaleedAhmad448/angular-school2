export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string;
  studentNumber: string;
  address: string;
  phoneNumber: string;
  email: string;
  gradeLevel: number;
  parentName?: string;
  parentPhoneNumber?: string;
  registrationDate: string;
}

export interface StudentRegistrationDto {
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  gradeLevel: number;
  parentName?: string;
  parentPhoneNumber?: string;
}