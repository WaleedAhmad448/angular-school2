import { Component, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderOptions } from '../../core/page-list.model';
import { KitsngFormFactoryService } from 'kitsng-form-factory';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styles: [
  ]
})
export class PageHeaderComponent implements OnInit {
    home!: MenuItem;
    @Input() pageHeaderOptions!: PageHeaderOptions;
    constructor(
        private formFactory: KitsngFormFactoryService
    ) {
      this.home = { icon: "pi pi-th-large", routerLink: "/" };
    }
    ngOnInit(): void {
        if (this.pageHeaderOptions.actionsFormFields && this.pageHeaderOptions.actionsFormFields.length) {
            this.pageHeaderOptions.actionsForm = this.formFactory.createForm(this.pageHeaderOptions.actionsFormFields);
        }
    }

}
