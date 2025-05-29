import { environment } from "src/environments/environment";

export interface SanedResponse<Type> {
  status: number;
  title: string;
  errors: SanedError;
  data: Type;
  lookupsV2: any;
  lookups: any;
}
export interface SanedList<Type> {
  items: Type[];
  pageInfo: {
    totalPages: number;
    totalItems: number;
    pageIndex: number;
    pageSize: number;
  };
}

export interface SanedError {
  [key: string]: string[];
}

export interface SanedQuery {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  filters?: { [key: string]: FilterValue };
  orders?: { [key: string]: OrderValue };
}

export interface LookUpResult {
  id: string;
  text: string;
  kv?: any;
}
export interface CountryLookupList {
  flag: string;
  nationality: string;
  countryCode: string;
  dailPatterns: string;
}
export interface LookupList<T = { [key: string]: string }> {
  id: string;
  text: string;
  kv: T;
}
export enum SanedFilterConditionValue {
  Equal = 0,
  GreaterThan = 1,
  GreaterThanOrEqual = 2,
  IN = 3,
  LessThen = 4,
  LessThenorEqual = 5,
  NotEqual = 6,
  NotIN = 7,
  REGEX = 8,
}

export enum SanedOrdersConditionsValue {
  ASEC = 0,
  DESC = 1,
}


export interface FilterValue {
  value: any;
  level?: number;
  conOp?: SanedFilterConditionValue;
  logOp?: number;
}

export interface OrderValue {
  value: SanedOrdersConditionsValue;
}

export const getMappedData = (
  res: SanedResponse<SanedList<any>>
): SanedList<any> => {
//
  const camelize = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };
  if (res.lookupsV2 && res.lookupsV2.length > 0) {
    res.lookupsV2.forEach(
      (lookup: {
        key: string;
        props: string[];
        dic: {
          [key: string]: LookUpResult;
        };
      }) => {
        lookup.props
          .map((k) => camelize(k))
          .map((k) => ({
            idProp: k,
            mapProp: k.endsWith("Id") ? k.slice(0, k.length - 2) : k,
          }))
          .forEach((ks) => {
            res.data.items.forEach((row) => {
              let mval = lookup.dic[row[ks.idProp]];
              if (mval) {
                row[ks.mapProp] = mval;
              } else {
              }
            });
          });
      }
    );
  }
//

  return res.data;
};

export const getBaseUrl = () => {
  let origin = "";
  if (environment.production) {
    origin = window.location.origin;
  } else {
    const tenant = getTenantFromSubdomain();
    origin = `${tenant}${environment.apiUrl}`;
  }
  return `${origin}`;
};
const getTenantFromSubdomain = () => {
    const host = window.location.origin.split('://')[1];
    const subdomainList = host.split('.');
    if (subdomainList.length > 1) {
      return subdomainList[0];
    }else{
      return environment.apiBaseUrl;
    }
};

export interface ApiResponseDto<Type> {
  status: number;
  title: string;
  errors: ApiErrorDto;
  data: Type;
  lookupsV2: any;
  lookups: any;
}
export interface ApiListDto<Type> {
  items: Type[];
  pageInfo: PageInfo;
  page?: PageInfo;
}

export interface PageInfo {
  totalPages: number;
  totalItems: number;
  pageIndex: number;
  pageSize: number;
}

export interface ApiErrorDto {
  [key: string]: string[];
}

export interface ApiQueryDto {
  pageSize?: number;
  pageIndex?: number;
  search?: string;
  filters?: { [key: string]: FilterValue };
  orders?: OrderQuery;
}

export interface OrderQuery {
  [key: string]: 0 | 1; // 0 = ASEC, 1 = DESC
}

export interface QueryFilters {
  [key: string]: {
    value: string | null;
    level?: number;
    conOp?: number;
    logOp?: number;
  };
}
export enum ApiFilterConditionValue {
  Equal = 0,
  GreaterThan = 1,
  GreaterThanOrEqual = 2,
  IN = 3,
  LessThen = 4,
  LessThenorEqual = 5,
  NotEqual = 6,
  NotIN = 7,
  REGEX = 8,
}

export enum ApiOrdersConditionsValue {
  ASEC = 0,
  DESC = 1,
}


export const appendToFormData = (
    formData: FormData,
    data: any,
    parentKey: string = ""
  ) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const currentKey = parentKey ? `${parentKey}[${key}]` : key;
        console.log(value);
        if (value instanceof Blob || value instanceof File) {
          // Handle Blob and File types
          formData.append(currentKey, value);
        } else if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays
            value.forEach((item, index) => {
              appendToFormData(formData, { [index]: item }, `${currentKey}`);
            });
          } else {
            // Handle nested objects
            appendToFormData(formData, value, currentKey);
          }
        } else {
          // Handle primitive values
          formData.append(currentKey, value);
        }
      }
    }
  };
export const removeNullFieldValues = (object: any): any => {
    if (typeof object !== "object" || object === null) {
      return object;
    }

    if (object instanceof File || object instanceof Blob) {
      // Don't modify File or Blob objects
      return object;
    }

    if (Array.isArray(object)) {
      return object.map(removeNullFieldValues);
    }

    const newObject: any = {};
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];
        if (value !== null) {
          if (typeof value === "object") {
            newObject[key] = removeNullFieldValues(value);
          } else {
            newObject[key] = value;
          }
        }
      }
    }

    return newObject;
  };

export const removeNullOrEmptyFieldValues = (object: any): any => {
    if (typeof object !== "object" || object === null) {
      return object;
    }

    if (object instanceof File || object instanceof Blob) {
      // Don't modify File or Blob objects
      return object;
    }

    if (Array.isArray(object)) {
      return object.map(removeNullOrEmptyFieldValues);
    }

    const newObject: any = {};
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];
        if (value !== null && value != "") {
          if (typeof value === "object") {
            newObject[key] = removeNullOrEmptyFieldValues(value);
          } else {
            newObject[key] = value;
          }
        }
      }
    }

    return newObject;
  };
