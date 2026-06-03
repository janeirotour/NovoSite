import { Router } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, adminsTable, toursTable, destinationsTable, blogPostsTable, reviewsTable } from "@workspace/db";
import { avg, count } from "drizzle-orm";
import {
  AdminLoginBody,
  GetAdminMeResponse,
  GetAdminStatsResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

declare module "express-session" {
  interface SessionData {
    adminId: number;
    adminUsername: string;
    adminRole: string;
  }
}

const router = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.username, parsed.data.username));
  if (!admin) { res.status(401).json({ success: false, message: "Invalid credentials" }); return; }

  const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!valid) { res.status(401).json({ success: false, message: "Invalid credentials" }); return; }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.adminRole = admin.role;
  res.json({ success: true, message: "Logged in" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy((err) => {
    if (err) logger.error({ err }, "Session destroy error");
    res.json({ success: true, message: "Logged out" });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  res.json(GetAdminMeResponse.parse({ username: req.session.adminUsername, role: req.session.adminRole }));
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  const [totalTours] = await db.select({ count: count() }).from(toursTable);
  const [totalDestinations] = await db.select({ count: count() }).from(destinationsTable);
  const [totalReviews] = await db.select({ count: count() }).from(reviewsTable);
  const [totalBlogPosts] = await db.select({ count: count() }).from(blogPostsTable);
  const [featuredTours] = await db.select({ count: count() }).from(toursTable).where(eq(toursTable.featured, true));
  const [publishedTours] = await db.select({ count: count() }).from(toursTable).where(eq(toursTable.published, true));
  const [avgRating] = await db.select({ avg: avg(reviewsTable.rating) }).from(reviewsTable);

  res.json(GetAdminStatsResponse.parse({
    totalTours: totalTours.count,
    totalDestinations: totalDestinations.count,
    totalReviews: totalReviews.count,
    totalBlogPosts: totalBlogPosts.count,
    featuredTours: featuredTours.count,
    publishedTours: publishedTours.count,
    averageRating: parseFloat(avgRating.avg ?? "0"),
  }));
});

export default router;
