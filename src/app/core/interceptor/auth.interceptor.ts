import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { AuthUtils } from './auth.utils';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { getBaseUrl, getTenantFromSubdomain } from '../model/http-response.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private router: Router)
    {
    }
    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
      console.log("Auth Interceptor");
        // Clone the request object
        let newReq = req.clone();

        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        // if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
        if ( !environment.production && environment.devToken)
        {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + (localStorage.getItem("devToken") ?? environment.devToken))
            });
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {

                // Catch "401 Unauthorized" responses
                if ( error instanceof HttpErrorResponse && error.status === 401 && environment.production )
                {
                    // Sign out
                    console.log('Unauthorized');
                    // Reload the app
                    this.redirectToLogin();
                }

                return throwError(error);
            })
        );
    }
    redirectToLogin(){
      const originUrl = getBaseUrl();
      const redirectUrl = this.getRedirectUrl();
      const tenant = getTenantFromSubdomain();
      const loginUrl = `${originUrl}/api/${tenant}/OAuth/SpaLogin?redirectUri=${redirectUrl}`;
      console.log('UnAuthorized');
      window.location.href = loginUrl;
    }
    private getRedirectUrl() {
      return window.location.origin;
    }
}
