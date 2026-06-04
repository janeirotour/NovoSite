import { Router } from "express";
  import { writeFile, mkdir } from "fs/promises";
  import { join, dirname } from "path";
  import { fileURLToPath } from "url";
  import { randomUUID } from "crypto";

  const router = Router();

  const WORKSPACE_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
  const UPLOADS_DIR = join(WORKSPACE_ROOT, "artifacts", "janeiro-tour", "public", "uploads");

  router.post("/upload/image", async (req, res): Promise<void> => {
    if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }

    const { dataUrl, filename } = req.body as { dataUrl?: string; filename?: string };
    if (!dataUrl || typeof dataUrl !== "string") { res.status(400).json({ error: "dataUrl is required" }); return; }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) { res.status(400).json({ error: "Invalid dataUrl format" }); return; }

    const mimeType = match[1];
    const base64Data = match[2];
    const ext = mimeType.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");

    const safeName = filename
      ? filename.replace(/[^a-z0-9.-]/gi, "-").toLowerCase().replace(/\.[^.]+$/, "") + "." + ext
      : `${randomUUID()}.${ext}`;

    try {
      await mkdir(UPLOADS_DIR, { recursive: true });
      await writeFile(join(UPLOADS_DIR, safeName), Buffer.from(base64Data, "base64"));
      res.json({ url: `/uploads/${safeName}`, filename: safeName });
    } catch (err) {
      req.log.error({ err, UPLOADS_DIR }, "Failed to save uploaded image");
      res.status(500).json({ error: "Failed to save image" });
    }
  });

  export default router;
  