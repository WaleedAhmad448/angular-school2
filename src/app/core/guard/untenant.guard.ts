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
export class UnTenantGuard  {
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

    if (tenant) {
      this.tenantService.setTenant(tenant);
    }
    const url = getBaseUrl();
    const tenantStatus = this.tenantService.getTenantStatus(tenant, url) as any;
    return tenantStatus.pipe(
      switchMap((res) => {
        if (res === false) {
          return of(true);
        } else {
          if (!environment.production) {
            return of(true);
          }
          this.router.navigate(['/']);
          return of(false);
        }
      })
    );
  }
}
