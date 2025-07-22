import Label from "@/components/common/form/label";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseModal from "@/hooks/useModal";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import * as Yup from "yup";

import EditProfileIcon from "@/components/page-components/profile/EditProfileIcon";
import { CustomCalendarEditor } from "./CustomCalendarEditor";
import { useTechOwnerStore } from "@/state/techOwnerStore";

export const EditHackathonSchedule = ({
  hackathonId,
}: {
  hackathonId: number;
}) => {
  const { selectedOrg } = useTechOwnerStore();
  const [code, setCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const {
    closeModal: onClose,
    isOpen,
    openModal: onOpen,
  } = UseModal("edit-schedule");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    setCode(code);
  }, []);

  const router = useRouter();

  const [loadingAuth, setLoadingAuth] = useState(false);

  const initiateGoogleCalendarAuth = async () => {
    setLoadingAuth(true);
    const response = await fetch(
      `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/schedule/auth`
    );
    const data = await response.json();

    if (data) {
      toast.success("Redirecting you...Please Wait a little bit", {
        position: "top-right",
      });

      return router.push(data);
    }

    toast.error("Could not Verify, Please Try again later", {
      position: "top-right",
    });

    setLoadingAuth(false);
  };

  const handleSave = (data: any) => {
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      calendarLink: "",
    },
    validationSchema: Yup.object({
      calendarLink: Yup.string()
        .required("Google Calendar link is required")
        .matches(
          /^https:\/\/calendar\.google\.com\/calendar\/embed\?src=.+$/,
          "Please enter a valid Google Calendar embed link"
        ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axios.put(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/schedule`,
          {
            calendarLink: values.calendarLink,
            code,
          }
        );
        mutate(`/api/hackathons/${hackathonId}/schedule`);

        toast.success("Updated Hackathon Schedule Information Successfully", {
          position: "top-right",
        });

        onClose();
        resetForm();
      } catch (error: any) {
        console.log("Error updating Hackathon Schedule information:", error);

        setSubmitting(false);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update Hackathon Schedule Information ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(
          `Could not Update Hackathon Schedule Information  ${error?.message}`,
          {
            position: "top-right",
          }
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

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
          Edit Schedule
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "upload" | "manual")}
          className="h-full"
        >
          <TabsList className="w-full  rounded-none h-12 font-roboto">
            <TabsTrigger
              value="upload"
              className="flex-1 dark:data-[state=active]:bg-main-primary data-[state=active]:text-schedule-text font-normal"
            >
              Google Calendar Link
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="flex-1 dark:data-[state=active]:bg-main-primary data-[state=active]:text-schedule-text text-schedule-text-muted font-normal"
            >
              Manual Event Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="h-full mt-4">
            <form
              className="flex flex-col overflow-y-scroll"
              onSubmit={formik.handleSubmit}
            >
              <p className="text-secondary-text text-sm mb-3 font-roboto">
                Enter your hackathon's public Google Calendar link and we'll
                populate your hackathon's schedule.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <Label>Google Calendar Link</Label>

                <Input
                  id="calendarLink"
                  name="calendarLink"
                  onChange={formik.handleChange}
                  value={formik.values.calendarLink ?? ""}
                  placeholder="https://calendar.google.com/calendar/embed?src=..."
                  prefixIcon={
                    <LinkIcon className="w-5 h-5 text-main-primary" />
                  }
                  disabled={!Boolean(code)}
                />
              </div>

              <div className="flex justify-center sm:justify-end my-5 w-full gap-2">
                <Button
                  onClick={initiateGoogleCalendarAuth}
                  type="button"
                  className="gap-2 !min-w-fit text-sm"
                  disabled={loadingAuth || Boolean(code)}
                >
                  {loadingAuth && <Spinner size="small" />} Get Calendar
                  Permissions
                </Button>

                <Button
                  type="submit"
                  className="gap-2 !min-w-fit text-sm"
                  disabled={!Boolean(code) || formik.isSubmitting}
                >
                  {formik.isSubmitting && <Spinner size="small" />} Submit
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="manual" className="h-full mt-4">
            <CustomCalendarEditor
              hackathonId={hackathonId.toString()}
              onSave={handleSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </GenericModal>
  );
};
