import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

class AccountApiRequest {
  me() {
    return http.get<AccountResType>("accounts/me");
  }
  updateMe(data: UpdateMeBodyType) {
    return http.put<AccountResType>("accounts/me", data);
  }
  changePassword(body: ChangePasswordBodyType) {
    return http.put<AccountResType>("accounts/change-password", body);
  }
}
export const accountApiRequest = new AccountApiRequest();
