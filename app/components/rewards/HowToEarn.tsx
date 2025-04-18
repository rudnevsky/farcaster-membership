"use client";

import { useUser } from "@/app/context/UserContext";
import { useTheme } from "@/app/context/ThemeContext";
import { Check } from "lucide-react";
import ExternalLink from "@/app/components/ExternalLink";
import { useEffect } from "react";

export default function HowToEarn() {
  const { 
    isLoading: isUserLoading, 
    hasBasenameCredential, 
    talentProfile, 
    basename,
    isFollowingTalentChannel,
    checkTalentChannelFollowStatus,
    frameContext
  } = useUser();
  const { isDarkMode } = useTheme();

  // Check the follow status when the component mounts
  useEffect(() => {
    checkTalentChannelFollowStatus();
    
    // Set up a periodic check every 30 seconds
    const intervalId = setInterval(() => {
      checkTalentChannelFollowStatus();
    }, 30000);
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [checkTalentChannelFollowStatus]);

  const EARNING_STEPS = [
    {
      text: "Follow /talent channel",
      url: "https://warpcast.com/~/channel/talent",
      condition: !isUserLoading && frameContext?.user?.fid && isFollowingTalentChannel,
    },
    {
      text: `Own a Basename ${basename ? `(${basename})` : ""}`,
      url: "https://www.base.org/names",
      condition: !isUserLoading && hasBasenameCredential,
    },
    {
      text: "Get your Human Checkmark",
      url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
      condition: !isUserLoading && talentProfile?.human_checkmark,
    },
    {
      text: "Increase your Builder Score to 40+",
      url: "https://app.talentprotocol.com/profile",
      condition:
        !isUserLoading &&
        talentProfile?.builder_score?.points &&
        talentProfile?.builder_score?.points >= 40,
    },
  ];

  const allConditionsMet = EARNING_STEPS.every((step) => step.condition);

  return (
    <div className={`rounded-lg border ${isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}`}>
      <div className="p-4">
        <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-neutral-800"}`}>
          How to post in /talent
        </h2>
        <p className={`mb-5 ${isDarkMode ? "text-neutral-500" : "text-neutral-600"}`}>
          Only members can post in the /talent channel. This helps prevent spam and low-quality interactions. 
          To become a member and get posting access, follow the steps below:
        </p>

        {allConditionsMet ? (
          <p className="text-green-500 mb-6 text-sm">
            You are eligible for Builder Rewards!
          </p>
        ) : (
          <p className={`mb-6 text-sm ${isDarkMode ? "text-neutral-500" : "text-neutral-600"}`}>
            You&apos;re not eligible to post in /talent channel yet.
          </p>
        )}

        <ul className="space-y-4">
          {EARNING_STEPS.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium ${
                  step.condition
                    ? isDarkMode
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-500"
                    : isDarkMode
                    ? "bg-neutral-700 text-white"
                    : "bg-neutral-200 text-neutral-800"
                }`}
              >
                {step.condition ? <Check className="w-3 h-3" /> : index + 1}
              </div>
              <ExternalLink
                href={step.url}
                className={`${
                  isDarkMode
                    ? "text-white hover:text-neutral-500"
                    : "text-neutral-800 hover:text-neutral-600"
                }`}
              >
                {step.text}
              </ExternalLink>
            </li>
          ))}
        </ul>

        <p className={`text-sm ${isDarkMode ? "text-neutral-500" : "text-neutral-600"} mt-6`}>
          Invitations are automatically sent to eligible users on a daily basis. Once you complete all the steps above, you&apos;ll get an invite to become a member. Just check back in the /talent channel a little bit later.
        </p>
      </div>
    </div>
  );
} 