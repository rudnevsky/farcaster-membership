"use client";

import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import ExternalLink from "@/app/components/ExternalLink";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

export default function RewardsActions() {
  const { 
    talentProfile, 
    hasGithubCredential, 
    isFollowingTalentChannel, 
    checkTalentChannelFollowStatus,
    frameContext
  } = useUser();
  const { isDarkMode } = useTheme();
  const [isCheckingFollow, setIsCheckingFollow] = useState(false);
  
  // Check the follow status when the component mounts
  useEffect(() => {
    checkTalentChannelFollowStatus();
  }, [checkTalentChannelFollowStatus]);
  
  const handleFollowTalent = async () => {
    // Check if user is logged into Farcaster
    if (!frameContext?.user?.fid) {
      // If not logged in, open Warpcast to log in first
      window.open("https://warpcast.com/login", "_blank");
      return;
    }
    
    // Open the Warpcast app with the follow action
    window.open("https://warpcast.com/~/channel/talent?action=follow", "_blank");
    
    // Start checking if the user has followed the channel
    setIsCheckingFollow(true);
    
    // Check multiple times with increasing delays to give the user time to follow
    const checkIntervals = [2000, 5000, 10000, 15000];
    
    for (const delay of checkIntervals) {
      setTimeout(async () => {
        await checkTalentChannelFollowStatus();
        
        // If the user is now following, stop checking
        if (isFollowingTalentChannel) {
          setIsCheckingFollow(false);
        }
      }, delay);
    }
    
    // Set a timeout to stop checking after the last interval
    setTimeout(() => {
      setIsCheckingFollow(false);
    }, checkIntervals[checkIntervals.length - 1] + 1000);
  };

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-4 mt-3 w-full">
      <Button
        size="lg"
        className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
          isDarkMode ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" : ""
        }`}
        onClick={handleFollowTalent}
        disabled={isFollowingTalentChannel || isCheckingFollow}
      >
        {isCheckingFollow 
          ? "Checking..." 
          : !frameContext?.user?.fid 
            ? "Login to Farcaster" 
            : isFollowingTalentChannel 
              ? "Following /talent" 
              : "Follow /talent"}
      </Button>

      {!hasGithubCredential && (
        <ExternalLink
          href={
            talentProfile
              ? "https://app.talentprotocol.com/settings/connected_accounts"
              : "https://app.talentprotocol.com"
          }
          target="_blank"
          className="w-full"
        >
          <Button
            size="lg"
            className={`bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black ${
              isDarkMode ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" : ""
            }`}
          >
            {talentProfile ? "Connect GitHub" : "My Builder Score"}
          </Button>
        </ExternalLink>
      )}
    </div>
  );
}
