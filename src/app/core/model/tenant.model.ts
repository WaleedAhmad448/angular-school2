export interface TenantStatus {
  isValid: boolean;
  trnantInfo: {
    tenant_id: string;
    tenant_identifier: string;
    tenant_name: string;
    tenant_status: string;
  };
}
