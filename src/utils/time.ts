/**
 * Time utility functions for UK timezone operations
 * 24/7/365 - no bank holiday or weekend logic
 */

/**
 * Check if current UK time is within business hours (09:00-17:00)
 * @returns true if current time is between 09:00 and 17:00 UK time
 */
export function isWithinBusinessHours(): boolean {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
  const hours = ukTime.getHours();
  return hours >= 9 && hours < 17;
}

/**
 * Get current UK time as a Date object
 */
export function getUkTime(): Date {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
}

/**
 * Calculate the difference in seconds between two dates
 */
export function getTimeDifferenceInSeconds(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}
