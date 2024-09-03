import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

class AccountApiRequest {
  async me() {
    return http.get<AccountResType>("accounts/me");
  }
}
export const accountApiRequest = new AccountApiRequest();
