import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS request for CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const channelId = searchParams.get("channelId");

  if (!fid || !channelId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400, headers }
    );
  }

  try {
    console.log(`Checking follow status for fid=${fid}, channelId=${channelId}`);
    
    const response = await fetch(
      `https://api.warpcast.com/v2/user-following-channel-status?fid=${fid}&channelId=${channelId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`Warpcast API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Warpcast API error: ${response.statusText}` },
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    console.log("Warpcast API response:", JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("Error checking channel follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500, headers }
    );
  }
} 