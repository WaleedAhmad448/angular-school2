import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit, AfterViewInit {
    isAdmin: boolean = true;
    model: any[] = [];
    constructor(public layoutService: LayoutService) {}
    ngAfterViewInit(): void {}

    ngOnInit() {
        console.log('role from app menu', this.isAdmin);
        this.model = [
            {
                label: 'Empty',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Empty Page',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
                role: this.isAdmin,
            },

            {
                label: 'Dimensions',
                icon: 'pi pi-fw pi-home',
                routerLink: ['/dimensions'],
                role: this.isAdmin,
            },

            {
                label: 'Document Types',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/docTypes'],
                role: this.isAdmin,
            },
             {
                label: 'Administrator',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/administrator'],
                role: this.isAdmin,
            },

            {
                label: 'Student',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/student'],
                role: this.isAdmin,
            },

            {
                label: 'Teacher',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/teacher'],
                role: this.isAdmin,
            },
            {
                label: 'Document Type Ages',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/doc-type-ages'],
                role: this.isAdmin,
            },

            {
                label: 'Archive Types',
                icon: 'pi pi-fw pi-align-justify',
                routerLink: ['/archive-types'],
                role: this.isAdmin,
            },
        ];
    }
}
