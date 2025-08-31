import { useEffect, useRef, useState } from 'react'

// Basic Twitch embed using iframe API
// Docs: https://dev.twitch.tv/docs/embed/video-and-clips/

declare global {
  interface Window {
    Twitch?: any
  }
}

export function TwitchEmbed({ channel }: { channel: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    // re-render iframe when channel changes
    setKey((k) => k + 1)
  }, [channel])

  // Use iframe directly to avoid loading extra script; parent domain must be set.
  // The parent param must match the current host for Twitch embeds to work.
  const parent = typeof location !== 'undefined' ? location.hostname : 'localhost'

  return (
    <div ref={containerRef} className="twitch-embed">
      <iframe
        key={key}
        src={`https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${encodeURIComponent(parent)}&muted=true&autoplay=true`}
        height="100%"
        width="100%"
        allowFullScreen={true}
        frameBorder="0"
        allow="autoplay; fullscreen"
        title={`Twitch ${channel}`}
      />
    </div>
  )
}
