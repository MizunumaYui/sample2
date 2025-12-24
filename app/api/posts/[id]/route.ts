import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import OpenAI from "openai";

// 認証チェック（Cookie ベース）
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// GET: 投稿詳細
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await checkAuth();
  if (!auth) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await context.params;
  const numId = Number(id);

  if (!id || isNaN(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT id, date, text
    FROM "Post"
    WHERE id = ${numId};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// POST: 要約生成
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await checkAuth();
  if (!auth) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { id } = await context.params;
  const numId = Number(id);

  if (!id || isNaN(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT text
    FROM "Post"
    WHERE id = ${numId};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const text: string = rows[0].text;

  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-nano-9b-v2:free",
    messages: [
      {
        role: "system",
        content: "あなたは文章を短くわかりやすく要約するアシスタントです。",
      },
      {
        role: "user",
        content: `次の文章を100文字以内で要約してください:\n\n${text}`,
      },
    ],
  });

  return NextResponse.json({
    summary:
      completion.choices[0]?.message?.content ??
      "要約を生成できませんでした。",
  });
}
