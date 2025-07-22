import { createClient } from "@/lib/supabase/server";
import { ConnectedAccount, Spotify } from "@/types/profile";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

async function getSpotifyAccessToken(refreshToken: string) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
          "base64"
        ),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: fetchUserError,
    } = await supabase.auth.getUser();

    if (!user || fetchUserError) {
      return NextResponse.redirect(`/login?ref=${request.url}`);
    }

    const refreshToken = cookies().get("spotify_refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { error: "No Spotify refresh token found" },
        { status: 400 }
      );
    }

    const accessToken = await getSpotifyAccessToken(refreshToken);

    // Fetch currently playing track
    const currentlyPlayingResponse = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

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

    // Fetch user's recently played tracks
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

    // Fetch current data from Supabase
    const { data: userData, error: fetchError } = await supabase
      .from("participant_profile")
      .select("connected_accounts")
      .eq("participant_id", user?.id)
      .single();

    if (fetchError) {
      throw new Error("Failed to fetch user data");
    }
    const isSpotifyAccount = (
      account: ConnectedAccount
    ): account is { spotify: Spotify } => {
      return "spotify" in account;
    };
    let existingSpotifyData;
    const connectedAccounts = (userData.connected_accounts ||
      []) as ConnectedAccount[];
    const existingAccountIndex = connectedAccounts.findIndex(
      (account) => "spotify" in account
    );
    const spotifyData = connectedAccounts.find(isSpotifyAccount);
    if (spotifyData) {
      existingSpotifyData = spotifyData;
    } else {
      throw new Error(`Spotify account missing`);
    }

    let dataChanged = false;

    if (
      JSON.stringify(currentlyPlaying) !==
        JSON.stringify(existingSpotifyData?.spotify?.currently_playing) ||
      JSON.stringify(lastPlayedTrack) !==
        JSON.stringify(existingSpotifyData?.spotify?.last_played_track)
    ) {
      dataChanged = true;

      // Update Spotify data in Supabase
      connectedAccounts[existingAccountIndex] = {
        spotify: {
          ...existingSpotifyData?.spotify,
          currently_playing: currentlyPlaying,
          last_played_track: lastPlayedTrack,
        },
      };

      const { error: updateError } = await supabase
        .from("participant_profile")
        .update({ connected_accounts: connectedAccounts })
        .eq("participant_id", user.id);

      if (updateError) {
        throw new Error("Failed to update user data");
      }
    }

    return NextResponse.json({
      currently_playing: currentlyPlaying,
      last_played_track: lastPlayedTrack,
      data_changed: dataChanged,
    });
  } catch (error) {
    console.error("Error refreshing Spotify data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
