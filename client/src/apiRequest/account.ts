import http from "@/lib/http";
import {
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

class AccountApiRequest {
  me() {
    return http.get<AccountResType>("accounts/me");
  }
  updateMe(data: UpdateMeBodyType) {
    return http.put<AccountResType>("accounts/me", data);
  }
}
export const accountApiRequest = new AccountApiRequest();
