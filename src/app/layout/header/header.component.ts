import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuService } from '../app.menu.service';
import { LayoutService, MenuMode } from '../service/app.layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isModuleMenuVisible = false;
  logoPath = environment.logoPath;
  platform = environment.platform;
  showApproval:boolean=true
  constructor() {


  }

  toggleMenu() {
    this.isModuleMenuVisible = !this.isModuleMenuVisible;
  }
  toggle() {
    document.getElementsByTagName('body')[0].classList.toggle('is-collapsed');
  }

  getLevel() {


    // return 'Company Level';
  }

  markNotfication(event:any){

    console.log('marlnotifa',event)

  }
}
