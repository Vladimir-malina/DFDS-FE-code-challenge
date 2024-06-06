import { fetchData } from "~/utils";

export const fetchUnitTypes = async () => {
  return fetchData("unitType/getAll");
};

export const fetchVessels = async () => {
  return fetchData("vessel/getAll");
};