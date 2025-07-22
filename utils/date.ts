export function countWords(text: string): number {
  const trimmedText = text.replace(/\s+/g, ""); // Remove all whitespace
  return trimmedText.length;
}

export const createEventTime = (baseDate: Date, hours: number, minutes = 0) => {
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export function formatDate(isoString: string, withTime = true) {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (withTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${formattedDate} @ ${hours}:${minutes} ${amPm}`;
  }

  return formattedDate;
}

