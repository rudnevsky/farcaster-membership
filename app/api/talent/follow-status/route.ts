import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get("fid");
    const channelId = searchParams.get("channelId") || "talent";

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    console.log(`Checking follow status for FID ${fid} on channel ${channelId}`);

    const response = await fetch(
      `https://api.warpcast.com/v2/user-following-channel-status?fid=${fid}&channelId=${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Warpcast API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to check follow status" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Follow status response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
} 