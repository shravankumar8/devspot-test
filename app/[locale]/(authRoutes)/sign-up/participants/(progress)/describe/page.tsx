"use client";

import Chip from "@/components/common/Chip";
import RolesDropdown from "@/components/common/RolesDropdown";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import { getRoleName } from "@/utils/roles";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Describe() {
  const { setActiveStep, setUserId } = useSignupStore();
  const router = useRouter();
  const [isAddingRoles, setIsAddingRoles] = useState(false);
  const [roleTouched, setRoleTouched] = useState(false);
  const [mainRole, setMainRole] = useState<number | null>(null);
  const [userRoles, setUserRoles] = useState<number[]>([]);

  const handleAddRoles = async (e: any) => {
    e.preventDefault();
    setIsAddingRoles(true);

    const payload = {
      ids: userRoles,
      primaryRoleId: mainRole ?? undefined,
    };

    try {
      const response = await axios.put("/api/profile/roles", payload);

      setUserId(response?.data?.id);
      router.push("/sign-up/participants/select-avatar");
    } catch (error: any) {
      console.log("Error updating roles image:", error);
      setIsAddingRoles(false);
    }
  };

  useEffect(() => {
    setActiveStep(2);
  }, []);

  return (
    <div className="flex flex-col gap-7 mt-[100px] md:mt-[155px] w-[90vw] sm:w-[500px]">
      <h4 className="font-bold text-[22px] sm:text-[28px] md:text-[32px] leading-[28px] sm:leading-[32px]">
        How would you describe yourself?
      </h4>
      <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
        Select all that apply.
      </p>

      <RolesDropdown
        value={userRoles}
        mainRole={mainRole}
        setMainRole={setMainRole}
        onChange={(selectedValues) => {
          setRoleTouched(true);
          setUserRoles(selectedValues as number[]);
        }}
      />

      <p className="font-roboto font-medium text-[#89898C] text-sm sm:text-base">
        Select the role you want highlighted on your profile.
      </p>

      <div className="flex gap-3">
        {userRoles?.map((role) => (
          <Chip
            name="main_role"
            key={role}
            variant={role === mainRole ? "gradient" : "outlined"}
            checked={role === mainRole}
            value={role}
            onChange={(value) => setMainRole(value)}
            onClick={(value) => setMainRole(value)}
          >
            {getRoleName(role)}
          </Chip>
        ))}
      </div>

      <div className="flex justify-end w-full">
        <Button
          type="submit"
          onClick={handleAddRoles}
          disabled={isAddingRoles || !mainRole || !userRoles.length}
          className="flex gap-2 font-roboto !text-base"
        >
          {isAddingRoles && <Spinner size="small" />} Continue
        </Button>
      </div>
    </div>
  );
}
