import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, map } from 'rxjs';
import { TenantStatus } from '../model/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private _tenant: Subject<string> = new Subject();
  constructor(private http: HttpClient){
  }
  get tenant$(): Observable<string>{
    return this._tenant.asObservable();
  }
  get tenant(): string{
    return sessionStorage.getItem('tenant') ?? '';
  }
  set tenant(tenant: string){
    sessionStorage.setItem('tenant',tenant);
  }
  setTenant(tenant: string){
    this.tenant = tenant;
    this._tenant.next(tenant);
  }
  getTenantStatus(tenant: string, hostUrl: string): Observable<boolean>{
    const url = this.getUrl(tenant, hostUrl);
    return this.http.get<TenantStatus>(url)
    .pipe(catchError((err: any)=>{
      return of({isValid:false});
    }))
    .pipe(
      map((res) => {
        if (res?.isValid) {
          return true;
        } else {
          // redirect to tenant invalid page
          return false;
        }
      })
    );
  }
  private getUrl(tenant: string, hostUrl: string): string{
    return `${hostUrl}/api/${tenant}/CurrentTenantInfo/Status`;
  }
}
