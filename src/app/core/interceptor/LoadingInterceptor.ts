import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import { LoadingService } from '../service/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
      this.totalRequests++;
      if (((request.url.search(/all/))>= 0 || (request.url.search(/page/))>= 0) && (request.url.search(/lookup/)) < 0) {
        setTimeout(() => {
        this.loadingService.loading = true;
        });
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          setTimeout(() => {
          this.loadingService.loading = false;
          });
        }
      })
    );
  }
}
