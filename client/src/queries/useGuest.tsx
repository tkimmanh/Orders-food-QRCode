import { guestApiRequest } from "@/apiRequest/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.nextServerLogin,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.nextServerLogout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order,
  });
};

export const useGuestOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrdersList,
    queryKey: ["guest-orders"],
  });
};
