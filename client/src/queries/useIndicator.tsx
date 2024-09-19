import { indicatorApiRequest } from "@/apiRequest/indicator";
import { useQuery } from "@tanstack/react-query";
import { DashboardIndicatorQueryParamsType } from "../schemaValidations/indicator.schema";

export const useIndicatorQuery = (
  params: DashboardIndicatorQueryParamsType
) => {
  return useQuery({
    queryKey: ["indicator", params],
    queryFn: () => indicatorApiRequest.getDoashboard(params),
  });
};
