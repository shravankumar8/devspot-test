import { Tags } from "@/components/common/Tags";
import Image from "next/image";
import { Certificate } from ".";

const CertificateTag = ({ certificate }: { certificate: Certificate }) => {
  return (
    <a href={certificate.credential_url} target="__blank" className="w-fit">
      <Tags
        text={
          <div className="flex items-center gap-1">
            <Image
              src={certificate.issuing_organization}
              width={20}
              height={20}
              alt={certificate.certificate_name}
            />
            <p>{certificate.certificate_name}</p>
          </div>
        }
      />
    </a>
  );
};

export default CertificateTag;
