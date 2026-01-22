import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const categoryEnum = z.enum(["U8-U9", "U10-U11", "U13", "U15", "A"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Players management
  players: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        dateOfBirth: z.string().optional(),
        category: categoryEnum,
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPlayer({
          ...input,
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        });
        return { success: true };
      }),

    list: protectedProcedure
      .input(z.object({
        category: categoryEnum.optional(),
      }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return await db.getPlayersByCategory(input.category);
        }
        return await db.getAllPlayers();
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPlayerById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        dateOfBirth: z.string().optional(),
        category: categoryEnum.optional(),
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePlayer(id, {
          ...data,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePlayer(input.id);
        return { success: true };
      }),
  }),

  // Trainings management
  trainings: router({
    create: protectedProcedure
      .input(z.object({
        date: z.string(),
        category: categoryEnum,
        location: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createTraining({
          ...input,
          date: new Date(input.date),
          createdById: ctx.user.id,
        });
        return { success: true };
      }),

    list: protectedProcedure
      .input(z.object({
        category: categoryEnum.optional(),
      }).optional())
      .query(async ({ input }) => {
        if (input?.category) {
          return await db.getTrainingsByCategory(input.category);
        }
        return await db.getAllTrainings();
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getTrainingById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        date: z.string().optional(),
        category: categoryEnum.optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTraining(id, {
          ...data,
          date: data.date ? new Date(data.date) : undefined,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteTraining(input.id);
        return { success: true };
      }),
  }),

  // Attendance tracking
  attendance: router({
    mark: protectedProcedure
      .input(z.object({
        trainingId: z.number(),
        playerId: z.number(),
        present: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.markAttendance(input);
        return { success: true };
      }),

    getByTraining: protectedProcedure
      .input(z.object({ trainingId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAttendanceByTraining(input.trainingId);
      }),

    getByPlayer: protectedProcedure
      .input(z.object({ playerId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAttendanceByPlayer(input.playerId);
      }),

    getStats: protectedProcedure
      .input(z.object({
        playerId: z.number(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getAttendanceStats(
          input.playerId,
          input.startDate ? new Date(input.startDate) : undefined,
          input.endDate ? new Date(input.endDate) : undefined
        );
      }),
  }),

  // News management
  news: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createNews({
          ...input,
          authorId: ctx.user.id,
        });
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getPublishedNews(input?.limit);
      }),

    listAll: protectedProcedure
      .query(async () => {
        return await db.getAllNews();
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNewsById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        imageUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateNews(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNews(input.id);
        return { success: true };
      }),
  }),

  // Gallery management
  gallery: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
        imageUrl: z.string(),
        imageKey: z.string(),
        category: z.enum(["U8-U9", "U10-U11", "U13", "U15", "A", "general"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createGalleryItem({
          ...input,
          uploadedById: ctx.user.id,
        });
        return { success: true };
      }),

    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getGalleryByCategory(input?.category);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteGalleryItem(input.id);
        return { success: true };
      }),
  }),

  // Membership Payments
  membershipPayments: router({
    setPayment: protectedProcedure
      .input(z.object({
        playerId: z.number(),
        year: z.number(),
        month: z.number().min(1).max(12),
        paid: z.boolean(),
        amount: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.setMembershipPayment(
          input.playerId,
          input.year,
          input.month,
          input.paid,
          input.amount
        );
        return { success: true };
      }),

    getByPlayer: protectedProcedure
      .input(z.object({ playerId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMembershipPaymentsByPlayer(input.playerId);
      }),

    getByYearMonth: protectedProcedure
      .input(z.object({
        year: z.number(),
        month: z.number().min(1).max(12),
      }))
      .query(async ({ input }) => {
        return await db.getMembershipPaymentsByYearMonth(input.year, input.month);
      }),

    getAll: protectedProcedure
      .query(async () => {
        return await db.getAllMembershipPayments();
      }),
  }),
});

export type AppRouter = typeof appRouter;
