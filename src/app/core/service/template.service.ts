import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates: Map<string, TemplateRef<any>> = new Map();

  registerTemplate(id: string, templateRef: TemplateRef<any>) {
    this.templates.set(id, templateRef);
  }

  getTemplate(id: string): TemplateRef<any> | undefined {
    return this.templates.get(id);
  }
}
