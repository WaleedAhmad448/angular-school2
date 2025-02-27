import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { getBaseUrl, getTenantFromSubdomain } from '../model/http-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard  {
  constructor( private router: Router, private authService: AuthService){
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.check(state);
  }

  private check(state: RouterStateSnapshot){
    if (!environment.production) {
      this.authService.baseUrl = getBaseUrl();
    }
    return this.authService.check().pipe(
      switchMap(res => {
        const originUrl = getBaseUrl();
        const redirectUrl = this.getRedirectUrl();
        //
        if (res === true) {
          return of(true);
        } else {
          if (!environment.production) {
            return of(true);
          }
          const tenant = getTenantFromSubdomain();
          const loginUrl = `${originUrl}/api/${tenant}/OAuth/SpaLogin?redirectUri=${redirectUrl}${state.url}`;
          window.location.href = loginUrl;
          return of(false);
          // return of(true);
        }
      })
    );
  }
  private getRedirectUrl() {
    return window.location.origin;
  }
}
