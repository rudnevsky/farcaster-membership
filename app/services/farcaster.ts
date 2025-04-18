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
    console.log("No user FID available, returning false");
    return false;
  }

  try {
    // In development, we'll simulate the API response
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Checking if user ${frameContext.user.fid} is following channel ${channelId}`);
      // For development, we'll return false by default
      return false;
    }

    console.log(`[PROD] Frame context:`, JSON.stringify(frameContext, null, 2));
    console.log(`[PROD] Checking if user ${frameContext.user.fid} is following channel ${channelId}`);
    
    // Make the API call to check if the user is following the channel
    const apiUrl = `https://api.warpcast.com/v2/user-following-channel-status?fid=${frameContext.user.fid}&channelId=${channelId}`;
    console.log(`[PROD] Making API call to:`, apiUrl);
    
    const response = await fetch(
      apiUrl,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[PROD] API response status:`, response.status);
    console.log(`[PROD] API response status text:`, response.statusText);

    if (!response.ok) {
      console.error(`[PROD] Error checking channel follow status: ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log("[PROD] API response data:", JSON.stringify(data, null, 2));
    
    // Check if the user is following the channel
    const isFollowing = data.result?.isFollowing || false;
    console.log(`[PROD] User ${frameContext.user.fid} is ${isFollowing ? "following" : "not following"} channel ${channelId}`);
    
    return isFollowing;
  } catch (error) {
    console.error("Error checking channel follow status:", error);
    return false;
  }
} 