import Label from "@/components/common/form/label";
import { SingleSelect } from "@/components/common/form/select";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { Link } from "lucide-react";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { SPONSOR_TIERS } from "../constants";
import { ChallengeFormPayload } from "../types";

interface ChallengeSponsorSectionProps {
  formik: FormikProps<ChallengeFormPayload>;
}

interface Sponsors {
  name: string;
  logo: string | File;
  tier: "gold" | "silver" | "sponsor";
  website: string;
}

const ChallengeSponsorSection = ({ formik }: ChallengeSponsorSectionProps) => {
  const sponsor = useMemo(() => {
    return formik.values?.challenge?.sponsors?.[0] as unknown as Sponsors;
  }, [formik.values?.challenge?.sponsors]);

  const updateSponsor = (field: keyof Sponsors, value: string | File) => {
    const currentSponsors = [
      ...(formik.values.challenge?.sponsors || []),
    ] as unknown as Sponsors[];

    if (currentSponsors.length === 0) {
      currentSponsors.push({} as Sponsors);
    }
    currentSponsors[0] = {
      ...(currentSponsors[0] as unknown as Sponsors),
      [field]: value,
    };

    formik.setFieldValue("challenge.sponsors", currentSponsors);
  };

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (file: File) => {
    updateSponsor("logo", file);
  };

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };
  // Handle drag events for logo
  const handleLogoDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleLogoUpload(file);
      }
    }
  };

  const isSponsorLogoFile = useMemo(() => {
    return sponsor?.logo && sponsor?.logo instanceof File;
  }, [sponsor?.logo]);

  const sponsorError = useMemo(() => {
    console.log({ errors: formik.errors.challenge?.sponsors });
    const sponsorObj = formik.errors.challenge?.sponsors?.[0] as unknown as Sponsors;

    return sponsorObj;
  }, [formik.errors.challenge?.sponsors]);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-secondary-text">
        What company is sponsoring this challenge?
      </Label>
      <div className="space-y-3">
        <Input
          placeholder="Company name"
          name="sponsor_name"
          value={sponsor?.name ?? ""}
          onChange={(e) => updateSponsor("name", e.target.value)}
          onBlur={formik.handleBlur}
          error={sponsorError?.name}
        />

        <Input
          name="website-link"
          placeholder="Company site link"
          prefixIcon={<Link className="h-4 w-4 text-main-primary" />}
          value={sponsor?.website ?? ""}
          onChange={(e) => updateSponsor("website", e.target.value)}
          onBlur={formik.handleBlur}
          error={sponsorError?.website}
        />

        <SingleSelect
          showCheckboxes
          options={SPONSOR_TIERS}
          onChange={(value) => updateSponsor("tier", value as string)}
          value={sponsor?.tier}
        />

        <div
          className={`border-2 border-dashed ${
            isDraggingLogo
              ? "border-[#4e52f5] bg-[#4e52f5]/5"
              : "border-[#2b2b31]"
          } rounded-xl p-3 flex flex-col items-center bg-primary-bg justify-center cursor-pointer transition-colors duration-200`}
          onClick={() => logoInputRef.current?.click()}
          onDragOver={handleLogoDragOver}
          onDragLeave={handleLogoDragLeave}
          onDrop={handleLogoDrop}
        >
          <input
            type="file"
            ref={logoInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleLogoFileChange}
          />

          {sponsor?.logo instanceof File && (
            <>
              <div className="text-[#89898c] text-sm font-roboto">
                {sponsor.logo.name}
              </div>
            </>
          )}

          {!isSponsorLogoFile && (
            <>
              <div className="text-[#89898c] text-sm font-roboto">
                Drag and drop image logo here or{" "}
                <span className="text-[#4e52f5]">click to upload</span>
              </div>
            </>
          )}
        </div>
      </div>

      {(sponsorError?.logo || sponsorError?.tier) && (
        <div className="text-red-500 text-xs font-medium capitalize font-roboto">
          {(sponsorError?.logo as string) || sponsorError?.tier}
        </div>
      )}
    </div>
  );
};

export default ChallengeSponsorSection;
