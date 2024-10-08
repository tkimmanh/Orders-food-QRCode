"use client";

import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestOrderListQuery } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestOrderListQuery();
  const { socket } = useAppStore((state) => state);
  const orders = useMemo(() => data?.payload.data || [], [data]);
  const { watingForPlaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            watingForPlaying: {
              price:
                result.watingForPlaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.watingForPlaying.quantity + order.quantity,
            },
          };
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              ...result,
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        watingForPlaying: {
          price: 0,
          quantity: 0,
        },
        paid: {
          price: 0,
          quantity: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (!socket) return;

    if (socket?.connected) {
      onDisconnect();
    }
    function onConnect() {
      console.log(socket?.id);
    }
    function onDisconnect() {
      console.log("socket disconnect");
    }
    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        status,
        quantity,
      } = data;
      toast({
        title: "Thông báo",
        description: `Món ${name} (SL: ${quantity} ) đã được cập nhật thành ${getVietnameseOrderStatus(
          status
        )}`,
      });
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast({
        description: `Hóa đơn của bạn '#${guest?.name}' đã được thanh toán`,
      });
      refetch();
    }

    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("payment", onPayment);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
      socket.off("payment", onPayment);
    };
  }, [refetch, socket]);

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
      <div className="flex flex-col gap-y-5">
        <Badge className="flex justify-between text-sm bg-white text-black font-semibold px-3 py-1 rounded">
          <span> Đơn chưa thanh toán· {watingForPlaying.quantity} món</span>
          <span>{formatCurrency(watingForPlaying.price)}</span>
        </Badge>

        {paid.quantity > 0 && (
          <div className="flex justify-between text-lg text-white font-semibold px-3 py-1 rounded">
            <span>Đã thanh toán· {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersCart;
