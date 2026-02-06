/**
 * SLA/SLO Threshold Configuration
 * 
 * SLA (Service Level Agreement): Maximum time allowed for response
 * SLO (Service Level Objective): Maximum time allowed for resolution
 * 
 * All times are in seconds
 */

export const SLA_THRESHOLDS = {
  CRITICAL: 20 * 60,      // 20 minutes
  HIGH: 1 * 60 * 60,      // 1 hour
  MEDIUM: 2 * 60 * 60,    // 2 hours
  LOW: 4 * 60 * 60,       // 4 hours
} as const;

export const SLO_THRESHOLDS = {
  CRITICAL: 2 * 60 * 60,  // 2 hours
  HIGH: 4 * 60 * 60,      // 4 hours
  MEDIUM: 8 * 60 * 60,    // 8 hours
  LOW: 12 * 60 * 60,      // 12 hours
} as const;

export type Priority = keyof typeof SLA_THRESHOLDS;

/**
 * Get SLA threshold for a given priority
 */
export function getSlaThreshold(priority: Priority): number {
  return SLA_THRESHOLDS[priority];
}

/**
 * Get SLO threshold for a given priority
 */
export function getSloThreshold(priority: Priority): number {
  return SLO_THRESHOLDS[priority];
}
