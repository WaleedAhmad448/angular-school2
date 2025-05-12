// TeacherModel.ts
export interface Teacher {
    id: number;
    fullName: string;
    dateOfBirth: string; // أو Date إذا كنت ستتعامل مع كائنات Date في الفرونت إند
    teacherNumber: string;
    address: string;
    phoneNumber: string;
    email: string;
    subject: string;
    qualification?: string; // علامة الاستفهام تعني أنها اختيارية
    hireDate: string; // أو Date
    profileImagePath?: string; // اختياري
}

export interface TeacherRegistrationDto {
    fullName: string;
    dateOfBirth: string; // أو Date
    address: string;
    phoneNumber: string;
    email: string;
    subject: string;
    qualification?: string;
}

export interface PagedResult<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}