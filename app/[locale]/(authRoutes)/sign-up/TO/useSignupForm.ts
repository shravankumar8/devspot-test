import useDebounce from "@/hooks/useDebounce";
import { useSignupStore } from "@/state";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { TOSignUpWithEmail } from "../actions";
import { useAccountValidation } from "./useAccountNameValidation";

const businessEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$|aol\.com$|icloud\.com$|live\.com$|protonmail\.com$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface FormValues {
  account_name: string;
  name: string;
  password: string;
  email: string;
}

export function useSignupForm() {
  const router = useRouter();
  const { setActiveStep, setPersonalInfo } = useSignupStore();
  const { checkAccountExists, isValidating } = useAccountValidation();

  const [serverError, setServerError] = useState<string | null>(null);
  const [accountNameError, setAccountNameError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    account_name: Yup.string()
      .min(3, "Must be more than 3 characters")
      .required("This field is required"),
    name: Yup.string()
      .min(3, "Must be more than 3 characters")
      .required("This field is required"),
    password: Yup.string()
      .min(8, "Must be 8 characters or more")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
      )
      .required("This field is required"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(businessEmailRegex, "Please enter a valid business email")
      .required("This field is required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      account_name: "",
      name: "",
      password: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (
      values,
      { setSubmitting, setStatus, resetForm, setErrors }
    ) => {
      setSubmitting(true);
      setServerError(null);

      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("name", values.name);
        formData.append("account_name", values.account_name);

        const { error } = await TOSignUpWithEmail(formData);

        if (error) {
          setServerError(error);
          return;
        }

        setPersonalInfo({ name: values.name, email: values.email });
        setActiveStep(2);
        resetForm();
        setErrors({ email: undefined, name: undefined, password: undefined });
        router.push("/sign-up/TO/verify-email");
      } catch (error) {
        setStatus("An unexpected error occurred");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const debouncedAccountName = useDebounce(formik.values.account_name, 500);
  const [lastValidatedAccountName, setLastValidatedAccountName] = useState("");

  useEffect(() => {
    const validateAccountName = async () => {
      if (
        debouncedAccountName &&
        debouncedAccountName.length >= 3 &&
        debouncedAccountName !== lastValidatedAccountName
      ) {
        const exists = await checkAccountExists(debouncedAccountName);
        if (exists) {
          setAccountNameError(
            `The name "${debouncedAccountName}" is already in use.`
          );
        } else {
          setAccountNameError(null);
        }
        setLastValidatedAccountName(debouncedAccountName);
      } else if (debouncedAccountName.length === 0) {
        setAccountNameError(null);
        setLastValidatedAccountName("");
      }
    };

    validateAccountName();
  }, [debouncedAccountName, lastValidatedAccountName, checkAccountExists]);

  return {
    formik,
    serverError,
    isValidatingAccountName: isValidating,
    accountNameError,
  };
}
