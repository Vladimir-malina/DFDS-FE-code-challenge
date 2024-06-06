import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "~/utils";
import { type VoyageFormData } from "~/components/voyageForm";
import { formatISO } from "date-fns";

const mapData = (voyage: VoyageFormData) => ({
  ...voyage,
  departure: formatISO(voyage.departure),
  arrival: formatISO(voyage.arrival),
})

export const useCreateVoyage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voyage: VoyageFormData) => postData('voyage/create', mapData(voyage)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["voyages"] });
    },
    onError: (error) => {
      console.error('Error creating voyage:', error);
    },
  });
};