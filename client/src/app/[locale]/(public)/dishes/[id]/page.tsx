import { dishesApiRequest } from "@/apiRequest/dishe";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import DishesDetail from "./dishe-detail";

const DishesPage = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;
  if (!dish) {
    return <div>Không tìm thấy món ăn</div>;
  }
  return <DishesDetail dish={dish}></DishesDetail>;
};

export default DishesPage;
