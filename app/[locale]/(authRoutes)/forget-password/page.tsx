"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { resetPassword, updateUserPassword } from "../sign-up/actions";
import { Spinner } from "@/components/ui/spinner";

export default function ForgetPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
        )
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      try {
        const { success, message } = await updateUserPassword(values.password);

        if (!success) {
          setServerError(message);
          return;
        }

        // Show success toast
        toast.success("Password updated successfully");

        // Redirect to home page
        router.push("/");
      } catch (error) {
        setServerError("Failed to update password");
      }
    },
  });
  const handleResetPassword = async () => {
    const { success, message } = await resetPassword(resetEmail);
    setResetStatus(message);
    if (success) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  return (
    <form
      className="sm:w-[500px] w-full gap-9 flex flex-col"
      onSubmit={formik.handleSubmit}
    >
      <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%]">
        Forgot password?
      </h4>
      <p className="text-[#89898C] text-[16px] font-medium font-roboto">
        We’ll send you a link to reset your password.
      </p>

      <div className="flex flex-col gap-2">
        <Input
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="Enter your email"
          className="border-[#424248] dark:bg-tertiary-bg font-roboto dark:placeholder:text-secondary-text"
        />
        {serverError && (
          <div className="text-[14px] text-red-500 mt-2">{serverError}</div>
        )}

        {resetStatus && (
          <div
            className={`text-sm mb-4 ${
              resetStatus.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {resetStatus}
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center font-roboto font-medium ">
        <Button
          onClick={() => {
            router.push("/login");
          }}
          variant="tertiary"
          type="button"
          size="lg"
          className="!text-base text-white !pb-[2px]"
        >
          Back to login
        </Button>

        <Button
          type="submit"
          disabled={!isValidEmail(resetEmail) || formik.isSubmitting}
          onClick={handleResetPassword}
          className="gap-2 min-w-[105px] font-roboto text-base"
        >
          {formik.isSubmitting && <Spinner size="small" />} Send link
        </Button>
      </div>
    </form>
  );
}
