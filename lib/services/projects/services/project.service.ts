import { HackathonChallenges } from "@/types/entities";
import { Novu } from "@novu/api";
import { MessagesControllerGetMessagesRequest } from "@novu/api/models/operations";
import { SupabaseClient, User } from "@supabase/supabase-js";
import axios, { AxiosError } from "axios";
import JudgingService from "../../judging/services/judging.service";
import ApiBaseService from "../../utils/baseService";
import { TokenService } from "../../utils/tokenService";
import { uploadImage } from "../../utils/uploadImage";
import { uploadVideo } from "../../utils/uploadVideo";
import {
  InvitationExistsError,
  NoAcceptannceError,
  ProjectMembershipExistsError,
  ProjectNotFoundException,
  ProjectServiceError,
  UserNotFoundException,
} from "../error";

type BaseProjectPayload = {
  name?: string;
  challengeIds?: number[];
};

type AIProjectPayload = BaseProjectPayload & {
  ai: true;
  projectUrl: string;
  hackathonId: number;
  creator_id: string;
};

type NonAIProjectPayload = {
  name?: string;
  projectUrl?: string | null;
  hackathonId: number;
  challengeIds: number[];
  creator_id: string;
  logo_url: string;
  project_code_type?: "fresh_code" | "existing_code";
  ai: false;
};

export type CreateProjectPayload = AIProjectPayload | NonAIProjectPayload;

interface ProjectAnalysisResult {
  challengeIds: number[];
  technologies: string[];
  description: string;
  title: string;
  tagline: string;
}

