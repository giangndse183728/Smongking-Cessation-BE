export function parseTimeStringToDate(timeStr: string): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}
