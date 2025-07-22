import { ConnectedIcon, UnconnectedIcon } from "@/components/icons/Location";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import axios, { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DevAccountInfo } from "./type";
import { UserIdentity } from "@supabase/supabase-js";
import useSWR from "swr";

const DevAccountCard = (props: DevAccountInfo) => {
  const { icon, label, method, url, value } = props;

  const [loading, setLoading] = useState(false);

  const providersCanBeUnlinked = [
    "github",
    "gitlab",
    "linkedin_oidc",
    "spotify",
  ];

  const authProviders = [
    'github',
    'gitlab'
  ]

  const fetchIdentities = async (url: string) => {
    const resp = await axios.get(url);
    return resp.data?.identities as UserIdentity[];
  };

  const {
    data: identities = [],
    isLoading,
    mutate,
  } = useSWR<UserIdentity[]>("/api/auth/identities", fetchIdentities);

  const connected = useMemo(
    () => identities.some((iden) => iden.provider === value),
    [identities, value]
  );

  const handleLinkIdentity = async () => {
    if (method == "GET") {
      window.location.href = url;

      return;
    }

    const response = await axios.post(url, props.data);

    if (!response.data.url) return;

    window.location.href = response.data?.url;
  };

  const handleUnlinkIdentity = async () => {
    await axios.post("/api/auth/identities/unlink", { provider: value });
    toast.success("Disconnected Successfully");
    mutate();
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      if (connected && providersCanBeUnlinked.includes(value)) {
        // count how many auth‑provider identities the user has right now
        const currentAuthCount = identities.filter((i) =>
          authProviders.includes(i.provider)
        ).length;

        // if they’re unlinking an auth provider, and this is the last one, block
        if (authProviders.includes(value) && currentAuthCount <= 1) {
          toast.error(
            "You must keep at least one authentication provider connected."
          );
          return;
        }

        await handleUnlinkIdentity();
        return;
      }


      await handleLinkIdentity();
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(
          `Could not Connect/Disconnect: ${err?.response?.data?.error}`
        );
        return;
      }

      toast.error("Could not Connect/Disconnect");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    isLoading ||
    // also disable if they’re about to unlink the last auth provider
    (connected &&
      providersCanBeUnlinked.includes(value) &&
      authProviders.includes(value) &&
      identities.filter((i) => authProviders.includes(i.provider)).length <= 1);

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="w-full justify-between h-11"
      disabled={isDisabled}
    >
      <div className="flex items-center text-[#A1A1A3] text-base font-medium font-roboto gap-2">
        {icon}
        {label}
      </div>

      {loading && <Spinner size="small" />}

      {!loading && (
        <div>
          {isLoading ? (
            <Spinner size="small" />
          ) : (
            <>
              {!connected ? (
                <UnconnectedIcon color="#4E52F5" width="30px" height="30px" />
              ) : (
                <>
                  {providersCanBeUnlinked.includes(value) && (
                    <ConnectedIcon width="30px" height="30px" />
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </Button>
  );
};

export default DevAccountCard;
