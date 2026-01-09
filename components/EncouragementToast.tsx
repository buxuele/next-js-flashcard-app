"use client";

import { memo, useEffect, useState, useRef } from "react";

interface EncouragementToastProps {
  trigger: number; // 改用触发计数器
  onComplete: () => void;
}

const ENCOURAGEMENT_MESSAGES = [
  "你很棒哦！ 🌟",
  "干得漂亮！ 👏",
  "继续加油！ 💪",
  "太厉害了！ ✨",
  "学习达人！ 🎯",
  "真是天才！ 🧠",
  "越来越强！ 🚀",
  "坚持就是胜利！ 🏆",
  "知识+1！ 📚",
  "进步神速！ ⚡",
  "好样的！ 🎉",
  "棒棒哒！ 🌈",
  "真聪明！ 💡",
  "超级赞！ 🌺",
  "你是最棒的！ 🎊",
  "学霸本霸！ 📖",
  "智慧满满！ 🎓",
  "完美！ ⭐",
  "优秀！ 🏅",
  "了不起！ 🎪",
];

export const EncouragementToast = memo(function EncouragementToast({
  trigger,
  onComplete,
}: EncouragementToastProps) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const lastTriggerRef = useRef(0);

  useEffect(() => {
    // 只在 trigger 变化且大于 0 时触发
    if (trigger > 0 && trigger !== lastTriggerRef.current) {
      lastTriggerRef.current = trigger;

      // 随机选择一条鼓励语
      const randomMessage =
        ENCOURAGEMENT_MESSAGES[
          Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
        ];
      setMessage(randomMessage);
      setIsShowing(true);

      // 立即显示（无延迟）
      setTimeout(() => setIsVisible(true), 10);

      // 2秒后开始淡出
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      // 2.5秒后完全移除
      const removeTimer = setTimeout(() => {
        setIsShowing(false);
        onComplete();
      }, 2500);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  if (!isShowing) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      {/* Bootstrap 风格的 Toast - 深色主题 */}
      <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden min-w-[280px] max-w-[350px]">
        {/* 顶部彩色条 */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

        {/* 内容区 */}
        <div className="p-4 flex items-start gap-3">
          {/* 图标 */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl">
            ✓
          </div>

          {/* 文字内容 */}
          <div className="flex-1 pt-1">
            <p className="text-white font-medium text-base">{message}</p>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setIsShowing(false);
                onComplete();
              }, 500);
            }}
            className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
