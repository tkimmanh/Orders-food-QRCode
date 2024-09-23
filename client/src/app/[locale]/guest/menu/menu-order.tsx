"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useListDishes } from "@/queries/useDishe";
import Quantity from "./quantity";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";

export default function MenuOrder() {
  const { data } = useListDishes();
  const dishes = useMemo(() => data?.payload.data || [], [data]);
  const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      // tìm xem dish có trong order không
      const order = orders.find((item) => item.dishId === dish.id);
      // nếu không có thì trả về giá trị cũ
      if (!order) return result;
      // nếu có thì cộng thêm giá trị mới
      return result + dish.price * order.quantity;
    }, 0);
  }, [orders, dishes]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrder((prev) => {
      // nếu quantity = 0 thì xóa dish đó khỏi order
      if (quantity === 0) {
        return prev.filter((item) => item.dishId !== dishId);
      }
      // tìm xem dish đã có trong order chưa (nếu có thì trả về index, không thì trả về -1)
      const index = prev.findIndex((item) => item.dishId === dishId);
      // nếu dish chưa có trong order thì thêm vào
      if (index === -1) {
        return [...prev, { dishId, quantity }];
      }
      // có rồi thì cập nhật quantity
      const newOrder = [...prev];
      newOrder[index] = { ...newOrder[index], quantity };

      // trả về order mới
      return newOrder;
    });
  };
  const hanleOrders = async () => {
    try {
      await mutateAsync(orders);
      router.push("/guest/orders");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn(
              "flex gap-4",
              dish.status === DishStatus.Unavailable
                ? "pointer-events-none"
                : ""
            )}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span className="absolute inset-0 flex items-center justify-center text-sm bg-black bg-opacity-45">
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((item) => item.dishId === dish.id)?.quantity || 0
                }
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={hanleOrders}
          disabled={orders.length === 0}
        >
          <span>Giỏ hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
