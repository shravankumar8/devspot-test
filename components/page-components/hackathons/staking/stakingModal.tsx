import { Hackathons } from "@/types/entities";

interface StakingModalProps {
  hackathon: Hackathons;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  status: "idle" | "pending" | "confirmed" | "failed";
}

export default function StakingModal({
  hackathon,
  onClose,
  onConfirm,
  isLoading,
  status,
}: StakingModalProps) {
  const primaryWallet = {
    address: "0xbab81af844687c57f4bb8c9aa74f7e97281960dd",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Confirm Stake</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Hackathon</span>
              <span className="font-medium text-black">{hackathon.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Stake Amount</span>
              <span className="font-bold text-lg text-black">
                ${hackathon.stake_amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Connected Wallet</span>
              <span className="font-mono text-sm text-black">
                {primaryWallet?.address?.slice(0, 6)}...
                {primaryWallet?.address?.slice(-4)}
              </span>
            </div>
          </div>

          {status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                <span className="text-sm text-yellow-800">
                  Please complete the payment in the opened window
                </span>
              </div>
            </div>
          )}

          {status === "confirmed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-green-800">
                  Stake confirmed! You're now registered.
                </span>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-sm text-red-800">
                  Transaction failed. Please try again.
                </span>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            💡 Your stake will be automatically refunded when you submit a valid
            project before the deadline.
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || status === "pending"}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Confirm Stake"}
          </button>
        </div>
      </div>
    </div>
  );
}
