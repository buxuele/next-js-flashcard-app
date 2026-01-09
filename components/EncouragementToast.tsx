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
      setIsVisible(true);

      // 1.7秒后开始淡出
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 1700);

      // 2秒后完全隐藏
      const removeTimer = setTimeout(() => {
        setIsShowing(false);
        onComplete();
      }, 2000);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [trigger, onComplete]);

  if (!isShowing) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95"
      }`}
    >
      <div className="relative">
        {/* 主卡片 - 移除抖动动画 */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl p-4 min-w-[200px]">
          <div className="bg-white/95 backdrop-blur rounded-xl px-6 py-3 text-center">
            <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {message}
            </p>
          </div>
        </div>

        {/* 装饰性光晕 */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-2xl blur-xl opacity-50 -z-10"></div>

        {/* 星星装饰 */}
        <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">
          ✨
        </div>
        <div className="absolute -bottom-2 -left-2 text-2xl">🎉</div>
      </div>
    </div>
  );
});
