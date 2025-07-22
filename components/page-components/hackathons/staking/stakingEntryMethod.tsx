"use client";

import { Hackathons } from "@/types/entities";
import { useState } from "react";
import StakingModal from "./stakingModal";
import { useStaking } from "./useStaking";

interface StakingEntryMethodProps {
  hackathon: Hackathons;
  onRegistrationComplete: () => void;
}

export function StakingEntryMethod({
  hackathon,
  onRegistrationComplete,
}: StakingEntryMethodProps) {
  const [showStakingModal, setShowStakingModal] = useState(false);

  const { isLoading, stakeStatus, initiateStake } = useStaking({
    hackathonId: hackathon.id,
    onSuccess: () => {
      setShowStakingModal(false);
      onRegistrationComplete();
    },
    onError: (error) => {
      alert(`Staking failed: ${error}`);
    },
    primaryWallet: {
      address: "0xbab81af844687c57f4bb8c9aa74f7e97281960dd",
    }
  });

  const handleStakeClick = () => {
    setShowStakingModal(true);
  };

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Staking Entry</h3>
          <p className="text-sm text-gray-600 mt-1">
            Stake ${hackathon.stake_amount} to participate. Get it back when you
            submit your project!
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            ${hackathon.stake_amount}
          </div>
          <div className="text-xs text-gray-500">USD</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Refundable upon project submission
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
          Secure payment via Coinbase Commerce
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
          Supports major cryptocurrencies
        </div>
      </div>

      <button
        onClick={handleStakeClick}
        disabled={isLoading}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {!isLoading
          ? "Processing..."
          : `Stake $${hackathon.stake_amount} to Join`}
      </button>

      {/* Staking Modal */}
      {showStakingModal && (
        <StakingModal
          hackathon={hackathon}
          onClose={() => setShowStakingModal(false)}
          onConfirm={initiateStake}
          isLoading={isLoading}
          status={stakeStatus}
        />
      )}
    </div>
  );
}
