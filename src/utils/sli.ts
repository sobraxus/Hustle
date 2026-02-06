/**
 * SLI (Service Level Indicator) calculation utilities
 */

import { getSlaThreshold, getSloThreshold, type Priority } from "~/config/sla-slo";

/**
 * Calculate resolution SLI for a completed case
 * SLI = (actual resolution time) / (SLO target) * 100
 * 
 * @param createdAt - When the case was created
 * @param completedAt - When the case was completed
 * @param priority - Priority level of the case
 * @returns SLI percentage (0-100+), where 100 means exactly on target, >100 means over target
 */
export function calculateResolutionSli(
  createdAt: Date,
  completedAt: Date,
  priority: Priority
): number {
  const actualResolutionTime = Math.floor(
    (completedAt.getTime() - createdAt.getTime()) / 1000
  ); // in seconds
  const sloTarget = getSloThreshold(priority); // in seconds
  
  if (sloTarget === 0) return 0;
  
  return (actualResolutionTime / sloTarget) * 100;
}

/**
 * Calculate response SLI for a case
 * SLI = (actual response time) / (SLA target) * 100
 * 
 * @param createdAt - When the case was created
 * @param assignedAt - When the case was assigned (response time)
 * @param priority - Priority level of the case
 * @returns SLI percentage (0-100+), where 100 means exactly on target, >100 means over target
 */
export function calculateResponseSli(
  createdAt: Date,
  assignedAt: Date | null,
  priority: Priority
): number | null {
  if (!assignedAt) return null;
  
  const actualResponseTime = Math.floor(
    (assignedAt.getTime() - createdAt.getTime()) / 1000
  ); // in seconds
  const slaTarget = getSlaThreshold(priority); // in seconds
  
  if (slaTarget === 0) return 0;
  
  return (actualResponseTime / slaTarget) * 100;
}

/**
 * Check if SLI indicates a breach (SLI > 100)
 */
export function isSliBreach(sli: number | null): boolean {
  if (sli === null) return false;
  return sli > 100;
}
