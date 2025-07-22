import { Hackathons } from "@/types/entities";
import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import ApiBaseService from "../../utils/baseService";
import { TokenService } from "../../utils/tokenService";
import { checkQuestionnaireStatus, checkStakeStatus } from "../utils";

class JoinHackathonService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  formatFullDate(input: string): string {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format. Expected YYYY-MM-DD.");
    }

    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${dayOfWeek} ${day}${suffix} ${month} ${year}`;
  }

  async joinHackathon(
    hackathon: Hackathons,
    hackathonId: number,
    userId: string,
    joinTypeInput: string
  ) {
    const allowedJoinTypes = [
      "join",
      "stake",
      "apply",
      "apply_additional",
      "apply_stake",
      "apply_additional_stake",
    ] as const;

    if (!allowedJoinTypes.includes(joinTypeInput as any)) {
      throw new Error("Invalid join type");
    }
    const tokenService = new TokenService(this.supabase);

    const joinType = joinTypeInput as (typeof allowedJoinTypes)[number];

    if (
      hackathon.application_method &&
      hackathon.application_method !== joinType
    ) {
      throw new Error(
        `This hackathon only allows ${hackathon.application_method} join type`
      );
    }

    if (joinType === "stake") {
      const stakeStatus = await checkStakeStatus(userId, hackathonId);
      if (!stakeStatus) {
        throw new Error(
          "User has not completed required stake to join this hackathon."
        );
      }
    }

    if (
      joinType === "apply_additional" ||
      joinType === "apply_additional_stake"
    ) {
      const questionnaireStatus = await checkQuestionnaireStatus(
        userId,
        hackathonId
      );
      if (!questionnaireStatus) {
        throw new Error("User has not completed the required questionnaire.");
      }
    }

    const application_status: "pending" | "accepted" | "rejected" =
      joinType === "join" || joinType === "stake" ? "accepted" : "pending";
    const { data, error } = await this.supabase
      .from("hackathon_participants")
      .insert([
        {
          hackathon_id: hackathonId,
          participant_id: userId,
          application_status,
          looking_for_teammates: true,
        },
      ])
      .select(
        `
        *,
        users:participant_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `
      )
      .single();
    if (error) {
      throw new Error(`Failed to join hackathon: ${error.message}`);
    }

    await tokenService.awardTokens({
      amount: 50,
      userId: userId,
      category: "hackathon_join",
      referenceId: `hackathon_join_bonus_${userId}`,
    });

    const participant = data?.users;

    await axios.post(
      "https://app.loops.so/api/v1/events/send",
      {
        email: participant?.email,
        eventName: "Join PL_Genesis Hackathon 2025",
        eventProperties: {
          hackathon_name: hackathon?.name,
          user_name: participant?.full_name,
          submission_deadline: hackathon?.deadline_to_submit
            ? this.formatFullDate(hackathon?.deadline_to_submit)
            : undefined,
          dashboard_url: "https://devspot.app/en/profile",
          prize_amount: "100k",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }
    );

    await axios.post(
      "https://app.loops.so/api/v1/contacts/update",
      {
        email: participant?.email,
        properties: {
          is_hackathon_participant: true,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        },
      }
    );

    // const { data: existing_invitation, error: existing_invitation_error } =
    //   await this.supabase
    //     .from("project_team_members")
    //     .select("*")
    //     .eq("user_id", userId)
    //     .single();

    return {
      message: "Joined hackathon successfully",
      data: {
        hackathon_id: hackathonId,
        participant_id: userId,
        application_status,
      },
    };
  }
}

export default JoinHackathonService;
