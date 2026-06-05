import { Router } from "express";
import OpenAI from "openai";

const router = Router();

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

router.post("/ai/generate-text", async (req, res): Promise<void> => {
  if (!req.session.adminId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const { field, context } = req.body as { field: string; context: Record<string, string> };
  if (!field) { res.status(400).json({ error: "field is required" }); return; }

  const prompts: Record<string, string> = {
    seoTitle: `Write a concise, compelling SEO title (max 60 chars) for this travel experience. Must include the main destination/activity keyword at the beginning. No quotes, no brand name suffix needed.
Context: ${JSON.stringify(context)}
Return ONLY the title text, nothing else.`,

    seoDescription: `Write a persuasive SEO meta description (max 155 chars) for this travel experience. Include a call-to-action, main keyword, and a unique selling point. No quotes.
Context: ${JSON.stringify(context)}
Return ONLY the meta description text, nothing else.`,

    overview: `Write an engaging, evocative 3-sentence overview for this tour/travel experience. Write from the traveler's perspective, highlight what makes it special and unique. Afrotourism / Black-owned travel company in Rio de Janeiro context.
Context: ${JSON.stringify(context)}
Return ONLY the overview paragraph, nothing else.`,

    excerpt: `Write a compelling 1-2 sentence blog excerpt (max 200 chars) that entices readers to click. Should be vivid and include the main topic.
Context: ${JSON.stringify(context)}
Return ONLY the excerpt text, nothing else.`,

    description: `Write a rich, engaging 2-3 sentence destination description that highlights culture, atmosphere, and what travelers will experience.
Context: ${JSON.stringify(context)}
Return ONLY the description text, nothing else.`,
  };

  const prompt = prompts[field] ?? `Generate professional marketing copy for the field "${field}". Context: ${JSON.stringify(context)}. Return only the text.`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert travel copywriter for a Black-owned Afrotourism company based in Rio de Janeiro, Brasil. Write compelling, authentic content that celebrates Brazilian culture and Black heritage. Be vivid and specific, not generic." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ text });
  } catch (err: unknown) {
    req.log.error({ err }, "OpenAI generate-text failed");
    res.status(500).json({ error: "AI generation failed. Check your API key." });
  }
});

export default router;
