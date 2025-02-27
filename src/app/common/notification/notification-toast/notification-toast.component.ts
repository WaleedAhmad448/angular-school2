import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
  styleUrls: ['./notification-toast.component.scss']
})
export class NotificationToastComponent implements OnInit{
  @Input() notification!:any;
  constructor(private router: Router){}
  ngOnInit(): void {
    // this.notification = this.msg.data;
  }
  navagiate(route:any){
    this.router.navigate([route])
   }
}
