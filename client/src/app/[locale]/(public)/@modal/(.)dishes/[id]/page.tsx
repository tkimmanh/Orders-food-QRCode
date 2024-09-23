import { dishesApiRequest } from "@/apiRequest/dishe";
import { wrapServerApi } from "@/lib/utils";
import React from "react";
import ModalDishDetail from "./modal";
import DishesDetail from "@/app/[locale]/(public)/dishes/[id]/dishe-detail";

const DishesPage = async ({ params: { id } }: { params: { id: string } }) => {
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload.data;
  if (!dish) {
    return <div>Không tìm thấy món ăn</div>;
  }
  return (
    <ModalDishDetail>
      <DishesDetail dish={dish}></DishesDetail>
    </ModalDishDetail>
  );
};

export default DishesPage;
