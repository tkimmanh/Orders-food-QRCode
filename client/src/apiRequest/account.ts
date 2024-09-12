import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
  CreateEmployeeAccountBodyType,
  AccountListResType,
} from "@/schemaValidations/account.schema";

const prefix = "accounts";
class AccountApiRequest {
  me() {
    return http.get<AccountResType>(`${prefix}/me`);
  }
  updateMe(body: UpdateMeBodyType) {
    return http.put<AccountResType>(`${prefix}/me`, body);
  }
  changePassword(body: ChangePasswordBodyType) {
    return http.put<AccountResType>(`${prefix}/change-password`, body);
  }
  list() {
    return http.get<AccountListResType>(`${prefix}`);
  }
  addEmployee(body: CreateEmployeeAccountBodyType) {
    return http.post<AccountResType>(`${prefix}`, body);
  }
  updateEmployee(id: number, body: UpdateEmployeeAccountBodyType) {
    return http.put<AccountResType>(`${prefix}/detail/${id}`, body);
  }
  getEmployee(id: number) {
    return http.get<AccountResType>(`${prefix}/detail/${id}`);
  }
  deleteEmployee(id: string) {
    return http.delete<AccountResType>(`${prefix}/${id}`);
  }
}
export const accountApiRequest = new AccountApiRequest();
