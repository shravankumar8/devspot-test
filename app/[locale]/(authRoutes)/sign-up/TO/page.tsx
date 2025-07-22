"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useAuthProviders from "@/hooks/useAuthProviders";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSignupForm } from "./useSignupForm";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { isDisabled: isAuthenticating } = useAuthProviders();
  const { formik, serverError, isValidatingAccountName, accountNameError } =
    useSignupForm();

  const isFormValid =
    formik.values.email &&
    formik.values.password &&
    formik.values.name &&
    formik.values.account_name &&
    !formik.isSubmitting &&
    !isAuthenticating &&
    !accountNameError;

  const getAccountNameError = () => {
    if (accountNameError) return accountNameError;
    return formik.errors.account_name;
  };

  return (
    <div className="sm:w-[500px] w-full">
      <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%] mb-9">
        Welcome to DevSpot
      </h4>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            id="account_name"
            name="account_name"
            value={formik.values.account_name}
            onChange={formik.handleChange}
            type="text"
            placeholder="Account Name"
            className="font-roboto dark:placeholder:text-secondary-text capitalize"
            prefixIcon={isValidatingAccountName && <Spinner size="small" />}
            error={getAccountNameError()}
          />

          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            type="text"
            placeholder="Name"
            className="font-roboto dark:placeholder:text-secondary-text"
            error={formik.touched.name ? formik.errors.name : undefined}
          />

          <Input
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            type="email"
            placeholder="Email"
            className="font-roboto dark:placeholder:text-secondary-text"
            error={formik.touched.email ? formik.errors.email : undefined}
          />

          <div className="relative">
            <Input
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className=" font-roboto dark:placeholder:text-secondary-text"
              error={
                formik.touched.password ? formik.errors.password : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        {serverError && (
          <div className="text-[14px] text-red-500 break-words max-w-[400px] mt-2">
            {serverError}
          </div>
        )}
        <div className="flex mt-4 justify-center gap-2 items-center font-roboto font-medium !text-base">
          <p className="text-secondary-text">Already have an account?</p>
          <Link href="/login" className="underline">
            <Button
              variant="tertiary"
              size="lg"
              className="!text-base text-white !pb-[2px]"
              type="button"
            >
              Log In
            </Button>
          </Link>
        </div>
        <div className="w-full mt-14 flex justify-between">
          <Link href="/sign-up" className="underline">
            <Button
              variant="tertiary"
              size="lg"
              className="!text-base text-white !pb-[2px]"
              type="button"
            >
              Back
            </Button>
          </Link>
          <Button
            type="submit"
            className="gap-2 min-w-[105px] font-roboto text-base"
            disabled={!isFormValid}
          >
            {formik.isSubmitting && <Spinner size="small" />} Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
