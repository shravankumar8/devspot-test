"use client";
import { resetDynamic } from "@/utils/reset-dynamic";
import {
  useDynamicContext,
  useDynamicEvents,
  useDynamicModals,
  Wallet,
} from "@dynamic-labs/sdk-react-core";
import Image from "next/image";

const WalletAuth = () => {
  const { setShowAuthFlow, handleUnlinkWallet } = useDynamicContext();
  const { setShowLinkNewWalletModal } = useDynamicModals();

  const handleOnWalletConnectMode = async (wallet: Wallet) => {
    try {
      // 1. Get nonce
      const nonceRes = await fetch(`/api/auth/nonce?address=${wallet.address}`);
      const { nonce } = await nonceRes.json();

      // 2. Sign message
      const signature = await wallet.signMessage(nonce);

      const walletAddress = wallet.address;

      resetDynamic();

      // 3. Verify signature
      const verifyRes = await fetch("/api/auth/wallet-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          signature,
          nonce,
        }),
      });

      const responseJson = await verifyRes.json();

      if (!responseJson.url) return;

      window.location.href = responseJson.url;
    } catch (error) {
      handleUnlinkWallet(wallet.id);
      console.error("Authentication error:", error);
    }
  };

  useDynamicEvents("walletAdded", async (newWallet) => {
    handleOnWalletConnectMode(newWallet);
  });

  return (
    <button
      onClick={() => {
        console.log("Hello");
        setShowAuthFlow(true);
        console.log("Showinfg modal");
        setShowLinkNewWalletModal(true);
      }}
      className="flex w-full justify-center rounded-[12px] gap-2 py-[10px] items-center mb-2 bg-[#2B2B31]"
    >
      <Image
        src="/rainbowkit.png"
        width={25}
        height={25}
        className="object-contain"
        alt="rainbowkit Icon"
      />
      <span>Login with Web3 Wallet</span>
    </button>
  );
};

export default WalletAuth;
