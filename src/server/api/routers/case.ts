import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { isWithinBusinessHours, getTimeDifferenceInSeconds } from "~/utils/time";
import { calculateResolutionSli, calculateResponseSli } from "~/utils/sli";
import { getSlaThreshold } from "~/config/sla-slo";

// Define the allowed values as constants
const CaseStatus = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  RESOLVED: "RESOLVED",
} as const;

const CasePriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

// Zod schemas for validation
const CaseStatusSchema = z.enum(["OPEN", "ASSIGNED", "RESOLVED"]);
const CasePrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const caseRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.case.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.case.findUnique({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        priority: CasePrioritySchema,
        status: CaseStatusSchema.default(CaseStatus.OPEN),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.case.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: CaseStatusSchema.optional(),
        priority: CasePrioritySchema.optional(),
        assignedAt: z.date().optional(),
        completedAt: z.date().optional(),
        responseSli: z.number().optional(),
        resolutionSli: z.number().optional(),
        isCallOutTriggered: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      // Get the current case to calculate SLI
      const currentCase = await ctx.db.case.findUnique({
        where: { id },
      });

      if (!currentCase) {
        throw new Error("Case not found");
      }

      // Calculate response SLI if assignedAt is being set or updated
      if (data.assignedAt !== undefined && data.assignedAt !== null) {
        const responseSli = calculateResponseSli(
          currentCase.createdAt,
          data.assignedAt,
          (data.priority ?? currentCase.priority) as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        );
        if (responseSli !== null) {
          data.responseSli = Math.round(responseSli * 100) / 100; // Round to 2 decimal places
        }
      }

      // Calculate resolution SLI if completedAt is being set
      if (data.completedAt !== undefined && data.completedAt !== null) {
        const resolutionSli = calculateResolutionSli(
          currentCase.createdAt,
          data.completedAt,
          (data.priority ?? currentCase.priority) as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        );
        data.resolutionSli = Math.round(resolutionSli * 100) / 100; // Round to 2 decimal places
      }

      return ctx.db.case.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.case.delete({
        where: { id: input.id },
      });
    }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const result = await ctx.db.case.deleteMany({});
    return {
      count: result.count,
      message: `Deleted ${result.count} case${result.count !== 1 ? "s" : ""}`,
    };
  }),

  /**
   * Get completed cases with calculated SLI for dashboard view
   */
  getCompletedWithSli: publicProcedure.query(async ({ ctx }) => {
    const completedCases = await ctx.db.case.findMany({
      where: {
        status: CaseStatus.RESOLVED,
        completedAt: { not: null },
      },
      orderBy: { completedAt: "desc" },
    });

    return completedCases.map((caseItem) => {
      const resolutionSli = caseItem.completedAt
        ? calculateResolutionSli(
            caseItem.createdAt,
            caseItem.completedAt,
            caseItem.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
          )
        : null;

      const responseSli = calculateResponseSli(
        caseItem.createdAt,
        caseItem.assignedAt,
        caseItem.priority as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      );

      return {
        ...caseItem,
        calculatedResolutionSli: resolutionSli ? Math.round(resolutionSli * 100) / 100 : null,
        calculatedResponseSli: responseSli ? Math.round(responseSli * 100) / 100 : null,
      };
    });
  }),

  /**
   * Check SLA breaches and trigger call-outs
   * Runs every minute (or on request)
   * 
   * Call-Out Logic:
   * - Critical: If status == OPEN and currentTime - createdAt > 20 mins, set isCallOutTriggered = true
   * - High: If status == OPEN AND currentTime is outside 09:00-17:00 UK time AND currentTime - createdAt > 5 mins, set isCallOutTriggered = true
   */
  checkSlaBreach: publicProcedure.mutation(async ({ ctx }) => {
    const now = new Date();
    const updatedCases: string[] = [];

    // Get all OPEN cases that haven't been triggered yet
    const openCases = await ctx.db.case.findMany({
      where: {
        status: CaseStatus.OPEN,
        isCallOutTriggered: false,
      },
    });

    for (const caseItem of openCases) {
      const timeSinceCreation = getTimeDifferenceInSeconds(
        caseItem.createdAt,
        now
      );
      let shouldTrigger = false;

      // Critical: If status == OPEN and currentTime - createdAt > 20 mins
      if (caseItem.priority === CasePriority.CRITICAL) {
        const criticalThreshold = getSlaThreshold("CRITICAL"); // 20 minutes in seconds
        if (timeSinceCreation > criticalThreshold) {
          shouldTrigger = true;
        }
      }

      // High: If status == OPEN AND currentTime is outside 09:00-17:00 UK time AND currentTime - createdAt > 5 mins
      if (caseItem.priority === CasePriority.HIGH) {
        const isOutsideBusinessHours = !isWithinBusinessHours();
        const highThreshold = 5 * 60; // 5 minutes in seconds
        if (isOutsideBusinessHours && timeSinceCreation > highThreshold) {
          shouldTrigger = true;
        }
      }

      if (shouldTrigger) {
        await ctx.db.case.update({
          where: { id: caseItem.id },
          data: { isCallOutTriggered: true },
        });
        updatedCases.push(caseItem.id);
      }
    }

    return {
      checked: openCases.length,
      triggered: updatedCases.length,
      caseIds: updatedCases,
    };
  }),
});
