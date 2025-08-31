import { useEffect, useRef } from 'react'

// Twitch JS Embed API
// https://dev.twitch.tv/docs/embed/video-and-clips/

declare global {
  interface Window {
    Twitch?: any
  }
}

let twitchScriptLoading: Promise<void> | null = null
function loadTwitchScript() {
  if (window.Twitch && window.Twitch.Player) return Promise.resolve()
  if (!twitchScriptLoading) {
    twitchScriptLoading = new Promise<void>((resolve, reject) => {
      const s = document.createElement('iframe')
      s.src = 'https://player.twitch.tv/js/embed/v1.js'
      document.head.appendChild(s)
    })
  }
  return twitchScriptLoading
}

export function TwitchEmbed({ channel }: { channel: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false
    const parent = typeof location !== 'undefined' ? location.hostname : 'localhost'
    loadTwitchScript()
      .then(() => {
        if (disposed || !containerRef.current) return
        containerRef.current.innerHTML = ''
        playerRef.current = new window.Twitch.Player(containerRef.current, {
          width: '100%',
          height: '100%',
          channel,
          parent: [parent],
          autoplay: true,
          muted: true,
        })
      })
      .catch(() => {})
    return () => {
      disposed = true
      try { playerRef.current?.destroy?.() } catch {}
      playerRef.current = null
    }
  }, [channel])

  return <div ref={containerRef} className="twitch-embed" />
}
