import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
  CreateEmployeeAccountBodyType,
  AccountListResType,
  GetGuestListQueryParamsType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetListGuestsResType,
} from "@/schemaValidations/account.schema";
import queryString from "query-string";

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
  deleteEmployee(id: number) {
    return http.delete<AccountResType>(`${prefix}/detail/${id}`);
  }
  guestList(queryParams: GetGuestListQueryParamsType) {
    return http.get<GetListGuestsResType>(
      `${prefix}/guests?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toDateString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    );
  }
  createGuest(body: CreateGuestBodyType) {
    return http.post<CreateGuestResType>(`${prefix}/guests`, body);
  }
}
export const accountApiRequest = new AccountApiRequest();
