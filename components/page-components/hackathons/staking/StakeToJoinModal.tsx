"use client";
import { Checkbox } from "@/components/common/Checkbox";
import { CoinIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GenericModal from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import UseModal from "@/hooks/useModal";
import { useAuthStore } from "@/state";
import { Hackathons } from "@/types/entities";
import { UserProfile } from "@/types/profile";
import {
  useDynamicContext,
  useDynamicEvents,
  useDynamicModals,
} from "@dynamic-labs/sdk-react-core";
import axios from "axios";
import { Contract, formatUnits, getAddress, JsonRpcProvider } from "ethers";
import { ChevronDown, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import { useStaking } from "./useStaking";
interface StakeToJoinModalProps {
  hackathon: Hackathons;
}

const StakeToJoinModal = ({ hackathon }: StakeToJoinModalProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { closeModal: onClose, isOpen, openModal: onOpen } = UseModal();

  const fetchProfile = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data as UserProfile;
  };
  const { data: profileData, isLoading: isProfileDataLoading } =
    useSWR<UserProfile>(`/api/profile`, fetchProfile);

  const isWalletConnected = useMemo(() => {
    return Boolean(profileData?.wallets?.length);
  }, [profileData?.wallets]);

  const [isLoading, setIsLoading] = useState(false);
  const { setShowLinkNewWalletModal } = useDynamicModals();
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();
  useDynamicEvents("authFlowClose", async () => {
    setIsLoading(false);
  });
  const handleConnectWithWeb3WalletAuth = () => {
    setIsLoading(true);
    handleLogOut();

    setShowAuthFlow(true);
    setShowLinkNewWalletModal(true);
  };

  const {
    isLoading: processing,
    stakeStatus,
    initiateStake,
  } = useStaking({
    hackathonId: hackathon.id,
    onSuccess: () => {},
    onError: (error) => {
      alert(`Staking failed: ${error}`);
    },
    primaryWallet: {
      address: "0xbab81af844687c57f4bb8c9aa74f7e97281960dd",
    },
  });

  const [selectedWallet, setSelectedWallet] = useState({
    wallet: profileData?.wallets?.[0],
    balance: 0,
    loading: false,
  });

  useCallback(async () => {
    if (!selectedWallet?.wallet) return 0;

    setSelectedWallet({
      ...selectedWallet,
      loading: true,
    });

    const USDC_RAW = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    const USDC = USDC_RAW.toLowerCase();
    const RPC_URL = "https://ethereum-rpc.publicnode.com";
    const ERC20_ABI = [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
    ];
    const provider = new JsonRpcProvider(RPC_URL);
    const token = new Contract(USDC, ERC20_ABI, provider);

    const checksum = getAddress(
      selectedWallet?.wallet?.wallet_address!.toLowerCase()
    );

    const [raw, decimals] = await Promise.all([
      token.balanceOf(checksum),
      token.decimals(),
    ]);
    const balance = formatUnits(raw, decimals);
    console.log({ balance });

    setSelectedWallet({
      ...selectedWallet,
      balance: parseFloat(balance),
      loading: false,
    });
  }, [selectedWallet.wallet]);

  return (
    <GenericModal
      hasMinHeight={false}
      hasSidebar={false}
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
      trigger={
        <div>
          <Button className="flex gap-2 items-center" variant="special">
            <CoinIcon />
            <span>Stake {hackathon.stake_amount} USDC to Join</span>
          </Button>
        </div>
      }
    >
      <div className="overflow-y-scroll">
        <DialogHeader className="bg-[#1B1B22] py-2">
          <DialogTitle className="!text-[24px] font-semibold font-roboto">
            Stake {hackathon.stake_amount} USDC to join
          </DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-3 mt-6 overflow-y-scroll">
          <p className="font-normal font-roboto text-sm">
            Please note that you need to stake USDC to confirm your spot for{" "}
            {hackathon.name}. You will receive your stake back after you submit
            a project.
          </p>

          <div className="my-6 flex flex-col gap-4">
            {selectedWallet && (
              <div className=" bg-primary-bg rounded-xl flex items-center gap-2 font-roboto pl-3 w-[300px] ">
                <h2 className="text-white font-bold text-sm w-1/2">
                  {selectedWallet.balance} USDC
                </h2>

                <div className="w-1/2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className="relative flex justify-between items-center bg-tertiary-bg px-4 py-2 border-secondary-text rounded-xl "
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        className="!border-tertiary-text !border !text-sm text-secondary-text !font-roboto !font-medium truncate w-full flex items-center justify-between"
                      >
                        <Image
                          src={profileData?.avatar_url ?? ""}
                          alt="profile"
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />

                        <p>
                          {profileData?.wallets?.[0]?.wallet_address?.slice(
                            0,
                            6
                          )}
                          ...
                          {profileData?.wallets?.[0]?.wallet_address?.slice(-4)}
                        </p>

                        <ChevronDown
                          className="ml-2 flex-shrink-0"
                          color="#fff"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="left-0 !bg-tertiary-bg p-0 overflow-y-scroll font-roboto text-gray-300 text-sm w-full"
                    >
                      {profileData?.wallets?.map((wallet) => (
                        <DropdownMenuItem
                          key={"todo-implement-project"}
                          className="p-3 border-b border-b-tertiary-text"
                          onClick={() =>
                            setSelectedWallet({
                              wallet,
                              balance: 0,
                              loading: false,
                            })
                          }
                        >
                          <label className="flex items-center gap-3 text-secondary-text text-sm">
                            <Checkbox
                              checked={wallet.id === selectedWallet.wallet?.id}
                            />

                            {wallet.wallet_address}
                          </label>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            {selectedWallet &&
              Number(selectedWallet?.balance) <
                Number(hackathon.stake_amount ?? 0) && (
                <p className="font-normal font-roboto text-xs text-red-500 flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  Insufficient USDC balance. You need at least{" "}
                  {hackathon.stake_amount} USDC to stake.
                </p>
              )}

            {stakeStatus === "pending" && (
              <p className="font-normal font-roboto text-xs text-yellow-200 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Please complete the payment in the opened window
              </p>
            )}

            {stakeStatus === "confirmed" && (
              <p className="font-normal font-roboto text-xs text-green-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Stake confirmed! You're now registered.
              </p>
            )}

            {stakeStatus === "failed" && (
              <p className="font-normal font-roboto text-xs text-red-500 flex items-center gap-2">
                <Info className="w-3 h-3" />
                Transaction failed. Please try again.
              </p>
            )}
          </div>

          {!user && (
            <p className="font-normal font-roboto text-xs flex items-center gap-2 italic">
              <Info
                color="#4E52F5"
                className="w-3 h-3 text-gray-400 hover:text-white"
              />
              <p className="flex items-center gap-1">
                To proceed with staking, please log in or create a Devspot
                account using the button below
              </p>
            </p>
          )}

          <div className="w-full gap-2 flex sm:justify-end justify-center mt-4">
            {!user && (
              <Button
                onClick={() => router.push("/en/login")}
                type="button"
                className="w-fit font-roboto text-sm flex items-center gap-2"
              >
                Log In
              </Button>
            )}

            {!isWalletConnected && (
              <Button
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
                onClick={handleConnectWithWeb3WalletAuth}
              >
                {isLoading && <Spinner size="tiny" />}Connect Wallet
              </Button>
            )}

            {isWalletConnected && (
              <Button
                type="button"
                onClick={initiateStake}
                className="w-fit font-roboto text-sm flex items-center gap-2"
                disabled={selectedWallet.loading || processing}
              >
                {processing ? "Processing..." : "Stake Now"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </GenericModal>
  );
};

export default StakeToJoinModal;
