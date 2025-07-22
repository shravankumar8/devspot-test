import { Technologies } from "@/types/entities";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

const fetchTechnologies = async (url: string) => {
  const resp = await axios.get(url);
  const data = resp?.data as Technologies[];
  return data.map((tech) => ({
    value: tech.slug,
    label: tech.name,
  }));
};

export const useTechnologyTags = () => {
  const [technologyDropdownValues, setTechnologyDropdownValues] = useState<
    string[]
  >([]);

  const { data: technologyTags, isLoading: isFetchingTechnologies } = useSWR(
    `/api/technology-tags`,
    fetchTechnologies
  );

  return {
    technologyDropdownValues,
    technologyTags,
    isFetchingTechnologies,
    setTechnologyDropdownValues,
  };
};
