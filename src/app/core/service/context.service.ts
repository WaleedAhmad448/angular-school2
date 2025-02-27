import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private nonCoContext: { [key: string]: any } = {};

  set(id: string, value: any): any {
    this.nonCoContext[id] = value;
    return value;
  }

  get(id: string, defaultValue: any = null): any {
    return this.nonCoContext[id] !== undefined ? this.nonCoContext[id] : defaultValue;
  }

  has(id: string): boolean {
    return id in this.nonCoContext;
  }

  destroy(id: string): void {
    delete this.nonCoContext[id];
  }

  copy(from: ContextService, keys: string[] = []): void {
    const map = keys.length ? this.pick(from.nonCoContext, keys) : { ...from.nonCoContext };
    this.nonCoContext = map;
  }

  override(id: string, closure: (value: any) => any): any {
    const value = this.has(id) ? this.get(id) : null;
    const newValue = closure(value);
    this.set(id, newValue);
    return newValue;
  }

  getOrSet(id: string, value: any): any {
    if (!this.has(id)) {
      return this.set(id, value);
    }
    return this.get(id);
  }

  private pick(obj: { [key: string]: any }, keys: string[]): { [key: string]: any } {
    return keys.reduce((acc, key) => (obj[key] !== undefined ? { ...acc, [key]: obj[key] } : acc), {});
  }

  getContainer(): { [key: string]: any } {
    return { ...this.nonCoContext };
  }
}
