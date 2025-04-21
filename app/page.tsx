"use client";

import { useFrameContext } from "@/app/hooks/useFrameContext";
import { isFollowingChannel } from "@/app/services/farcaster";
import RewardsHome from "@/app/components/rewards/RewardsHome";
import { useState, useEffect } from "react";
import { FrameContextType } from "@/app/types/frame";

export default function HomePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const frameContext = useFrameContext() as FrameContextType;

  const checkFollowStatus = async () => {
    if (!frameContext?.frameData?.fid) {
      console.log("No user FID available");
      return;
    }

    try {
      const isFollowing = await isFollowingChannel(frameContext.frameData.fid);
      console.log(`User ${frameContext.frameData.fid} is ${isFollowing ? "following" : "not following"} /talent`);
      setIsFollowing(isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
      setIsFollowing(false);
    }
  };

  useEffect(() => {
    checkFollowStatus();
  }, [frameContext?.frameData?.fid]);

  return (
    <RewardsHome isFollowing={isFollowing} onCheckFollowStatus={checkFollowStatus} />
  );
}
