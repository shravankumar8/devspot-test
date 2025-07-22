const combineDateAndTime = (
  date: Date | undefined | null,
  time: string | null
): string => {
  if (!date) return "";

  const combined = new Date(date);

  if (time) {
    const [hours, minutes] = time.split(":");
    combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  }

  return combined.toISOString();
};
const parseExistingDateTime = (dateString: string | null) => {
  if (!dateString) {
    return {
      date: null,
      time: null,
    };
  }

  const date = new Date(dateString);
  const time = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date,
    time,
  };
};
export { combineDateAndTime, parseExistingDateTime };
