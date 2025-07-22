"use client";

import { Checkbox } from "@/components/common/Checkbox";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { termsData } from "@/mocked_data/data-helpers/auth/terms-data";
import { useSignupStore } from "@/state";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TermsAndConditions = ({
  closeTermsAndConditionsModal,
}: {
  closeTermsAndConditionsModal?: () => void;
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({
    termsOfService: false,
    privacyPolicy: false,
    codeOfConduct: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState<{
    [key: string]: boolean;
  }>({
    termsOfService: false,
    privacyPolicy: false,
    codeOfConduct: false,
  });

  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { setActiveStep, setRegComplete, userId } = useSignupStore();

  useEffect(() => {
    Object.keys(contentRefs.current).forEach((key) => {
      const element = contentRefs.current[key];
      if (element) {
        element.addEventListener("scroll", () => handleScroll(key));
      }
    });

    return () => {
      Object.keys(contentRefs.current).forEach((key) => {
        const element = contentRefs.current[key];
        if (element) {
          element.removeEventListener("scroll", () => handleScroll(key));
        }
      });
    };
  }, []);

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleScroll = (id: string) => {
    const element = contentRefs.current[id];
    if (element) {
      const hasScrolledToEnd =
        element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
      setScrolledToEnd((prev) => ({
        ...prev,
        [id]: hasScrolledToEnd,
      }));
    }
  };

  const handleCheckboxChange = (id: string) => {
    setCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = Object.values(checkboxes).every((value) => value);

  const handleAcceptTerms = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/profile/terms-accepted", {
        termsAccepted: true,
      });
      setLoading(false);
      closeTermsAndConditionsModal && closeTermsAndConditionsModal();
      router.push("/sign-up/participants/connect-account/success");
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError("Failed to accept terms and conditions. Please try again.");
    }
  };

  return (
    <div className="text-white py-4 px-6 rounded-lg mx-auto shadow-lg w-full font-roboto">
      <h2 className="text-xl font-meduim mb-4">
        Please agree to the following Terms and Conditions
      </h2>
      {error && <span className="text-red-500 text-[13px] mb-2">{error}</span>}

      {termsData.map(({ id, title, content }) => (
        <div
          key={id}
          className="mb-3 bg-[#2B2B31] py-3 px-4 text-left rounded-xl"
        >
          <button
            className="w-full flex justify-between items-center"
            onClick={() => handleExpand(id)}
          >
            <span>{title}</span>
            <span>
              {expanded === id ? (
                <FaChevronUp color="#89898C" size={15} />
              ) : (
                <FaChevronDown color="#89898C" size={15} />
              )}
            </span>
          </button>

          {expanded === id && (
            <div
              // ref={contentRefs?.current[id]}
              className="py-3 bg-[#2B2B31]  max-h-40 overflow-y-auto"
              style={{ whiteSpace: "pre-line" }}
            >
              <p className="text-sm leading-6 text-secondary-text">{content}</p>
            </div>
          )}

          {expanded == id && (
            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                id={`checkbox-${id}`}
                disabled={expanded !== id}
                checked={checkboxes[id]}
                onCheckedChange={() => handleCheckboxChange(id)}
                className="mr-1"
              />
              <label
                htmlFor={`checkbox-${id}`}
                className="text-sm cursor-pointer"
                onClick={() => handleCheckboxChange(id)}
              >
                I agree with the {title}
              </label>
            </div>
          )}
        </div>
      ))}

      <div className="w-full justify-end flex mb-2">
        <Button
          className={` mt-4 flex gap-2 items-center`}
          disabled={!allChecked}
          onClick={handleAcceptTerms}
        >
          {loading && <Spinner size="small" />} Confirm
        </Button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
