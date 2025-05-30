import { Component } from '@angular/core';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent {
    teachers = [
    { name: 'أ. أحمد علي', subject: 'رياضيات', phone: '777777777' },
    { name: 'أ. سارة محمد', subject: 'لغة عربية', phone: '733333333' },
    { name: 'أ. خالد حسن', subject: 'علوم', phone: '711111111' },
    { name: 'أ. نجلاء فؤاد', subject: 'إنجليزي', phone: '700000000' },
  ];

}
