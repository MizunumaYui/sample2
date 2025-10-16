"use client";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function HomePage() {
  const router = useRouter();

  // 現在の年月
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-based（0=1月）

  // Textarea の入力値を管理する state
  const [text, setText] = useState("");
  // 月ごとの投稿を保持する state（id も含む）
  const [monthPosts, setMonthPosts] = useState<Array<{ id: number; date: string }>>([]);

  // ページ初期描画時に今日の投稿を取得して初期値に設定
  useEffect(() => {
    const fetchTodayPost = async () => {
      try {
        const response = await fetch("/api/posts/today");
        if (response.ok) {
          const data = await response.json();
          if (data && data.text) {
            setText(data.text);
          }
        } else {
          console.error("GET /api/posts/today リクエスト失敗");
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      }
    };
    fetchTodayPost();
  }, []);

  // currentYear, currentMonthが変更されたら月ごとの投稿を取得
  useEffect(() => {
    const fetchMonthPosts = async () => {
      try {
        const monthStr = String(currentMonth + 1).padStart(2, "0");
        const response = await fetch(`/api/posts/month?year=${currentYear}&month=${monthStr}`);
        if (response.ok) {
          const data = await response.json();
          setMonthPosts(data);
        } else {
          console.error("GET /api/posts/month リクエスト失敗");
        }
      } catch (error) {
        console.error("エラー発生", error);
      }
    };
    fetchMonthPosts();
  }, [currentYear, currentMonth]);

  // POST リクエストを送る関数：更新する
  const handleUpdate = async () => {
    if (!text) return;
    try {
      const response = await fetch("/api/posts/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        console.log("更新成功");
      } else {
        console.error("更新失敗");
      }
    } catch (error) {
      console.error("エラーが発生しました", error);
    }
  };

  // 現在の月の日数を取得
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // カレンダー生成（1〜日数を配列に）
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 月初の曜日を取得
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // 行ごと（週ごと）に分ける
  const calendarDays = [];
  let week = new Array(firstDay).fill(null); // 月初の空白
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      calendarDays.push(week);
      week = [];
    }
  });
  if (week.length > 0) calendarDays.push(week);

  // 月切り替え関数
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="flex flex-col items-start bg-white">
      <div className="flex flex-col min-h-[800px] items-start w-full bg-[#f7f9fc]">
        <header className="flex items-center justify-between px-10 py-3 w-full border-b border-[#e5e8ea]">
          <div className="inline-flex items-center gap-4">
            <img
              className="flex-shrink-0"
              alt="Depth frame"
              src="/Depth 5, Frame 0.svg"
            />
            <h1 className="text-[#0c141c] text-lg font-bold">日記アプリ</h1>
          </div>
        </header>

        <main className="flex items-start justify-center gap-1 px-6 py-5 w-full max-w-[1240px] mx-auto">
          <section className="flex flex-col max-w-[920px] w-[584px] h-[695px] items-start">
            <div className="flex flex-col items-start pt-5 pb-3 px-4 w-full">
              <h2 className="text-[#0c141c] text-[28px] font-bold">
                今日の出来事を書き留めましょう
              </h2>
            </div>
            
            <div className="inline-flex flex-wrap items-end gap-4 px-4 py-3">
              <div className="flex flex-col items-start flex-1">
                <Textarea
                  className="w-[500px] min-h-36 bg-[#f7f9fc] rounded-lg border border-[#cedbe8] resize-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start px-4 py-3 w-full">
              <Button
                className="min-w-[84px] px-4 py-2.5 bg-[#0c7ff2] rounded-lg hover:bg-[#0c7ff2]/90"
                onClick={handleUpdate}
              >
                <span className="text-[#f7f9fc] text-sm font-bold">更新する</span>
              </Button>
            </div>
          </section>

          {/* カレンダー */}
          <aside className="flex flex-col w-[360px] h-[695px] items-start">
            <div className="flex flex-wrap items-center justify-center gap-6 p-4 w-full">
              <div className="flex flex-col min-w-72 max-w-[336px] items-start gap-0.5 flex-1">
                <div className="flex justify-between p-1 w-full items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-auto p-0"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-[#0c141c]" />
                  </Button>

                  <div className="text-center flex-1 font-bold text-[#0c141c]">
                    {currentYear}年 {currentMonth + 1}月
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-auto p-0"
                    onClick={handleNextMonth}
                  >
                    <ChevronRightIcon className="w-6 h-6 text-[#0c141c]" />
                  </Button>
                </div>

                {/* 曜日 */}
                <div className="flex items-start w-full">
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      className="flex w-[47px] h-12 items-center justify-center"
                    >
                      <div className="font-bold text-[#0c141c] text-[13px]">
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                {/* カレンダー日付 */}
                {calendarDays.map((week, i) => (
                  <div key={i} className="flex items-start w-full">
                    {week.map((day, j) => {
                      if (day === null) {
                        return (<div key={j} className="w-[47px] h-12"></div>);
                      }

                      // api/posts/month のレスポンスから該当の日付の投稿を取得
                      const postForDay = monthPosts.find((post) => {
                        const postDay = new Date(post.date).getDate();
                        return postDay === day;
                      });

                      const isToday =
                        day === today.getDate() &&
                        currentMonth === today.getMonth() &&
                        currentYear === today.getFullYear();

                      return (
                        <div key={j} className="flex flex-col w-[47px] h-12 items-center relative">
                          <button
                            onClick={() => {
                              if (postForDay) {
                                router.push(`/${postForDay.id}`);
                              }
                            }}
                            className={`flex items-center justify-center flex-1 w-full rounded-3xl ${
                              isToday ? "bg-[#0c7ff2]" : "hover:bg-gray-100"
                            }`}
                          >
                            <div className={`text-sm font-medium ${isToday ? "text-white" : "text-[#0c141c]"}`}>
                              {day}
                            </div>
                          </button>
                          {postForDay && (
                            <div className="absolute bottom-1 w-2 h-2 bg-blue-200 rounded-full"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
