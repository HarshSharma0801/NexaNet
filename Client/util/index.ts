import { format, subHours, isBefore } from "date-fns";

export const timeConvert = (timestamp: string | Date): string => {
  const now = new Date();
  const twentyFourHoursAgo = subHours(now, 24);

  const parsedTimestamp =
    timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isBefore(parsedTimestamp, twentyFourHoursAgo)) {
    return format(parsedTimestamp, "d MMM yyyy");
  } else {
    return format(parsedTimestamp, "HH:mm");
  }
};
