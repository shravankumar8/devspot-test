import { signInWithProvider } from "@/app/[locale]/(authRoutes)/sign-up/actions";
import {
  useDynamicContext,
  useDynamicEvents,
  useDynamicModals,
  Wallet,
} from "@dynamic-labs/sdk-react-core";
import axios from "axios";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const useAuthProviders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setShowLinkNewWalletModal } = useDynamicModals();
  const { setShowAuthFlow, handleLogOut } = useDynamicContext();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const resetValues = () => {
    setIsLoading(false);
    setSelectedProvider(null);
  };

  useDynamicEvents("authFlowClose", async () => {
    setIsLoading(false);
  });

  useDynamicEvents("authFlowOpen", async () => {
    setIsLoading(true);
  });

  const handleOnWalletConnectMode = async (wallet: Wallet) => {
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

      const verifyRes = await axios.post(
        "/api/auth/wallet-verify",
        JSON.stringify({
          address: walletAddress,
          signature,
          nonce,
        })
      );

      if (!verifyRes.data.url) return;

      window.location.href = verifyRes.data.url;
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast(error?.message ?? "Could not Authenticate Wallet");
      resetValues();
    }
  };

  useDynamicEvents("walletAdded", async (newWallet) => {
    handleOnWalletConnectMode(newWallet);
  });

  const handleConnectWithWeb3WalletAuth = () => {
    setIsLoading(true);
    setSelectedProvider("web3_wallet");
    handleLogOut();

    setShowAuthFlow(true);
    setShowLinkNewWalletModal(true);
  };

  const handleProviderConnect = async (formData: FormData) => {
    const { data, errorMessage } = await signInWithProvider(formData);

    if (errorMessage) throw new Error(errorMessage);

    if (!data) return;

    window.location.href = data.url;
  };

  const handleClick = async (
    provider: string,
    options: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    setSelectedProvider(provider);

    const formData = new FormData();

    formData.append("provider", provider.toLowerCase());
    formData.append("options", JSON.stringify(options));

    startTransition(async () => {
      try {
        await handleProviderConnect(formData);
      } catch (error: any) {
        resetValues();
        toast(
          error?.message ?? `Could not Authenticate with Provider: ${provider}`
        );
      }
    });
  };

  const getLoading = (provider: string) => {
    return (isLoading || isPending) && selectedProvider == provider;
  };

  const googleAuthOptions = {
    queryParams: {
      access_type: "offline",
      prompt: "consent",
    },
  };

  const authProviderMap = [
    {
      title: "Google",
      imageSrc: "/Google_Icons.png",
      handler: () => handleClick("google", googleAuthOptions),
      loading: getLoading("google"),
    },
    {
      title: "GitHub",
      imageSrc: "/github.png",
      handler: () =>
        handleClick("github", {
          scopes: "read:user",
        }),
      loading: getLoading("github"),
    },
    {
      title: "GitLab",
      imageSrc: "/gitlab-logo.png",
      handler: () =>
        handleClick("gitlab", {
          scopes: "read_user",
        }),
      loading: getLoading("gitlab"),
    },

    {
      title: "Web3 Wallet",
      imageSrc: "/rainbowkit.png",
      handler: handleConnectWithWeb3WalletAuth,
      loading: getLoading("web3_wallet"),
    },
  ];

  return {
    authProviderMap,
    isDisabled: isPending || isLoading,
  };
};

export default useAuthProviders;
