import { HackathonSessions as DBHackathonSessions } from "@/types/entities";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

interface HackathonSessions
  extends Omit<
    DBHackathonSessions,
    "created_at" | "updated_at" | "id" | "rsvpd" | "upcoming"
  > {
  location: {
    name: string;
    link: string;
  }[];
}

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  htmlLink?: string;
  hangoutLink?: string;
}

class GoogleCalendarScheduleGenerator {
  private oauth2Client: OAuth2Client;
  private calendar: any;
  private useTestCalendar: boolean = false;

  constructor(withTestCalendar?: boolean) {
    // Initialize OAuth2 client
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.calendar = google.calendar({ version: "v3", auth: this.oauth2Client });
    this.useTestCalendar = withTestCalendar ?? false;
  }

  /**
   * Extract calendar ID from various Google Calendar URL formats
   */
  extractCalendarId(calendarUrl: string): string | null {
    try {
      // Handle different URL formats
      const patterns = [
        // Public calendar embed URL
        /calendar\/embed\?src=([^&]+)/,
        // Calendar ID directly
        /calendar\/([^\/\?]+)/,
        // Google Calendar share URL
        /calendar\.google\.com\/calendar\/u\/\d+\/r\?cid=([^&]+)/,
        // Simple calendar ID pattern
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
      ];

      for (const pattern of patterns) {
        const match = calendarUrl.match(pattern);
        if (match) {
          // Decode URL-encoded calendar ID if necessary
          return decodeURIComponent(match[1]);
        }
      }

      // If no pattern matches, assume it's already a calendar ID
      if (calendarUrl.includes("@")) {
        return calendarUrl;
      }

      return null;
    } catch (error) {
      console.error("Error extracting calendar ID:", error);
      return null;
    }
  }

  /**
   * Set OAuth2 credentials
   */
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthUrl(hackathonId?: number): string {
    const readOnlyScope = ["https://www.googleapis.com/auth/calendar.readonly"];
    const fullscope = ["https://www.googleapis.com/auth/calendar"];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.useTestCalendar ? fullscope : readOnlyScope,
      state: hackathonId?.toString(),
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string) {
    try {
      // Validate the authorization code
      if (!code || typeof code !== "string") {
        throw new Error("Invalid authorization code");
      }

      const { tokens } = await this.oauth2Client.getToken(
        decodeURIComponent(code)
      );

      return tokens;
    } catch (error: any) {
      console.error("Token exchange failed:", {
        error: error.message,
        code: error.code,
        details: error.response?.data,
      });
      throw new Error(`Token exchange failed: ${error.message}`);
    }
  }

