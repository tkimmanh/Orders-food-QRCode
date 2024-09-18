import http from "@/lib/http";
import {
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

class OrderApiRequest {
  getOrderList(queryParams: GetOrdersQueryParamsType) {
    return http.get<GetOrdersResType>(
      "/orders?" +
        queryString.stringify({
          formDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        })
    );
  }
  updateOrder(orderId: number, body: UpdateOrderBodyType) {
    return http.put<UpdateOrderResType>(`/orders/${orderId}`, body);
  }
  getOrderDetail(orderId: number) {
    return http.get<GetOrderDetailResType>(`/orders/${orderId}`);
  }
  pay(body: PayGuestOrdersBodyType) {
    return http.post<PayGuestOrdersResType>(`/orders/pay`, body);
  }
}
export const orderApiRequest = new OrderApiRequest();
