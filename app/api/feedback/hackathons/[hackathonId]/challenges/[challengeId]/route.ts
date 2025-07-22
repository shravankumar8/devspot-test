import { type NextRequest } from "next/server";
import { get_feedback_by_challenge, submit_feedback_for_challenge, update_feedback_for_challenge } from "@/lib/services/feedback";

export const GET = async (
  req: NextRequest,
  { params }: { params: { hackathonId: string; challengeId: string } }
) => {
  const hackathonId = Number(params.hackathonId);
  const challengeId = Number(params.challengeId);

  return await get_feedback_by_challenge(hackathonId, challengeId);
};


export const POST = async (
  req: NextRequest,
  { params }: { params: { hackathonId: string; challengeId: string } }
) => {
  const body = await req.json();
  const hackathonId = Number(params.hackathonId);
  const challengeId = Number(params.challengeId);
  return await submit_feedback_for_challenge(hackathonId, challengeId, body);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { hackathonId: string; challengeId: string } }
) => {
  const body = await req.json();
  const hackathonId = Number(params.hackathonId);
  const challengeId = Number(params.challengeId);
  return await update_feedback_for_challenge(hackathonId, challengeId, body);
};

