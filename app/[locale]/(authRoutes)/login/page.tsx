"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SignOutButton from "@/components/ui/sign-out-button";
import { Spinner } from "@/components/ui/spinner";
import useAuthProviders from "@/hooks/useAuthProviders";
import { useAuthStore } from "@/state";
import { useFormik } from "formik";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { signInWithEmail } from "../sign-up/actions";

function LoginPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (
      values,
      { setSubmitting, setStatus, resetForm, setErrors }
    ) => {
      setSubmitting(true);

      try {
        const { success, message } = await signInWithEmail(
          values.email,
          values.password
        );

        if (!success) {
          setStatus(message || "Invalid email or password");
          return;
        }
        setErrors({
          email: undefined,
          password: undefined,
        });
        router.push("/");

        resetForm();
      } catch (error) {
        setStatus("An unexpected error occurred");
        setSubmitting(false);
      }
    },
  });

  const { authProviderMap, isDisabled: isAuthenticating } = useAuthProviders();

  return (
    <>
      {user ? (
        <SignOutButton />
      ) : (
        <div className="sm:w-[500px] w-full">
          <h4 className="sm:text-[32px] text-[28px] font-bold sm:leading-[32px] leading-[100%] mb-9">
            Welcome back!
          </h4>
          <div className="w-full flex flex-col gap-3">
            {authProviderMap.map(({ handler, imageSrc, title, loading }) => (
              <button
                key={title}
                className="flex w-full justify-center gap-2 items-center bg-[#2B2B31] h-[38px] sm:h-[44px] px-5 rounded-lg disabled:text-secondary-text font-roboto sm:text-base text-sm font-medium hover:bg-[#5A5A5F] transition-all duration-200 ease-in-out disabled:bg-[#424248] text-[#A1A1A3]"
                onClick={handler}
                disabled={isAuthenticating || formik.isSubmitting}
              >
                <Image
                  src={imageSrc}
                  width={24}
                  height={24}
                  className="object-contain"
                  alt={`${title} Icon`}
                  priority
                  quality={100}
                />
                {loading ? "Connecting..." : `Continue with ${title}`}

                {loading && <Spinner size="small" />}
              </button>
            ))}
          </div>

          <div className="text-[14] !font-[400]"></div>
          <p className="text-secondary-text my-6 relative before:absolute before:w-[43%] before:h-[2px] before:bg-[#424248] before:top-1/2 text-center w-full before:left-0 after:absolute after:h-[2px] after:bg-[#424248] after:top-1/2 after:right-0 after:w-[43%] text-[18px] font-roboto font-[500]">
            or
          </p>

          <form className="text-white" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-3">
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                type="text"
                placeholder="Email"
                className="font-roboto "
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-[14px] text-red-500 font-roboto">
                  {formik.errors.email}
                </div>
              ) : null}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="font-roboto "
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
                <div className="text-[14px] text-red-500 font-roboto">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            {formik.status && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {formik.status}
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <Link href="/forget-password">
                <Button
                  variant="tertiary"
                  type="button"
                  className="text-base font-roboto font-medium !pb-[2px]"
                >
                  Forgot your password?
                </Button>
              </Link>
            </div>

            <div className="flex mt-4 justify-center gap-2 items-center font-roboto font-medium !text-base">
              <p className="text-secondary-text">
                Don&apos;t have an account yet?
              </p>
              <Link
                href={`${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/sign-up`}
              >
                <Button
                  variant="tertiary"
                  size="lg"
                  type="button"
                  className="!text-base text-white !pb-[2px]"
                >
                  Sign up
                </Button>
              </Link>
            </div>

            <div className="w-full mt-14 flex justify-end ">
              <Button
                type="submit"
                className="gap-2 min-w-[105px] font-roboto text-base"
                disabled={
                  !formik.values.email ||
                  !formik.values.password ||
                  isAuthenticating ||
                  formik.isSubmitting
                }
              >
                {formik.isSubmitting && <Spinner size="small" />} Continue
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginPage;
