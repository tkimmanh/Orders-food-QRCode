import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const prefix = "dishes";
class DishesApiRequest {
  list() {
    return http.get<DishListResType>(prefix);
  }
  add(body: CreateDishBodyType) {
    return http.post<DishResType>(prefix, body);
  }
  getDish(id: number) {
    return http.get<DishResType>(`${prefix}/${id}`);
  }
  update(id: number, body: UpdateDishBodyType) {
    return http.put<DishResType>(`${prefix}/${id}`, body);
  }
  deleteDish(id: number) {
    return http.delete<DishResType>(`${prefix}/${id}`);
  }
}
export const dishesApiRequest = new DishesApiRequest();
