"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { updateUserPassword } from "../sign-up/actions";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <form
      className="sm:w-[500px] w-full gap-9 flex flex-col"
      onSubmit={formik.handleSubmit}
    >
      <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%]">
        Reset Password
      </h4>

      <div className="flex flex-col gap-4">
        <p className="text-[#89898C] text-[16px] font-medium font-roboto">
          Create a new password.
        </p>

        <div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-[#424248] dark:bg-tertiary-bg font-roboto dark:placeholder:text-secondary-text"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {formik.touched.password && formik.errors.password ? (
            <div className="text-[14px] mt-2 text-red-500 break-words max-w-[400px]">
              {formik.errors.password}
            </div>
          ) : null}
        </div>

        <div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-[#424248] dark:bg-tertiary-bg font-roboto dark:placeholder:text-secondary-text"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-[14px] text-red-500 break-words max-w-[400px]">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        {serverError && (
          <div className="text-[14px] text-red-500 mt-2">{serverError}</div>
        )}
      </div>

      <div className="w-full mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting}
          className="font-roboto text-base"
        >
          {formik.isSubmitting && <Spinner size="small" />} Update Password
        </Button>
      </div>
    </form>
  );
}
