import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("trainer authentication", () => {
  beforeAll(async () => {
    // Initialize trainers in database
    await db.initializeTrainers();
  });

  it("initializes trainers successfully", async () => {
    const trainers = await db.getAllTrainers();
    expect(trainers.length).toBeGreaterThanOrEqual(4);
    
    const usernames = trainers.map(t => t.username);
    expect(usernames).toContain("Siandorj");
    expect(usernames).toContain("Cajkovicm");
    expect(usernames).toContain("Hupkas");
    expect(usernames).toContain("Jedinakp");
  });

  it("verifies trainer password correctly", async () => {
    const trainer = await db.verifyTrainerPassword("Siandorj", "Cajla123");
    expect(trainer).not.toBeNull();
    expect(trainer?.username).toBe("Siandorj");
  });

  it("rejects invalid password", async () => {
    const trainer = await db.verifyTrainerPassword("Siandorj", "wrongpassword");
    expect(trainer).toBeNull();
  });

  it("rejects non-existent trainer", async () => {
    const trainer = await db.verifyTrainerPassword("nonexistent", "Cajla123");
    expect(trainer).toBeNull();
  });

  it("gets trainer by username", async () => {
    const trainer = await db.getTrainerByUsername("Cajkovicm");
    expect(trainer).not.toBeUndefined();
    expect(trainer?.fullName).toBe("Čajkovič Milan");
  });

  it("updates trainer password", async () => {
    const trainer = await db.getTrainerByUsername("Hupkas");
    if (!trainer) throw new Error("Trainer not found");

    await db.updateTrainerPassword(trainer.id, "NewPassword123");
    
    // Verify old password doesn't work
    const oldPasswordCheck = await db.verifyTrainerPassword("Hupkas", "Cajla123");
    expect(oldPasswordCheck).toBeNull();
    
    // Verify new password works
    const newPasswordCheck = await db.verifyTrainerPassword("Hupkas", "NewPassword123");
    expect(newPasswordCheck).not.toBeNull();
  });
});
