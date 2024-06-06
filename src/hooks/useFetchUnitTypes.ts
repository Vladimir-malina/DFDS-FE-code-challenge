import { type UnitType } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '~/utils';


export const useFetchUnitTypes = () => {
  return useQuery<UnitType[]>({
    queryKey: ['unitTypes'],
    queryFn: () => fetchData('unitType/getAll'),
  });
};