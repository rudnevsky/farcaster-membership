import RewardsActions from "@/app/components/RewardsActions";
import HowToEarn from "@/app/components/rewards/HowToEarn";

interface RewardsHomeProps {
  isFollowing: boolean;
  onCheckFollowStatus: () => Promise<void>;
}

export default function RewardsHome({ isFollowing, onCheckFollowStatus }: RewardsHomeProps) {
  return (
    <>
      <HowToEarn isFollowing={isFollowing} onCheckFollowStatus={onCheckFollowStatus} />
      <RewardsActions />
    </>
  );
}
