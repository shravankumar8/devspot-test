import { UserProfile } from "@/types/profile";
import ProfileAbout from "./About";
import AvailabilityToggles from "./AvailabilityToggles";
import BuilderStats from "./BuilderStats";
import Header from "./Header";
import ProfileProgressBar from "./ProfileProgressBar";
import ProfileTabs from "./ProfileTabs";
import SkillsAndTechnologies from "./SkillsAndTechnologies";

interface ProfileProps {
  profileData: UserProfile;
  isProfileDataLoading: boolean;
  isOwner: boolean;
}

const Profile = (props: ProfileProps) => {
  const { isOwner, isProfileDataLoading, profileData } = props;

  return (
    <div
      className={`flex flex-col w-full items-start gap-4 ${
        isProfileDataLoading && "pointer-events-none"
      }`}
    >
      <Header
        userProfile={profileData}
        isFetching={isProfileDataLoading}
        isOwner={isOwner}
      />
      <div className="items-start gap-3 grid grid-cols-1 lg:grid-cols-10 w-full">
        <aside className="flex flex-col self-start gap-4 lg:col-span-3 pl-1">
          <ProfileProgressBar isOwner={isOwner} />

          <AvailabilityToggles
            userProfile={profileData}
            isFetching={isProfileDataLoading}
            isOwner={isOwner}
          />

          <ProfileAbout
            userProfile={profileData}
            isFetching={isProfileDataLoading}
            isOwner={isOwner}
          />

          <BuilderStats
            accounts={profileData?.profile?.connected_accounts}
            isFetching={isProfileDataLoading}
            isOwner={isOwner}
          />

          <SkillsAndTechnologies
            userProfile={profileData}
            isFetching={isProfileDataLoading}
            isOwner={isOwner}
          />
        </aside>

        <section className="lg:col-span-7">
          <ProfileTabs isOwner={isOwner} userProfile={profileData} />
        </section>
      </div>
    </div>
  );
};

export default Profile;
