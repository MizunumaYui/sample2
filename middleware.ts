import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 公開ページ
  const publicPages = ['/signin', '/signup'];

  // 公開 API
  const publicApiRoutes = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/signout',
  ];

  const isPublicPage = publicPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isPublicApiRoute = publicApiRoutes.some(
    (p) => pathname.startsWith(p)
  );

  // JWT Cookie の存在確認（検証はしない）
  const token = request.cookies.get('token')?.value;
  const hasToken = !!token;

  console.log('middleware debug:', {
    pathname,
    hasToken,
    isPublicPage,
    isPublicApiRoute,
  });

  /**
   * API ルートの処理
   */
  if (pathname.startsWith('/api')) {
    // 認証不要 API はそのまま通す
    if (isPublicApiRoute) {
      return NextResponse.next();
    }

    // 保護 API：トークンがなければ 401
    if (!hasToken) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  /**
   * ページルートの処理
   */

  // 未ログインで保護ページ → /signin
  if (!hasToken && !isPublicPage) {
    console.log('middleware: unauthenticated, redirect to /signin');
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // ログイン済みで /signin, /signup → /
  if (hasToken && isPublicPage) {
    console.log('middleware: authenticated, redirect to /');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // その他は通す
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