class ProjectService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async get_all_submitted_projects() {
    const { data, error } = await this.supabase
      .from("projects")
      .select(
        `
          *, 
          hackathons (name, organizer:technology_owners(*)),

          project_team_members (
            id,
            is_project_manager,
            status,
            users (
              id,
              full_name,
              email,
              avatar_url,
              participant_wallets (
                wallet_address,
                primary_wallet
              )
            )
          )
        `
      )
      .eq("submitted", true)
      .eq("project_team_members.status", "confirmed");

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data ?? [];
  }
  async create_project_with_bot(projectUrl: string, creator_id: string) {
    const response = await axios.get<{ data: ProjectAnalysisResult }>(
      "https://devspot-judge-agent.onrender.com/project/generate",
      {
        params: {
          project_url: projectUrl,
          user_id: creator_id,
        },
      }
    );

    if (!response?.data) return null;

    return response.data?.data;
  }

  async create_project(body: CreateProjectPayload) {
    const { hackathonId, creator_id } = body;

    try {
      await this.validateHackathonAndParticipant(hackathonId, creator_id);

      if (body?.ai) {
        return await this.create_project_with_bot(body.projectUrl, creator_id);

        // return await this.createAIProject(body, hackathonId, creator_id);
      }

      return await this.createManualProject(body, hackathonId, creator_id);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`${error?.response?.data?.error}`);
      }

      throw error;
    }
  }

  private async validateHackathonAndParticipant(
    hackathonId: number,
    creator_id: string
  ) {
    const { data: hackathon, error: hackathonError } = await this.supabase
      .from("hackathons")
      .select("status")
      .eq("id", hackathonId)
      .single();

    if (hackathonError) {
      throw new Error(`Could not fetch hackathon: ${hackathonError.message}`);
    }

    if (hackathon.status !== "live") {
      throw new Error(
        `Hackathon is not live (current status: ${hackathon.status})`
      );
    }

    const { error: participantError } = await this.supabase
      .from("hackathon_participants")
      .select("id")
      .eq("hackathon_id", hackathonId)
      .eq("participant_id", creator_id)
      .eq("application_status", "accepted")
      .single();

    if (participantError) {
      throw new Error(
        `User is not registered or not yet accepted: ${participantError.message}`
      );
    }
  }

  private async createAIProject(
    body: AIProjectPayload,
    hackathonId: number,
    creator_id: string
  ) {
    const response = await this.create_project_with_bot(body.projectUrl, "");
    if (!response) {
      throw new Error("Failed to fetch project analysis");
    }

    const { technologies, description, title, tagline, challengeIds } =
      response;

    const project = await this.insertProject({
      project_url: body.projectUrl,
      hackathon_id: hackathonId,
      submitted: false,
      name: body?.name ?? title ?? "Untitled Project",
      description,
      tagline,
      technologies,
    });

    if (challengeIds.length < 1)
      throw new Error(
        "Invalid Project - Doesn't Match any existing Challenges"
      );

    await this.linkProjectChallenges(project.id, challengeIds);
    await this.addTeamMember(project.id, creator_id);
    const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

    await novu.trigger({
      workflowId: "project-creation-success",
      transactionId: project.id.toString(),
      to: {
        subscriberId: creator_id,
      },
      payload: {
        project_id: project.id,
        hackathon_name: project?.hackathons?.name,
        hackathon_profile: `${process.env.NEXT_PUBLIC_PROTOCOL}${process.env.NEXT_PUBLIC_BASE_SITE_URL}/en/hackathons/${project?.hackathons.id}`,
      },
    });

    return project;
  }

  private async createManualProject(
    body: NonAIProjectPayload,
    hackathonId: number,
    creator_id: string
  ) {
    const project = await this.insertProject({
      project_url: body.projectUrl,
      hackathon_id: hackathonId,
      submitted: false,
      name: body.name,
      project_code_type: body.project_code_type,
      logo_url: body.logo_url,
    });

    await this.linkProjectChallenges(project.id, body.challengeIds);
    await this.addTeamMember(project.id, creator_id);

    return project;
  }

  private async insertProject(projectData: any) {
    const { data: insertedProject, error: projectError } = await this.supabase
      .from("projects")
      .insert(projectData)
      .select("*, hackathons (id, name, organizer:technology_owners(*))")
      .single();

    if (projectError) {
      throw new Error(`Failed to insert project: ${projectError.message}`);
    }

    return insertedProject;
  }

  private async linkProjectChallenges(
    projectId: number,
    challengeIds: number[]
  ) {
    const challengeInserts = challengeIds.map((challengeId) => ({
      project_id: projectId,
      challenge_id: challengeId,
    }));

    const { error: challengeError } = await this.supabase
      .from("project_challenges")
      .insert(challengeInserts);

    if (challengeError) {
      throw new Error(`Failed to link challenges: ${challengeError.message}`);
    }
  }

  private async addTeamMember(projectId: number, userId: string) {
    const { error: teamMemberError } = await this.supabase
      .from("project_team_members")
      .insert({
        project_id: projectId,
        user_id: userId,
        is_project_manager: true,
        status: "confirmed",
        prize_allocation: 100,
      })
      .select()
      .single();

    if (teamMemberError) {
      throw new Error(`Failed to Add Team member: ${teamMemberError.message}`);
    }
  }

  calculate_project_completion_rate(project: any) {
    let project_completion_rate = 0;

    // +10 if project_url is set
    if (project.project_url) {
      project_completion_rate += 20;
    }

    // // +10 if demo_url is set
    // if (project.demo_url) {
    //   project_completion_rate += 10;
    // }

    // +20 if video_url is set
    if (project.video_url) {
      project_completion_rate += 20;
    }

    // +20 if description is set
    if (project.description) {
      project_completion_rate += 10;
    }

    if (project.tagline) {
      project_completion_rate += 10;
    }

    // +20 if at least one technology is listed
    if (
      Array.isArray(project.technologies) &&
      project.technologies.length >= 1
    ) {
      project_completion_rate += 20;
    }

    if (
      Array.isArray(project?.project_challenges) &&
      project?.project_challenges?.length >= 1
    ) {
      project_completion_rate += 20;
    }

    return project_completion_rate;
  }

  async get_a_project(project_id: number, user_id?: string) {
    const { data: project, error: project_error } = await this.supabase
      .from("projects")
      .select(
        `
      *,
      hackathons (name, team_limit, deadline_to_submit),
      project_challenges (*, hackathon_challenges(*)),
      project_team_members (
        id,
        is_project_manager,
        prize_allocation,
        status,
        user_id,
        users (
          id,
          full_name,
          email,
          avatar_url
        )
      )
    `
      )
      .eq("id", project_id)
      .single();

    if (project_error) {
      throw new Error(`Could not fetch project: ${project_error.message}`);
    }
    let is_owner = false;

    if (user_id) {
      const { data: team_member } = await this.supabase
        .from("project_team_members")
        .select("*")
        .eq("project_id", project_id)
        .eq("user_id", user_id)
        .eq("status", "confirmed")
        .single();

      is_owner = !!team_member;
    }

    let project_completion_rate =
      this.calculate_project_completion_rate(project);

    return { ...project, is_owner, project_completion_rate };
  }

  async update_project_video(project_id: number, form_data: FormData) {
    const file = form_data.get("video");

    if (!file || !(file instanceof File)) {
      throw new Error("video must be a valid file");
    }

    const { publicUrl: public_url, error: upload_error } = await uploadVideo({
      file,
      userId: project_id?.toString(),
      bucketName: "project-videos",
      folderPath: "videos",
    });

    if (upload_error) {
      throw new Error(`Video upload failed: ${upload_error}`);
    }

    const { error: update_error } = await this.supabase
      .from("projects")
      .update({ video_url: public_url })
      .eq("id", project_id);

    if (update_error) {
      throw new Error(
        `Failed to update project Video: ${update_error.message}`
      );
    }

    return {
      videoUrl: public_url,
    };
  }

  async update_project(
    projectId: number,
    updates: Partial<{
      name: string;
      description: string;
      video_url: string;
      demo_url: string;
      project_url: string;
      logo_url: string;
      header_url: string;
      submitted: boolean;
      technologies: string[];
      challenge_ids: number[];
      project_code_type?: "fresh_code" | "existing_code";
    }>
  ) {
    const { challenge_ids, ...rest } = updates;
    const projectFields: Partial<{
      name: string;
      description: string;
      video_url: string;
      demo_url: string;
      project_url: string;
      logo_url: string;
      header_url: string;
      submitted: boolean;
      technologies: string[];
      project_code_type?: "fresh_code" | "existing_code";
    }> = rest;

    // if (video_url) {
    //   try {
    //     const updatedVideoUrl = await this.update_project_video(video_url);
    //     if (updatedVideoUrl) {
    //       projectFields.video_url = updatedVideoUrl;
    //     }
    //   } catch (error) {
    //     console.error("Error updating video:", error);
    //   }
    // }

    const { data: updatedProject, error: updateError } = await this.supabase
      .from("projects")
      .update(projectFields)
      .eq("id", projectId)
      .select()
      .maybeSingle();

    if (updateError) {
      throw new Error(`Failed to update project: ${updateError.message}`);
    }

    // If challenge_ids provided, update project_challenges
    if (challenge_ids) {
      const { error: deleteError } = await this.supabase
        .from("project_challenges")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) {
        throw new Error(
          `Failed to delete old challenges: ${deleteError.message}`
        );
      }

      const newChallengeLinks = challenge_ids.map((challenge_id) => ({
        project_id: projectId,
        challenge_id,
      }));

      const { error: insertError } = await this.supabase
        .from("project_challenges")
        .insert(newChallengeLinks);

      if (insertError) {
        throw new Error(
          `Failed to insert new challenges: ${insertError.message}`
        );
      }
    }

    if (projectFields.technologies) {
      const tokenService = new TokenService(this.supabase);

      const { data: project_members = [] } = await this.supabase
        .from("project_team_members")
        .select("*")
        .eq("project_id", updatedProject?.id!);

      const tokenAmount = projectFields.technologies.slice(0, 5).length * 10;

      for (let member of project_members ?? []) {
        const ref = `project_technologies_bonus_${member.user_id}_${updatedProject?.id}`;

        const existingToken = await tokenService.getTransactionByRef(ref);

        if (tokenAmount > existingToken?.amount) {
          await tokenService.awardTokens({
            userId: member.user_id,
            amount: tokenAmount,
            category: "project_technologies",
            referenceId: ref,
            update: true,
          });
        }
      }
    }
    return updatedProject;
  }

  async delete_project(projectId: number) {
    const { data: deletedProject, error: deleteError } = await this.supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .select()
      .maybeSingle();

    if (deleteError) {
      throw new Error(`Failed to delete project: ${deleteError.message}`);
    }

    return deletedProject;
  }

  async team_up_with_user_request() {}

  /**
   * Invites a teammate to join a project
   *
   * This function allows project members to invite others to join their project.
   * If a participant_id is provided, it sends a direct invitation to that user.
   *
   * @param project_id - The ID of the project to invite the teammate to
   * @param participant_id - Optional ID of the specific user to invite
   * @returns The created invitation object
   * @throws {ProjectNotFoundException} If the project doesn't exist
   * @throws {UserNotFoundException} If the user doesn't exist (when participant_id is provided)
   * @throws {InvitationExistsError} If an invitation already exists for this user and project
   * @throws {ProjectMembershipExistsError} If the user is already a member of the project
   * @throws {ProjectServiceError} For other errors
   */
  async invite_team_mate(project_id: number, participant_id: string) {
    try {
      // Check if project exists
      const { data: project, error: project_error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("id", project_id)
        .single();

      if (!project || project_error) {
        throw new ProjectNotFoundException(project_id);
      }

      const { data: user, error: user_error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", participant_id)
        .single();

      if (!user || user_error) {
        throw new UserNotFoundException(participant_id);
      }

      if (!project.accepting_participants) {
        throw new NoAcceptannceError(project_id);
      }

      const { data: existing_member, error: existing_member_error } =
        await this.supabase
          .from("project_team_members")
          .select("*")
          .eq("user_id", participant_id)
          .single();

      if (existing_member || existing_member_error) {
        throw new ProjectMembershipExistsError(project_id, participant_id);
      }

      const { data: existing_invitation, error: existing_invitation_error } =
        await this.supabase
          .from("project_invitations")
          .select("*")
          .eq("user_id", participant_id)
          .eq("status", "pending")
          .single();

      if (existing_invitation || existing_invitation_error) {
        throw new InvitationExistsError(project_id, participant_id);
      }

      const { data: invitation, error: invitation_error } = await this.supabase
        .from("project_invitations")
        .insert({
          project_id: project_id,
          user_id: participant_id,
          status: "pending",
          type: "invite",
        })
        .select()
        .single();

      if (invitation_error) {
        throw new Error(
          `Failed to create invitation: ${invitation_error.message}`
        );
      }

      return invitation;
    } catch (error) {
      if (error instanceof ProjectServiceError) {
        throw error;
      }

      // Handle unexpected errors
      console.error("Error inviting team mate:", error);

      throw new ProjectServiceError(
        "Failed to invite team mate. Please try again later."
      );
    }
  }
  /**
   * Syncs a project's team‐member list.
   *
   * For each item in `team`, this will:
   *   - INSERT a new row if `is_new === true && !is_deleted`
   *   - DELETE the row if `is_deleted === true`
   *   - UPDATE `is_project_manager` if neither `is_new` nor `is_deleted`
   *
   * @param project_id - The ID of the project whose team you're updating
   * @param team - An array of diff‐objects — new members, updated flags, or deletions
   * @returns A summary of what was inserted/updated/deleted
   * @throws {ProjectNotFoundException} If the project doesn't exist
   * @throws {ProjectServiceError} For any unexpected Supabase error
   */
  async update_project_team(
    project_id: number,
    sender: User,
    origin: string,
    team:
      | {
          user_id: string;
          is_project_manager: NonNullable<boolean | undefined>;
          is_new: NonNullable<boolean | undefined>;
          is_deleted: NonNullable<boolean | undefined>;
        }[]
      | undefined
  ) {
    try {
      // 1) Ensure project exists
      const { data: project, error: projErr } = await this.supabase
        .from("projects")
        .select("id, name, hackathons (id, name)")
        .eq("id", project_id)
        .single();

      if (!project || projErr) {
        throw new ProjectNotFoundException(project_id);
      }

      if (!team || team.length === 0) {
        // nothing to do
        return { inserted: 0, updated: 0, deleted: 0 };
      }

      // 2) Partition the incoming diffs
      const toInsert = team.filter((m) => m.is_new && !m.is_deleted);
      const toDelete = team.filter((m) => m.is_deleted);
      const toUpdate = team.filter((m) => !m.is_new && !m.is_deleted);

      let inserted = 0;
      let deleted = 0;
      let updated = 0;

      // 3) Inserts
      if (toInsert.length > 0) {
        const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

        const payload = toInsert.map((m) => ({
          project_id,
          user_id: m.user_id,
          is_project_manager: m.is_project_manager,
        }));
        const { error: insertErr, data: insertedRows } = await this.supabase
          .from("project_team_members")
          .insert(payload)
          .select("id, user_id, status");
        if (insertErr) throw insertErr;

        const userIds = insertedRows!.map((r) => r.user_id);
        const { data: users, error: userErr } = await this.supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);

        if (userErr) throw userErr;

        // 3. Trigger notifications in parallel
        users!.map(async (user) => {
          const { data: hackathonParticipant, error } = await this.supabase
            .from("hackathon_participants")
            .select("id")
            .eq("participant_id", user?.id)
            .eq("hackathon_id", project?.hackathons?.id)
            .single();

          const selectedUser = insertedRows?.find(
            (r) => r.user_id === user?.id
          );

          const transactionId = crypto.randomUUID();
          const is_hackathon_participant = Boolean(hackathonParticipant);

          const payload = {
            sender_id: sender?.id,
            sender_name: sender?.user_metadata?.full_name,
            sender_profile: `${origin}/en/people/${sender.id}`,
            hackathon_id: project?.hackathons?.id,
            hackathon_name: project?.hackathons?.name,
            hackathon_profile: `${origin}/en/hackathons/${project?.hackathons?.id}`,
            project_id: project?.id,
            is_hackathon_participant,
            status: selectedUser?.status,
            transaction_id: transactionId,
          };

          const { result } = await novu.trigger({
            workflowId: is_hackathon_participant
              ? "invite-user-to-project-flow-receiver"
              : "invite-user-to-project-flow-receiver-not-in-hackathon",
            transactionId: transactionId,
            to: {
              subscriberId: user?.id,
              firstName: user?.full_name ?? undefined,
              email: user?.email ?? undefined,
            },
            payload,
          });

          if (result.status === "processed") {
            const { error } = await this.supabase
              .from("project_notification_data")
              .insert({
                transaction_id: result.transactionId,
                payload,
              })
              .select("*");

            if (error) throw error;
          }
        });

        inserted = Array.isArray(insertedRows) ? insertedRows.length : 0;
      }

      // 4) Deletes
      if (toDelete.length > 0) {
        const userIds = toDelete.map((m) => m.user_id);
        const { error: deleteErr, data: deletedRows } = await this.supabase
          .from("project_team_members")
          .delete()
          .eq("project_id", project_id)
          .in("user_id", userIds)
          .select("id");
        if (deleteErr) throw deleteErr;
        deleted = Array.isArray(deletedRows) ? deletedRows.length : 0;
      }

      // 5) Updates
      for (const member of toUpdate) {
        const { error: updErr } = await this.supabase
          .from("project_team_members")
          .update({ is_project_manager: member.is_project_manager })
          .match({ project_id, user_id: member.user_id });
        if (updErr) throw updErr;
        updated++;
      }

      return { inserted, updated, deleted };
    } catch (err) {
      // If we already threw a ProjectServiceError (or subclass), rethrow it
      if (err instanceof ProjectServiceError) {
        throw err;
      }
      console.error("Error updating project team:", err);
      throw new ProjectServiceError(
        "Failed to update project team. Please try again later."
      );
    }
  }

  async request_to_join_project(project_id: number, participant_id: string) {
    try {
      // Check if project exists
      const { data: project, error: project_error } = await this.supabase
        .from("projects")
        .select("*")
        .eq("id", project_id)
        .single();

      if (!project || project_error) {
        throw new ProjectNotFoundException(project_id);
      }

      const { data: user, error: user_error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", participant_id)
        .single();

      if (!user || user_error) {
        throw new UserNotFoundException(participant_id);
      }

      if (!project.accepting_participants) {
        throw new NoAcceptannceError(project_id);
      }

      const { data: existing_member, error: existing_member_error } =
        await this.supabase
          .from("project_team_members")
          .select("*")
          .eq("user_id", participant_id)
          .single();

      if (existing_member || existing_member_error) {
        throw new ProjectMembershipExistsError(project_id, participant_id);
      }

      const { data: existing_invitation, error: existing_invitation_error } =
        await this.supabase
          .from("project_invitations")
          .select("*")
          .eq("user_id", participant_id)
          .eq("status", "pending")
          .single();

      if (existing_invitation || existing_invitation_error) {
        throw new InvitationExistsError(project_id, participant_id);
      }

      const { data: invitation, error: invitation_error } = await this.supabase
        .from("project_invitations")
        .insert({
          project_id: project_id,
          user_id: participant_id,
          status: "pending",
          type: "request",
        })
        .select()
        .single();

      if (invitation_error) {
        throw new Error(
          `Failed to create invitation: ${invitation_error.message}`
        );
      }

      return invitation;
    } catch (error) {
      if (error instanceof ProjectServiceError) {
        throw error;
      }

      // Handle unexpected errors
      console.error("Error inviting team mate:", error);

      throw new ProjectServiceError(
        "Failed to invite team mate. Please try again later."
      );
    }
  }

  async getTransactionMessage(subscriberId: string, transactionId: string) {
    const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

    const request: MessagesControllerGetMessagesRequest = {
      channel: "in_app",
      page: 0,
      limit: 10,
      subscriberId,
      transactionId: [transactionId],
    };

    // Get messages from feed with pagination
    const { result } = await novu.messages.retrieve(request);

    const message = result.data.find(
      (msg) => msg.transactionId === transactionId
    );

    if (!message) {
      return null;
    }

    return message;
  }

  async user_accept_project_invitation(
    project_id: number,
    user_id: string,
    transactionId: string
  ) {
    const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });
    const tokenService = new TokenService(this.supabase);

    const invitation = await this.getPendingInvitation(project_id, user_id);
    if (!invitation) {
      try {
        await novu.messages.deleteByTransactionId(transactionId);
      } catch (error) {
        console.log(error);
      }

      throw new Error("Invalid Invitation");
    }

    const teamMember = await this.updateInvitation(
      project_id,
      user_id,
      "approve"
    );
    const { full_name, email } = teamMember.users || {};

    const notificationData = await this.getNotificationData(transactionId);

    const payload = Object.assign({}, notificationData?.payload, {
      status: "confirmed",
    });

    await novu.messages.deleteByTransactionId(transactionId);

    await novu.trigger({
      workflowId: "invite-user-to-project-flow-receiver",
      to: {
        subscriberId: user_id,
        firstName: full_name ?? undefined,
        email: email ?? undefined,
      },
      payload,
    });

    await tokenService.awardTokens({
      amount: 25,
      userId: user_id,
      category: "accept_project_invitation",
      referenceId: `accept_project_invitation_${user_id}`,
    });

    return null;
  }

  async user_reject_project_invitation(
    project_id: number,
    user_id: string,
    transactionId: string
  ) {
    const invitation = await this.getPendingInvitation(project_id, user_id);
    if (!invitation) throw new Error("Invalid Invitation");

    const teamMember = await this.updateInvitation(
      project_id,
      user_id,
      "reject"
    );
    const { full_name, email } = teamMember.users || {};

    const notificationData = await this.getNotificationData(transactionId);

    const payload = Object.assign({}, notificationData?.payload, {
      status: "rejected",
    });

    const novu = new Novu({ secretKey: process.env.NOVU_API_KEY! });

    await novu.messages.deleteByTransactionId(transactionId);

    await novu.trigger({
      workflowId: "invite-user-to-project-flow-receiver",
      to: {
        subscriberId: user_id,
        firstName: full_name ?? undefined,
        email: email ?? undefined,
      },
      payload,
    });

    return null;
  }

  private async getPendingInvitation(project_id: number, user_id: string) {
    const { data, error } = await this.supabase
      .from("project_team_members")
      .select("*")
      .eq("project_id", project_id)
      .eq("user_id", user_id)
      .eq("status", "pending")
      .single();

    if (error) {
      console.error("Invitation fetch error:", error.message);
      return null;
    }

    return data;
  }

  private async redistributePrizeAllocation(project_id: number) {
    // 1) fetch all confirmed member IDs for this project
    const { data: members, error: fetchError } = await this.supabase
      .from("project_team_members")
      .select("id")
      .eq("project_id", project_id)
      .eq("status", "confirmed");

    if (fetchError) {
      throw new Error(
        `Failed to fetch confirmed members: ${fetchError.message}`
      );
    }

    // if nobody is confirmed we can leave all prize_allocations untouched (or zero them out)
    if (!members || members.length === 0) {
      return;
    }

    // 2) compute equal share
    const share = 100 / members.length;

    // 3) bulk‐update every confirmed member
    const { error: updateError } = await this.supabase
      .from("project_team_members")
      .update({ prize_allocation: share })
      .eq("project_id", project_id)
      .eq("status", "confirmed");

    if (updateError) {
      throw new Error(
        `Failed to redistribute prize allocations: ${updateError.message}`
      );
    }
  }

  public async updateInvitation(
    project_id: number,
    user_id: string,
    status: "approve" | "reject"
  ) {
    // 1) flip the one invitation
    const { data, error } = await this.supabase
      .from("project_team_members")
      .update({ status: status === "approve" ? "confirmed" : "rejected" })
      .eq("project_id", project_id)
      .eq("user_id", user_id)
      .select(
        `
        *,
        users (
          id,
          full_name,
          email,
          main_role
        )
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to ${status} invitation: ${error.message}`);
    }

    // 2) redistribute prize_allocation among the confirmed members
    await this.redistributePrizeAllocation(project_id);

    // 3) return the updated row for convenience
    return data;
  }

  private async getNotificationData(transactionId: string) {
    const { data, error } = await this.supabase
      .from("project_notification_data")
      .select("*")
      .eq("transaction_id", transactionId)
      .single();

    if (error) throw new Error(`Error fetching notification: ${error.message}`);
    return data;
  }

  async leave_project(project_id: number, user_id: string) {
    // 1. Fetch the membership record for this user
    const { data: member, error: memberError } = await this.supabase
      .from("project_team_members")
      .select("*")
      .eq("project_id", project_id)
      .eq("user_id", user_id)
      .single();

    if (memberError || !member) {
      throw new Error(
        `User ${user_id} is not a member of project ${project_id}.`
      );
    }

    // If they're NOT the PM, just delete their membership
    if (!member.is_project_manager) {
      const { error: deleteError } = await this.supabase
        .from("project_team_members")
        .delete()
        .eq("project_id", project_id)
        .eq("user_id", user_id);

      if (deleteError) {
        throw new Error(`Failed to leave project: ${deleteError.message}`);
      }

      await this.redistributePrizeAllocation(project_id);

      return null;
    }

    // 2. They are the PM → find next member to promote.
    //    Here we pick the one with the earliest `created_at` timestamp.
    const { data: nextMember, error: nextError } = await this.supabase
      .from("project_team_members")
      .select("*")
      .eq("project_id", project_id)
      .neq("user_id", user_id) // exclude current PM
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (nextError && nextError.code !== "PGRST116") {
      // PGRST116 = no rows found
      throw new Error(`Error finding replacement PM: ${nextError.message}`);
    }

    if (!nextMember) {
      // No one left to promote → delete the whole project
      const { error: deleteProjectError } = await this.supabase
        .from("projects")
        .delete()
        .eq("id", project_id);

      if (deleteProjectError) {
        throw new Error(
          `Failed to delete project: ${deleteProjectError.message}`
        );
      }

      return null;
    }

    // 3. Promote the next member to PM
    const { error: promoteError } = await this.supabase
      .from("project_team_members")
      .update({ is_project_manager: true })
      .eq("project_id", project_id)
      .eq("user_id", nextMember.user_id);

    if (promoteError) {
      throw new Error(`Failed to promote new PM: ${promoteError.message}`);
    }

    // 4. Delete the old PM's membership
    const { error: deleteError } = await this.supabase
      .from("project_team_members")
      .delete()
      .eq("project_id", project_id)
      .eq("user_id", user_id);

    if (deleteError) {
      throw new Error(`Failed to leave project: ${deleteError.message}`);
    }

    await this.redistributePrizeAllocation(project_id);

    return nextMember;
  }

  async submit_project(project_id: number) {
    const { data: updatedProject, error: updateError } = await this.supabase
      .from("projects")
      .update({ submitted: true })
      .eq("id", project_id)
      .select(
        `
            *,
            project_challenges (
                challenge_id,
                hackathon_challenges (*)
            )
        `
      )
      .maybeSingle();

    if (updateError) {
      throw new Error(`Failed to submit project: ${updateError.message}`);
    }

    const tokenService = new TokenService(this.supabase);

    const { data: project_members = [] } = await this.supabase
      .from("project_team_members")
      .select("*")
      .eq("project_id", updatedProject?.id!);

    const allChallenges = updatedProject?.project_challenges?.map(
      (item) => item.hackathon_challenges
    ) as HackathonChallenges[];

    for (let member of project_members ?? []) {
      await tokenService.awardTokens({
        userId: member.user_id,
        amount: 150,
        category: "project_submission",
        referenceId: `project_submission_bonus_${member.user_id}_${updatedProject?.id}`,
      });
    }

    const responses = await Promise.all(
      allChallenges.map(async (item) => {
        const { data } = await this.supabase
          .from("judging_bot_scores")
          .insert({ challenge_id: item.id, project_id: project_id })
          .select()
          .single();

        return data;
      })
    );

    // Filter out any null/undefined responses before mapping IDs
    const createdRecordIds = responses.filter(Boolean).map((item) => item?.id);

    const service = new JudgingService(this.supabase);

    if (createdRecordIds.length) {
      await service.assignProjectsToJudges(
        createdRecordIds.filter((id): id is number => id !== undefined)
      );
    }

    axios.post(
      `ec2-54-172-24-214.compute-1.amazonaws.com:3000/judge/${project_id}`
    );

    return updatedProject;
  }

  async update_project_allocation(
    project_id: number,
    auth_user_id: string,
    body: {
      user_id: string;
      prize_allocation: number;
    }[]
  ) {
    // 1. Check that the caller is a project manager
    const { data: mgr, error: mgrErr } = await this.supabase
      .from("project_team_members")
      .select("is_project_manager")
      .eq("project_id", project_id)
      .eq("user_id", auth_user_id)
      .single();

    if (mgrErr) throw new Error(mgrErr.message);
    if (!mgr || !mgr.is_project_manager) {
      throw new Error(
        "Unauthorized: only a project manager may update allocations"
      );
    }

    // 2. Validate input payload
    for (const item of body) {
      if (item.prize_allocation < 0) {
        throw new Error(
          `Invalid prize_allocation for user ${item.user_id}: must be ≥ 0`
        );
      }
    }

    // 3. Perform updates
    const updates = await Promise.all(
      body.map(async (item) => {
        const { data, error } = await this.supabase
          .from("project_team_members")
          .update({ prize_allocation: item.prize_allocation })
          .eq("project_id", project_id)
          .eq("user_id", item.user_id);

        if (error) {
          // you might want more nuanced error handling here
          throw new Error(error.message);
        }
        return data;
      })
    );

    // 4. Flatten and return all updated rows
    return updates.flat();
  }

  async update_project_logo(project_id: number, form_data: FormData) {
    const file = form_data.get("image");

    if (!file || !(file instanceof File)) {
      throw new Error("image must be a valid file");
    }

    const { publicUrl: public_url, error: upload_error } = await uploadImage({
      file,
      userId: project_id?.toString(),
      bucketName: "project-videos",
      folderPath: "project-logos",
    });

    if (upload_error) {
      throw new Error(`Image upload failed: ${upload_error}`);
    }

    const { error: update_error } = await this.supabase
      .from("projects")
      .update({ logo_url: public_url })
      .eq("id", project_id);

    if (update_error) {
      throw new Error(`Failed to update project logo: ${update_error.message}`);
    }

    return {
      imageUrl: public_url,
    };
  }

  async remove_project_logo(project_id: number) {
    // Implement method to remove image from supabase storage
    const { error: update_error } = await this.supabase
      .from("projects")
      .update({ logo_url: null })
      .eq("id", project_id);

    if (update_error) {
      throw new Error(`Failed to update project logo: ${update_error.message}`);
    }

    return null;
  }

  async update_project_header(project_id: number, form_data: FormData) {
    const file = form_data.get("image");

    if (!file || !(file instanceof File)) {
      throw new Error("image must be a valid file");
    }

    const { publicUrl: public_url, error: upload_error } = await uploadImage({
      file,
      userId: project_id?.toString(),
      bucketName: "project-videos",
      folderPath: "project-banners",
    });

    if (upload_error) {
      throw new Error(`Image upload failed: ${upload_error}`);
    }

    const { error: update_error } = await this.supabase
      .from("projects")
      .update({ header_url: public_url })
      .eq("id", project_id);

    if (update_error) {
      throw new Error(`Failed to update header Image: ${update_error.message}`);
    }

    return {
      imageUrl: public_url,
    };
  }

  async remove_project_header(project_id: number) {
    // Implement method to remove image from supabase storage
    const { error: update_error } = await this.supabase
      .from("projects")
      .update({ header_url: null })
      .eq("id", project_id);

    if (update_error) {
      throw new Error(
        `Failed to update project Header: ${update_error.message}`
      );
    }

    return null;
  }

  async getProjectSubmissionStatsForHackathon(hackathonId: number) {
    // 1️⃣ Fetch all challenges for this hackathon
    const { data: challenges, error: challengeError } = await this.supabase
      .from("hackathon_challenges")
      .select("id, challenge_name")
      .eq("hackathon_id", hackathonId);

    if (challengeError) {
      throw new Error(`Error fetching challenges: ${challengeError.message}`);
    }

    const results = await Promise.all(
      challenges.map(async (challenge) => {
        // 2️⃣ Get total number of projects created for this challenge
        const { count: totalCount, error: totalError } = await this.supabase
          .from("project_challenges")
          .select("id", { count: "exact", head: true })
          .eq("challenge_id", challenge.id);

        if (totalError) {
          throw new Error(
            `Error fetching total projects: ${totalError.message}`
          );
        }

        // 3️⃣ Get submitted project IDs for this hackathon
        const { data: submittedProjects, error: submittedProjectsError } =
          await this.supabase
            .from("projects")
            .select("id")
            .eq("hackathon_id", hackathonId)
            .eq("submitted", true);

        if (submittedProjectsError) {
          throw new Error(
            `Error fetching submitted projects: ${submittedProjectsError.message}`
          );
        }

        const submittedProjectIds = submittedProjects.map((p) => p.id);

        // 4️⃣ Get number of submitted projects for this challenge
        const { count: submittedCount, error: submittedError } =
          await this.supabase
            .from("project_challenges")
            .select("id", { count: "exact", head: true })
            .eq("challenge_id", challenge.id)
            .in("project_id", submittedProjectIds);

        if (submittedError) {
          throw new Error(
            `Error fetching submitted projects: ${submittedError.message}`
          );
        }

        // 5️⃣ Calculate percentage
        const percentage =
          totalCount && totalCount > 0
            ? Math.round(((submittedCount || 0) / totalCount) * 100)
            : 0;

        return {
          challenge_id: challenge.id,
          challenge_name: challenge.challenge_name,
          total_projects: totalCount,
          submitted_projects: submittedCount,
          submission_percentage: percentage,
        };
      })
    );

    return results;
  }

  async getProjectStatuses(hackathonId: number) {
    // Get total number of projects for this hackathon
    const { count: totalCount, error: totalError } = await this.supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("hackathon_id", hackathonId);

    if (totalError) {
      throw new Error(
        `Error fetching total project count: ${totalError.message}`
      );
    }

    if (!totalCount || totalCount === 0) {
      return {
        totalCount: 0,
        statuses: [],
      };
    }

    // Count Submitted Projects
    const { count: submittedCount, error: submittedError } = await this.supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("hackathon_id", hackathonId)
      .eq("submitted", true);

    if (submittedError) {
      throw new Error(
        `Error fetching submitted projects: ${submittedError.message}`
      );
    }

    // Count Draft Projects (assuming submitted = false)
    const { count: draftCount, error: draftError } = await this.supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("hackathon_id", hackathonId)
      .eq("submitted", false);

    if (draftError) {
      throw new Error(`Error fetching draft projects: ${draftError.message}`);
    }

    // need to add a 'deleted' column (soft delete)
    // const { count: deletedCount, error: deletedError } = await this.supabase
    //   .from("projects")
    //   .select("id", { count: "exact", head: true })
    //   .eq("hackathon_id", hackathonId)
    //   .eq("deleted", true);

    // if (deletedError) {
    //   throw new Error(`Error fetching deleted projects: ${deletedError.message}`);
    // }
    const deletedCount = 0;

    // Build the status breakdown
    const statuses = [
      {
        status: "Submitted",
        count: submittedCount || 0,
        percentage: Math.round(((submittedCount || 0) / totalCount) * 100),
      },
      {
        status: "Draft",
        count: draftCount || 0,
        percentage: Math.round(((draftCount || 0) / totalCount) * 100),
      },
      {
        status: "Deleted",
        count: deletedCount || 0,
        percentage: Math.round(((deletedCount || 0) / totalCount) * 100),
      },
    ];

    return {
      totalCount,
      statuses,
    };
  }

  async getProjectsPerChallenge(hackathonId: number) {
    // Get all challenges with their project counts
    const { data: challenges, error: challengesError } = await this.supabase
      .from("hackathon_challenges")
      .select(
        `
        id,
        challenge_name,
        project_challenges!left (
          project_id,
          projects!inner (
            id,
            hackathon_id
          )
        )
      `
      )
      .eq("hackathon_id", hackathonId);

    if (challengesError) {
      throw new Error(`Failed to get challenges: ${challengesError.message}`);
    }

    // Process the data to calculate counts and percentages
    const processedChallenges =
      challenges?.map((challenge) => {
        const projectCount = challenge.project_challenges?.length || 0;
        return {
          challenge_id: challenge.id,
          challenge_name: challenge.challenge_name,
          project_count: projectCount,
          percentage: 0, // Will be calculated after we get total
        };
      }) || [];

    // Calculate total project-challenge relationships
    const totalProjectChallengeRelationships = processedChallenges.reduce(
      (sum, challenge) => sum + challenge.project_count,
      0
    );

    // Now calculate percentages based on total relationships
    processedChallenges.forEach((challenge) => {
      challenge.percentage =
        totalProjectChallengeRelationships > 0
          ? Math.round(
              (challenge.project_count / totalProjectChallengeRelationships) *
                100 *
                10
            ) / 10 // Round to 1 decimal place
          : 0;
    });

    // Sort by project count (highest to lowest)
    processedChallenges.sort((a, b) => b.project_count - a.project_count);

    return processedChallenges;
  }

  async getTechnologiesFromChallenges(hackathonId: number) {
    // 1. Get all challenge technologies for this hackathon
    const { data: challenges, error: challengesError } = await this.supabase
      .from("hackathon_challenges")
      .select("technologies")
      .eq("hackathon_id", hackathonId);

    if (challengesError) {
      throw new Error(
        `Failed to get challenge technologies: ${challengesError.message}`
      );
    }

    // 2. Get all project technologies for this hackathon (including drafts)
    const { data: projects, error: projectsError } = await this.supabase
      .from("projects")
      .select("technologies")
      .eq("hackathon_id", hackathonId);

    if (projectsError) {
      throw new Error(
        `Failed to get project technologies: ${projectsError.message}`
      );
    }

    // 3. Extract and deduplicate all challenge technologies
    const challengeTechnologies = new Set<string>();
    challenges?.forEach((challenge) => {
      if (challenge.technologies && Array.isArray(challenge.technologies)) {
        challenge.technologies.forEach((tech) => {
          if (tech && typeof tech === "string" && tech.trim() !== "") {
            challengeTechnologies.add(tech);
          }
        });
      }
    });

    // 4. Calculate total number of projects
    const totalProjects = projects?.length || 0;

    // 5. For each challenge technology, count how many projects use it
    const technologyStats = Array.from(challengeTechnologies).map(
      (technology) => {
        let uses = 0;

        projects?.forEach((project) => {
          if (project.technologies && Array.isArray(project.technologies)) {
            if (project.technologies.includes(technology)) {
              uses++;
            }
          }
        });

        // Calculate percentage with 1 decimal place
        const percentage =
          totalProjects > 0
            ? Math.round((uses / totalProjects) * 100 * 10) / 10
            : 0;

        return {
          technology_name: technology,
          uses,
          percentage,
        };
      }
    );

    // 6. Sort by uses count (highest to lowest)
    technologyStats.sort((a, b) => b.uses - a.uses);

    return technologyStats;
  }
}

export default ProjectService;
