"use client";

import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestOrderListQuery();
  const orders = useMemo(() => data?.payload.data || [], [data]);
  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      return result + order.dishSnapshot.price * order.quantity;
    }, 0);
  }, [orders]);

  useEffect(() => {
    if (socket.connected) {
      onDisconnect();
    }
    function onConnect() {
      console.log(socket.id);
    }
    function onDisconnect() {
      console.log("socket disconnect");
    }
    function onUpdateOrder(data: UpdateOrderResType) {
      const {
        dishSnapshot: { name },
        status,
        quantity,
      } = data.data;
      toast({
        title: "Thông báo",
        description: `Món ${name} (SL: ${quantity} ) đã được cập nhật thành ${getVietnameseOrderStatus(
          status
        )}`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, [refetch]);

  return (
    <div className="w-full max-w-[600px] ">
      {orders.map((order, index) => (
        <div
          className="flex gap-4 my-5 p-3 border border-gray-900 rounded"
          key={order.id}
        >
          <div className="">{index + 1}</div>
          <div className="flex-shrink-0">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{"  "}
              <Badge>{order.quantity}</Badge>
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"secondary"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <Badge className="flex justify-between text-sm bg-white text-black font-semibold px-3 py-1 rounded">
        <span>Tổng món · {orders.length} món</span>
        <span>{formatCurrency(totalPrice)}</span>
      </Badge>
    </div>
  );
};

export default OrdersCart;
