import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
selector: 'app-page-heading',
templateUrl: './page-heading.component.html',
styleUrls: ['./page-heading.component.scss'],
standalone: true,
imports: [ CommonModule, ButtonModule, BreadcrumbModule, InputTextModule],
})
export class PageHeading {
    home!: MenuItem;
    @Input() pageHeaderOptions!: PageHeadeingOptions;
    constructor() {
      this.home = { icon: "pi pi-th-large", routerLink: "/" };
    }
}

export interface PageHeadeingOptions{
    title: string;
    titleTemplate?: TemplateRef<any>;
    description?: string;
    breadcrumbs?: MenuItem[];
    actions?: HeadingAction[];
    actionsTemplate?: TemplateRef<any>;
    status?: HeadingStatus[];
    statusTemplate?: TemplateRef<any>;
    filtersTemplate?: TemplateRef<any>;
    statusClass?: string;
    actionsClass?: string;
    filterClass?: string;
    containerClass?: string;
}

export interface HeadingAction {
    icon?: string;
    iconPos?: "left" | "right" | "top" | "bottom";
    label?: string;
    onClick?(event: any): void;
    class?: string;
    isAdd?: boolean;
  }

  export interface HeadingStatus {
    icon?: string;
    label?: string;
  }
