import { Component, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderOptions } from '../../core/page-list.model';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styles: [
  ]
})
export class PageHeaderComponent {
    home!: MenuItem;
    @Input() pageHeaderOptions!: PageHeaderOptions;
    constructor() {
      this.home = { icon: "pi pi-th-large", routerLink: "/" };
    }

}
