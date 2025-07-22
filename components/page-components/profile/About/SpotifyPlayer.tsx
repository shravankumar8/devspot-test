import { useEffect, useState } from "react";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
  }
}
const SpotifyPlayer = ({ trackId }: { trackId: string }) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const options = {
        uri: `spotify:track:${trackId}`,
        width: "100%",
        height: "80",
        theme: "dark",
      };

      IFrameAPI.createController(
        document.getElementById("spotify-player"),
        options,
        (EmbedController: any) => {
          setPlayer(EmbedController);

          EmbedController.addListener("playback_update", (event: any) => {
            setIsPaused(event.data.isPaused);
          });
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [trackId]);


  return <div id="spotify-player"></div>;
};

export default SpotifyPlayer;
