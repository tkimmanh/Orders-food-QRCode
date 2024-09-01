import { authApiRequest } from "@/app/apiRequest/auth";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApiRequest.clientLogin,
  });
};
