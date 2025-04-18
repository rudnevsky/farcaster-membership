import { useContext } from "react";
import { FrameContext } from "../types/frame";

export const useFrameContext = () => {
  const context = useContext(FrameContext);
  if (!context) {
    throw new Error("useFrameContext must be used within a FrameProvider");
  }
  return context;
}; 