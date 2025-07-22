"use client";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
  RemoveWallets,
} from "@dynamic-labs/sdk-react-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { WagmiProvider } from "wagmi";

import { config } from "../wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  useCallback(() => {
    () => {
      const faviconEl = document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      mediaQuery.addEventListener("change", themeChange);

      console.log({ faviconEl, mediaQuery });

      // if (faviconEl) {
      //   if (mediaQuery.matches) {
      //     faviconEl.setAttribute("href", "/favicon-dark.ico");
      //   } else {
      //     faviconEl.setAttribute("href", "/favicon.ico");
      //   }
      // }
    };
  }, []);

  const themeChange = (e: MediaQueryListEvent) => {
    const faviconEl = document.querySelector('link[rel="icon"]');
    console.log({ faviconEl, e });

    if (faviconEl) {
      if (e.matches) {
        faviconEl.setAttribute("href", "/favicon-dark.png");
      } else {
        faviconEl.setAttribute("href", "/favicon-light.png");
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", themeChange);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicContextProvider
          settings={{
            initialAuthenticationMode: "connect-only",
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
            walletConnectors: [EthereumWalletConnectors],
            walletsFilter: RemoveWallets(["trust"]),
          }}
        >
          {children}
        </DynamicContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
