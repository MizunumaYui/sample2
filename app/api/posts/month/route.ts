import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// 認証チェック（Cookie ベース）
async function checkAuth() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET: 指定月の投稿を取得
export async function GET(request: Request) {
  const auth = checkAuth();

  if (!auth) {
    return NextResponse.json(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json(
      { error: "year and month are required" },
      { status: 400 }
    );
  }

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(
    Number(year),
    Number(month),
    0
  )
    .toISOString()
    .split("T")[0];

  const rows = await sql`
    SELECT id, date
    FROM "Post"
    WHERE date >= ${startDate}
      AND date <= ${endDate}
    ORDER BY date;
  `;

  return NextResponse.json(rows);
}
