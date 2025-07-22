import { MultiSelect } from "@/components/common/form/select/multi";
import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import UseModal from "@/hooks/useModal";
import {
  HackathonChallenges,
  HackathonVipRoles,
  HackathonVips,
} from "@/types/entities";
import { getInitials } from "@/utils/url-validator";
import axios from "axios";
import { Calendar, Crown, InfoIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useVIPsForm, VIP } from "./useEditVips";
import VIPsDropdown from "./vipUsersDropdown";

const positionOptions = [
  { label: "Judge", value: "judge" },
  { label: "Mentor", value: "mentor" },
  // { label: "Speaker", value: "speaker" },
  // { label: "Sponsor", value: "sponsor" },
];

export const EditVIPs = ({ hackathonId }: { hackathonId: number }) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const fetchVips = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const [vipsData, setVipsData] = useState<VIP[]>([]);

  const { data, isLoading: isFetchVipsLoading } = useSWR(
    `/api/hackathons/${hackathonId}/vips`,
    fetchVips
  );

  useEffect(() => {
    const formattedData = data?.map((item: HackathonVips) => {
      // Extract role names from the nested structure
      const roles =
        item.hackathon_vip_roles?.map(
          (role: HackathonVipRoles) => role.roles?.name
        ) || [];

      return {
        ...item,
        id: item.user_id || Date.now(),
        hackathon_vip_roles: roles, //
        users: item.users,
      };
    });

    setVipsData(formattedData);
  }, [data]);

  const {
    formik,
    addVIP,
    removeVIP,
    updateVIPRoles,
    updateJudgeChallenges,
    toggleFeatured,
    updateOfficeHours,
    inviteByEmail,
  } = useVIPsForm(vipsData, hackathonId, onClose);

  const handleEmailKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formik.values.inviteEmail) {
      e.preventDefault();
      inviteByEmail(formik.values.inviteEmail);
    }
  };

  const fetchHackathonChallenges = async (url: string) => {
    try {
      const response = await axios.get<{
        data: {
          items: HackathonChallenges[];
        };
      }>(url);

      return (
        response?.data?.data?.items.map((challenge) => ({
          value: challenge.id,
          label: challenge.label || challenge.challenge_name,
        })) || []
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: hackathonChallenges = [], isLoading: isFetchingChallenges } =
    useSWR(
      `/api/hackathons/${hackathonId}/challenges?as=options`,
      fetchHackathonChallenges
    );

  const featuredCount = formik.values.vips.filter(
    (vip) => vip.is_featured
  ).length;

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="absolute top-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit VIPs
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col overflow-y-scroll"
      >
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Add judges, speakers, mentors, and sponsors to your hackathon.
        </p>

        {/* Search Input */}
        <VIPsDropdown
          hackathonId={hackathonId}
          selectedVIPs={formik.values.vips}
          handleAddUser={(user) => {
            const newVIP: VIP = {
              id: Date.now(), // Temporary ID
              created_at: new Date().toISOString(),
              hackathon_id: hackathonId,
              office_hours: null,
              updated_at: new Date().toISOString(),
              user_id: user.id,
              hackathon_vip_roles: [],
              is_featured: false,
              users: user,
            };
            formik.setFieldValue("vips", [...formik.values.vips, newVIP]);
            formik.setFieldValue(`judgeChallenges.${newVIP.id}`, []);
          }}
        />

        {/* Can't find section */}
        <div className="mb-4">
          <p className="text-secondary-text text-sm mt-4 mb-2 font-roboto">
            Can't find who you're looking for?
          </p>
          <Input
            placeholder="Enter their email and we'll send them an invite"
            value={formik.values.inviteEmail}
            onChange={formik.handleChange("inviteEmail")}
            onKeyDown={handleEmailKeyPress}
          />
        </div>

        {/* Info message */}
        <div className="mb-4 flex items-start gap-2">
          <InfoIcon className="text-main-primary" size={20} />
          <p className="text-secondary-text text-sm font-roboto">
            Click on the crown icon to select a maximum of three professionals
            to feature on the overview page. Click on the calendar to add a
            mentor's office hours link.
          </p>
        </div>

        {/* Selected VIPs */}
        <div className="h-[312px] overflow-y-scroll space-y-4 bg-secondary-bg border border-tertiary-bg rounded-lg p-3">
          {formik.values.vips.map((vip) => {
            const hasOfficeHours = !!vip.office_hours;
            return (
              <div key={vip.id} className="space-y-3">
                {/* VIP Header */}
                <div className="flex items-start gap-3 font-roboto">
                  <div className="flex items-center gap-3 bg-[#000375] text-[#ADAFFA] px-3 py-1 rounded-full w-[184px] overflow-hidden">
                    {vip.users.avatar_url ? (
                      <img
                        src={vip.users.avatar_url}
                        alt={vip.users.full_name ?? ""}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 flex-shrink-0">
                        {vip.user_id.startsWith("email:")
                          ? getInitials(vip.users.email ?? "")
                          : getInitials(vip.users.full_name ?? "")}
                      </div>
                    )}

                    <span className="text-sm truncate w-[70%]">
                      {vip.user_id.startsWith("email:")
                        ? vip.users.email
                        : vip.users.full_name}
                    </span>
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => removeVIP(vip.id)}
                    />
                  </div>
                  <div className="space-y-3 w-full">
                    <div className="space-y-2 w-full">
                      <MultiSelect
                        showCheckboxes
                        options={positionOptions}
                        className="w-full"
                        value={vip.hackathon_vip_roles}
                        placeholder="Select roles"
                        onChange={(values) => {
                          // console.log(values);
                          updateVIPRoles(vip.user_id, values as string[]);
                        }}
                      />
                    </div>

                    {vip.hackathon_vip_roles.includes("judge") && (
                      <div className="space-y-2 w-full">
                        <div className="flex flex-wrap gap-2 w-full">
                          <MultiSelect
                            isSearchable
                            options={hackathonChallenges}
                            className="w-full"
                            isLoading={isFetchingChallenges}
                            placeholder="Assign this judge to challenges"
                            value={formik.values.judgeChallenges[vip.id] || []}
                            onChange={(selectedValues) => {
                              updateJudgeChallenges(
                                vip.id,
                                selectedValues as number[]
                              );
                            }}
                            height="150px"
                            styles={{
                              placeholder: (provided) => ({
                                ...provided,
                                fontSize: "14px",
                                fontWeight: "normal",
                                height: "40px",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {vip.hackathon_vip_roles.includes("mentor") && (
                      <div>
                        <Input
                          placeholder="Office hours link"
                          value={vip.office_hours || ""}
                          onChange={(e) =>
                            updateOfficeHours(vip.id, e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-auto">
                    {vip.hackathon_vip_roles.includes("mentor") && (
                      <Calendar
                        className={`w-5 h-5 cursor-pointer ${
                          hasOfficeHours
                            ? "text-main-primary"
                            : "text-[#424248]"
                        }`}
                        onClick={() => {
                          if (!vip.office_hours) {
                            updateOfficeHours(vip.id, "");
                          } else {
                            updateOfficeHours(vip.id, vip.office_hours);
                          }
                        }}
                      />
                    )}
                    <Crown
                      className={`w-5 h-5 cursor-pointer ${
                        vip.is_featured
                          ? "text-yellow-400"
                          : featuredCount >= 3
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-[#424248]"
                      }`}
                      onClick={() => toggleFeatured(vip.id)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end w-full pt-6">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            loading={formik.isSubmitting}
          >
            Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};
