import { Card } from "@/components/ui/card";
import axios from "axios";
import { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import useSWR from "swr";
import AddCertificateModal from "./AddCertificateModal";
import CertificateTag from "./CertificateTag";
import CertificationTagSkeleton from "./SkeletonLoader";

export interface Certificate {
  id: string;
  credential_url: string;
  certificate_name: string;
  issuing_organization: string;
}

interface CertificationsProp {
  isOwner: boolean;
}

const Certifications = (props: CertificationsProp) => {
  const fetchCertifications = async (url: string) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { isOwner } = props;

  const { data: certificates, isLoading } = useSWR<Certificate[]>(
    "/api/profile/certifications",
    fetchCertifications
  );

  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const allCertificates = useMemo(() => {
    const SHORT_LENGTH = 10;

    if (!certificates) return [];

    if (certificates.length <= SHORT_LENGTH) return certificates;

    if (!showAllCertificates) return certificates.slice(0, SHORT_LENGTH);

    return certificates;
  }, [showAllCertificates, certificates]);

  const showEdit = useMemo(() => {
    return isOwner && !isLoading;
  }, [isLoading, isOwner]);

  return (
    <Card className="w-full bg-secondary-bg rounded-xl !border-none font-roboto gap-4 flex flex-col !p-6">
      <div className="flex justify-between items-center">
        <p className="font-normal !text-base text-white">Certifications</p>
        {showEdit && <AddCertificateModal />}
      </div>

      <div className="flex flex-wrap gap-3">
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <CertificationTagSkeleton key={index} />
          ))}

        {!isLoading && (
          <>
            {allCertificates?.map((certificate, index) => (
              <CertificateTag certificate={certificate} key={index} />
            ))}

            {!allCertificates.length && (
              <p className="text-secondary-text text-sm font-normal">
                No Certificates added
              </p>
            )}
          </>
        )}
      </div>

      {!isLoading && certificates?.length ? (
        <button
          onClick={() => setShowAllCertificates((prev) => !prev)}
          className={`text-[13px] flex items-center gap-1 uppercase ${
            certificates?.length < 11 && "hidden"
          }`}
        >
          {showAllCertificates ? "View Less" : "View All"}
          <FaChevronDown color="#4E52F5" size={18} />
        </button>
      ) : (
        ""
      )}
    </Card>
  );
};

export default Certifications;
