import { dishesApiRequest } from "@/apiRequest/dishe";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useListDishes = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: dishesApiRequest.list,
  });
};

export const useGetDishDetail = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishesApiRequest.getDish(id),
    enabled: enabled,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishesApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishesApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
        exact: true,
      });
    },
  });
};
