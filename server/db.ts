import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, players, trainings, attendance, news, gallery, membershipPayments, trainers, InsertPlayer, InsertTraining, InsertAttendance, InsertNews, InsertGallery, InsertMembershipPayment, InsertTrainer, Trainer } from "../drizzle/schema";
import { ENV } from './_core/env';
import * as bcrypt from 'bcryptjs';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Players
export async function createPlayer(player: InsertPlayer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(players).values(player);
  return result;
}

export async function getPlayersByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(players).where(eq(players.category, category as any)).orderBy(players.name);
  return result;
}

export async function getAllPlayers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(players).orderBy(players.category, players.name);
  return result;
}

export async function getPlayerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(players).where(eq(players.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePlayer(id: number, data: Partial<InsertPlayer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(players).set(data).where(eq(players.id, id));
}

export async function deletePlayer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(players).where(eq(players.id, id));
}

// Trainings
export async function createTraining(training: InsertTraining) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(trainings).values(training);
  return result;
}

export async function getTrainingsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(trainings).where(eq(trainings.category, category as any)).orderBy(desc(trainings.date));
  return result;
}

export async function getAllTrainings() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(trainings).orderBy(desc(trainings.date));
  return result;
}

export async function getTrainingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(trainings).where(eq(trainings.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTraining(id: number, data: Partial<InsertTraining>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(trainings).set(data).where(eq(trainings.id, id));
}

export async function deleteTraining(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(trainings).where(eq(trainings.id, id));
}

// Attendance
export async function markAttendance(data: InsertAttendance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(attendance)
    .where(and(
      eq(attendance.trainingId, data.trainingId),
      eq(attendance.playerId, data.playerId)
    )).limit(1);
  
  if (existing.length > 0) {
    await db.update(attendance)
      .set({ present: data.present })
      .where(eq(attendance.id, existing[0].id));
  } else {
    await db.insert(attendance).values(data);
  }
}

export async function getAttendanceByTraining(trainingId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(attendance).where(eq(attendance.trainingId, trainingId));
  return result;
}

export async function getAttendanceByPlayer(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(attendance).where(eq(attendance.playerId, playerId));
  return result;
}

export async function getAttendanceStats(playerId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return { total: 0, present: 0, percentage: 0 };
  
  let conditions = [eq(attendance.playerId, playerId)];
  
  if (startDate || endDate) {
    const trainingIds = await db.select({ id: trainings.id })
      .from(trainings)
      .where(
        and(
          startDate ? gte(trainings.date, startDate) : undefined,
          endDate ? lte(trainings.date, endDate) : undefined
        )
      );
    
    if (trainingIds.length === 0) {
      return { total: 0, present: 0, percentage: 0 };
    }
  }
  
  const result = await db.select({
    total: sql<number>`COUNT(*)`,
    present: sql<number>`SUM(CASE WHEN ${attendance.present} = 1 THEN 1 ELSE 0 END)`
  }).from(attendance).where(and(...conditions));
  
  const stats = result[0];
  const total = Number(stats?.total || 0);
  const present = Number(stats?.present || 0);
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
  
  return { total, present, percentage };
}

// News
export async function createNews(newsItem: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(news).values(newsItem);
  return result;
}

export async function getPublishedNews(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(news).where(eq(news.published, true)).orderBy(desc(news.createdAt));
  
  if (limit) {
    query = query.limit(limit) as any;
  }
  
  return await query;
}

export async function getAllNews() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(news).orderBy(desc(news.createdAt));
  return result;
}

export async function getNewsById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateNews(id: number, data: Partial<InsertNews>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(news).where(eq(news.id, id));
}

// Gallery
export async function createGalleryItem(item: InsertGallery) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(gallery).values(item);
  return result;
}

export async function getGalleryByCategory(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    const result = await db.select().from(gallery).where(eq(gallery.category, category as any)).orderBy(desc(gallery.createdAt));
    return result;
  }
  
  const result = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  return result;
}

export async function deleteGalleryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(gallery).where(eq(gallery.id, id));
}

// Membership Payments
export async function setMembershipPayment(playerId: number, year: number, month: number, paid: boolean, amount?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(membershipPayments)
    .where(
      and(
        eq(membershipPayments.playerId, playerId),
        eq(membershipPayments.year, year),
        eq(membershipPayments.month, month)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing
    await db
      .update(membershipPayments)
      .set({
        paid: paid ? 1 : 0,
        amount: amount,
        paidAt: paid ? new Date() : null,
      })
      .where(eq(membershipPayments.id, existing[0]!.id));
  } else {
    // Insert new
    await db.insert(membershipPayments).values({
      playerId,
      year,
      month,
      paid: paid ? 1 : 0,
      amount,
      paidAt: paid ? new Date() : null,
    });
  }
}

export async function getMembershipPaymentsByPlayer(playerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(membershipPayments)
    .where(eq(membershipPayments.playerId, playerId))
    .orderBy(desc(membershipPayments.year), desc(membershipPayments.month));
  
  return result;
}

export async function getMembershipPaymentsByYearMonth(year: number, month: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(membershipPayments)
    .where(
      and(
        eq(membershipPayments.year, year),
        eq(membershipPayments.month, month)
      )
    );
  
  return result;
}

export async function getAllMembershipPayments() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(membershipPayments)
    .orderBy(desc(membershipPayments.year), desc(membershipPayments.month));
  
  return result;
}

// Trainer Authentication
export async function initializeTrainers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const trainerData = [
    { username: "Siandorj", fullName: "Šiandor Ján" },
    { username: "Cajkovicm", fullName: "Čajkovič Milan" },
    { username: "Hupkas", fullName: "Hupka Šimon" },
    { username: "Jedinakp", fullName: "Jedináková Petra" }
  ];
  
  const initialPassword = "Cajla123";
  const hashedPassword = await bcrypt.hash(initialPassword, 10);
  
  for (const trainer of trainerData) {
    const existing = await db.select().from(trainers).where(eq(trainers.username, trainer.username)).limit(1);
    
    if (existing.length === 0) {
      await db.insert(trainers).values({
        username: trainer.username,
        fullName: trainer.fullName,
        passwordHash: hashedPassword
      });
    }
  }
}

export async function getTrainerByUsername(username: string): Promise<Trainer | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(trainers).where(eq(trainers.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function verifyTrainerPassword(username: string, password: string): Promise<Trainer | null> {
  const trainer = await getTrainerByUsername(username);
  if (!trainer) return null;
  
  const isValid = await bcrypt.compare(password, trainer.passwordHash);
  return isValid ? trainer : null;
}

export async function updateTrainerPassword(trainerId: number, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await db.update(trainers).set({ passwordHash: hashedPassword }).where(eq(trainers.id, trainerId));
}

export async function getAllTrainers() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(trainers).orderBy(trainers.fullName);
  return result;
}

export async function getTrainerById(trainerId: number): Promise<Trainer | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(trainers).where(eq(trainers.id, trainerId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
