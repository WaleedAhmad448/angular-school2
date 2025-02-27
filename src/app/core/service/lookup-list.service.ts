import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  delay,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { LookupList, ApiListDto, ApiQueryDto, ApiResponseDto, getBaseUrl } from '../model/http-response.model';


@Injectable({
  providedIn: 'root',
})
export class LookupListService {
  private baseUrl = environment.apiBaseUrl;
  private readonly module = "SanedSharedData";
  private readonly version = "v1.2";
  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
  ) {
    // this.baseUrl = `${this.getBaseUrl()}/api/default/${this.module}/${this.entity}/${this.version}`;
  }
  getLookupLists<T = LookupList>(
    entity: string,
    session: boolean = true,
    query: any = null,
    module: string = this.module,
    version: string = this.version
  ): Observable<ApiResponseDto<ApiListDto<T>>> {
    const url = `${getBaseUrl()}/api/default/${module}/${entity}/${version}/lookup/all`;
    if (session) {
      const seesionData = sessionStorage.getItem(entity);
      if (seesionData) {
        const data: ApiResponseDto<ApiListDto<T>> = JSON.parse(seesionData);
        return of(data);
      }
      else{
        this.getLookupLists(entity, false, query, module, version);
      }
    }
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(url, query ?? {})
      .pipe(
        map((response) => {
          const seesionData = JSON.stringify(response);
          sessionStorage.setItem(entity, seesionData);
          return response;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
}
