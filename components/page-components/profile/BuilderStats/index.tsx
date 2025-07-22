import { Card } from "@/components/ui/card";
import { ConnectedAccount } from "@/types/profile";
import { useMemo } from "react";
import AddBuilderStatModal from "./AddBuilderStatModal";
import SkeletonStatCard from "./SkeletonLoader";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import UseModal from "@/hooks/useModal";

type BuilderStatsProps = {
  isFetching: boolean;
  accounts: ConnectedAccount[];
  isOwner: boolean;
};

const BuilderStats = (props: BuilderStatsProps) => {
  const { accounts, isFetching, isOwner } = props;
  const {
    closeModal: onClose,
    isOpen,
    openModal: onOpen,
  } = UseModal("connect-account");

  const showEdit = useMemo(() => {
    return isOwner && !isFetching;
  }, [isFetching, isOwner]);

  if (!accounts?.length && !isOwner) return null;

  return (
    <Card className="w-full bg-secondary-bg rounded-xl !border-none font-roboto gap-4 flex flex-col !p-6">
      <div className="flex justify-between items-center">
        <p className="font-normal !text-base text-white">Builder Stats</p>

        {showEdit && (
          <AddBuilderStatModal
            accounts={accounts}
            onClose={onClose}
            isOpen={isOpen}
            onOpen={onOpen}
          />
        )}
      </div>

      {isFetching &&
        Array.from({ length: 5 }).map((_, index) => (
          <SkeletonStatCard key={index} />
        ))}

      {!isFetching &&
        accounts?.map((account, index) => (
          <StatCard data={account} key={index} />
        ))}

      {!accounts?.length && (
        <div>
          <p className="text-secondary-text text-sm font-normal mb-5">
            To automatically fill out your profile, connect your developer
            accounts.
          </p>
          <Button size="md" className="w-full" onClick={onOpen}>
            Connect accounts
          </Button>
        </div>
      )}
    </Card>
  );
};

export default BuilderStats;
