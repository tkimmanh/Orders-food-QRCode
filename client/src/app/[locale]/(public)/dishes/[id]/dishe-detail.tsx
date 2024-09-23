import { dishesApiRequest } from "@/apiRequest/dishe";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import { DishResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import React from "react";

const DishesDetail = async ({
  dish,
}: {
  dish: DishResType["data"] | undefined;
}) => {
  if (!dish) {
    return <div>Không tìm thấy món ăn</div>;
  }
  return (
    <div className="spacc-y-4 ">
      <div className="flex items-center flex-col">
        <h1 className="text-2xl lg:text-3xl font-semibold my-4 ">
          {dish.name}
        </h1>
        <div className="font-semibold mb-5">
          Giá : {formatCurrency(dish.price)}
        </div>
        <Image
          src={dish.image}
          width={700}
          height={700}
          quality={100}
          alt={dish.name}
          className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
        />
        <p className="mt-5">{dish.description}</p>
      </div>
    </div>
  );
};

export default DishesDetail;
