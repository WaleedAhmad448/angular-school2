import { environment } from 'src/environments/environment';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService, MenuMode } from './service/app.layout.service';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent {
    timeout: any = null;
    platform = environment.platform;
    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: LayoutService, public el: ElementRef, public menuService: MenuService) {}


    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;


        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
            }
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

  toggleSidebar(){
    const menuMode: MenuMode = this.layoutService.isSlim() ? 'static' : 'slim' ;
    this.layoutService.config.menuMode = menuMode;
    if (this.layoutService.isSlimPlus() || this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
        this.menuService.reset();
    }
}

}
