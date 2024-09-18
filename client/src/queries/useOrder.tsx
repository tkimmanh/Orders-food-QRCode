import { orderApiRequest } from "@/apiRequest/order";
import {
  GetOrdersQueryParamsType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & { orderId: number }) =>
      orderApiRequest.updateOrder(orderId, body),
  });
};

export const useOrderListOwnerQuery = (
  queryParams: GetOrdersQueryParamsType
) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderList(queryParams),
    queryKey: ["orders", queryParams],
  });
};

export const useGetOrderDetailQuery = ({
  orderId,
  enabled,
}: {
  orderId: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(orderId),
    enabled: enabled,
    queryKey: ["order", orderId],
  });
};
