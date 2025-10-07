import { NextResponse } from "next/server";
import { sql } from "@/lib/db";


// ユーティリティ: 今日の日付を YYYY-MM-DD で取得
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// GET: 今日の投稿を取得
export async function GET() {
  const today = getToday();

  const rows = await sql`
    SELECT id, date, text
    FROM posts
    WHERE date = ${today};
  `;

  return NextResponse.json(rows[0] ?? null);
}


//POST: 今日の投稿を新規作成 or 更新
export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const today = getToday();

  // INSERT して、date で衝突したら UPDATE
  const rows = await sql`
    INSERT INTO posts (date, text)
    VALUES (${today}, ${text})
    ON CONFLICT (date)
    DO UPDATE SET text = EXCLUDED.text
    RETURNING id, date, text;
  `;

  return NextResponse.json(rows[0], { status: 200 });
}
