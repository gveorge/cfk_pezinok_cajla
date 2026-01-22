import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-trainer",
    email: "trainer@cfkpezinok.sk",
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

describe("membership payments", () => {
  it("sets payment status for a player", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a player
    await caller.players.create({
      name: "Test Player",
      dateOfBirth: "2015-01-01",
      category: "U13",
      position: "Forward",
    });

    // Get the player
    const players = await caller.players.list({});
    const player = players[0];
    expect(player).toBeDefined();

    // Set payment
    const result = await caller.membershipPayments.setPayment({
      playerId: player!.id,
      year: 2026,
      month: 1,
      paid: true,
    });

    expect(result.success).toBe(true);

    // Verify payment was set
    const payments = await caller.membershipPayments.getByPlayer({
      playerId: player!.id,
    });

    expect(payments.length).toBeGreaterThan(0);
    const payment = payments.find((p: any) => p.year === 2026 && p.month === 1);
    expect(payment).toBeDefined();
    expect(payment?.paid).toBe(1);
    expect(payment?.year).toBe(2026);
    expect(payment?.month).toBe(1);
  });

  it("retrieves payments by year and month", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a player
    await caller.players.create({
      name: "Another Player",
      dateOfBirth: "2014-06-15",
      category: "U13",
      position: "Defender",
    });

    const players = await caller.players.list({});
    const player = players.find((p: any) => p.name === "Another Player");

    // Set payment
    await caller.membershipPayments.setPayment({
      playerId: player!.id,
      year: 2026,
      month: 2,
      paid: true,
    });

    // Get payments for specific month
    const payments = await caller.membershipPayments.getByYearMonth({
      year: 2026,
      month: 2,
    });

    expect(payments.length).toBeGreaterThan(0);
    const playerPayment = payments.find((p: any) => p.playerId === player!.id);
    expect(playerPayment).toBeDefined();
    expect(playerPayment?.paid).toBe(1);
  });

  it("updates existing payment status", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a player
    await caller.players.create({
      name: "Update Test Player",
      dateOfBirth: "2016-03-20",
      category: "U8-U9",
      position: "Midfielder",
    });

    const players = await caller.players.list({});
    const player = players.find((p: any) => p.name === "Update Test Player");

    // Set payment as paid
    await caller.membershipPayments.setPayment({
      playerId: player!.id,
      year: 2026,
      month: 3,
      paid: true,
    });

    // Update to unpaid
    await caller.membershipPayments.setPayment({
      playerId: player!.id,
      year: 2026,
      month: 3,
      paid: false,
    });

    // Verify update
    const payments = await caller.membershipPayments.getByPlayer({
      playerId: player!.id,
    });

    const payment = payments.find((p: any) => p.month === 3);
    expect(payment?.paid).toBe(0);
  });
});