  /**
   * Fetch events from Google Calendar
   */
  async fetchCalendarEvents(
    calendarId: string,
    timeMin?: Date,
    timeMax?: Date,
    maxResults: number = 250
  ): Promise<CalendarEvent[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin?.toISOString(),
        timeMax: timeMax?.toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: "startTime",
      });

      return response.data.items || [];
    } catch (error: any) {
      console.error("Error fetching calendar events:", error);
      throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
  }

  /**
   * Convert Google Calendar event to HackathonSession format
   */
  private convertToHackathonSession(
    event: CalendarEvent,
    hackathonId: number
  ): HackathonSessions {
    // Extract tags from description or event properties
    const tags = this.extractTagsFromEvent(event);

    // Determine if it's a milestone
    const isMilestone = this.isMilestoneEvent(event);

    // Handle location data
    const location = event.location
      ? [
          {
            name: event.location,
            link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              event.location
            )}`,
          },
        ]
      : [];

    return {
      hackathon_id: hackathonId,
      title: event.summary || "Untitled Event",
      description: event.description || null,
      start_time: event.start.dateTime || event.start.date || "",
      end_time: event.end?.dateTime || event.end?.date || null,
      tags: tags,
      location: location,
      virtual_link: event.hangoutLink || null,
      is_milestone: isMilestone,
      event_link: event.htmlLink || null,
    };
  }

  /**
   * Extract tags from event description or title
   */
  private extractTagsFromEvent(event: CalendarEvent): string[] {
    const tags: string[] = [];
    const text = `${event.summary || ""} ${
      event.description || ""
    }`.toLowerCase();

    // Define tag patterns
    const tagPatterns = {
      workshop: /workshop|training|tutorial/,
      milestone: /milestone|deadline|due|submission/,
      ceremony: /ceremony|opening|closing|kickoff/,
      networking: /networking|mixer|social|after.?hours/,
      virtual: /virtual|online|remote|zoom|meet/,
      IRL: /in.?person|irl|onsite|venue|location/,
      "office hours": /office.?hours|help|support|q&a/,
    };

    // Check for each pattern
    for (const [tag, pattern] of Object.entries(tagPatterns)) {
      if (pattern.test(text)) {
        tags.push(tag);
      }
    }

    // Check if event has video conferencing
    if (event.hangoutLink) {
      tags.push("virtual");
    }

    // Check if event has physical location
    if (event.location && !event.hangoutLink) {
      tags.push("IRL");
    }

    return tags;
  }

  /**
   * Determine if event is a milestone
   */
  private isMilestoneEvent(event: CalendarEvent): boolean {
    const text = `${event.summary || ""} ${
      event.description || ""
    }`.toLowerCase();
    const milestoneKeywords = [
      "deadline",
      "submission",
      "registration",
      "judging",
      "milestone",
      "due",
      "open",
      "close",
      "end",
    ];

    return milestoneKeywords.some((keyword) => text.includes(keyword));
  }

  /**
   * Main method to generate schedule from calendar URL
   */
  async generateScheduleFromCalendar(
    calendarUrl: string,
    hackathonId: number
  ): Promise<HackathonSessions[]> {
    try {
      // Extract calendar ID from URL
      const calendarId = this.extractCalendarId(calendarUrl);
      if (!calendarId) {
        throw new Error("Invalid calendar URL format");
      }

      // Fetch events from calendar
      const events = await this.fetchCalendarEvents(calendarId);

      // Convert events to hackathon sessions
      const sessions = events.map((event) =>
        this.convertToHackathonSession(event, hackathonId)
      );

      return sessions;
    } catch (error) {
      console.error("Error generating schedule:", error);
      throw error;
    }
  }

  async createTestHackathonCalendar() {
    const calendar = google.calendar({
      version: "v3",
      auth: this.oauth2Client,
    });

    try {
      // 1. Create a new calendar
      const newCalendar = await calendar.calendars.insert({
        requestBody: {
          summary: "PL_Genesis Hackathon Test Calendar",
          description: "Test calendar for hackathon schedule import",
          timeZone: "America/New_York",
        },
      });

      const calendarId = newCalendar.data.id;
      console.log("Created calendar:", calendarId);

      // 2. Add sample events that match your hackathon structure
      const sampleEvents = [
        {
          summary: "Registrations Open",
          description:
            "Register for the PL_Genesis hackathon and get to our sponsors and sponsor tech",
          start: {
            dateTime: "2025-05-15T07:00:00Z",
          },
          end: {
            dateTime: "2025-05-15T08:00:00Z",
          },
          colorId: "9", // Blue for milestones
        },
        {
          summary: "University Summit Kickoff - BAF x Protocol Labs",
          description:
            "Whether you're here to build, learn, or find your next opportunity, this kickoff sets the tone for everything ahead. Come curious — your next startup, project, or job could start right here.",
          start: {
            dateTime: "2025-05-15T14:00:00Z",
          },
          end: {
            dateTime: "2025-05-15T15:00:00Z",
          },
          location: "Metro Toronto Convention Centre",
          colorId: "2", // Green for networking
        },
        {
          summary: "After Hours by Protocol Labs Day 2, hosted by FIL-B",
          description:
            "Join us for laid-back evenings of connection and conversation with members of the Protocol Labs network! This casual after-hours event is open to anyone, from founders and innovators to open-source contributors and tech enthusiasts.",
          start: {
            dateTime: "2025-05-15T23:30:00Z",
          },
          end: {
            dateTime: "2025-05-16T04:00:00Z",
          },
          location: "20 Nelson Street",
          colorId: "2", // Green for networking
        },
        {
          summary: "Opening Ceremony",
          description:
            "Join us for the PL Genesis hackathon opening ceremony—where we'll unveil our partner challenges, reveal exciting prize details, and showcase hands-on workshops led by our partners.",
          start: {
            dateTime: "2025-06-05T16:00:00Z",
          },
          end: {
            dateTime: "2025-06-05T17:00:00Z",
          },
          conferenceData: {
            createRequest: {
              requestId: "opening-ceremony-meet",
            },
          },
          colorId: "4", // Red for ceremonies
        },
        {
          summary: "Flow Workshop: Build Next Generation AI Agents",
          description:
            "AI agents are revolutionizing the world and promise to impact nearly every industry. This workshop will cover the basics of creating your own AI agent from scratch and MCP, no previous experience required! By Felipe",
          start: {
            dateTime: "2025-06-06T15:00:00Z",
          },
          end: {
            dateTime: "2025-06-06T17:00:00Z",
          },
          conferenceData: {
            createRequest: {
              requestId: "ai-workshop-meet",
            },
          },
          colorId: "5", // Yellow for workshops
        },
        {
          summary: "Flow office hours",
          description: "Get help with your Flow blockchain projects",
          start: {
            dateTime: "2025-06-05T18:00:00Z",
          },
          end: {
            dateTime: "2025-06-05T19:00:00Z",
          },
          conferenceData: {
            createRequest: {
              requestId: "office-hours-meet",
            },
          },
          colorId: "6", // Orange for office hours
        },
        {
          summary: "Submission deadline",
          description: "All projects must be submitted by this date",
          start: {
            dateTime: "2025-07-07T08:59:00Z",
          },
          end: {
            dateTime: "2025-07-07T09:00:00Z",
          },
          colorId: "11", // Red for deadlines
        },
        {
          summary: "Judging period",
          description: "Judges will be reviewing projects async virtually",
          start: {
            dateTime: "2025-07-07T09:00:00Z",
          },
          end: {
            dateTime: "2025-07-10T07:00:00Z",
          },
          colorId: "9", // Blue for process events
        },
        {
          summary: "Closing ceremony and winner announcements",
          description:
            "Join us as we celebrate all of the projects and participants for the PL_Genesis: Modular worlds hackathon",
          start: {
            dateTime: "2025-07-18T17:00:00Z",
          },
          end: {
            dateTime: "2025-07-18T19:00:00Z",
          },
          conferenceData: {
            createRequest: {
              requestId: "closing-ceremony-meet",
            },
          },
          colorId: "4", // Red for ceremonies
        },
      ];

      // Insert all events
      const createdEvents = [];

      for (const event of sampleEvents) {
        const createdEvent: any = await calendar.events.insert({
          calendarId: calendarId!,
          requestBody: event,
          conferenceDataVersion: 1,
        });

        createdEvents.push(createdEvent.data);
        console.log("Created event:", createdEvent.data.summary);
      }

      // 3. Make calendar public (optional)
      await calendar.acl.insert({
        calendarId: calendarId!,
        requestBody: {
          role: "reader",
          scope: {
            type: "default",
          },
        },
      });

      return {
        calendarId,
        publicUrl: `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
          calendarId!
        )}`,
        events: createdEvents,
      };
    } catch (error) {
      console.error("Error creating test calendar:", error);
      throw error;
    }
  }
}

export default GoogleCalendarScheduleGenerator;
