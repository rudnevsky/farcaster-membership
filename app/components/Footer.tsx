"use client";

import { useTheme } from "@/app/context/ThemeContext";
import ExternalLink from "./ExternalLink";

export function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <div className="py-6 flex flex-col gap-0 justify-center">
      <p
        className={`text-center ${
          isDarkMode ? "text-neutral-500" : "text-neutral-600"
        } text-xs`}
      >
        Mini App by{" "}
        <ExternalLink
          href="https://warpcast.com/talent"
          className={`text-center text-xs underline ${
            isDarkMode ? "text-neutral-500" : "text-neutral-600"
          }`}
        >
          @talent
        </ExternalLink>
      </p>
    </div>
  );
}
