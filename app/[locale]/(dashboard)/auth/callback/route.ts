import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount } from "@/types/profile";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const errorCode = searchParams.get("error_code");
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const redirect = searchParams.get("redirect");
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  if (errorCode === "identity_already_exists") {
    return redirectToOrigin(
      request,
      origin,
      `/profile?linkedError=identity_already_exists`
    );
  }

  if (code || accessToken) {
    const supabase = await createClient();
    let authData;

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      authData = data;
    }

    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      authData = data;
    }

    if (authData?.user) {
      if (provider && redirect) {
        // This is an account connection flow

        const {
          data: { user },
        } = await supabase.auth.getUser();

        try {
          if (!user) throw new Error("User not found");

          const userData = await fetchProviderData(
            provider,
            authData?.session?.provider_token!
          );

          const { data: existingData, error: fetchError } = await supabase
            .from("participant_profile")
            .select("connected_accounts")
            .eq("participant_id", user.id)
            .single();
          if (fetchError) throw fetchError;

          const connectedAccounts = (existingData?.connected_accounts ||
            []) as ConnectedAccount[];

          const existingAccountIndex = connectedAccounts.findIndex(
            (acc) => Object.keys(acc)[0] === provider
          );

          if (existingAccountIndex !== -1) {
            // @ts-ignore
            connectedAccounts[existingAccountIndex] = { [provider]: userData };
          } else {
            // @ts-ignore
            connectedAccounts.push({ [provider]: userData });
          }

          const { data, error: updateError } = await supabase
            .from("participant_profile")
            .update({ connected_accounts: connectedAccounts })
            .eq("participant_id", user?.id);

          if (updateError) throw updateError;
          if (redirect == "profile") {
            return redirectToOrigin(
              request,
              origin,
              `/profile?success=true&provider=${provider}`
            );
          } else if (redirect == "signup") {
            return redirectToOrigin(
              request,
              origin,
              `/sign-up/connect-account?success=true&provider=${provider}`
            );
          }
        } catch (error) {
          console.error("Error in account connection:", error);
          if (redirect == "profile") {
            return redirectToOrigin(
              request,
              origin,
              `/profile?success=false&provider=${provider}`
            );
          } else if (redirect == "signup") {
            return redirectToOrigin(
              request,
              origin,
              `/sign-up/connect-account?success=false&provider=${provider}`
            );
          }
        }
      } else {
        // This is a regular auth flow
        createLoopsContact(
          {
            email: authData?.user?.email!,
            firstName:
              authData?.user?.user_metadata?.full_name?.split(" ")[0] ||
              undefined,
            lastName:
              authData?.user?.user_metadata?.full_name
                ?.split(" ")
                .slice(1)
                .join(" ") || undefined,
            fullName: authData?.user?.user_metadata?.full_name!,
            userId: authData?.user?.id!,
            mailingLists: {
              cmbgcrbki0s5e0j3rbd69bnc7: true,
            },
          },

          process.env.LOOPS_API_KEY!,
          process.env.FALLBACK_CSV_ENDPOINT!
        );

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role_id")
          .eq("id", authData.user.id)
          .single();

        if (userError) throw userError;

        // Handle technology owner flow
        if (userData?.role_id === 5) {
          // Technology owners don't have OAuth providers or token balances
          const technologyOwnerId =
            authData.user.user_metadata?.technology_owner_id;

          if (technologyOwnerId) {
            try {
              // Check if the record already exists to avoid duplicates
              const { data: existingRecord, error: checkError } = await supabase
                .from("technology_owner_users")
                .select("id")
                .eq("user_id", authData.user.id)
                .eq("technology_owner_id", technologyOwnerId)
                .maybeSingle();

              if (checkError && checkError.code !== "PGRST116") {
                console.error(
                  "Error checking existing technology_owner_users record:",
                  checkError
                );
              }

              // Only create the record if it doesn't exist
              if (!existingRecord) {
                const { error: createError } = await supabase
                  .from("technology_owner_users")
                  .insert({
                    user_id: authData.user.id,
                    technology_owner_id: technologyOwnerId,
                  });

                if (createError) {
                  console.error(
                    "Error creating technology_owner_users record:",
                    createError
                  );
                }
              }
            } catch (error) {
              console.error("Error in technology owner user creation:", error);
            }
          }

          return redirectToOrigin(request, origin, "/TO/chat-with-spot");
        }

        const { data: participant } = await supabase
          .from("participant_profile")
          .select("token_balance, connected_accounts")
          .eq("participant_id", authData.user.id)
          .single();

        if (provider && provider !== "google") {
          const userData = await fetchProviderData(
            provider,
            authData?.session?.provider_token!
          );

          const connectedAccounts = (participant?.connected_accounts ||
            []) as ConnectedAccount[];

          const existingAccountIndex = connectedAccounts.findIndex(
            (acc) => Object.keys(acc)[0] === provider
          );

          if (existingAccountIndex !== -1) {
            // @ts-ignore
            connectedAccounts[existingAccountIndex] = {
              [provider]: userData,
            };
          } else {
            // @ts-ignore
            connectedAccounts.push({ [provider]: userData });
          }

          const { error: updateError } = await supabase
            .from("participant_profile")
            .update({ connected_accounts: connectedAccounts })
            .eq("participant_id", authData.user.id);

          if (updateError) throw updateError;
        }

        if (participant && participant?.token_balance <= 1) {
          const { error: updateError } = await supabase
            .from("participant_profile")
            .update({ token_balance: 100 })
            .eq("participant_id", authData.user.id);
        }

        const { data: user_roles, error: user_roles_error } = await supabase
          .from("user_participant_roles")
          .select("*")
          .eq("participant_id", authData?.user?.id);

        const hasMainRole = user_roles?.some((role) => role.is_primary);

        if (user_roles_error || user_roles?.length <= 0 || !hasMainRole) {
          // User doesn't exist in the users table, redirect to complete registration
          if (authData?.user?.app_metadata?.provider) {
            let avatarUrl = getAvatarUrlFromProvider(
              authData?.user?.app_metadata,
              authData?.user?.app_metadata?.provider
            );

            if (avatarUrl) {
              const { error: updateError } = await supabase
                .from("users")
                .update({ avatar_url: avatarUrl })
                .eq("id", authData.user.id);

              if (updateError) {
                console.error("Error updating avatar_url:", updateError);
              }
            }
          }

          return redirectToOrigin(
            request,
            origin,
            "/sign-up/participants/select-location"
          );
        } else {
          // User exists, redirect to home page
          return redirectToOrigin(request, origin, "/");
        }
      }
    }
  }

  return redirectToOrigin(request, origin, "/auth/callback/client");
}

