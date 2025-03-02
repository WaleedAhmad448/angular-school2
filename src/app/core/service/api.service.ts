import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment"; // ✅ استيراد environment

import {
  appendToFormData,
  getMappedData,
  ApiListDto,
  ApiQueryDto,
  ApiResponseDto,
} from "../model/http-response.model";
import { TenantService } from "./tenant.service";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type HttpMethodType = keyof typeof HttpMethod;

@Injectable({
  providedIn: "root",
})
export class ApiService<T = any> {
  private baseUrl = "";
  private module = "";
  private entity = "";
  // private version = "v1";
  private path: string | undefined;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient, private _tenant: TenantService) {
    this._initBaseUrl();
  }

  _initService(module: string, entity: string,
    // version: string,
    path?: string | undefined) {
    this.module = module;
    this.entity = entity;
    // this.version = version;
    this.path = path;
    this._initBaseUrl();
  }

  _initBaseUrl() {
    const path = this.path && this.path !== "" ? `/${this.path}` : "";
    this.baseUrl = `${environment.apiBaseUrl}${this.module}/${this.entity}`; // ✅ استخدام environment.apiBaseUrl
  }

  fetchData(
    method: HttpMethodType,
    endpoint: string,
    data?: any,
    dataType?: "JSON" | "FormData",
    options?: string[][] | Record<string, string> | string | URLSearchParams
  ): Observable<T> {
    let url = `${this.baseUrl}/${endpoint}`;

    if (method === HttpMethod.GET && options) {
      const queryString = new URLSearchParams(options);
      url += `?${queryString.toString()}`;
    }

    const requestBody = method === HttpMethod.POST || method === HttpMethod.PUT ? data : undefined;

    let formData: FormData | undefined;
    if (requestBody && requestBody instanceof FormData) {
      formData = requestBody;
    } else if (requestBody && dataType === "FormData") {
      formData = new FormData();
      appendToFormData(formData, data);
    }

    return this._httpClient
      .request<ApiResponseDto<T>>(method, url, { body: formData || requestBody })
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  getAll(query: ApiQueryDto): Observable<ApiListDto<T>> {
  return this._httpClient
    .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/all`, query)
    .pipe(
      map((response) => this.checkResponseStatus(response) ?? { items: [], total: 0, pageInfo: { currentPage: 1, totalPages: 1, pageSize: 10, totalItems: 0, pageIndex: 0 } })
    )
    .pipe(
      catchError((response: any) => throwError(() => response.error))
    );
}


  getPaged(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/page`, query)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(response.error))
      );
  }

  getAsList(): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/lookup/all`, {})
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response) => throwError(response.error))
      );
  }

  getListById(supplierId: string): Observable<ApiListDto<T>> {
    return this._httpClient
      .get<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(response.error))
      );
  }

  getById(supplierId: string): Observable<T> {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  getLookUpById(id: string) {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/lookup/${id}`)
      .pipe(
        map((response) => response),
        catchError((response: any) => throwError(response.error))
      );
  }

  add(data: T): Observable<T> {
    return this._httpClient
      .post<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  edit(data: T): Observable<T> {
    return this._httpClient
      .put<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  addForm(data: T): Observable<T> {
    const formData = new FormData();
    appendToFormData(formData, data);
    return this._httpClient
      .post<ApiResponseDto<T>>(`${this.baseUrl}/form`, formData)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  editForm(data: T): Observable<T> {
    const formData = new FormData();
    appendToFormData(formData, data);
    return this._httpClient
      .put<ApiResponseDto<T>>(`${this.baseUrl}/form`, formData)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  delete(supplierId: string) {
    return this._httpClient
      .delete<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

private checkResponseStatus(
  response: ApiResponseDto<ApiListDto<T>>
): ApiListDto<T> {
  if (response?.status === 200) {
    return getMappedData(response);
  } else {
    return {
      items: [],
      total: 0,
      pageInfo: { 
        currentPage: 1, 
        totalPages: 1, 
        pageSize: 10, 
        totalItems: 0, 
        pageIndex: 0 
      }
    } as ApiListDto<T>;
  }
}


}
