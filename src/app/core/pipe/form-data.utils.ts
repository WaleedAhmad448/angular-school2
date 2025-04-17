export function appendToFormData(formData: FormData, data: any, parentKey?: string): void {
  if (data && typeof data === 'object' && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      if (value instanceof File) {
        formData.append(formKey, value);
      } else if (value instanceof Date) {
        formData.append(formKey, value.toISOString());
      } else if (typeof value === 'object' && value !== null) {
        appendToFormData(formData, value, formKey); // ✅ معالجة الكائنات المتداخلة
      } else {
        formData.append(formKey, value);
      }
    });
  } else {
    formData.append(parentKey || 'file', data); // ✅ إضافة البيانات العادية
  }
}