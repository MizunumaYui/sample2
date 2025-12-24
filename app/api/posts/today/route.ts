import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// 🔑 async にする
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET() {
  const user = await checkAuth();

  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  const today = getToday();

  const rows = await sql`
    SELECT id, date, text
    FROM "Post"
    WHERE date = ${today};
  `;

  return NextResponse.json(rows[0] ?? null);
}
