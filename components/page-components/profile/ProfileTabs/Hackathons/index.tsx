import { useEffect, useState } from "react";
import EmptyState from "../EmptyState";
import HackathonCard from "./HackathonCard";
import ProfileHackathonCardSkeleton from "./HackathonSkeletonCard";
import Link from "next/link";
import axios from "axios";
import { UserHackathonType } from "@/types/hackathons";
import { Hackathons } from "@/types/entities";
import { UserProfile } from "@/types/profile";

const ProfileHackathons = ({
  userProfile,
  isOwner,
}: {
  userProfile: UserProfile;
  isOwner: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [userHackathons, setUserHackathons] = useState<Hackathons[]>([]);

  const fetchUserHackathons = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/people/${userProfile?.id}/hackathons`
      );
      setUserHackathons(response.data);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      fetchUserHackathons();
    }
  }, [userProfile?.id]);

  if (userHackathons.length == 0 && !loading) {
    return isOwner ? (
      <EmptyState
        title="No Hackathons"
        description="Join a new hackathon to see the list here."
        buttonLabel="Hackathons"
        href="/hackathons"
      />
    ) : (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <p className="text-lg text-secondary-text font-medium font-roboto">{`${userProfile?.full_name} hasn't joined any hackathons yet`}</p>
      </div>
    );
  }
  return (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
      {loading &&
        Array.from({ length: 4 }).map((_, index) => (
          <ProfileHackathonCardSkeleton key={index} />
        ))}

      {!loading &&
        userHackathons.map((hackathon, index) => (
          // change from index to hackathon id when we start using real data
          <Link key={hackathon.id} href={`/hackathons/${hackathon.id}`}>
            <HackathonCard userHackathon={hackathon} />
          </Link>
        ))}
    </div>
  );
};

export default ProfileHackathons;
