import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment"; // ✅ استيراد environment
import { appendToFormData } from '../pipe/form-data.utils'; // ✅ استيراد الدالة

import {
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
  private path: string | undefined;

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient, private _tenant: TenantService) {
    this._initBaseUrl();
  }

  /**
   * Initialize the service with module, entity, and optional path
   */
  _initService(module: string, entity: string, path?: string | undefined) {
    this.module = module;
    this.entity = entity;
    this.path = path;
    this._initBaseUrl();
  }

  /**
   * Initialize the base URL using environment.apiBaseUrl
   */
  _initBaseUrl() {
    const path = this.path && this.path !== "" ? `/${this.path}` : "";
    this.baseUrl = `${environment.apiBaseUrl}${this.module}/${this.entity}${path}`; // ✅ استخدام environment.apiBaseUrl
  }

  /**
   * Fetch data from the API
   */
  fetchData(
    method: HttpMethodType,
    endpoint: string,
    data?: any,
    dataType: "JSON" | "FormData" = "JSON",
    options?: string[][] | Record<string, string> | string | URLSearchParams
  ): Observable<T> {
    let url = `${this.baseUrl}/${endpoint}`;

    if (method === HttpMethod.GET && options) {
      const queryString = new URLSearchParams(options);
      url += `?${queryString.toString()}`;
    }

    const requestBody = method === HttpMethod.POST || method === HttpMethod.PUT ? data : undefined;

    let formData: FormData | undefined;
    if (requestBody && dataType === "FormData") {
      formData = new FormData();
      appendToFormData(formData, data); // ✅ استخدام دالة مساعدة لإضافة البيانات إلى FormData
    }

    return this._httpClient
      .request<ApiResponseDto<T>>(method, url, {
        body: formData || requestBody,
        headers: dataType === "FormData" ? {} : { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }
  /**
   * Get all data
   */
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
// getAll(query: ApiQueryDto): Observable<any[]> {
//   return this._httpClient
//     .post<ApiResponseDto<ApiListDto<any>>>(`${this.baseUrl}/all`, query)
//     .pipe(
//       map((response) => this.checkResponseStatus(response)?.items ?? []) // ✅ تحويل ApiListDto إلى any[]
//     )
//     .pipe(
//       catchError((response: any) => throwError(() => response.error))
//     );
// }
  /**
   * Get paged data
   */
  getPaged(query: ApiQueryDto): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/page`, query)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Get data as a list
   */
  getAsList(): Observable<ApiListDto<T>> {
    return this._httpClient
      .post<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/lookup/all`, {})
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response) => throwError(response.error))
      );
  }

  /**
   * Get list by ID
   */
  getListById(supplierId: string): Observable<ApiListDto<T>> {
    return this._httpClient
      .get<ApiResponseDto<ApiListDto<T>>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => this.checkResponseStatus(response)),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Get data by ID
   */
  getById(supplierId: string): Observable<T> {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Get lookup data by ID
   */
  getLookUpById(id: string) {
    return this._httpClient
      .get<ApiResponseDto<T>>(`${this.baseUrl}/lookup/${id}`)
      .pipe(
        map((response) => response),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Add new data
   */
  add(data: T): Observable<T> {
    return this._httpClient
      .post<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Edit existing data
   */
  edit(data: T): Observable<T> {
    return this._httpClient
      .put<ApiResponseDto<T>>(`${this.baseUrl}`, data)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Add data using FormData
   */
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

  /**
   * Edit data using FormData
   */
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

  /**
   * Delete data by ID
   */
  delete(supplierId: string) {
    return this._httpClient
      .delete<ApiResponseDto<T>>(`${this.baseUrl}/${supplierId}`)
      .pipe(
        map((response) => response.data),
        catchError((response: any) => throwError(response.error))
      );
  }

  /**
   * Check the response status and return mapped data
   */
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

 private appendToFormData(formData: FormData, data: any, parentKey?: string): void {
    if (data && typeof data === 'object' && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        const formKey = parentKey ? `${parentKey}[${key}]` : key;
        if (value instanceof File) {
          formData.append(formKey, value);
        } else if (value instanceof Date) {
          formData.append(formKey, value.toISOString());
        } else if (typeof value === 'object' && value !== null) {
          this.appendToFormData(formData, value, formKey); // ✅ معالجة الكائنات المتداخلة
        } else {
          formData.append(formKey, value);
        }
      });
    } else {
      formData.append(parentKey || 'file', data); // ✅ إضافة البيانات العادية
    }
  }
}