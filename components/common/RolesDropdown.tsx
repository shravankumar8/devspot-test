import { Option } from "@/types/common";
import { ParticipantRoles } from "@/types/entities";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import useSWR from "swr";
import { MultiSelect } from "./form/select/multi";

interface RolesDropdownProps {
  value: number[];
  mainRole: number | null;
  placeholder?: string;
  setMainRole: Dispatch<SetStateAction<number | null>>;
  onChange: (value: (string | number)[]) => void;
}

const RolesDropdown = (props: RolesDropdownProps) => {
  const { mainRole, onChange, setMainRole, value, placeholder } = props;

  async function getParticipantSubRoleOptions(url: string): Promise<Option[]> {
    try {
      const response = await axios.get<ParticipantRoles[]>(url);

      const options: Option[] = response?.data.map((role) => ({
        value: role.id,
        label: role.name,
      }));

      return options;
    } catch (error) {
      console.error("Error fetching Roles:", error);
      return [];
    }
  }

  const { data: participantRoles, isLoading: isParticipantRolesFetching } =
    useSWR<Option[]>(`/api/profile/roles`, getParticipantSubRoleOptions);

  return (
    <MultiSelect
      showCheckboxes
      isSearchable={true}
      options={participantRoles ?? []}
      isLoading={isParticipantRolesFetching}
      value={value}
      doubleClickedItem={mainRole}
      placeholder={placeholder ?? "What is your role?"}
      onChange={onChange}
      onDoubleClickItem={(value) => {
        setMainRole(value as number | null);
      }}
    />
  );
};

export default RolesDropdown;
