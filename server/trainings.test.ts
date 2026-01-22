import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-trainer",
    email: "trainer@example.com",
    name: "Test Trainer",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("trainings management", () => {
  it("creates a new training successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.trainings.create({
      date: new Date().toISOString(),
      category: "U13",
      location: "Main field",
      notes: "Basic training session",
    });

    expect(result).toEqual({ success: true });
  });

  it("lists trainings by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const trainings = await caller.trainings.list({ category: "U13" });

    expect(Array.isArray(trainings)).toBe(true);
  });

  it("lists all trainings when no category specified", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const trainings = await caller.trainings.list();

    expect(Array.isArray(trainings)).toBe(true);
  });
});

describe("attendance tracking", () => {
  it("marks player attendance successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.attendance.mark({
      trainingId: 1,
      playerId: 1,
      present: true,
    });

    expect(result).toEqual({ success: true });
  });

  it("retrieves attendance statistics for a player", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.attendance.getStats({
      playerId: 1,
    });

    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("present");
    expect(stats).toHaveProperty("percentage");
    expect(typeof stats.total).toBe("number");
    expect(typeof stats.present).toBe("number");
    expect(typeof stats.percentage).toBe("number");
  });
});
