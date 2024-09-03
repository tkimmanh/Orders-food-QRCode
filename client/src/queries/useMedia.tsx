import { mediaRequest } from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationFn: mediaRequest.upload,
  });
};
