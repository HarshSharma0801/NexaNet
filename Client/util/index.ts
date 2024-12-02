export const timeConvert = (timestamp: string): string => {
  if(timestamp=""){
    return "";
  }  
  const currentDate = new Date();
  const date = new Date(timestamp);

  const timeDiff = currentDate.getTime() - date.getTime();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const timeFormatted = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  if (timeDiff >= 24 * 60 * 60 * 1000) {
    // More than 24 hours ago
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);

    return `Yesterday, ${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  }

  return timeFormatted;
};
