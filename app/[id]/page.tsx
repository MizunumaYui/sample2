"use client";

import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export default function DetailPage() {
  const [text, setText] = useState(
    "今日は内省と感謝の一日でした。午前中は日記を書き、人生のささやかな喜びを感謝しました。午後は新しいスキルを学ぶことに専念し、大きな進歩を遂げました。夕方には家族と静かな夕食を楽しみ、物語や笑いを分かち合いました。満足感と充実感を感じています。"
  );
  const [isSummarized, setIsSummarized] = useState(false);

  // ダミー要約処理（実際はAPIを呼ぶ想定）
  const handleSummarize = () => {
    const summary =
      "内省と感謝に満ちた一日。日記、学び、家族との時間を通じて充実感を得た。";
    setText(summary);
    setIsSummarized(true);
  };

  return (
    <div className="flex flex-col items-start relative bg-white">
      <div className="flex flex-col min-h-[800px] items-start relative w-full bg-[#f7f9fc]">
        <div className="flex flex-col items-start relative w-full">
          
          {/* ヘッダー */}
          <header className="flex items-center justify-between px-10 py-3 border-b border-solid border-[#e5e8ea] w-full">
            <div className="inline-flex items-center gap-4">
              <ArrowLeftIcon className="w-6 h-6 text-[#0c141c]" />
              <h1 className="font-bold text-lg leading-[23px] whitespace-nowrap [font-family:'Newsreader',Helvetica] text-[#0c141c]">
                日記アプリ
              </h1>
            </div>
          </header>

          {/* メイン */}
          <main className="flex items-start justify-center px-40 py-5 flex-1 w-full">
            <div className="flex flex-col max-w-[960px] items-start w-full">
              
              {/* 日付 */}
              <div className="flex flex-wrap items-start justify-around gap-3 p-4 w-full">
                <div className="inline-flex flex-col min-w-72 items-start">
                  <h2 className="font-bold text-[32px] leading-10 whitespace-nowrap [font-family:'Newsreader',Helvetica] text-[#0c141c]">
                    2024年7月12日の日記
                  </h2>
                </div>
              </div>

              {/* 投稿文カード */}
              <div className="px-4 w-full mb-4">
                <Card className="w-full bg-[#f7f9fc] rounded-lg border border-solid border-[#cedbe8] px-6 py-4">
                  <CardContent className="p-0">
                    <p className="font-normal text-base leading-6 [font-family:'Newsreader',Helvetica] text-[#0c141c] whitespace-pre-wrap">
                      {text}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AIボタン（カードの外） */}
              <div className="flex justify-start px-4 w-full">
                <Button
                  onClick={handleSummarize}
                  disabled={isSummarized}
                  className="min-w-[84px] h-10 px-4 bg-[#0c7ff2] hover:bg-[#0c7ff2]/90 rounded-lg"
                >
                  <span className="[font-family:'Newsreader',Helvetica] font-bold text-[#f7f9fc] text-sm leading-[21px] whitespace-nowrap">
                    {isSummarized ? "要約済み" : "AIで要約"}
                  </span>
                </Button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
