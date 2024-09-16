import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const prefix = "dishes";

class DishesApiRequest {
  // nextjs 15 fetch default là "no-store": nghĩa là không lưu cache , đồng nghĩa với việc là dynamic rendering page
  // nextjs 14 fetch default là "force-cache": nghĩa là lưu cache , đồng nghĩa với việc là static rendering page
  list() {
    return http.get<DishListResType>(prefix, {
      next: { tags: ["dishes-tag"] },
    });
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
