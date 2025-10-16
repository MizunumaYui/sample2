"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 投稿詳細取得
  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.date) setDate(data.date);
          if (data.text) setText(data.text);
        })
        .catch((error) =>
          console.error("投稿詳細の取得に失敗しました", error)
        );
    }
  }, [id]);

  // 要約処理
  const handleSummarize = async () => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "POST" });
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary("要約を取得できませんでした。");
      }
    } catch {
      setSummary("要約を取得できませんでした。");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start relative bg-white min-h-screen">
      {/* ヘッダー */}
      <header className="flex items-center gap-4 px-4 py-3 border-b border-solid border-[#e5e8ea] w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="p-0"
        >
          <ArrowLeftIcon className="w-6 h-6 text-[#0c141c]" />
        </Button>
        <h1 className="font-bold text-lg leading-[23px] [font-family:'Newsreader',Helvetica] text-[#0c141c]">
          日記アプリ
        </h1>
      </header>

      {/* メイン */}
      <main className="flex flex-col items-center justify-start px-4 py-5 w-full flex-1">
        <div className="flex flex-col max-w-[960px] w-full gap-6">
          {/* 日付 */}
          <div>
            <h2 className="font-bold text-[32px] leading-10 [font-family:'Newsreader',Helvetica] text-[#0c141c]">
              {date
                ? new Date(date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "日付読み込み中"}
              の日記
            </h2>
          </div>

          {/* 投稿文カード */}
          <Card className="w-full bg-[#f7f9fc] rounded-lg border border-solid border-[#cedbe8] px-6 py-4">
            <CardContent className="p-0">
              <p className="font-normal text-base leading-6 [font-family:'Newsreader',Helvetica] text-[#0c141c] whitespace-pre-wrap">
                {loading
                  ? "要約を生成中です..."
                  : summary !== null
                  ? summary
                  : text}
              </p>
            </CardContent>
          </Card>

          {/* AIボタン */}
          <div className="flex justify-start w-full">
            <Button
              onClick={handleSummarize}
              disabled={loading}
              className="min-w-[84px] h-10 px-4 bg-[#0c7ff2] hover:bg-[#0c7ff2]/90 rounded-lg"
            >
              <span className="[font-family:'Newsreader',Helvetica] font-bold text-[#f7f9fc] text-sm leading-[21px] whitespace-nowrap">
                AIで要約
              </span>
            </Button>
            {summary !== null && !loading && (
              <Button
                variant="ghost"
                className="ml-4 text-[#0c7ff2] underline"
                onClick={() => setSummary(null)}
              >
                元に戻す
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
