import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsQueryParams,
  CreateBlogPostBody,
  GetBlogPostParams,
  GetBlogPostResponse,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  UpdateBlogPostResponse,
  DeleteBlogPostParams,
  ListBlogPostsResponse,
} from "@workspace/api-zod";

const router = Router();

const mapPost = (post: typeof blogPostsTable.$inferSelect) => ({
  ...post,
  createdAt: post.createdAt.toISOString(),
});

router.get("/blog", async (req, res): Promise<void> => {
  const params = ListBlogPostsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success && params.data.featured !== undefined) {
    conditions.push(eq(blogPostsTable.featured, params.data.featured));
  }
  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(blogPostsTable.createdAt);
  res.json(ListBlogPostsResponse.parse(posts.map(mapPost)));
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const rawId = req.params.id;
  const numId = parseInt(rawId, 10);
  const isNumeric = !isNaN(numId) && String(numId) === rawId;

  let post;
  if (isNumeric) {
    [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, numId));
  } else {
    [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, rawId));
  }
  if (!post) { res.status(404).json({ error: "Blog post not found" }); return; }
  res.json(GetBlogPostResponse.parse(mapPost(post)));
});

router.post("/blog", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [post] = await db.insert(blogPostsTable).values(parsed.data as typeof blogPostsTable.$inferInsert).returning();
  res.status(201).json(GetBlogPostResponse.parse(mapPost(post)));
});

router.patch("/blog/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [post] = await db.update(blogPostsTable).set(parsed.data as Partial<typeof blogPostsTable.$inferInsert>).where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!post) { res.status(404).json({ error: "Blog post not found" }); return; }
  res.json(UpdateBlogPostResponse.parse(mapPost(post)));
});

router.delete("/blog/:id", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [post] = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, params.data.id)).returning();
  if (!post) { res.status(404).json({ error: "Blog post not found" }); return; }
  res.sendStatus(204);
});

export default router;
