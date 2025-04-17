import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import {
  appendToFormData,
  getMappedData,
  ApiListDto,
  ApiQueryDto,
  ApiResponseDto,
} from "../model/http-response.model";
import { TenantService } from "./tenant.service";

@Injectable({
  providedIn: "root",
})
export class ApiService<T = any> {
  private baseUrl = "";
  private module = "";
  private entity = "";

  constructor(private _httpClient: HttpClient, private _tenant: TenantService) {}

  _initService(module: string, entity: string) {
    this.module = module;
    this.entity = entity;
    this._initBaseUrl();
  }

  private _initBaseUrl() {
    // تأكد من أن apiBaseUrl تنتهي بـ '/'
    const apiBase = environment.apiBaseUrl.endsWith('/')
      ? environment.apiBaseUrl
      : `${environment.apiBaseUrl}/`;

    this.baseUrl = `${apiBase}default/${this.module}/${this.entity}`;
  }

  getAll(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/all`, query)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  getPaged(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/page`, query)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  getAsList(): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/lookup/all`, {})
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  getById(id: string): Observable<T> {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  add(data: T): Observable<T> {
    return this._httpClient
      .post<ApiResponseDto<T>>(this.baseUrl, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  edit(data: T): Observable<T> {
    return this._httpClient
      .put<ApiResponseDto<T>>(this.baseUrl, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  addForm(data: T): Observable<T> {
    const formData = new FormData();
    appendToFormData(formData, data);
    return this._httpClient
      .post<ApiResponseDto<T>>(this.baseUrl, formData)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  editForm(data: T): Observable<T> {
    const formData = new FormData();
    appendToFormData(formData, data);
    return this._httpClient
      .put<ApiResponseDto<T>>(this.baseUrl, formData)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  delete(id: string): Observable<T> {
    return this._httpClient
      .delete<ApiResponseDto<T>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(() => response.error))
      );
  }

  private checkResponseStatus(response: ApiResponseDto<ApiListDto<T>>): ApiListDto<T> {
    if (response?.status === 200) {
      return getMappedData(response);
    }
    throw new Error('Invalid response status');
  }
}
