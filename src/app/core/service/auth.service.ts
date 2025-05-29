
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    tenant!: string;
    public userTypes = [
        { value: 'clientUser-0', viewValue: 'clientUser' },
        { value: 'adminUser-1', viewValue: 'adminUser' }
        //{ value: 'indivualUser-2', viewValue: 'IndivualUser' },
    ];

    private _authenticated: boolean = false;
    public baseUrl = window.location.origin;
    private _user: BehaviorSubject<any> = new BehaviorSubject({});
    get user$(): any{
      return this._user.asObservable();
    }
    user: any;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private tenantService: TenantService
    ) {
      this.tenant = tenantService.tenant;
      this.baseUrl = window.location.origin;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    check(): Observable<boolean> {
        return this.validateToken();
    }

    validateToken(): Observable<boolean>{
      const url = `${this.baseUrl}/api/${this.tenant}/OAuth/userinfo`;
      return this._httpClient.get(url)
      .pipe(catchError((error)=>{
        return of(false)
      })).pipe(map((res)=>{
        this._user.next(res);
        this.user = res;
        return !!res;
      }));
    }
    getUser(): Observable<any>{
      const url = `${this.baseUrl}/api/${this.tenant}/OAuth/userinfo`;
      return this._httpClient.get<any>(url).pipe(map((res)=>{
        this.user = res;
        this._user.next(res);
        return res;
      }));
    }
    logout(): Observable<any>{
      const url = `${this.baseUrl}/api/${this.tenant}/OAuth/Signout`;
      return this._httpClient.post<any>(url,{});
    }
}