function redirectToOrigin(request: Request, origin: string, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${path}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${path}`);
  } else {
    return NextResponse.redirect(`${origin}${path}`);
  }
}
function getAvatarUrlFromProvider(
  userMetadata: any,
  provider: string | null
): string | null {
  switch (provider) {
    case "google":
      return userMetadata?.avatar_url || userMetadata?.picture;
    case "github":
      return userMetadata?.avatar_url;
    // Add cases for other providers as needed
    default:
      return null;
  }
}

interface LoopsContactPayload {
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userId: string;
  mailingLists: Record<string, boolean>;
}

async function createLoopsContact(
  payload: LoopsContactPayload,
  apiKey: string,
  fallbackSheetUrl: string
): Promise<any> {
  try {
    const response = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          ...payload,
          userGroup: "Users",
          tag: "users-devspot-2025-beta",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Loops API error: ${response.status} ${errorText}`);
    }

    console.log("✅ Loops contact created");

    return response.json();
  } catch (error: any) {
    console.error("❌ Loops API failed:", error.message);

    // Push to fallback CSV
    const fallbackRow = {
      timestamp: new Date().toISOString(),
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: payload.fullName,
      userId: payload.userId,
      mailingLists: JSON.stringify(payload.mailingLists),
      error: error.message,
    };

    await fetch(fallbackSheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([Object.values(fallbackRow)]),
    });
  }
}

async function fetchProviderData(provider: string, token: string) {
  switch (provider) {
    case "github":
      return fetchGithubData(token);
    case "gitlab":
      return fetchGitlabData(token);
    case "linkedin_oidc":
      return fetchLinkedInData(token);
    case "spotify":
      return fetchSpotifyData(token);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function fetchGithubData(token: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(token, data);
  return {
    following: data?.following,
    followers: data?.followers,
    repository: data?.public_repos,
    url: data?.html_url,
  };
}

async function fetchGitlabData(token: string) {
  const response = await fetch("https://gitlab.com/api/v4/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return {
    followers: data.followers,
    repository: data.projects_limit,
    url: data?.web_url,
  };
}

async function fetchLinkedInData(token: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return {
    firstName: data.given_name,
    lastName: data.family_name,
  };
}

async function fetchSpotifyData(token: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  // Fetch user's top tracks
  const topTracksResponse = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=5",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!topTracksResponse.ok) {
    throw new Error("Failed to fetch top tracks");
  }
  const currentlyPlayingResponse = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const topTracksData = await topTracksResponse.json();

  let currentlyPlaying = null;
  if (currentlyPlayingResponse.status === 200) {
    const currentlyPlayingData = await currentlyPlayingResponse.json();
    currentlyPlaying = {
      name: currentlyPlayingData.item.name,
      artist: currentlyPlayingData.item.artists[0].name,
      album: currentlyPlayingData.item.album.name,
      id: currentlyPlayingData.item.id,
    };
  }

  const recentlyPlayedResponse = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  let lastPlayedTrack = null;
  if (recentlyPlayedResponse.ok) {
    const recentlyPlayedData = await recentlyPlayedResponse.json();
    if (recentlyPlayedData.items && recentlyPlayedData.items.length > 0) {
      const track = recentlyPlayedData.items[0].track;
      lastPlayedTrack = {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        id: track.id,
      };
    }
  }
  return {
    followers: data.followers.total,
    top_tracks: topTracksData.items.map((track: any) => ({
      name: track.name,
      artist: track.artists[0].name,
    })),
    playlist: data?.playlist,
    url: data?.external_urls?.spotify,
    currently_playing: currentlyPlaying,
    last_played_track: lastPlayedTrack,
  };
}
