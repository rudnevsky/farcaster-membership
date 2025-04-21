import { TalentProfileResponse } from "@/app/types/talent";

const TALENT_PROTOCOL_API_KEY = process.env.TALENT_PROTOCOL_API_KEY;

if (!TALENT_PROTOCOL_API_KEY) {
  console.warn('TALENT_PROTOCOL_API_KEY is not set. Some features may not work correctly.');
}

export async function fetchUserByFid(fid: number): Promise<TalentProfileResponse> {
  const url = `/api/talent/profile?fid=${fid}`;
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${TALENT_PROTOCOL_API_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }

  return response.json();
} 