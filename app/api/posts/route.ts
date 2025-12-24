import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function checkAuth() {
  const cookieStore =await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { date, text } = await request.json();

  if (!date || !text) {
    return NextResponse.json(
      { error: "date and text are required" },
      { status: 400 }
    );
  }

  // 既にあれば更新、なければ作成
  await sql`
    INSERT INTO "Post" (date, text)
    VALUES (${date}, ${text})
    ON CONFLICT (date)
    DO UPDATE SET text = EXCLUDED.text;
  `;

  return NextResponse.json({ success: true });
}
