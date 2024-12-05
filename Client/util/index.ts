import { format, isAfter, addHours } from "date-fns";

export const timeConvert = (timestamp: string | Date): string => {
  const now = new Date();
  const twentyFourHoursFromNow = addHours(now, 24);

  const parsedTimestamp = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isAfter(parsedTimestamp, twentyFourHoursFromNow)) {
    return format(parsedTimestamp, "d MMM yyyy");
  } else {
    return format(parsedTimestamp, "HH:mm");
  }
};
