import { useQuery } from '@tanstack/react-query';
import { fetchData } from '~/utils';

type Vessel = {
  value: string;
  label: string;
}

export const useFetchVessels = () => {
  return useQuery<Vessel[]>({
    queryKey: ['vessels'],
    queryFn: () => fetchData('vessel/getAll'),
  });
};