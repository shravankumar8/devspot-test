import { Novu } from "@novu/api";
import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import * as yup from "yup";
import ApiBaseService from "../../utils/baseService";
import { uploadImage } from "../../utils/uploadImage";
import {
  ChallengeFormData,
  EditHackathonChallengePrize,
} from "../edit_hackathon_challenge.schema";
import { VipList, VIPRole } from "../edit_hackathon_vip.schema";
import TechnologyOwnerService from "./technology_owner.service";

interface UpdateHackathonDetailsProps {
  type: "virtual" | "physical";
  hackathon_start_date_time: string;
  hackathon_end_date_time: string;
  registration_start_date_time: string;
  registration_end_date_time: string;
  project_submission_start_date_time: string;
  project_submission_end_date_time: string;
  show_registration_deadline_countdown: boolean;
  show_submission_deadline_countdown: boolean;
  rules?: string | null;
  communication_link?: string | null;
  winners_announcement_date?: string | null;
}

export interface HackathonResourcePayload {
  id?: number;
  title?: string | null;
  type?: string | null;
  challengeIds?: number[] | null;
  technologies?: string[] | null;
  url?: string | null;
  is_downloadable?: boolean | null;
}

class EditHackathonService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async update_project_header(
    hackathon_id: number,
    form_data: Partial<{
      hackathonHeader: string | File | null;
      hackathonLogo: string | File | null;
      name: string | null;
      technologies: string[];
    }>
  ) {
    try {
      let { hackathonHeader, hackathonLogo, name, technologies } = form_data;

      if (hackathonHeader && hackathonHeader instanceof File) {
        const { publicUrl: public_url, error: upload_error } =
          await uploadImage({
            file: hackathonHeader,
            userId: hackathon_id?.toString(),
            bucketName: "hackathon-images",
            folderPath: "banners",
          });

        if (upload_error || !public_url) return (hackathonHeader = null);

        hackathonHeader = public_url;
      }

      if (hackathonLogo && hackathonLogo instanceof File) {
        const { publicUrl: public_url, error: upload_error } =
          await uploadImage({
            file: hackathonLogo,
            userId: hackathon_id?.toString(),
            bucketName: "hackathon-images",
            folderPath: "logos",
          });

        if (upload_error || !public_url) return (hackathonLogo = null);

        hackathonLogo = public_url;
      }

      const { data, error } = await this.supabase
        .from("hackathons")
        .update({
          avatar_url: hackathonLogo ? hackathonLogo : undefined,
          banner_url: hackathonHeader ? hackathonHeader : undefined,
          name: name ? name : undefined,
          technologies: technologies,
        })
        .eq("id", hackathon_id);

      if (error) {
        throw new Error(`Could not Update Hackathon: ${error}`);
      }

      return data;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new Error(`Validation Error: ${error.errors.join(", ")}`);
      }
      throw error;
    }
  }

  async update_project_description(hackathon_id: number, description: string) {
    const { data, error } = await this.supabase
      .from("hackathons")
      .update({
        description,
      })
      .eq("id", hackathon_id);

    if (error) {
      throw new Error(`Could not Update Hackathon: ${error}`);
    }

    return data;
  }

  async update_hackathon_faqs(
    hackathon_id: number,
    body: { id?: number; question: string; answer: string }[]
  ) {
    const results = [];

    // Get all existing FAQs for this hackathon
    const { data: existingFaqs, error: fetchError } = await this.supabase
      .from("hackathon_faqs")
      .select("id")
      .eq("hackathon_id", hackathon_id);

    if (fetchError) {
      throw new Error(`Could not fetch existing FAQs: ${fetchError}`);
    }

    const newFaqIds = new Set(
      body.map((faq) => faq.id).filter((id) => id !== undefined)
    );

    // Delete FAQs that aren't in the input body
    const faqsToDelete = existingFaqs?.filter((faq) => !newFaqIds.has(faq.id));
    if (faqsToDelete && faqsToDelete.length > 0) {
      const { error: deleteError } = await this.supabase
        .from("hackathon_faqs")
        .delete()
        .in(
          "id",
          faqsToDelete.map((faq) => faq.id)
        );

      if (deleteError) {
        throw new Error(`Could not delete FAQs: ${deleteError}`);
      }
    }

    // Process new and updated FAQs
    for (const faq of body) {
      if (!faq.id) {
        // Create new FAQ
        const { data: newFaq, error: createError } = await this.supabase
          .from("hackathon_faqs")
          .insert({
            hackathon_id,
            question: faq.question,
            answer: faq.answer,
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Could not create FAQ: ${createError}`);
        }
        results.push(newFaq);
        continue;
      }

      // Check if FAQ exists
      const { data: existingFaq, error: fetchError } = await this.supabase
        .from("hackathon_faqs")
        .select("*")
        .eq("id", faq.id)
        .single();

      // If FAQ doesn't exist or there's an error, create new one
      if (fetchError || !existingFaq) {
        const { data: newFaq, error: createError } = await this.supabase
          .from("hackathon_faqs")
          .insert({
            hackathon_id,
            question: faq.question,
            answer: faq.answer,
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Could not create FAQ: ${createError}`);
        }
        results.push(newFaq);
        continue;
      }

      // Update existing FAQ
      const { data: updatedFaq, error: updateError } = await this.supabase
        .from("hackathon_faqs")
        .update({
          question: faq.question,
          answer: faq.answer,
        })
        .eq("id", faq.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Could not update FAQ: ${updateError}`);
      }
      results.push(updatedFaq);
    }

    return results;
  }

  async update_hackathon_vips(hackathon_id: number, body: VipList[]) {
    const results: any[] = [];
    const userIds = body.filter((vip) => vip.id).map((vip) => vip.id!);
    const emails = body
      .filter((vip) => vip.email && !vip.id)
      .map((vip) => vip.email!);

    // Batch fetch current VIPs and roles upfront
    const [currentVipsResult, rolesResult] = await Promise.all([
      this.supabase
        .from("hackathon_vips")
        .select("user_id")
        .eq("hackathon_id", hackathon_id),
      this.supabase.from("roles").select("id, name"),
    ]);

    if (currentVipsResult.error)
      throw new Error(currentVipsResult.error.message);
    if (rolesResult.error)
      throw new Error(`Failed to fetch roles: ${rolesResult.error.message}`);

    const currentVipIds = currentVipsResult.data?.map((v) => v.user_id) || [];
    const roleMap = new Map(
      rolesResult.data?.map((r) => [r.name.toLowerCase(), r.id]) || []
    );

    // Batch fetch existing judging records and pending invitations
    const [existingJudgingsResult, pendingInvitationsResult] =
      await Promise.all([
        userIds.length > 0
          ? this.supabase
              .from("judgings")
              .select("id, user_id")
              .eq("hackathon_id", hackathon_id)
              .in("user_id", userIds)
          : Promise.resolve({ data: [], error: null }),
        emails.length > 0
          ? this.supabase
              .from("pending_invitations")
              .select("*")
              .eq("hackathon_id", hackathon_id)
              .in("email", emails)
          : Promise.resolve({ data: [], error: null }),
      ]);

    if (existingJudgingsResult.error)
      throw new Error(existingJudgingsResult.error.message);
    if (pendingInvitationsResult.error)
      throw new Error(pendingInvitationsResult.error.message);

    const existingJudgings = new Map(
      existingJudgingsResult.data?.map((j) => [j.user_id, j.id]) || []
    );
    const existingInvitations = new Map(
      pendingInvitationsResult.data?.map((inv) => [inv.email, inv]) || []
    );

    // Prepare batch operations
    const judgingOperations: Array<() => Promise<void>> = [];
    const vipOperations: Array<() => Promise<void>> = [];
    const invitationOperations: Array<() => Promise<void>> = [];

    // Process existing users
    for (const vip of body.filter((v) => v.id)) {
      const roleIds = vip.roles
        .filter((role): role is VIPRole => role !== undefined)
        .map((role) => roleMap.get(role.toLowerCase()))
        .filter((id): id is number => id !== undefined);

      // Handle judging records
      if (vip.roles.includes("judge")) {
        judgingOperations.push(() =>
          this.createJudgingRecordOptimized(
            hackathon_id,
            vip.id!,
            vip.challengeIds ?? [],
            existingJudgings.get(vip.id!)
          )
        );
      } else if (existingJudgings.has(vip.id!)) {
        judgingOperations.push(() =>
          this.deleteJudgingRecordById(existingJudgings.get(vip.id!)!)
        );
      }

      // Handle VIP records
      // Handle VIP record first
      const vipPromise = this.createVipRecordIfNotExistsOptimized(
        hackathon_id,
        vip
      );
      vipOperations.push(async () => {
        await vipPromise; // Wait for VIP creation to complete

        // Only update roles after VIP record exists
        if (roleIds.length > 0) {
          await this.updateUserRolesOptimized(vip.id!, roleIds, hackathon_id);
        }
      });

      results.push({ id: vip.id, email: vip.email, roles: vip.roles });
    }

    // Process invitations
    for (const vip of body.filter((v) => !v.id && v.email)) {
      if (vip.roles.includes("judge")) {
        const existingInvite = existingInvitations.get(vip.email!);
        if (
          !existingInvite ||
          existingInvite.invitation_status !== "accepted"
        ) {
          invitationOperations.push(async () => {
            const invite = await this.handleJudgeInvitationOptimized(
              vip.email!,
              hackathon_id,
              existingInvite
            );
            if (invite) results.push(invite);
          });
        }
      }
    }

    // Execute all operations in parallel batches
    await Promise.all([
      ...judgingOperations.map((op) => op()),
      ...vipOperations.map((op) => op()),
      ...invitationOperations.map((op) => op()),
    ]);

    // Clean up removed VIPs
    const vipsToRemove = currentVipIds.filter((id) => !userIds.includes(id));
    if (vipsToRemove.length > 0) {
      await Promise.all([
        this.supabase
          .from("hackathon_vips")
          .delete()
          .eq("hackathon_id", hackathon_id)
          .in("user_id", vipsToRemove),
        this.supabase
          .from("judgings")
          .delete()
          .eq("hackathon_id", hackathon_id)
          .in("user_id", vipsToRemove),
      ]);
    }

    return results;
  }

  private async updateUserRolesOptimized(
    user_id: string,
    newRoleIds: number[],
    hackathon_id: number
  ) {
    const operations = [
      this.supabase
        .from("users")
        .update({ role_id: newRoleIds[0] })
        .eq("id", user_id),
      this.supabase
        .from("hackathon_vip_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("hackathon_id", hackathon_id)
        .not("role_id", "in", `(${newRoleIds.join(",")})`),
      this.supabase.from("hackathon_vip_roles").upsert(
        newRoleIds.map((rid) => ({
          user_id,
          role_id: rid,
          hackathon_id,
        })),
        { onConflict: "user_id,role_id,hackathon_id" }
      ),
    ];

    const results = await Promise.all(operations);

    for (const result of results) {
      if (result.error) {
        throw new Error(`Error updating user roles: ${result.error.message}`);
      }
    }
  }

  private async createJudgingRecordOptimized(
    hackathon_id: number,
    user_id: string,
    challengeIds: string[],
    existingJudgingId?: number
  ) {
    let judgingId = existingJudgingId;

    // Create judging record if it doesn't exist
    if (!judgingId) {
      const { data: newJudging, error } = await this.supabase
        .from("judgings")
        .insert({ hackathon_id, user_id, is_submitted: false })
        .select("id")
        .single();

      if (error) {
        throw new Error(`Failed to create judging record: ${error.message}`);
      }
      judgingId = newJudging.id;
    }

    // Get existing challenges in one query
    const { data: existingChallenges } = await this.supabase
      .from("judging_challenges")
      .select("challenge_id")
      .eq("judging_id", judgingId);

    const existingChallengeIds = new Set(
      existingChallenges?.map((c) => c.challenge_id.toString()) || []
    );
    const newChallengeIdsSet = new Set(challengeIds.filter((id) => id));

    const challengesToAdd = Array.from(newChallengeIdsSet)
      .filter((id) => !existingChallengeIds.has(id))
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    const challengesToRemove = Array.from(existingChallengeIds)
      .filter((id) => !newChallengeIdsSet.has(id))
      .map((id) => parseInt(id));

    // Execute adds and removes in parallel
    const operations = [];

    if (challengesToRemove.length > 0) {
      operations.push(
        this.supabase
          .from("judging_challenges")
          .delete()
          .eq("judging_id", judgingId)
          .in("challenge_id", challengesToRemove)
      );
    }

    if (challengesToAdd.length > 0) {
      operations.push(
        this.supabase.from("judging_challenges").insert(
          challengesToAdd.map((challengeId) => ({
            challenge_id: challengeId,
            is_winner_assigner: false,
            judging_id: judgingId,
          }))
        )
      );
    }

    if (operations.length > 0) {
      const results = await Promise.all(operations);
      for (const result of results) {
        if (result.error) {
          throw new Error(
            `Failed to update judging challenges: ${result.error.message}`
          );
        }
      }
    }
  }

  private async deleteJudgingRecordById(judgingId: number) {
    const operations = [
      this.supabase
        .from("judging_challenges")
        .delete()
        .eq("judging_id", judgingId),
      this.supabase.from("judgings").delete().eq("id", judgingId),
    ];

    const results = await Promise.all(operations);

    for (const result of results) {
      if (result.error) {
        throw new Error(
          `Failed to delete judging record: ${result.error.message}`
        );
      }
    }
  }

  private async createVipRecordIfNotExistsOptimized(
    hackathon_id: number,
    vip: VipList
  ) {
    const { data: existing, error: lookupError } = await this.supabase
      .from("hackathon_vips")
      .select("user_id")
      .eq("hackathon_id", hackathon_id)
      .eq("user_id", vip.id!)
      .maybeSingle();

    if (lookupError) throw new Error(lookupError.message);

    const vipData = {
      office_hours: vip.office_hours,
      is_featured: vip.is_featured ?? false,
    };

    if (existing) {
      const { error: updateError } = await this.supabase
        .from("hackathon_vips")
        .update(vipData)
        .eq("hackathon_id", hackathon_id)
        .eq("user_id", vip.id!);

      if (updateError) throw new Error(updateError.message);
    } else {
      const { error: insertError, data } = await this.supabase
        .from("hackathon_vips")
        .insert({
          hackathon_id,
          user_id: vip.id!,
          status: "pending",
          ...vipData,
        })
        .select("*, status, hackathons(name), users(*)")
        .maybeSingle();

      if (insertError) throw new Error(insertError.message);

      const transactionId = crypto.randomUUID();

      const payload = {
        hackathon_id,
        hackathon_name: data?.hackathons?.name,
        status: data?.status,
        transaction_id: transactionId,
      };

      const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

      const { result } = await novu.trigger({
        workflowId: "invite-user-to-vip-flow-receiver",
        transactionId: transactionId,
        to: [
          {
            subscriberId: data?.users?.id!,
            firstName: data?.users?.full_name?.trim() ?? undefined,
            email: data?.users?.email ?? undefined,
          },
        ],
        payload,
      });

      if (result.status === "processed") {
        const { error } = await this.supabase
          .from("hackathon_notification_data")
          .insert({
            transaction_id: result.transactionId,
            payload,
          })
          .select("*");

        if (error) throw error;
      }
    }
  }

  private async handleJudgeInvitationOptimized(
    email: string,
    hackathon_id: number,
    existingInvite?: any
  ) {
    if (existingInvite?.invitation_status === "accepted") return existingInvite;

    let invite = existingInvite;

    if (!invite) {
      const { data: newInvite, error: inviteError } = await this.supabase
        .from("pending_invitations")
        .insert({
          email,
          hackathon_id,
          role: "judge",
          invitation_status: "pending",
        })
        .select()
        .single();

      if (inviteError) throw new Error(inviteError.message);
      invite = newInvite;
    }

    // Send email in parallel (don't await)
    this.sendInvitationEmail(email).catch(console.error);

    return invite;
  }

  private async sendInvitationEmail(email: string) {
    await axios.post(
      "https://app.loops.so/api/v1/transactional",
      { transactionalId: "cmcvpv6232ywhyh0jkjtkjzv9", email },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }
    );
  }

  async update_project_details(
    hackathon_id: number,
    body: Partial<UpdateHackathonDetailsProps>
  ) {
    const { data, error } = await this.supabase
      .from("hackathons")
      .update({
        type: body?.type,
        start_date: body?.hackathon_start_date_time,
        end_date: body?.hackathon_end_date_time,
        registration_start_date: body.registration_start_date_time,
        deadline_to_join: body?.registration_end_date_time,
        submission_start_date: body?.project_submission_start_date_time,
        deadline_to_submit: body.project_submission_end_date_time,
        rules: body?.rules,
        communication_link: body?.communication_link,
        winners_announcement_date: body?.winners_announcement_date,
      })
      .eq("id", hackathon_id);

    if (error) {
      throw new Error(`Could not Update Hackathon: ${error}`);
    }

    return data;
  }

  async update_hackathon_resources(
    hackathon_id: number,
    data: HackathonResourcePayload[]
  ) {
    const results = [];

    for (const item of data) {
      const { challengeIds, ...rest } = item;

      // Update existing resource
      if (item.id) {
        const { data: availableResource, error: availableResourceError } =
          await this.supabase
            .from("hackathon_resources")
            .select("*")
            .eq("id", item.id)
            .maybeSingle();

        console.log({ availableResource, availableResourceError });
        if (availableResourceError || !availableResource) {
          const response = await this.create_resource_information(
            hackathon_id,
            item
          );
          if (response) {
            results.push(response);
          }
        }
        if (availableResource) {
          const response = await this.update_resource_information(item);
          if (response) {
            results.push(response);
          }
        }
      } else {
        const newResource = await this.create_resource_information(
          hackathon_id,
          item
        );

        results.push(newResource);
      }
    }

    return results;
  }

  private async create_resource_information(
    hackathonId: number,
    data: HackathonResourcePayload
  ) {
    const { challengeIds, id, ...rest } = data;
    console.log("creating");

    const { data: newResource, error: createError } = await this.supabase
      .from("hackathon_resources")
      .insert({
        ...rest,
        title: rest.title || "",
        type: rest.type || "blog",
        url: rest.url || "",
        is_downloadable: rest.is_downloadable ?? false,
        hackathon_id: hackathonId,
      })
      .select()
      .maybeSingle();

    if (createError) {
      console.error(`Failed to create resource: ${createError.message}`);
      return;
    }

    if (challengeIds && challengeIds?.length > 0 && newResource) {
      const newMappings = challengeIds.map((challengeId) => ({
        resource_id: newResource.id,
        challenge_id: challengeId,
      }));

      const { error: mappingError } = await this.supabase
        .from("hackathon_resource_challenges")
        .insert(newMappings);

      if (mappingError) {
        console.error(
          `Failed to create resource challenge mappings: ${mappingError.message}`
        );
        return;
      }
    }

    return newResource;
  }

  private async update_resource_information(
    data: HackathonResourcePayload
  ): Promise<any> {
    if (!data?.id) {
      return;
    }
    try {
      const { challengeIds, ...rest } = data;

      const { data: updatedResource, error } = await this.supabase
        .from("hackathon_resources")
        .update({
          title: rest.title || "",
          type: rest.type || "blog",
          url: rest.url || "",
          is_downloadable: rest.is_downloadable ?? false,
          technologies: rest.technologies ?? [],
        })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        console.error(`Failed to update resource: ${error.message}`);
        return;
      }

      // Handle existing resource challenges
      if (challengeIds && challengeIds?.length >= 0) {
        const { data: existingMappings, error: fetchError } =
          await this.supabase
            .from("hackathon_resource_challenges")
            .select("*")
            .eq("resource_id", data.id);

        if (fetchError) {
          console.error(
            `Failed to fetch existing resource challenges: ${fetchError.message}`
          );
          return;
        }

        // Delete all existing mappings if no challenge IDs provided
        if (challengeIds.length === 0) {
          const { error: deleteError } = await this.supabase
            .from("hackathon_resource_challenges")
            .delete()
            .eq("resource_id", data?.id);

          if (deleteError) {
            console.error(
              `Failed to delete resource challenges: ${deleteError.message}`
            );
            return;
          }
        } else {
          const existingChallengeIds =
            existingMappings?.map((m) => m.challenge_id) || [];

          const challengesToDelete = existingChallengeIds.filter(
            (id: number | null) => id !== null && !challengeIds.includes(id)
          );

          const challengesToAdd = challengeIds.filter(
            (id) => !existingChallengeIds.includes(id)
          );

          if (challengesToDelete.length > 0) {
            const { error: deleteError } = await this.supabase
              .from("hackathon_resource_challenges")
              .delete()
              .eq("resource_id", data.id)
              .in("challenge_id", challengesToDelete);

            if (deleteError) {
              console.error(
                `Failed to delete resource challenges: ${deleteError.message}`
              );
              return;
            }
          }

          if (challengesToAdd.length > 0) {
            const newMappings = challengesToAdd.map((challengeId) => ({
              resource_id: data.id,
              challenge_id: challengeId,
            }));

            const { error: insertError } = await this.supabase
              .from("hackathon_resource_challenges")
              .insert(newMappings);

            if (insertError) {
              console.error(
                `Failed to insert resource challenges: ${insertError.message}`
              );
              return;
            }
          }
        }
      }

      return updatedResource;
    } catch (error) {
      console.error("Error updating challenge information:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred while updating challenge");
    }
  }

  async update_hackathon_challenges(
    hackathon_id: number,
    data: ChallengeFormData
  ) {
    const challenge = data.challenge;

    if (challenge.id) {
      const { data: availableChallenge, error: availableChallengeError } =
        await this.supabase
          .from("hackathon_challenges")
          .select("*")
          .eq("id", challenge?.id)
          .single();

      if (availableChallengeError || !availableChallenge) {
        await this.create_challenge_information(hackathon_id, data);
      }
      if (availableChallenge) {
        await this.update_challenge_information(data);
      }
    } else {
      const item = await this.create_challenge_information(hackathon_id, data);
      if (item) {
        challenge.id = item.id;
      }
    }

    const judges = data.judges;

    if (judges.customJudgeEmail) {
      const { data } = await this.supabase
        .from("users")
        .select(
          `
            id,
            judgings (
              user_id
            )
          `
        )
        .eq("email", judges.customJudgeEmail)
        .maybeSingle();

      if (data) {
        judges.judges.push(data.id);
      } else {
        const technology_owner_service = new TechnologyOwnerService(
          this.supabase
        );

        await technology_owner_service.invite_judge(
          judges.customJudgeEmail,
          hackathon_id
        );
      }
    }

    // Process judges assignments
    if (judges.judges?.length) {
      const { data: existingJudgings, error: judgingsError } =
        await this.supabase
          .from("judgings")
          .select("*")
          .eq("hackathon_id", hackathon_id)
          .in("user_id", judges.judges);

      if (judgingsError) {
        throw new Error(
          `Failed to fetch existing judgings: ${judgingsError.message}`
        );
      }

      // Create map of existing judgings by user_id for quick lookup
      const existingJudgingsMap = new Map(
        existingJudgings?.map((judging) => [judging.user_id, judging]) || []
      );

      // Process each judge
      for (const judgeId of judges.judges) {
        let judgingId: number;

        if (!existingJudgingsMap.has(judgeId)) {
          // Create new judging record if judge doesn't exist
          const { data: newJudging, error: createError } = await this.supabase
            .from("judgings")
            .insert({
              hackathon_id,
              user_id: judgeId,
              is_submitted: false,
            })
            .select()
            .single();

          if (createError) {
            throw new Error(
              `Failed to create judging record: ${createError.message}`
            );
          }

          judgingId = newJudging.id;
          // TODO: Send email notification to new judge
        } else {
          judgingId = existingJudgingsMap.get(judgeId)!.id;
        }

        // Assign challenge to judge
        const { error: assignError } = await this.supabase
          .from("judging_challenges")
          .insert({
            challenge_id: challenge.id!,
            judging_id: judgingId,
            is_winner_assigner: false,
            submitted_winners: false,
          });

        if (assignError) {
          throw new Error(
            `Failed to assign challenge to judge: ${assignError.message}`
          );
        }
      }
    }

    return challenge;
  }

  async update_hackathon_commuity_partners(
    hackathon_id: number,
    data: {
      partner_website: string;
      id: string;
      logo_url: FormDataEntryValue | null;
    }[]
  ) {
    const results = [];

    for (const partner of data) {
      let finalLogoUrl = partner.logo_url;

      // Handle file upload if logo_url is a File
      if (partner.logo_url instanceof File) {
        const { publicUrl, error: uploadError } = await uploadImage({
          file: partner.logo_url,
          userId: hackathon_id.toString(),
          bucketName: "hackathon-images",
          folderPath: "community-partners",
        });

        if (uploadError) {
          throw new Error(`Failed to upload logo: ${uploadError}`);
        }

        finalLogoUrl = publicUrl;
      }

      // Update or insert partner
      const { data: updatedPartner, error } = await this.supabase
        .from("hackathon_community_partners")
        .upsert({
          id: parseInt(partner.id) || undefined,
          hackathon_id: hackathon_id,
          partner_website: partner.partner_website,
          logo_url: finalLogoUrl as string,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update community partner: ${error.message}`);
      }

      results.push(updatedPartner);
    }

    return results;
  }

  private async update_challenge_information(
    data: ChallengeFormData
  ): Promise<any> {
    const { challenge } = data;

    if (!challenge?.id) {
      throw new Error("Challenge ID is required for update");
    }

    try {
      const { prizes, created_at, updated_at, sponsors, ...updateFields } =
        challenge;

      const processedSponsors = await this.processSponsorsWithLogos(sponsors);

      const { data: updatedChallenge, error } = await this.supabase
        .from("hackathon_challenges")
        .update({
          ...updateFields,
          sponsors: processedSponsors,
        })
        .eq("id", challenge.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update challenge: ${error.message}`);
      }

      await this.processChallengePrizes(challenge.id, prizes);

      return updatedChallenge;
    } catch (error) {
      console.error("Error updating challenge information:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred while updating challenge");
    }
  }

  private async create_challenge_information(
    hackathonId: number,
    data: ChallengeFormData
  ) {
    const { challenge } = data;

    if (!challenge?.id) {
      throw new Error("Challenge ID is required for update");
    }

    try {
      const { prizes, created_at, updated_at, sponsors, ...updateFields } =
        challenge;

      const processedSponsors = await this.processSponsorsWithLogos(sponsors);

      const { data: createdChallenge, error } = await this.supabase
        .from("hackathon_challenges")
        .insert({
          ...updateFields,
          sponsors: processedSponsors,
          id: challenge?.id ?? undefined,
          hackathon_id: hackathonId,
          challenge_name: challenge?.challenge_name ?? "",
          description: challenge?.description ?? "",
          example_projects: challenge?.example_projects,
          is_round_2_only: challenge?.is_round_2_only,
          label: challenge?.label,
          required_tech: challenge?.required_tech,
          submission_requirements: challenge?.submission_requirements,
          technologies: challenge?.technologies,
        })
        .select()
        .maybeSingle();

      if (error) {
        throw new Error(`Failed to create challenge: ${error.message}`);
      }

      await this.processChallengePrizes(challenge.id, prizes);

      return createdChallenge;
    } catch (error) {
      console.error("Error creating challenge information:", error);
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred while creating challenge");
    }
  }

  private async processSponsorsWithLogos(sponsors: any[]): Promise<any[]> {
    if (!sponsors?.length) return [];

    return Promise.all(
      sponsors.map(async (sponsor) => {
        if (!(sponsor?.logo instanceof File)) {
          return sponsor;
        }

        try {
          const { publicUrl } = await uploadImage({
            file: sponsor.logo,
            userId: sponsor.name,
            bucketName: "hackathon-images",
            folderPath: "sponsors",
          });

          return { ...sponsor, logo: publicUrl };
        } catch (error) {
          console.error(
            `Failed to upload logo for sponsor ${sponsor.name}:`,
            error
          );

          return { ...sponsor, logo: "" };
        }
      })
    );
  }

  private async processChallengePrizes(
    challenge_id: number,
    prizes: EditHackathonChallengePrize[]
  ) {
    const formattedPrizes = await Promise.all(
      prizes.map(async (prize) => {
        if (!(prize?.company_partner_logo instanceof File)) {
          return prize;
        }

        try {
          const { publicUrl } = await uploadImage({
            file: prize.company_partner_logo,
            userId: `PRIZE_${prize.id}_COMPANY`,
            bucketName: "hackathon-images",
            folderPath: "organizers",
          });

          return { ...prize, company_partner_logo: publicUrl };
        } catch (error) {
          console.error(
            `Failed to upload company partner logo for prize ${prize.title}:`,
            error
          );

          return { ...prize, company_partner_logo: "" };
        }
      })
    );

    // Separate prizes into existing and new ones
    const existingPrizes = formattedPrizes.filter((prize) => prize.id);
    const newPrizes = formattedPrizes.filter((prize) => !prize.id);

    // Update existing prizes
    if (existingPrizes.length > 0) {
      const { error: updateError } = await this.supabase
        .from("hackathon_challenge_bounties")
        .upsert(
          existingPrizes.map((prize) => ({
            id: prize.id,
            title: prize?.title ?? "",
            company_partner_logo: prize?.company_partner_logo as string,
            prize_custom: prize?.prize_custom,
            prize_tokens: prize?.prize_tokens,
            prize_usd: prize?.prize_usd,
            rank: prize?.rank,
            challenge_id,
          }))
        );

      if (updateError) {
        throw new Error(
          `Failed to update existing prizes: ${updateError.message}`
        );
      }
    }

    // Insert new prizes
    if (newPrizes.length > 0) {
      const { error: insertError } = await this.supabase
        .from("hackathon_challenge_bounties")
        .insert(
          newPrizes.map((prize) => ({
            title: prize?.title ?? "",
            company_partner_logo: prize?.company_partner_logo as string,
            prize_custom: prize.prize_custom,
            prize_tokens: prize.prize_tokens,
            prize_usd: prize.prize_usd,
            rank: prize.rank,
            challenge_id,
          }))
        );

      if (insertError) {
        throw new Error(`Failed to insert new prizes: ${insertError.message}`);
      }
    }
  }

  async get_hackathon_completion_percentage(hackathon_id: number) {
    let completionPercentage = 0;
    const totalPoints = 100;

    // Fetch hackathon data
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select(
        `
      *,
      vips:hackathon_vips(count),
      resources:hackathon_resources(count),
      faqs:hackathon_faqs(count),
      challenges:hackathon_challenges(count),
      sessions:hackathon_sessions(count)
    `
      )
      .eq("id", hackathon_id)
      .single();

    if (hackathonError) {
      throw new Error(
        `Failed to fetch hackathon data: ${hackathonError.message}`
      );
    }

    // Check VIPs (20 points)
    if (hackathon?.vips?.[0]?.count >= 1) {
      completionPercentage += 20;
    }

    // Check Resources (15 points)
    if (hackathon?.resources?.[0]?.count >= 1) {
      completionPercentage += 15;
    }

    // Check FAQs (15 points)
    if (hackathon?.faqs?.[0]?.count >= 1) {
      completionPercentage += 15;
    }

    // Check Challenges (15 points)
    if (hackathon?.challenges?.[0]?.count >= 1) {
      completionPercentage += 15;
    }

    // Check About/Description (15 points)
    if (hackathon?.description && hackathon.description.trim().length > 0) {
      completionPercentage += 15;
    }

    // Check Sessions (10 points)
    if (hackathon?.sessions?.[0]?.count >= 1) {
      completionPercentage += 10;
    }

    // Check Registration Dates (10 points)
    if (hackathon?.registration_start_date && hackathon?.deadline_to_join) {
      completionPercentage += 10;
    }

    return {
      completionPercentage,
      maxPoints: totalPoints,
      details: {
        hasVips: hackathon?.vips?.[0]?.count >= 1,
        hasResources: hackathon?.resources?.[0]?.count >= 1,
        hasFaqs: hackathon?.faqs?.[0]?.count >= 1,
        hasChallenges: hackathon?.challenges?.[0]?.count >= 1,
        hasDescription: Boolean(hackathon?.description?.trim()),
        hasSessions: hackathon?.sessions?.[0]?.count >= 1,
        hasRegistrationDates: Boolean(
          hackathon?.registration_start_date && hackathon?.deadline_to_join
        ),
      },
    };
  }
}

export default EditHackathonService;
