import { createClient } from "@/lib/supabase/server";
import { HackathonService } from "./services/hackathon.service";

export const get_hackathon_projects = async (hackathon_id: number) => {
  const supabase = await createClient();
  const hackathonService = new HackathonService(supabase);
  return await hackathonService.getHackathonProjects(hackathon_id);
}; 