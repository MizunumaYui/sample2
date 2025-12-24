import { PrismaClient } from '@/lib/generated/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { signUpSchema } from '@/lib/validations/auth';
import { ZodError } from 'zod';
import { signToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zodでバリデーション
    const { email, password } = signUpSchema.parse(body);

    // メール重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // JWTトークンを生成
    const token = signToken({
      id: user.id,
      email: user.email,
    });

    // レスポンスにトークンを含める
    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        token: token,
      },
      { status: 201 }
    );

    // トークンをクッキーに設定
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1時間
    });

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'アカウント作成に失敗しました' },
      { status: 500 }
    );
  }
}