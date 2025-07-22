import { createClient } from "@/lib/supabase/server";
import { errorResponse } from "@/utils/response-helpers";

/**
 * Fetches a hackathon by its ID from the database.
 * Returns an object containing the hackathon data if found, or an error response if not found.
 */
export async function getHackathonById(hackathonId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hackathons")
    .select("*")
    .eq("id", hackathonId)
    .single();

  if (error) return { error: errorResponse("Hackathon not found") };
  return { hackathon: data };
}

/**
 * Fetches a hackathon event by its ID from the database.
 * Returns an object containing the event data if found, or an error response if not found.
 */
export async function getHackathonEventById(eventId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
      .from("hackathon_events")
      .select("*")
      .eq("id", eventId)
      .single();

  if (error) return { error: errorResponse("Event not found") };
  return { event: data };
}

/**
 * Checks if a user has answered all required application questions for a hackathon.
 * Returns `true` if all questions are answered, otherwise `false`.
 */
export async function checkQuestionnaireStatus(
  userId: string,
  hackathonId: number
): Promise<boolean> {
  const supabase = await createClient();

  const { data: questions, error: questionsError } = await supabase
    .from("hackathon_application_questions")
    .select("id")
    .eq("hackathon_id", hackathonId);

  if (questionsError) {
    console.error("Error fetching questions:", questionsError.message);
    return false;
  }

  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return true;
  }

  const { data: answers, error: answersError } = await supabase
    .from("hackathon_application_answers")
    .select("question_id")
    .eq("participant_id", userId)
    .eq("hackathon_id", hackathonId);

  if (answersError) {
    console.error("Error fetching answers:", answersError.message);
    return false;
  }

  const answeredQuestions = new Set(answers.map((a) => a.question_id));

  return answeredQuestions.size === totalQuestions;
}

/**
 * Checks if a user has staked for a hackathon.
 * Returns `true` if the user has staked, otherwise `false`.
 */
export async function checkStakeStatus(
  userId: string,
  hackathonId: number
): Promise<boolean> {
  const supabase = await createClient();

  // Query the hackathon_stakes table to check if the user has a stake for this hackathon
  const { data: stakes, error } = await supabase
    .from("hackathon_stakes")
    .select("status")
    .eq("participant_id", userId)
    .eq("hackathon_id", hackathonId)
    .eq("status", "confirmed")
    .limit(1);

  if (error) {
    console.error("Error checking stake status:", error.message);
    return false;
  }

  // If there's at least one confirmed stake, return true
  return stakes && stakes.length > 0;
}
