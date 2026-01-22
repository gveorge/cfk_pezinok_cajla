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

describe("players management", () => {
  it("creates a new player successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.players.create({
      name: "Test Player",
      category: "U13",
      parentName: "Test Parent",
      parentPhone: "+421123456789",
      parentEmail: "parent@example.com",
    });

    expect(result).toEqual({ success: true });
  });

  it("lists players by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const players = await caller.players.list({ category: "U13" });

    expect(Array.isArray(players)).toBe(true);
  });

  it("lists all players when no category specified", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const players = await caller.players.list();

    expect(Array.isArray(players)).toBe(true);
  });
});
