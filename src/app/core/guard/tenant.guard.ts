import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map, of, switchMap } from 'rxjs';
import { state } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { getBaseUrl, getTenantFromSubdomain } from '../model/http-response.model';
import { TenantService } from '../service/tenant.service';

@Injectable({
  providedIn: 'root',
})
export class TenantGuard  {
  constructor(
    private router: Router,
    private tenantService: TenantService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.check(route);
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.check(childRoute);
  }
  private check(route: ActivatedRouteSnapshot): any {
    const tenant = getTenantFromSubdomain() ?? '';
    const url = getBaseUrl();
    const tenantStatus = this.tenantService.getTenantStatus(tenant, url) as any;
    return tenantStatus.pipe(
      switchMap((res) => {
        if (res === true) {
          return of(true);
        } else {
            return of(true);
          this.router.navigate(['/error-tenant']);
          return of(false);
        }
      })
    );
  }
}
