import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import Select from "react-select";


import { useCreateVoyage } from "~/hooks/useCreateVoyage";
import { InputWrapper } from "./inputWrapper";
import { useFetchVessels } from "~/hooks/useFetchVessels";
import { useFetchUnitTypes } from "~/hooks/useFetchUnitTypes";
import { Form } from "./ui/form";
import { type Dispatch } from "react";
import { type SetStateAction } from "react";
import { Input } from "./ui/input";


type SelectOption = {
  value: string;
  label: string;
};

const formSchema = z.object({
  departure: z.string().min(1, "Departure is required"),
  arrival: z.string().min(1, "Arrival is required"),
  portOfLoading: z.string().min(1, "Port of loading is required"),
  portOfDischarge: z.string().min(1, "Port of discharge is required"),
  vessel: z.string().min(1, "Vessel is required"),
  unitTypes: z.string().array().min(1, "Unit types are required"),
}).refine((data) => new Date(data.departure) < new Date(data.arrival), {
  message: 'Departure date and time should be before arrival date and time',
  path: ['arrival'],
});

export type VoyageFormData = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
  setToastMessage: Dispatch<SetStateAction<{message: string | null, isError?: boolean}>>;
}

const VoyageForm: React.FC<Props> = ({onClose, setToastMessage}) => {

  const form = useForm<VoyageFormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;

  const { mutate } = useCreateVoyage();
  const { data: vessels, isLoading: vesselsLoading } = useFetchVessels();
  const { data: unitTypes, isLoading: unitTypesLoading } = useFetchUnitTypes();

  const onSubmit: SubmitHandler<VoyageFormData> = (data) => {
    mutate(data, {
      onSuccess: () => {
        setToastMessage({message: 'Voyage created successfully', isError: false});
        form.reset();
      },
      onError: () => {
        setToastMessage({message: 'Error creating voyage', isError: true});
      },
    });
    onClose()
  };

  const handleVesselChange = (selectedOption: SelectOption) => {
    setValue("vessel", selectedOption.value);
  };

  const handleUnitTypeChange = (selectedOptions: Array<SelectOption>) => {
    setValue(
      "unitTypes",
      selectedOptions.map((option: SelectOption) => option.value),
    );
  };

  if (vesselsLoading || unitTypesLoading) {
    return <div>Loading...</div>;
  }
  console.log('control---', control)
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <InputWrapper label="Departure" errorMessage={errors.departure?.message} required>
          <Input type="datetime-local" {...register("departure")}/>
        </InputWrapper>
        <InputWrapper label="Arrival" errorMessage={errors.arrival?.message} required>
          <Input type="datetime-local" {...register("arrival")}/>
        </InputWrapper>
        <InputWrapper label="Port of Loading" errorMessage={errors.portOfLoading?.message} required>
          <Input type="text" {...register("portOfLoading")}/>
        </InputWrapper>
        <InputWrapper label="Port of Discharge" errorMessage={errors.portOfDischarge?.message} required>
          <Input type="text" {...register("portOfDischarge")}/>
        </InputWrapper>
        <InputWrapper label="Vessel" errorMessage={errors.vessel?.message} required>
          <Controller 
              name='vessel'
              control={control}
                render={() => (
                  <Select
                    options={vessels?.map((vessel) => ({
                    value: vessel.value,
                    label: vessel.label,
                  }))}
                  onChange={handleVesselChange}
                  />
                )}
            />
        </InputWrapper>
        <InputWrapper label="Unit Types" errorMessage={errors.unitTypes?.message} required>
          <Controller 
            name='unitTypes'
            control={control}
              render={() => (
                <Select
                 options={unitTypes?.map((unitType) => ({
                 value: unitType.id,
                 label: unitType.name,
                 }))}
                 isMulti
                  onChange={handleUnitTypeChange}
                 />
              )}
          />
        </InputWrapper>
        <Button type="submit">Submit</Button>
      </form>
   </Form>
  );
};

export default VoyageForm;


