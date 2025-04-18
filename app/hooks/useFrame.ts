import { useContext } from "react";
import { FrameContext } from "../types/frame";

export function useFrame() {
  const context = useContext(FrameContext);
  
  if (context === undefined) {
    throw new Error("useFrame must be used within a FrameProvider");
  }
  
  return context;
} 