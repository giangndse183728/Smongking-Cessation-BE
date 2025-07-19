/**
 * Timezone utility functions
 */

/**
 * Get current date in Vietnam timezone (UTC+7)
 * @returns Date object representing current date/time in Vietnam
 */
export function getCurrentDateInVietnam(): Date {
  const now = new Date();
  const vietnamOffset = 7 * 60; // UTC+7 in minutes
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (vietnamOffset * 60000));
}

/**
 * Convert a date to Vietnam timezone
 * @param date - The date to convert
 * @returns Date object in Vietnam timezone
 */
export function toVietnamTimezone(date: Date): Date {
  const vietnamOffset = 7 * 60; // UTC+7 in minutes
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (vietnamOffset * 60000));
} 