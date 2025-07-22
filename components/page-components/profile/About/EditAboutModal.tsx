import Chip from "@/components/common/Chip";
import Label from "@/components/common/form/label";
import { TextArea } from "@/components/common/form/textarea";
import RolesDropdown from "@/components/common/RolesDropdown";
import {
  LensIcon,
  LinkedinIcon2,
  WarpcastIcon,
  XIcon,
} from "@/components/icons/EditPencil";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal from "@/components/ui/generic-modal";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import UseModal from "@/hooks/useModal";
import { UserProfile } from "@/types/profile";
import { getRoleName } from "@/utils/roles";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { LinkIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import EditProfileIcon from "../EditProfileIcon";
import LocationSearch from "./LocationSearch";
import { editAboutValidationSchema } from "./validationSchema";

interface AboutModalProps {
  profile: UserProfile;
}

const EditAboutModal = (props: AboutModalProps) => {
  const { profile } = props;
  const userProfile = profile?.profile;

  const { mutate } = useSWRConfig();

  const getUserPrimaryRole = () => {
    if (!profile?.roles) return null;

    const primaryRole = profile?.roles?.find((role) => role.is_primary);

    return primaryRole?.participant_roles.id;
  };

  // const [selectedDefaultRole, setSelectedDefaultRole] = useState<number | null>(
  //   getUserPrimaryRole() ?? null
  // );

  const {
    closeModal: onClose,
    isOpen = Boolean(getUserPrimaryRole()),
    openModal: onOpen,
  } = UseModal("edit-about");

  const initialValues = useMemo(() => {
    return {
      full_name: profile.full_name || "",
      description: userProfile?.description || "",
      location: userProfile?.location || "",
      portfolio_website: userProfile?.portfolio_website || "",
      linkedin_url: userProfile?.linkedin_url || "",
      x_url: userProfile?.x_url || "",
      lensfrens_url: userProfile?.lensfrens_url || "",
      warpcast_url: userProfile?.warpcast_url || "",
      roles: profile?.roles?.map((role) => role.role_id) || [],
      main_role: getUserPrimaryRole() ?? null,
      display_wallet_id: profile?.display_wallet_id ?? false,
    };
  }, [profile]);

  const userWallets = useMemo(() => {
    return profile?.wallets;
  }, [profile?.wallets]);

  const formik = useFormik({
    initialValues,
    validationSchema: editAboutValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { main_role, roles, ...rest } = values;

      try {
        const payload = {
          ...rest,

          roles: {
            ids: roles,
            primaryRoleId: main_role ?? undefined,
          },
        };

        await axios.put("/api/profile", payload);
        mutate("/api/profile");
        mutate("/api/profile/profile-completion");
        toast.success("Updated About Information Successfully", {
          position: "top-right",
        });
        onClose();
      } catch (error: any) {
        console.log("Eror updating about information:", error);

        if (error instanceof AxiosError) {
          toast.error(
            `Could not Update About Information: ${error?.response?.data?.error}`
          );
          return;
        }
        toast.error(`Could not Update About Information ${error?.message}`, {
          position: "top-right",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose: getUserPrimaryRole() ? onClose : () => undefined,
        onOpen,
      }}
      trigger={
        <div>
          <EditProfileIcon />
        </div>
      }
    >
      <DialogHeader className="bg-[#1B1B22] pt-2 pb-5">
        <DialogTitle className="font-semibold !text-[24px]">
          Edit about
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit} className="flex flex-col">
        <div className="flex flex-col gap-5 overflow-y-scroll">
          <div className="flex flex-col gap-3 w-full">
            {/* walletId and name */}
            <div className="flex flex-col gap-3 w-full">
              <Label>Name</Label>

              <div className="flex gap-3">
                {/* Todo: Implement wallet switch */}
                <Switch
                  checked={formik.values.display_wallet_id}
                  onClick={() =>
                    formik.setFieldValue(
                      "display_wallet_id",
                      !formik.values.display_wallet_id
                    )
                  }
                  disabled={userWallets.length <= 0}
                />
                <Label>Display my Wallet ID</Label>
              </div>

              {formik.values.display_wallet_id && (
                <Input
                  readOnly
                  id="wallet_id"
                  name="wallet_id"
                  value={userWallets?.[0]?.wallet_address?.slice(-6)}
                />
              )}

              {!formik.values.display_wallet_id && (
                <Input
                  id="full_name"
                  name="full_name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  placeholder={profile.full_name || "Your Name"}
                  error={formik.errors.full_name}
                />
              )}
            </div>

            <Label>About</Label>

            <TextArea
              required
              name="description"
              label="description"
              maxWordLength={250}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.errors.description}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>
              How would you describe yourself? Select all roles that apply.
            </Label>

            <div className="flex flex-col gap-2">
              <RolesDropdown
                value={formik.values.roles}
                mainRole={formik.values.main_role}
                setMainRole={(value) => {
                  formik.setFieldValue("main_role", value);
                }}
                onChange={(selectedValues) => {
                  formik.setFieldValue("roles", selectedValues);
                }}
              />

              {formik.errors.roles && (
                <p
                  className="font-roboto font-medium text-red-500 text-xs capitalize"
                  role="alert"
                >
                  {formik.errors.roles}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Select the role you want highlighted on your profile.</Label>

            <div className="flex gap-3">
              {formik.values?.roles?.map((role) => (
                <Chip
                  name="main_role"
                  key={role}
                  variant={
                    role === formik.values?.main_role ? "gradient" : "outlined"
                  }
                  checked={role === formik.values?.main_role}
                  value={role}
                  onChange={(value) => formik.setFieldValue("main_role", value)}
                  onClick={(role) => {
                    formik.setFieldValue("main_role", role);
                  }}
                >
                  {getRoleName(role)}
                </Chip>
              ))}
            </div>

            {formik.errors.main_role && (
              <p
                className="font-roboto font-medium text-red-500 text-xs capitalize"
                role="alert"
              >
                {formik.errors.main_role}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Location</Label>

            <div className="flex flex-col gap-2">
              <LocationSearch
                initialLocation={formik.values?.location || ""}
                setLocation={(value) => formik.setFieldValue("location", value)}
              />

              {formik.errors.location && (
                <p
                  className="font-roboto font-medium text-red-500 text-xs capitalize"
                  role="alert"
                >
                  {formik.errors.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Add a website</Label>

            <Input
              id="portfolio_website"
              name="portfolio_website"
              value={formik.values.portfolio_website}
              onChange={formik.handleChange}
              placeholder="https://www.myportfolio.com"
              prefixIcon={<LinkIcon className="w-5 h-5 text-main-primary" />}
              error={formik.errors.portfolio_website}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Add your LinkedIn profile</Label>

            <Input
              id="linkedin_url"
              name="linkedin_url"
              value={formik.values.linkedin_url}
              onChange={formik.handleChange}
              placeholder="https://www.linkedin.com/in/john-doe/"
              prefixIcon={
                <LinkedinIcon2 className="w-5 h-5 text-main-primary" />
              }
              error={formik.errors.linkedin_url}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label>Add your X profile</Label>

            <Input
              id="x_url"
              name="x_url"
              value={formik.values.x_url}
              onChange={formik.handleChange}
              placeholder="https://www.x.com/john-doe/"
              prefixIcon={<XIcon className="w-5 h-5 text-main-primary" />}
              error={formik.errors.x_url}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Add your Lens account</Label>

            <Input
              id="lensfrens_url"
              name="lensfrens_url"
              value={formik.values.lensfrens_url}
              onChange={formik.handleChange}
              placeholder="https://www.lensfrens.xyz/myprofile/john-doe/"
              prefixIcon={<LensIcon className="w-5 h-5 text-main-primary" />}
              error={formik.errors.lensfrens_url}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <Label>Add your Warpcast account</Label>

            <Input
              id="warpcast_url"
              name="warpcast_url"
              value={formik.values.warpcast_url}
              onChange={formik.handleChange}
              placeholder="https://www.warpcast.com/myprofile/john-doe/"
              prefixIcon={
                <WarpcastIcon className="w-5 h-5 text-main-primary" />
              }
              error={formik.errors.warpcast_url}
            />
          </div>
        </div>

        <div className="flex justify-center sm:justify-end my-5 w-full">
          <Button
            type="submit"
            className="gap-2 !min-w-fit"
            disabled={
              (!formik.dirty && formik.isValid) ||
              formik.isSubmitting ||
              !formik.isValid
            }
          >
            {formik.isSubmitting && <Spinner size="small" />} Save
          </Button>
        </div>
      </form>
    </GenericModal>
  );
};

export default EditAboutModal;
