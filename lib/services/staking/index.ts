import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/utils/auth-helpers";
import { errorResponse, successResponse } from "@/utils/response-helpers";
import { StakingService } from "./service";

export const stake_for_hackathon = async (hackathonId: number) => {
  try {
    const supabase = await createClient();

    const service = new StakingService(supabase);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const result = await service.stake_for_hackathon(
      hackathonId,
      user?.id,
    );

    return successResponse(result);
  } catch (error: any) {
    console.log(error);
    return errorResponse(error?.message ?? "Failed to stake for hackathon ");
  }
};

export const fetch_stake_status = async (hackathonId: number) => {
  try {
    const supabase = await createClient();

    const service = new StakingService(supabase);

    const { user, error } = await getAuthenticatedUser();
    if (error) return error;

    const result = await service.fetch_stake_status(hackathonId, user?.id);

    return successResponse(result);
  } catch (error: any) {
    console.log(error);
    return errorResponse(error?.message ?? "Failed to stake for hackathon ");
  }
};
  
  

