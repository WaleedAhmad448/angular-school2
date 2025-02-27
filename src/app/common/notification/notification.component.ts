import { OnDestroy } from '@angular/core';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ApiOrdersConditionsValue } from 'src/app/core/model/http-response.model';
import { ApiQueryDto } from 'src/app/core/model/http-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [
    {
      label: `
      <div class="d-flex border-bottom pb-2 justify-content-between align-items-center">
        <div>
          you have notifications
        </div>
        <div class="mx-2">
          <span class="badge text-bg-secondary"></span>
        </div>
      </div>
    `,

      escape: false,
      items: [],
    },
  ];
  notifications!: any[];
  showSideBar = false;
  sort: any = { createdAt: ApiOrdersConditionsValue.DESC };

  constructor(
    private router:Router,
    private renderer: Renderer2,
  ) {}
  ngOnInit() {
    this.fetchAndAppendNotifications();
  }
  private pageIndex = 0;
  private isLoading = false;

  private fetchAndAppendNotifications() {
    if (this.isLoading) return;
    this.isLoading = true;
    let exe = () => {
      const query: ApiQueryDto = {
        filters: {},
        orders: this.sort,
        pageIndex: ++this.pageIndex,
      };
    };
    setTimeout(exe, 500);
  }
  onHideMenu(e: any) {
    this.removeScrollEventListener();
  }
  onShowMenu(e: any) {
    setTimeout(() => {
      this.scrollPanelRef = document
        .getElementsByClassName('ref-notification-container')
        .item(0);
      this.addScrollEventListener();
    }, 500);
  }
  scrollPanelRef: any = undefined;
  ngOnDestroy(): void {
    this.removeScrollEventListener();
  }

  addScrollEventListener(): void {
    if (this.scrollPanelRef) {
      this.renderer.listen(
        this.scrollPanelRef,
        'scroll',
        this.onScroll.bind(this)
      );
    }
  }

  removeScrollEventListener(): void {
    if (this.scrollPanelRef)
      this.renderer.listen(
        this.scrollPanelRef,
        'scroll',
        this.onScroll.bind(this)
      );
  }

  onScroll(): void {
    if (this.scrollPanelRef) {
      const scrollPanel = this.scrollPanelRef;
      const scrollOffset = scrollPanel.scrollTop;
      const scrollHeight = scrollPanel.scrollHeight;
      const panelHeight = scrollPanel.clientHeight;

      if (scrollOffset + panelHeight >= scrollHeight - 10) {
        this.fetchAndAppendNotifications();
      }
    }
  }
}
