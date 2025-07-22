import { SupabaseClient } from "@supabase/supabase-js";
import ApiBaseService from "../../utils/baseService";

class FeedbackService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async getFeedbackByChallenge(hackathonId: number, challengeId: number) {
    const { data, error } = await this.supabase
      .from("hackathon_challenge_feedback")
      .select("*")
      .eq("hackathon_id", hackathonId)
      .eq("challenge_id", challengeId);
  
    if (error) {
      throw new Error(`Failed to get feedback: ${error.message}`);
    }
  
    return data;
  }
  

  async createFeedbackForChallenge({
    hackathon_id,
    challenge_id,
    project_id,
    overall_rating,
    docs_rating,
    support_rating,
    comments
  }: {
    hackathon_id: number;
    challenge_id: number;
    project_id: number;
    overall_rating: number;
    docs_rating: number;
    support_rating: number;
    comments?: string;
  }) {
    const { data, error } = await this.supabase
      .from("hackathon_challenge_feedback")
      .insert({
        hackathon_id: hackathon_id,
        challenge_id: challenge_id,
        project_id: project_id,
        overall_rating: overall_rating,
        docs_rating: docs_rating,
        support_rating: support_rating,
        comments
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to create feedback: ${error.message}`);
    }

    return data;
  }

  async updateFeedbackForChallenge({
    hackathon_id,
    challenge_id,
    project_id,
    overall_rating,
    docs_rating,
    support_rating,
    comments
  }: {
    hackathon_id: number;
    challenge_id: number;
    project_id: number;
    overall_rating: number;
    docs_rating: number;
    support_rating: number;
    comments?: string;
  }) {
    const updates: Record<string, any> = {};
    if (overall_rating !== undefined) updates.overall_rating = overall_rating;
    if (docs_rating !== undefined) updates.docs_rating = docs_rating;
    if (support_rating !== undefined) updates.support_rating = support_rating;
    if (comments !== undefined) updates.comments = comments;

    const { data, error } = await this.supabase
      .from("hackathon_challenge_feedback")
      .update(updates)
      .eq("hackathon_id", hackathon_id)
      .eq("challenge_id", challenge_id)
      .eq("project_id", project_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update feedback: ${error.message}`);
    }

    return data;
  }
}

export default FeedbackService;
