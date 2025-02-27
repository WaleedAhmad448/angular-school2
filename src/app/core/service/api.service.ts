import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import {
  appendToFormData,
  getBaseUrl,
  getMappedData,
  removeNullFieldValues,
  ApiListDto,
  ApiQueryDto,
  ApiResponseDto,
} from "../model/http-response.model";

@Injectable({
  providedIn: "root",
})
export class ApiService<T = any> {
  private baseUrl = "";
  private module = "";
  private entity = "";
  private version = "v1";
  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
    this._initBaseUrl();
  }
  _initService(module: string, entity: string, version: string) {
    this.module = module;
    this.entity = entity;
    this.version = version;
    this._initBaseUrl();
  }
  _initBaseUrl() {
    this.baseUrl = `${getBaseUrl()}/api/default/${this.module}/${this.entity}/${
      this.version
    }`;
  }
  getAll(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/all`, query)
      .pipe(
        map((response) => {
          console.log(response);
          return this.checkResponseStatus(response);
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
  getPaged(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/page`, query)
      .pipe(
        map((response) => {
          console.log(response);
          return this.checkResponseStatus(response);
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
  getAsList(): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/lookup/all`, {})
      .pipe(
        map((response) => {
          return this.checkResponseStatus(response);
        })
      )
      .pipe(
        catchError<any, any>((response) => {
          return throwError(response.error);
        })
      );
  }
  getById(supplierId: string): Observable<T> {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
  add(data: T): Observable<T> {
    return this._httpClient
      .post<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
  edit(data: T): Observable<T> {
    return this._httpClient
      .put<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(() => response.error);
        })
      );
  }
  addForm(data: T): Observable<T> {
    const sentData = data;
    const formData = new FormData();
    appendToFormData(formData, sentData);
    return this._httpClient
      .post<ApiResponseDto<T>>(`${this.baseUrl}/form`, formData)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(response.error);
        })
      );
  }
  editForm(data: T): Observable<T> {
    const sentData = data;
    const formData = new FormData();
    appendToFormData(formData, sentData);
    return this._httpClient
      .put<ApiResponseDto<T>>(`${this.baseUrl}/form`, formData)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(() => response.error);
        })
      );
  }
  delete(supplierId: string) {
    return this._httpClient
      .delete<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .pipe(
        catchError<any, any>((response: any) => {
          return throwError(() => response.error);
        })
      );
  }
  private checkResponseStatus(
    response: ApiResponseDto<ApiListDto<T>>
  ): ApiListDto<T> | null {
    if (response?.status === 200) {
      return getMappedData(response);
    } else {
      return null;
    }
  }
}
