"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { ExternalLink, Pencil, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react"

interface VideoPlayerProps {
  url: string
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false)
  const [youtubeId, setYoutubeId] = useState<string | null>(null)

  // Function to extract YouTube video ID from URL
  const getYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Function to check if URL is a YouTube link
  const isYoutubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be")
  }

  // Initialize video source based on URL
  useEffect(() => {
    if (isYoutubeUrl(url)) {
      const id = getYoutubeId(url)
      setIsYoutubeVideo(true)
      setYoutubeId(id)
    } else {
      setIsYoutubeVideo(false)
      setYoutubeId(null)
    }

    // Reset player state when URL changes
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
    setDuration(0)
  }, [url])

  // Handle play/pause for regular video
  const togglePlay = () => {
    if (isYoutubeVideo) {
      // For YouTube, we can't directly control play/pause
      // We'll just toggle the state for UI purposes
      setIsPlaying(!isPlaying)
      return
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration
      setCurrentTime(current)
      setProgress((current / duration) * 100)
    }
  }

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isYoutubeVideo) {
      // For YouTube, we can't directly control seeking
      return
    }

    const seekTime = Number(e.target.value)
    setProgress(seekTime)
    if (videoRef.current) {
      videoRef.current.currentTime = (seekTime / 100) * duration
    }
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isYoutubeVideo) {
      // For YouTube, we can't directly control volume
      return
    }

    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (isYoutubeVideo) {
      // For YouTube, we can't directly control mute
      return
    }

    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 1
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      playerContainerRef.current.requestFullscreen()
    }
  }

  // Reset video
  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setProgress(0)
      if (isPlaying) {
        videoRef.current.play()
      }
    }
  }

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setIsControlsVisible(true)
      clearTimeout(timeout)

      if (isPlaying) {
        timeout = setTimeout(() => {
          setIsControlsVisible(false)
        }, 3000)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  return (
    <div
    ref={playerContainerRef}
    className="relative aspect-video rounded-[8px] bg-[#13131a] overflow-hidden group w-full"
    onMouseEnter={() => setIsControlsVisible(true)}
    onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
  >
    {!isYoutubeVideo ? (
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        src={url}
      />
    ) : (
      youtubeId && (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    )}

    {/* Play/Pause button overlay */}
    {!isYoutubeVideo && (
      <button
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying && !isControlsVisible ? "opacity-0" : "opacity-100"
        }`}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-700/80">
          {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
        </div>
      </button>
    )}

    {/* Video controls */}
    {!isYoutubeVideo && (
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
          isControlsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            style={{background:"4779ff"}}
            className="w-full video-range h-1 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"

          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={resetVideo}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-10 h-1 video-range rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}
