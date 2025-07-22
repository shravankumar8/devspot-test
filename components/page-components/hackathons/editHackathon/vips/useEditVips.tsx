import { useTechOwnerStore } from "@/state/techOwnerStore";
import { HackathonVips, Users } from "@/types/entities";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "sonner";
import { mutate } from "swr";
import * as Yup from "yup";

export interface VIP extends Partial<HackathonVips> {
  id: number;
  hackathon_vip_roles: any;
  created_at: string;
  hackathon_id: number;
  office_hours: string | null;
  updated_at: string;
  user_id: string;
  is_featured: boolean;
  users: Users;
  challengeIds?: number[];
}

interface VIPsFormValues {
  vips: VIP[];
  searchQuery: string;
  inviteEmail: string;
  // Separate field for judge challenges
  judgeChallenges: Record<number, number[]>; // VIP ID -> challenge IDs
}

export const useVIPsForm = (
  initialVips: VIP[] = [],
  hackathonId: number,
  onClose: () => void
) => {
  const { selectedOrg } = useTechOwnerStore();
  // Initialize judge challenges as empty for each VIP
  const initialJudgeChallenges = initialVips.reduce((acc, vip) => {
    if (vip.hackathon_vip_roles?.includes("judge") && vip.challengeIds) {
      acc[vip.id] = vip.challengeIds;
    } else {
      acc[vip.id] = [];
    }
    return acc;
  }, {} as Record<number, number[]>);

  const initialValues: VIPsFormValues = {
    vips: initialVips,
    searchQuery: "",
    inviteEmail: "",
    judgeChallenges: initialJudgeChallenges,
  };

  const validationSchema = Yup.object().shape({
    vips: Yup.array().of(
      Yup.object().shape({
        users: Yup.object().shape({
          name: Yup.string().required("Name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        }),
        hackathon_vip_roles: Yup.array()
          .min(1, "At least one role is required")
          .of(Yup.string().required()),
      })
    ),
    inviteEmail: Yup.string().email("Invalid email"),
  });

  const formik = useFormik<VIPsFormValues>({
    initialValues,
    // validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        // Prepare VIPs data for API
        const vipsData = values.vips.map((vip) => {
          const isEmailInvite = vip.user_id.startsWith("email:");
          const baseData = {
            roles: vip.hackathon_vip_roles ?? [],
            is_featured: vip.is_featured,
            // Only include challenges if VIP is a judge
            ...(vip.hackathon_vip_roles.includes("judge") && {
              challengeIds: values.judgeChallenges[vip.id] || [],
            }),
            // Only include office hours if VIP is a mentor
            ...(vip.hackathon_vip_roles.includes("mentor") && {
              office_hours: vip.office_hours,
            }),
          };

          // For email-invited users (new users)
          if (isEmailInvite) {
            return {
              ...baseData,
              email: vip.users.email, // Only send email for new users
            };
          }

          // For existing users
          return {
            ...baseData,
            id: vip.user_id, // Only send id for existing users
          };
        });

        await axios.put(
          `/api/technology-owners/${selectedOrg?.technology_owner_id}/hackathons/${hackathonId}/edit/vips`,
          vipsData
        );

        mutate(`/api/hackathons/${hackathonId}/vips`);
        toast.success("VIPs updated successfully");
        onClose();
        return true;
      } catch (error) {
        console.error("Error submitting VIPs:", error);
        toast.error("Failed to update VIPs");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inviteByEmail = (email: string) => {
    const newVIP: VIP = {
      id: Date.now(), // Temporary ID for new VIPs
      created_at: new Date().toISOString(),
      hackathon_id: hackathonId,
      office_hours: null,
      updated_at: new Date().toISOString(),
      user_id: `email:${email}`, // Special identifier for email invites
      hackathon_vip_roles: [],
      is_featured: false,
      users: {
        id: `email:${email}`,
        email: email,
        full_name: email, // Use email as name initially
        avatar_url: null, // No avatar for email invites
      } as Users,
    };

    formik.setFieldValue("vips", [...formik.values.vips, newVIP]);
    formik.setFieldValue(`judgeChallenges.${newVIP.id}`, []);
    formik.setFieldValue("inviteEmail", ""); // Clear the input after adding
  };

  const addVIP = (user: Users) => {
    const newVIP: VIP = {
      id: Date.now(), // Temporary ID for new VIPs
      created_at: new Date().toISOString(),
      hackathon_id: 0, // Will be set when submitting
      office_hours: null,
      updated_at: new Date().toISOString(),
      user_id: user.id,
      hackathon_vip_roles: [],
      is_featured: false,
      users: user,
    };

    formik.setFieldValue("vips", [...formik.values.vips, newVIP]);
    formik.setFieldValue(`judgeChallenges.${newVIP.id}`, []);
    formik.setFieldValue("searchQuery", "");
  };

  const removeVIP = (id: number) => {
    formik.setFieldValue(
      "vips",
      formik.values.vips.filter((vip) => vip.id !== id)
    );
    // Also remove any challenges associated with this VIP
    const { [id]: _, ...remainingChallenges } = formik.values.judgeChallenges;
    formik.setFieldValue("judgeChallenges", remainingChallenges);
  };

  const updateVIPRoles = (id: string, roles: string[]) => {
    formik.setFieldValue(
      "vips",
      formik.values.vips.map((vip) =>
        vip.user_id === id ? { ...vip, hackathon_vip_roles: roles } : vip
      )
    );
    console.log(formik.values.vips);
  };

  const updateJudgeChallenges = (vipId: number, challengeIds: number[]) => {
    formik.setFieldValue(`judgeChallenges.${vipId}`, challengeIds);
  };

  const toggleFeatured = (id: number) => {
    const featuredCount = formik.values.vips.filter(
      (vip) => vip.is_featured
    ).length;
    const vip = formik.values.vips.find((v) => v.id === id);

    if (vip?.is_featured || featuredCount < 3) {
      formik.setFieldValue(
        "vips",
        formik.values.vips.map((vip) =>
          vip.id === id ? { ...vip, is_featured: !vip.is_featured } : vip
        )
      );
    }
  };

  const updateOfficeHours = (id: number, link: string) => {
    formik.setFieldValue(
      "vips",
      formik.values.vips.map((vip) =>
        vip.id === id ? { ...vip, office_hours: link } : vip
      )
    );
  };

  return {
    formik,
    addVIP,
    removeVIP,
    updateVIPRoles,
    updateJudgeChallenges,
    toggleFeatured,
    updateOfficeHours,
    inviteByEmail,
  };
};
