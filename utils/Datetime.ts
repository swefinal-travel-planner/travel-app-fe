export const formatDayMonthDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
};
export function formatTimeAMPM(datetime: string): string {
  const date = new Date(datetime.replace(" ", "T")); // Convert to valid ISO format
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;

  // Format hours and minutes
  const formattedHours =
    minutes === 0
      ? `${hours}:00`
      : `${hours}:${minutes.toString().padStart(2, "0")}`;

  return `${formattedHours} ${ampm}`;
}

// format date into day in week (e.g. Monday)
export function formatDayInWeek(datetime: string): string {
  const date = new Date(datetime.replace(" ", "T")); // Convert to valid ISO format
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
