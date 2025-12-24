import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "signed out" });

  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
