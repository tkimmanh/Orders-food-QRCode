import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
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
  createOrder(body: CreateOrdersBodyType) {
    return http.post<CreateOrdersResType>("/orders", body);
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
