"use client";

import LocationDropdown from "@/components/page-components/profile/About/LocationSearch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignupStore } from "@/state";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

const locationOnlySchema = Yup.object().shape({
  location: Yup.string()
    .required("Location is required")
    .max(100, "Location must be at most 100 characters"),
});

// Todo (ahmad): redirect to this page after sign up auth
export default function SelectLocation() {
  const { setActiveStep, setUserId } = useSignupStore();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  useEffect(() => {
    setActiveStep(1);
  }, []);

  const initialValues = useMemo(() => {
    return {
      location: null,
    };
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: locationOnlySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { location, ...rest } = values;

      try {
        const payload = {
          ...rest,
          location: location,
        };

        // Todo (ahmad): test these out with real user
        await axios.put("/api/profile", payload);
        mutate("/api/profile");
        mutate("/api/profile/profile-completion");
        router.push("/sign-up/participants/describe");
        toast.success("Updated About Information Successfully", {
          position: "top-right",
        });
      } catch (error: any) {
        console.log("Eror updating about information:", error);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update About Information: ${error?.response?.data?.error}`
          );
          return;
        }
        toast.error(`Could not Update About Information ${error?.message}`, {
          position: "top-right",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-7 mt-[100px] md:mt-[155px] w-[90vw] sm:w-[500px]">
      <h4 className="font-bold text-[22px] sm:text-[28px] md:text-[32px] leading-[28px] sm:leading-[32px]">
        Where are you located?
      </h4>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-7">
        <div className="flex flex-col gap-2">
          <LocationDropdown
            initialLocation={formik.values?.location || ""}
            setLocation={(value) => formik.setFieldValue("location", value)}
          />

          {formik.errors.location && (
            <p
              className="font-roboto font-medium text-red-500 text-xs capitalize"
              role="alert"
            >
              {formik.errors.location}
            </p>
          )}
        </div>

        <div className="flex justify-end w-full">
          <Button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            className="flex gap-2 font-roboto !text-base"
          >
            {formik.isSubmitting && <Spinner size="small" />}
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
