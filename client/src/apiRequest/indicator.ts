import http from "@/lib/http";
import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType,
} from "@/schemaValidations/indicator.schema";
import queryString from "query-string";

class IndicatorApiRequest {
  getDoashboard(params: DashboardIndicatorQueryParamsType) {
    return http.get<DashboardIndicatorResType>(
      "/indicators/dashboard?" +
        queryString.stringify({
          fromDate: params.fromDate.toISOString(),
          toDate: params.toDate.toISOString(),
        })
    );
  }
}

export const indicatorApiRequest = new IndicatorApiRequest();
