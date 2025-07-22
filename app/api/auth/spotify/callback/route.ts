import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount } from "@/types/profile";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const SPOTIFY_REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/spotify/callback`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") ?? "profile";

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=false&provider=spotify&message=No code provided`
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    if (!accessToken || !refreshToken) {
      throw new Error("No access token or refresh token received");
    }

    cookies().set("spotify_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Fetch user data
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();

    // Fetch user's top tracks
    const topTracksResponse = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=5",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!topTracksResponse.ok) {
      throw new Error("Failed to fetch top tracks");
    }
    const currentlyPlayingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
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
        headers: { Authorization: `Bearer ${accessToken}` },
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

    // Store the Spotify data in Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: fetchUserError,
    } = await supabase.auth.getUser();

    if (!user || fetchUserError) {
      return NextResponse.redirect(`/login?ref=${request.url}`);
    }

    const { data: existingData, error: fetchError } = await supabase
      .from("participant_profile")
      .select("connected_accounts")
      .eq("participant_id", user.id)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      throw new Error("Failed to fetch existing user data");
    }
    const spotifyData = {
      // user_id: userData.id,
      // display_name: userData.display_name,
      // email: userData.email,
      followers: userData.followers.total,
      // following: userData.following.total,
      top_tracks: topTracksData.items.map((track: any) => ({
        name: track.name,
        artist: track.artists[0].name,
      })),
      playlist: userData?.playlist,
      url: userData?.external_urls?.spotify,
      currently_playing: currentlyPlaying,
      last_played_track: lastPlayedTrack,
    };

    const connectedAccounts = (existingData?.connected_accounts ||
      []) as ConnectedAccount[];
    const existingAccountIndex = connectedAccounts.findIndex(
      (account) => "spotify" in account
    );
    if (existingAccountIndex !== -1) {
      // @ts-ignore
      connectedAccounts[existingAccountIndex] = {
        spotify: spotifyData,
      };
    } else {
      // @ts-ignore
      connectedAccounts.push({ spotify: spotifyData });
    }

    const { error: updateError } = await supabase
      .from("participant_profile")
      .update({ connected_accounts: connectedAccounts })
      .eq("participant_id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true&provider=spotify`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=true&provider=spotify`
      );
    }
  } catch (error) {
    console.error("Spotify OAuth error:", error);

    if (state == "profile") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=false&provider=spotify`
      );
    } else if (state == "signup") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up/connect-account?success=false&provider=spotify`
      );
    }
  }
}
