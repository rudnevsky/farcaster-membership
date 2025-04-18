import { createContext } from "react";

export interface FrameData {
  fid?: string;
  url?: string;
  messageHash?: string;
  timestamp?: string;
  network?: string;
  buttonIndex?: string;
  castId?: string;
}

export interface FrameContextType {
  isFrame: boolean;
  frameData: FrameData;
}

export const FrameContext = createContext<FrameContextType | undefined>(undefined); 