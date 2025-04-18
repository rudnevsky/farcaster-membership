"use client";

import Image from "next/image";
import { useTheme } from "@/app/context/ThemeContext";
import { useUser } from "@/app/context/UserContext";

export default function Navbar() {
  const { isDarkMode } = useTheme();
  const { frameContext } = useUser();
  
  return (
    <nav className="flex justify-center items-center mb-3 w-full">
      <div className="flex items-center justify-center gap-3">
        <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
          <Image
            src="/images/talent logo.svg"
            alt="Talent Protocol"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <h1 className="font-semibold text-foreground whitespace-nowrap text-lg">/talent membership</h1>
      </div>
    </nav>
  );
}