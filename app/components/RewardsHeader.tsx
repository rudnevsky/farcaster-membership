"use client";

import { useTheme } from '@/app/context/ThemeContext';

export default function RewardsHeader() {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`
        ${
          isDarkMode
            ? "bg-neutral-900 border-neutral-800"
            : "bg-white border-neutral-200"
        }
        rounded-lg border`}
      >
        <div className="flex flex-col items-center justify-between p-4">
          <h2
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-neutral-900"
            }`}
          >
            Mini App by @talent
          </h2>
        </div>
      </div>
    </div>
  );
}
