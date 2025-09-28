// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// GET: 投稿詳細を取得
export async function GET(
  _req: Request,
  context: unknown
) {
  const params = (context as { params?: { id?: string } }).params;
  const id = params?.id;
  const numId = Number(id);
  if (!id || isNaN(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT id, date, text
    FROM posts
    WHERE id = ${numId};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// POST: 要約を返す（生成AIを使用）
export async function POST(
  _req: Request,
  context: unknown
) {
  const params = (context as { params?: { id?: string } }).params;
  const id = params?.id;
  const numId = Number(id);
  if (!id || isNaN(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT text
    FROM posts
    WHERE id = ${numId};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const text: string = rows[0].text;

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      {
        role: "system",
        content: "あなたは文章を短く分かりやすく要約するアシスタントです。",
      },
      {
        role: "user",
        content: `次の文章を100文字以内で要約してください:\n\n${text}`,
      },
    ],
  });

  const summary =
    completion.choices[0]?.message?.content ?? "要約を生成できませんでした。";

  return NextResponse.json({ summary });
}
