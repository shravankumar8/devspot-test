// src/utils/frontendICS.ts

interface EventData {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end?: Date;
  uid?: string; // optional, you can generate one or leave blank
  organizer?: { name: string; email: string };
}

export function generateICS({
  title,
  description = "",
  location = "",
  start,
  end,
  uid,
  organizer,
}: EventData) {
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtstart = start.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const dtend = end?.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const eventUid =
    uid ||
    `${dtstamp}-${Math.random().toString(36).substr(2, 9)}@yourdomain.com`;
  const orgLine = organizer
    ? `ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}`
    : "";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YourApp//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${eventUid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICSText(title)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(location)}`,
    orgLine,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.filter(Boolean).join("\r\n");
}

function escapeICSText(txt: string) {
  // simple escaping for newlines and commas/semicolons
  return txt.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

// download helper
export function downloadICS(icsString: string, filename: string) {
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
