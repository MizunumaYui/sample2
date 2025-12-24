'use client';

import { useState } from 'react';
import { signUpSchema } from '@/lib/validations/auth';
import { ZodError } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // フロントエンドでのバリデーション
      signUpSchema.parse({ email, password });

      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        credentials: 'include', // クッキーの送受信を有効化
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // サインアップ成功
        // クッキーに JWT が設定された
        // middleware がクッキーを検証するため、フルリロードが必須
        console.log('signup/page.tsx: サインアップ成功、/ へフルリロード開始');
        
        // alert は使わない。直接リロード
        window.location.href = '/';
        
        // 念のため、リダイレクト実行を待つ
        return;
      } else {
        alert(data.error || 'エラーが発生しました');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        alert('エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-center mb-6 text-2xl font-bold">サインアップ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block mb-2">
              メールアドレス
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="block mb-2">
              パスワード
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400"
          >
            {loading ? '処理中...' : 'サインアップ'}
          </button>
        </form>

        <p className="text-center mt-4">
          アカウントをお持ちですか?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
