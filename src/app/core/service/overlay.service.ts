import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class OverLayService {

    constructor(
    ) {}
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    setMaxHeight(event: any) {
        const overlayPanel = (document.getElementsByClassName('custom-overlaypanel').item(0) as HTMLElement).children.item(0) as HTMLElement;
        if (overlayPanel) {
            const viewportHeight = window.innerHeight;
            const panelRect = overlayPanel.getBoundingClientRect();
            const panelTop = panelRect.top;
            const panelBottom = panelRect.bottom;
            const spaceAbove = viewportHeight - panelTop;
            const spaceBelow = viewportHeight - panelBottom;
            const maxHeight = Math.max(spaceAbove, spaceBelow) - 16;
            overlayPanel.style.maxHeight = maxHeight + 'px';
        }
    }
}
