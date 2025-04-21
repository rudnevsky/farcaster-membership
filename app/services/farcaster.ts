"use client";

import { FrameContext } from "@/app/types/farcaster";

/**
 * Checks if a user is following a specific Farcaster channel
 * @param fid The user's Farcaster ID
 * @param channelId The ID of the channel to check (e.g., "talent")
 * @returns A promise that resolves to a boolean indicating if the user is following the channel
 */
export async function isFollowingChannel(fid: string | number, channelId: string = "talent"): Promise<boolean> {
  try {
    console.log(`Checking if user ${fid} is following /${channelId} channel`);
    
    const response = await fetch(
      `/api/talent/follow-status?fid=${fid}&channelId=${channelId}`,
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