"use client";

import { FrameContext } from "@/app/types/farcaster";

/**
 * Checks if a user is following a specific Farcaster channel
 * @param frameContext The Farcaster frame context containing user information
 * @param channelId The ID of the channel to check (e.g., "talent")
 * @returns A promise that resolves to a boolean indicating if the user is following the channel
 */
export async function isFollowingChannel(fid: string): Promise<boolean> {
  try {
    console.log(`Checking if user ${fid} is following /talent channel`);
    
    const response = await fetch(
      `/api/talent/follow-status?fid=${fid}&channelId=talent`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Follow status check failed:", errorData);
      return false;
    }

    const data = await response.json();
    console.log("Follow status response:", data);
    
    // The Warpcast API returns { following: true/false }
    return data.following === true;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
} 