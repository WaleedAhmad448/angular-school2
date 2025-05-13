export interface Administrator {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  qualification?: string;
  administratorNumber: string;
  dateOfBirth: Date;
  hireDate: Date;
  imagePath: string;
}
export interface AdministratorRegistrationDto {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  qualification?: string;
  dateOfBirth: Date;
  hireDate: Date;
  imagePath: string;
}