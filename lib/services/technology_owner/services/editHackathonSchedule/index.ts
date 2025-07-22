import ApiBaseService from "@/lib/services/utils/baseService";
import { SupabaseClient } from "@supabase/supabase-js";
import { Credentials } from "google-auth-library";
import GoogleCalendarScheduleGenerator from "./google.service";

interface ImportScheduleOptions {
  hackathonId: number;
  calendarUrl: string;
  tokens: Credentials;
}

interface UpdateHackathonSchedule {
  hackathonId: number;
  url: string;
  code: string;
}

class EditHackathonScheduleService extends ApiBaseService {
  constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  async update_hackathon_schedule(options: UpdateHackathonSchedule) {
    const { code, hackathonId, url } = options;
    const calendarGenerator = new GoogleCalendarScheduleGenerator();

    const tokens = await calendarGenerator.getTokens(code);

    if (!tokens) {
      throw new Error(`Error Validating Code ${code}`);
    }

    const { data: hackathon, error: fetchHackathonError } = await this.supabase
      .from("hackathons")
      .select("*")
      .eq("id", hackathonId)
      .single();

    if (fetchHackathonError) {
      throw new Error(
        `Error fetching hackathon with ID ${hackathonId}: ${fetchHackathonError.message}`
      );
    }

    const generatedSessions = await this.importSchedule({
      calendarUrl: url,
      hackathonId: hackathonId,
      tokens,
    });

    const { data, error } = await this.supabase
      .from("hackathon_sessions")
      .upsert(
        generatedSessions.map((session) => ({
          hackathon_id: hackathonId,
          title: session?.title ?? "",
          description: session?.description ?? "",
          start_time: session?.start_time ?? "",
          end_time: session?.end_time ?? "",
          tags: session?.tags ?? [],
          location: session?.location ?? [],
          virtual_link: session?.virtual_link,
          is_milestone: session?.is_milestone,
          event_link: session?.event_link,
        }))
      );

    if (error) {
      throw new Error(`Could not create hackathon sessions: ${error}`);
    }

    return data;
  }

  importSchedule = async (options: ImportScheduleOptions) => {
    const { hackathonId, calendarUrl, tokens } = options;

    const calendarGenerator = new GoogleCalendarScheduleGenerator();

    // Set stored credentials
    calendarGenerator.setCredentials(tokens);

    const sessions = await calendarGenerator.generateScheduleFromCalendar(
      calendarUrl,
      hackathonId
    );

    return sessions;
  };
}

export default EditHackathonScheduleService;
