import http from "@/lib/http";
import {
  GetOrdersResType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";

class OrderApiRequest {
  getOrderList() {
    return http.get<GetOrdersResType>("/orders");
  }
  updateOrder(orderId: number, body: UpdateOrderBodyType) {
    return http.put(`/orders/${orderId}`, body);
  }
}
export const orderApiRequest = new OrderApiRequest();
