import { DragIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { HackathonCommunityPartners } from "@/types/entities";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikErrors,
  FormikTouched,
} from "formik";
import { AlertCircle, Plus, Trash2Icon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import EditProfileIcon from "../profile/EditProfileIcon";

// Enhanced interface with better typing
interface PartnersType
  extends Partial<Omit<HackathonCommunityPartners, "logo_url">> {
  logo_url: string | File;
  tempId?: string;
}

interface ImageData {
  file: File | null;
  url: string;
}

interface FormValues {
  partners: PartnersType[];
}

// Type for partner errors
interface PartnerErrors {
  partner_website?: string;
  logo_url?: string;
}

// Helper function to get partner errors safely
const getPartnerErrors = (
  errors: FormikErrors<FormValues>,
  index: number
): PartnerErrors | undefined => {
  if (!errors.partners || typeof errors.partners === "string") {
    return undefined;
  }

  if (Array.isArray(errors.partners)) {
    return errors.partners[index] as PartnerErrors | undefined;
  }

  return undefined;
};

// Helper function to get partner touched state safely
const getPartnerTouched = (
  touched: FormikTouched<FormValues>,
  index: number
): FormikTouched<PartnersType> | undefined => {
  if (!touched.partners || typeof touched.partners === "boolean") {
    return undefined;
  }

  if (Array.isArray(touched.partners)) {
    return touched.partners[index] as FormikTouched<PartnersType> | undefined;
  }

  return undefined;
};

// Validation schema using Yup
const validationSchema = Yup.object({
  partners: Yup.array()
    .of(
      Yup.object({
        partner_website: Yup.string()
          .url("Please enter a valid URL (e.g., https://example.com)")
          .required("Website URL is required"),

        // Tell Yup/TS that we expect a File or a string here:
        logo_url: Yup.mixed<File | string>()
          .required("Logo is required")
          .test("fileSize", "File size must be less than 5MB", (value) => {
            if (typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
          })
          .test("fileType", "Only image files are allowed", (value) => {
            if (typeof value === "string") return true;
            return value.type.startsWith("image/");
          }),
      })
    )
    .min(1, "At least one partner is required")
    .required("Partners are required"),
});

export const EditCommunityPartners = ({
  initialPartners = [],
  onSave,
  hackathonId,
}: {
  initialPartners?: PartnersType[];
  onSave?: (partners: FormData) => Promise<void>;
  hackathonId: number;
}) => {
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();
  const [images, setImages] = useState<Record<string, ImageData>>({});
  const [formValues, setFormValues] = useState<FormValues>(() =>
    initializePartners()
  );
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Initialize form values
  function initializePartners(): FormValues {
    if (initialPartners.length > 0) {
      const partnersWithIds = initialPartners.map((partner, index) => ({
        ...partner,
        tempId: partner.id ? partner.id.toString() : `temp-${index + 1}`,
      }));
      return { partners: partnersWithIds };
    }
    return { partners: [] };
  }

  // Initialize images when partners change
  const initializeImages = (partners: PartnersType[]) => {
    const newImages: Record<string, ImageData> = {};

    partners.forEach((partner) => {
      if (!partner.tempId) return;

      newImages[partner.tempId] = {
        file: null,
        url: typeof partner.logo_url === "string" ? partner.logo_url : "",
      };
    });

    setImages(newImages);
  };

  // Initialize images when form values change - moved outside Formik render
  useEffect(() => {
    initializeImages(formValues.partners);
  }, [formValues.partners.length]);

  // Handle logo file upload
  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tempId: string,
    setFieldValue: (field: string, value: any) => void,
    partnerIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImages((prevImages) => ({
      ...prevImages,
      [tempId]: {
        file,
        url: imageUrl,
      },
    }));

    // Update Formik field value
    setFieldValue(`partners.${partnerIndex}.logo_url`, file);
  };

  // Remove uploaded logo
  const removeLogo = (
    tempId: string,
    setFieldValue: (field: string, value: any) => void,
    partnerIndex: number
  ) => {
    setImages((prevImages) => ({
      ...prevImages,
      [tempId]: {
        file: null,
        url: "",
      },
    }));

    setFieldValue(`partners.${partnerIndex}.logo_url`, "");

    // Clear the file input
    if (fileInputRefs.current[tempId]) {
      fileInputRefs.current[tempId]!.value = "";
    }
  };

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(images).forEach((image) => {
        if (image.url && image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <button className="absolute bottom-4 right-4 z-20 cursor-pointer">
          <EditProfileIcon size="lg" />
        </button>
      }
    >
      <DialogHeader className="bg-[#1B1B22] py-2">
        <DialogTitle className="!text-[24px] font-semibold">
          Edit community partners
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col overflow-hidden">
        <p className="text-secondary-text text-sm mb-3 font-roboto">
          Manage your community partners. Add their logos, names, and website
          URLs to showcase your partnerships.
        </p>

        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            // Prepare final data for saving
            const partnersToSave = values.partners.map((partner) => {
              const imageData = images[partner.tempId!];
              return {
                ...partner,
                logo_url: imageData?.file || partner.logo_url || "",
                tempId: undefined,
              };
            });

            const formData = new FormData();

            partnersToSave.forEach((partner, idx) => {
              if (partner.id) {
                formData.append(`partners[${idx}][id]`, partner.id.toString());
              }

              formData.append(
                `partners[${idx}][partner_website]`,
                partner.partner_website || ""
              );

              if (partner.logo_url instanceof File) {
                formData.append(`partners[${idx}][logo_url]`, partner.logo_url);
              } else {
                formData.append(
                  `partners[${idx}][logo_url]`,
                  partner.logo_url || ""
                );
              }

              if (partner.hackathon_id != null) {
                formData.append(
                  `partners[${idx}][hackathon_id]`,
                  String(partner.hackathon_id)
                );
              }
            });

            try {
              if (onSave) {
                await onSave(formData);
              }
              onClose();
            } catch (error) {
              console.log(error);
            } finally {
              setSubmitting(false);
            }
          }}
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            setFieldTouched,
          }) => {
            // Update formValues state when Formik values change (no useEffect here)
            if (values !== formValues) {
              setFormValues(values);
            }

            return (
              <Form className="flex flex-col overflow-hidden">
                <FieldArray name="partners">
                  {({ push, remove }) => (
                    <>
                      {/* Partners List */}
                      <div className="h-[520px] overflow-y-auto pr-2">
                        {values.partners.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-secondary-text">
                            <p className="text-lg mb-2">
                              No partners added yet
                            </p>
                            <p className="text-sm">
                              Click "New partner" to get started
                            </p>
                          </div>
                        ) : (
                          values.partners.map((partner, index) => (
                            <div
                              key={partner.tempId}
                              className="mb-6 p-4 border border-gray-700 rounded-lg"
                            >
                              <div className="space-y-3">
                                {/* Website URL Input */}
                                <div className="flex gap-4 items-start">
                                  <div className="mt-3">
                                    <DragIcon />
                                  </div>
                                  <div className="flex-1">
                                    <Field
                                      as={Input}
                                      name={`partners.${index}.partner_website`}
                                      placeholder="https://www.partner-website.com"
                                      className={`w-full ${
                                        getPartnerErrors(errors, index)
                                          ?.partner_website &&
                                        getPartnerTouched(touched, index)
                                          ?.partner_website
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                      onBlur={() =>
                                        setFieldTouched(
                                          `partners.${index}.partner_website`,
                                          true
                                        )
                                      }
                                    />
                                    <ErrorMessage
                                      name={`partners.${index}.partner_website`}
                                      component="div"
                                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                    >
                                      {(msg: string) => (
                                        <>
                                          <AlertCircle className="size-4" />
                                          <span>{msg}</span>
                                        </>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Clean up image data when removing partner
                                      if (
                                        partner.tempId &&
                                        images[partner.tempId]
                                      ) {
                                        const imageUrl =
                                          images[partner.tempId].url;
                                        if (
                                          imageUrl &&
                                          imageUrl.startsWith("blob:")
                                        ) {
                                          URL.revokeObjectURL(imageUrl);
                                        }
                                        setImages((prevImages) => {
                                          const newImages = { ...prevImages };
                                          delete newImages[partner.tempId!];
                                          return newImages;
                                        });
                                      }
                                      remove(index);
                                    }}
                                    className="p-2 hover:bg-red-500/20 rounded-md transition-colors mt-1"
                                    title="Remove partner"
                                  >
                                    <Trash2Icon className="size-5 stroke-[#89898C] hover:stroke-red-500 transition" />
                                  </button>
                                </div>

                                {/* Logo Upload */}
                                <div className="flex gap-4 items-center">
                                  {images[partner.tempId!]?.url ? (
                                    <div className="border border-dashed border-secondary-text rounded-xl w-full h-20 bg-primary-bg flex items-center justify-center py-3 px-5 relative">
                                      <img
                                        src={images[partner.tempId!].url}
                                        alt={
                                          partner.partner_website ||
                                          "Partner logo"
                                        }
                                        className="max-h-full max-w-full object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeLogo(
                                            partner.tempId!,
                                            setFieldValue,
                                            index
                                          )
                                        }
                                        className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors"
                                        title="Remove logo"
                                      >
                                        <Trash2Icon className="size-4 text-red-500" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-full">
                                      <label
                                        htmlFor={`logo-upload-${partner.tempId}`}
                                        className={`border border-dashed rounded-xl w-full h-20 bg-primary-bg flex flex-col items-center justify-center py-3 px-5 cursor-pointer hover:border-main-primary transition-colors ${
                                          getPartnerErrors(errors, index)
                                            ?.logo_url &&
                                          getPartnerTouched(touched, index)
                                            ?.logo_url
                                            ? "border-red-500"
                                            : "border-secondary-text"
                                        }`}
                                      >
                                        <div className="size-6 flex-shrink-0">
                                          <UploadIcon className="stroke-main-primary size-6" />
                                        </div>
                                        <p className="font-medium text-sm text-secondary-text mt-2 text-center">
                                          Drag and drop partner logo here or{" "}
                                          <span className="text-main-primary underline">
                                            click to upload
                                          </span>
                                        </p>
                                        <input
                                          id={`logo-upload-${partner.tempId}`}
                                          type="file"
                                          ref={(
                                            el: HTMLInputElement | null
                                          ): void => {
                                            fileInputRefs.current[
                                              partner.tempId!
                                            ] = el;
                                          }}
                                          name="logo"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleLogoChange(
                                              e,
                                              partner.tempId!,
                                              setFieldValue,
                                              index
                                            )
                                          }
                                          className="hidden"
                                        />
                                      </label>
                                      <ErrorMessage
                                        name={`partners.${index}.logo_url`}
                                        component="div"
                                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                                      >
                                        {(msg: string) => (
                                          <>
                                            <AlertCircle className="size-4" />
                                            <span>{msg}</span>
                                          </>
                                        )}
                                      </ErrorMessage>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* General form errors */}
                      {typeof errors.partners === "string" && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="size-4" />
                            <span className="text-sm">{errors.partners}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between w-full pt-6 border-t border-gray-700">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            const newTempId = `temp-${Date.now()}`;
                            const newPartner: PartnersType = {
                              tempId: newTempId,
                              hackathon_id: hackathonId,
                              logo_url: "",
                              partner_website: "",
                            };
                            push(newPartner);
                          }}
                          className="text-gray-300 hover:text-white px-4 py-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New partner
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:opacity-50 gap-2"
                        >
                          {isSubmitting && <Spinner size="small" />} Save
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </Form>
            );
          }}
        </Formik>
      </div>
    </GenericModal>
  );
};
