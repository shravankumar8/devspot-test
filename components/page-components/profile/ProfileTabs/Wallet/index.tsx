import { DevTokenIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TransactionsData } from "@/mocked_data/data-helpers/profile/profile-data";
import { useAuthStore } from "@/state";
import { UserProfile } from "@/types/profile";
import {
  Wallet as DynamicWallet,
  useDynamicContext,
  useDynamicEvents,
  useDynamicModals,
} from "@dynamic-labs/sdk-react-core";
import axios, { AxiosError } from "axios";
import { ArrowDownLeft } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import EarningHistoryChart from "./EarningsChart";

const categories = [
  { label: "Deposit", value: "deposit" },
  { label: "Withdraw", value: "withdraw" },
];

export const Wallet = () => {
  const { data: profileData, mutate } = useSWR<UserProfile>(
    "/api/profile",
    fetchPersonalInfo
  );

  const { user } = useAuthStore();
  async function fetchPersonalInfo(url: string) {
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { setShowLinkNewWalletModal } = useDynamicModals();
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();
  useDynamicEvents("authFlowClose", async () => {
    setIsLoading(false);
  });

  useDynamicEvents("authFlowOpen", async () => {
    setIsLoading(true);
  });
  const handleOnWalletConnectMode = async (wallet: DynamicWallet) => {
    setIsLoading(true);
    try {
      const nonceRes = await axios(`/api/auth/nonce?address=${wallet.address}`);
      const nonce = nonceRes.data.nonce;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Signing request timed out")), 7000)
      );

      const signature = await Promise.race([
        wallet.signMessage(nonce),
        timeoutPromise,
      ]);

      const walletAddress = wallet.address;

      await axios.post(
        "/api/auth/wallet-verify",
        JSON.stringify({
          address: walletAddress,
          signature,
          nonce,
          userId: user?.id,
        })
      );

      mutate();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(`Could not Authenticate: ${error?.response?.data?.error}`, {
          position: "top-right",
        });

        return;
      }

      toast.error(`Could not Authenticate: ${error?.message}`, {
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useDynamicEvents("walletAdded", async (newWallet) => {
    handleOnWalletConnectMode(newWallet);
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleConnectWithWeb3WalletAuth = () => {
    setIsLoading(true);
    handleLogOut();

    setShowAuthFlow(true);
    setShowLinkNewWalletModal(true);
  };

  const isWalletConnected = useMemo(() => {
    return Boolean(profileData?.wallets?.length);
  }, [profileData?.wallets]);

  return (
    <div className="w-full bg-secondary-bg ">
      <div className="p-4">
        <div className="flex justify-between w-full mt-4 items-center">
          <div>
            <div className="flex items-center gap-1 md:text-3xl text-xl font-[700] text-white">
              <DevTokenIcon color="#A076FF" width="36px" height="36px" />
              {profileData?.profile?.token_balance}
            </div>
            <div>
              <p className="text-sm text-secondary-text font-medium mt-2 font-roboto">
                My DevSpot Token balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isWalletConnected ? (
              <>
                {/* <Button
                  size="sm"
                  variant="special"
                  disabled={!isWalletConnected}
                  className="flex items-center !font-roboto text-white"
                >
                  <ArrowUpRight />
                  <span className="ml-2">Withdraw</span>
                </Button>
                <Button
                variant='secondary'
                  size="sm"
                  disabled
                  className="flex items-center !font-roboto"
                >
                  <ArrowDownLeft />
                  <span className="ml-2">Deposit</span>
                </Button> */}

                <button className="rounded-[12px] bg-dark-connect flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={profileData?.avatar_url ?? ""}
                      alt="profile"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p>{profileData?.wallets?.[0]?.wallet_address?.slice(-6)}</p>
                  {/* <ChevronDown /> */}
                </button>
              </>
            ) : (
              <Button
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
                onClick={handleConnectWithWeb3WalletAuth}
              >
                {isLoading && <Spinner size="tiny" />}Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
      <EarningHistoryChart />
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-roboto font-bold">Transactions</h2>

          {/* <MobileDropdown
            options={categories}
            handleDropdownChange={handleCategory}
            selectedTab={selectedCategory}
            className="border border-tertiary-text !bg-tertiary-bg font-roboto"
          /> */}
        </div>
        <div>
          {TransactionsData.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-[12px] bg-primary-bg flex justify-between px-4 py-2 mb-4 items-center"
            >
              <div className="flex items-start gap-1">
                {transaction.type === "deposit" ? (
                  <ArrowDownLeft color="#91C152" size={25} />
                ) : (
                  <ArrowDownLeft color="#982237" size={25} />
                )}
                <div className="font-roboto">
                  <p className="text-lg font-medium text-white">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-secondary-text">
                    {transaction.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-2xl text-white text-right font-medium">
                  {transaction.type === "deposit" ? "+" : "-"}
                  {transaction.amount}
                </p>
                <p className="text-sm text-secondary-text font-roboto mt-1">
                  DevSpot Tokens
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
