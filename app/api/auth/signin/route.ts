import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email });

  console.log('signin/route.ts: token generated', { tokenExists: !!token });

  const response = NextResponse.json({ id: user.id, email: user.email, token });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1時間
  });

  console.log('signin/route.ts: cookie set, response headers', { 
    setCookie: response.headers.get('set-cookie') 
  });

  return response;
}
