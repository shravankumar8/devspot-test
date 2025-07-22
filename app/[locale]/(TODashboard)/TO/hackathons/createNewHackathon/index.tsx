// NAME, DATES, TYPE, subdomain, application method,
"use client";
import { SingleSelect } from "@/components/common/form/select";
import { ProjectIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useTechOwnerStore } from "@/state/techOwnerStore";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";
import {
  APPLICATION_METHOD_OPTIONS,
  HACKATHON_TYPE_OPTIONS,
} from "./constants";
import { createNewHackathonValidationSchema } from "./schema";

interface CreateHackathonFormik {
  name: string | null;
  type: "virtual" | "physical" | null;
  applicationMethod: null;
}

const CreateHackathonModal = () => {
  const router = useRouter();
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const { selectedOrg } = useTechOwnerStore();

  const generateSubdomain = (input: string): string => {
    return input
      .toLowerCase() // Convert to lowercase
      .normalize("NFD") // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
      .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
      .replace(/-{2,}/g, "-"); // Collapse multiple dashes into one
  };

  const formik = useFormik<CreateHackathonFormik>({
    initialValues: {
      name: null,
      type: null,
      applicationMethod: null,
    },
    validationSchema: createNewHackathonValidationSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      const payload = {
        ...values,
        subdomain: generateSubdomain(values.name ?? "test"),
        organizerId: selectedOrg?.technology_owner_id,
      };
      try {
        const response = await axios.post(`/api/hackathons`, payload);

        mutate(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons`
        );

        router.push(
          `/TO/hackathons/${response.data?.data.id}/analytics/hackathons`
        );

        toast.success("Hackathon Created Successfully", {
          position: "top-right",
        });

        resetForm();
        // onClose();
      } catch (error: any) {
        console.log("Error Creating Hackathon:", error);

        setSubmitting(false);

        console.log(error);
        if (error instanceof AxiosError) {
          toast.error(
            `Could not Create Hackathon ${error?.response?.data?.error}`,
            {
              position: "top-right",
            }
          );

          return;
        }

        toast.error(`Could not Create Hackathon ${error?.message}`, {
          position: "top-right",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <GenericModal
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <Button className="flex gap-2 items-center" variant="special">
            <ProjectIcon />
            <span>Create Hackathon</span>
          </Button>
        </div>
      }
    >
      <div className="overflow-y-scroll">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold">
            Create your Hackathon
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col mt-6 ">
          <div className="flex flex-col gap-5 overflow-y-scroll min-h-[550px]">
            <p className="font-normal font-roboto text-sm">
              You can always edit this later.
            </p>

            <Input
              required
              id="name"
              name="name"
              placeholder="Your hackathon's Name"
              height="20px"
              value={formik.values.name ?? ""}
              className="font-roboto text-sm"
              onChange={formik.handleChange}
              error={formik.errors.name}
            />

            <div className="space-y-2">
              <SingleSelect
                placeholder="Your hackathon's Type"
                showCheckboxes
                options={HACKATHON_TYPE_OPTIONS}
                onChange={(value) =>
                  formik.setFieldValue("type", value as string)
                }
                value={formik.values.type ?? ""}
              />

              {formik.touched.type && formik.errors.type && (
                <div className="text-red-400 text-sm">{formik.errors.type}</div>
              )}
            </div>

            <div className="space-y-2">
              <SingleSelect
                placeholder="Your hackathon's Application Method"
                showCheckboxes
                options={APPLICATION_METHOD_OPTIONS}
                onChange={(value) =>
                  formik.setFieldValue("applicationMethod", value as string)
                }
                value={formik.values.applicationMethod ?? ""}
              />

              {formik.touched.applicationMethod &&
                formik.errors.applicationMethod && (
                  <div className="text-red-400 text-sm">
                    {formik.errors.applicationMethod}
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-center sm:justify-end my-5 w-full">
            <Button
              type="submit"
              className="w-fit font-roboto text-sm gap-2"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {formik.isSubmitting && <Spinner size="small" />}
              Submit
            </Button>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default CreateHackathonModal;
