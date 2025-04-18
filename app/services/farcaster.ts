"use client";

import { FrameContext } from "@/app/types/farcaster";

/**
 * Checks if a user is following a specific Farcaster channel
 * @param frameContext The Farcaster frame context containing user information
 * @param channelId The ID of the channel to check (e.g., "talent")
 * @returns A promise that resolves to a boolean indicating if the user is following the channel
 */
export async function isFollowingChannel(
  frameContext: FrameContext | undefined,
  channelId: string
): Promise<boolean> {
  if (!frameContext?.user?.fid) {
    return false;
  }

  try {
    // In development, we'll simulate the API response
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Checking if user ${frameContext.user.fid} is following channel ${channelId}`);
      // For development, we'll return false by default
      // This ensures the follow step is not marked as completed until explicitly set
      return false;
    }

    // Make the API call to check if the user is following the channel
    // Using the correct endpoint from the Farcaster API documentation
    const response = await fetch(
      `https://api.warpcast.com/v2/user-following-channel-status?fid=${frameContext.user.fid}&channelId=${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Error checking channel follow status: ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    
    // Check if the user is following the channel
    return data.result?.isFollowing || false;
  } catch (error) {
    console.error("Error checking channel follow status:", error);
    return false;
  }
} 