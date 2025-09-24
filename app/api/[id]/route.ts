// app/api/[id]/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // @neondatabase/serverless の sql をexportしている前提

// GET: 投稿詳細を取得
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT id, date, text
    FROM posts
    WHERE id = ${id};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

// POST: 要約を返す（仮実装: text の冒頭20文字）
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT text
    FROM posts
    WHERE id = ${id};
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const text: string = rows[0].text;
  const summary =
    text.length > 20 ? text.slice(0, 20) + "..." : text;

  return NextResponse.json({ summary });
}
