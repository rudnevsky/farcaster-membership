import { ReactNode, useEffect, useState } from "react";
import { FrameContext, FrameData } from "../types/frame";

interface FrameProviderProps {
  children: ReactNode;
}

export function FrameProvider({ children }: FrameProviderProps) {
  const [frameData, setFrameData] = useState<FrameData>({});
  const [isFrame, setIsFrame] = useState(false);

  useEffect(() => {
    // Check if we're in a frame context
    const isFrameContext = typeof window !== "undefined" && window.location.search.includes("frame=true");
    setIsFrame(isFrameContext);

    if (isFrameContext) {
      // Parse frame data from URL parameters
      const params = new URLSearchParams(window.location.search);
      const data: FrameData = {
        fid: params.get("fid") || undefined,
        url: params.get("url") || undefined,
        messageHash: params.get("messageHash") || undefined,
        timestamp: params.get("timestamp") || undefined,
        network: params.get("network") || undefined,
        buttonIndex: params.get("buttonIndex") || undefined,
        castId: params.get("castId") || undefined,
      };
      setFrameData(data);
    }
  }, []);

  return (
    <FrameContext.Provider value={{ isFrame, frameData }}>
      {children}
    </FrameContext.Provider>
  );
} 