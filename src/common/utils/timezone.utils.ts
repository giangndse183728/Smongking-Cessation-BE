import { DateTime } from 'luxon';

/**
 * Timezone utility functions using Luxon
 */

/**
 * Get current date in Vietnam timezone (UTC+7)
 * @returns Date object representing current date/time in Vietnam
 */
export function getCurrentDateInVietnam(): Date {
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  return now.toJSDate();
}

/**
 * Convert a date to Vietnam timezone
 * @param date - The date to convert
 * @returns Date object in Vietnam timezone
 */
export function toVietnamTimezone(date: Date): Date {
  const vietnamDate = DateTime.fromJSDate(date).setZone('Asia/Ho_Chi_Minh');
  return vietnamDate.toJSDate();
}

/**
 * Get start of day in Vietnam timezone
 * @param date - The date to get start of day for
 * @returns Date object representing start of day in Vietnam timezone
 */
export function getStartOfDayInVietnam(date: Date): Date {
  const vietnamDate = DateTime.fromJSDate(date).setZone('Asia/Ho_Chi_Minh');
  return vietnamDate.startOf('day').toJSDate();
}

/**
 * Get current date string in Vietnam timezone
 * @returns String in format YYYY-MM-DD
 */
export function getCurrentDateStringInVietnam(): string {
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  return now.toFormat('yyyy-MM-dd');
} 