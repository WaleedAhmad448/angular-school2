import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.debug("Error handler Interceptor");
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (response instanceof HttpErrorResponse) {
      if (response.status === 401 || response.status === 403) {
        sessionStorage.clear();
        if (this.router.url != "/login" && this.router.url != "/index") {
          this.router.navigate(['login']);
        }
      } else if (response.status === 404) {
        if (this.router.url != "/login" && this.router.url != "/index") {
          this.router.navigate(['error/404']);
        }
      } else if (response.status === 500) {
        if (this.router.url != "/login" && this.router.url != "/index") {
          this.router.navigate(['error/500']);
        }
      }
    }
    throw response;
  }

}
