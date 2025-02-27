import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LookUpResult, ApiListDto, ApiQueryDto, ApiResponseDto, getBaseUrl } from "../model/http-response.model";
import { catchError, map, throwError } from "rxjs";




@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  private readonly version = 'v1.2';

  private baseUrl(entity: string,module: string) {
    return `${getBaseUrl()}/api/default/${module}/${entity}/${this.version}`;
  }

  constructor(
    private _httpClient: HttpClient,
  ) {
  }


  getLookUp(
    entity: string,
    module = 'SanedSharedData',
    query: ApiQueryDto
  ){
    return this._httpClient
    .post<ApiResponseDto<ApiListDto<LookUpResult>>>(`${this.baseUrl(entity,module)}/lookup/page`, query)
    .pipe(
      map((response) => {

        //
        return response;
      })
    )
    .pipe(
      catchError<any, any>((response: any) => {
        return throwError(response.error);
      })
    );
  }
  getLookUpById(
    entity: string,
    module = 'SanedSharedData',
    id: string
  ){
    return this._httpClient
    .get<ApiResponseDto<LookUpResult>>(`${this.baseUrl(entity,module)}/lookup/${id}`)
    .pipe(
      map((response) => {

        //
        return response;
      })
    )
    .pipe(
      catchError<any, any>((response: any) => {
        return throwError(response.error);
      })
    );
  }

  getAllLookUp(
    entity: string,
    module = 'SanedSharedData'
  ){
    return this._httpClient
    .post<ApiResponseDto<ApiListDto<LookUpResult>>>(`${this.baseUrl(entity,module)}/lookup/all`,{})
    .pipe(
      map((response) => {

        //
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
