import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!year || !month) {
      return NextResponse.json(
        { error: "year and month required" },
        { status: 400 }
      );
    }

    // YYYY-MM の形式に整形
    const yearMonth = `${year}-${month.padStart(2, "0")}`;

    const rows = await sql`
      SELECT id, date
      FROM "Post"
      WHERE TO_CHAR(date, 'YYYY-MM') = ${yearMonth}
      ORDER BY date ASC
    `;

    // rows は配列で返ってくる
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /posts/month エラー:", error);
    return NextResponse.json(
      { error: "月ごとの投稿取得に失敗しました" },
      { status: 500 }
    );
  }
}
