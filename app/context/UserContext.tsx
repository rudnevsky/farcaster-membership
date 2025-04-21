"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TalentProfile } from "@/app/types/talent";
import { fetchUserByFid } from "@/app/services/talent";
import { FrameContext } from "@/app/types/farcaster";
import { sdk } from "@farcaster/frame-sdk";
import { isFollowingChannel } from "@/app/services/farcaster";

const DEV_FRAME_CONTEXT: FrameContext = {
  user: {
    fid: 856355,
    username: "simao",
    displayName: "Simão",
  },
  client: {
    clientFid: 1,
    added: true,
  },
};

interface UserContextType {
  isLoading: boolean;
  error: Error | null;
  talentProfile: TalentProfile | null;
  frameContext: FrameContext | undefined;
  hasGithubCredential: boolean;
  hasBasenameCredential: boolean;
  basename: string | null;
  isFollowingTalentChannel: boolean;
  checkTalentChannelFollowStatus: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  isLoading: true,
  error: null,
  talentProfile: null,
  frameContext: undefined,
  hasGithubCredential: false,
  hasBasenameCredential: false,
  basename: null,
  isFollowingTalentChannel: false,
  checkTalentChannelFollowStatus: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(null);
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [hasGithubCredential, setHasGithubCredential] = useState(false);
  const [hasBasenameCredential, setHasBasenameCredential] = useState(false);
  const [basename, setBasename] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isFollowingTalentChannel, setIsFollowingTalentChannel] = useState(false);

  // Add state to track if we need to keep checking credentials
  const [shouldCheckCredentials, setShouldCheckCredentials] = useState(true);

  useEffect(() => {
    const loadSDK = async () => {
      if (process.env.NODE_ENV === "development") {
        setFrameContext(DEV_FRAME_CONTEXT);
        sdk.actions.ready();
      } else {
        setFrameContext(await sdk.context);
        sdk.actions.ready();
        await sdk.actions.addFrame();
      }
    };
    
    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      loadSDK();
    }
  }, [isSDKLoaded]);

  const checkTalentChannelFollowStatus = async () => {
    try {
      if (!frameContext?.user?.fid) {
        console.log('No FID available in frame context');
        setIsFollowingTalentChannel(false);
        return;
      }

      const fid = frameContext.user.fid;
      console.log('Checking follow status for FID:', fid);

      const response = await fetch(`/api/talent/follow-status?fid=${fid}&channelId=talent`);
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Follow status response:', data);
      
      setIsFollowingTalentChannel(data.following);
      return data.following;
    } catch (error) {
      console.error('Error checking follow status:', error);
      setIsFollowingTalentChannel(false);
      return false;
    }
  };

  const fetchUserData = async () => {
    if (!frameContext?.user?.fid) {
      setIsLoading(false);
      return null;
    }

    try {
      const response = await fetchUserByFid(frameContext.user.fid);
      setTalentProfile(response.profile || null);
      setHasGithubCredential(response.hasGithubCredential || false);
      setHasBasenameCredential(response.hasBasenameCredential || false);
      setBasename(response.basename || null);
      setError(null);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
      setTalentProfile(null);
      setHasGithubCredential(false);
      setHasBasenameCredential(false);
      setBasename(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for periodic credential checks
  useEffect(() => {
    if (!frameContext?.user?.fid || !shouldCheckCredentials) {
      return;
    }

    const checkAllCredentials = async () => {
      console.log('Checking all credentials...');
      
      const [followStatus, userData] = await Promise.all([
        checkTalentChannelFollowStatus(),
        fetchUserData()
      ]);

      // Check if all conditions are met
      const allConditionsMet = 
        followStatus &&
        userData?.hasBasenameCredential &&
        userData?.profile?.human_checkmark &&
        (userData?.profile?.builder_score?.points || 0) >= 40;

      if (allConditionsMet) {
        console.log('All conditions met, stopping periodic checks');
        setShouldCheckCredentials(false);
      }
    };

    // Initial check
    checkAllCredentials();

    // Set up periodic checks every 15 seconds
    const intervalId = setInterval(checkAllCredentials, 15000);

    return () => clearInterval(intervalId);
  }, [frameContext?.user?.fid, shouldCheckCredentials]);

  // Initial data fetch
  useEffect(() => {
    if (frameContext?.user?.fid) {
      fetchUserData();
      checkTalentChannelFollowStatus();
    }
  }, [frameContext?.user?.fid]);

  return (
    <UserContext.Provider 
      value={{ 
        isLoading, 
        error, 
        talentProfile, 
        frameContext, 
        hasGithubCredential, 
        hasBasenameCredential, 
        basename,
        isFollowingTalentChannel,
        checkTalentChannelFollowStatus
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
} 