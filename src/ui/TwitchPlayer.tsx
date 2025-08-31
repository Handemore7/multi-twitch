import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Twitch JS Embed API with simple autoplay detection and troubleshooting overlay
// https://dev.twitch.tv/docs/embed/video-and-clips/

declare global {
  interface Window {
    Twitch?: any
  }
}

let twitchScriptPromise: Promise<void> | null = null
function ensureTwitchScript() {
  if (window.Twitch?.Player) return Promise.resolve()
  if (!twitchScriptPromise) {
    twitchScriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://player.twitch.tv/js/embed/v1.js'
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Twitch embed script'))
      document.head.appendChild(s)
    })
  }
  return twitchScriptPromise
}

export type PlayerStatus = 'init' | 'ready' | 'playing' | 'paused' | 'blocked' | 'offline'

export type PlayerHandle = { playMuted: () => void }

export const TwitchPlayer = forwardRef<PlayerHandle, { channel: string; onStatusChange?: (status: PlayerStatus) => void }>(
  function TwitchPlayer({ channel, onStatusChange }, ref) {
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [status, setStatus] = useState<PlayerStatus>('init')
  const statusRef = useRef<PlayerStatus>('init')
  const setSt = (s: PlayerStatus) => { statusRef.current = s; setStatus(s); onStatusChange?.(s) }

  useEffect(() => {
    let disposed = false
    let blockTimer: any
    const parent = typeof location !== 'undefined' ? location.hostname : 'localhost'

    ensureTwitchScript()
      .then(() => {
        if (disposed || !mountRef.current) return
        mountRef.current.innerHTML = ''
        const p = new window.Twitch.Player(mountRef.current, {
          width: '100%',
          height: '100%',
          channel,
          parent: [parent],
          autoplay: true,
          muted: true,
        })
        playerRef.current = p

        const T = window.Twitch?.Player
        if (T) {
          p.addEventListener(T.READY, () => {
            setSt('ready')
            try { p.setMuted(true); p.play() } catch {}
            clearTimeout(blockTimer)
            blockTimer = setTimeout(() => {
              if (playerRef.current && statusRef.current !== 'playing') { setSt('blocked') }
            }, 2000)
          })
          // Use PLAY (correct event) instead of PLAYING
          p.addEventListener(T.PLAY, () => {
            setSt('playing')
            clearTimeout(blockTimer)
          })
          p.addEventListener(T.PAUSE, () => { if (statusRef.current === 'playing') setSt('paused') })
          p.addEventListener(T.ONLINE, () => { setSt('playing') })
          p.addEventListener(T.OFFLINE, () => { setSt('offline') })
        }
      })
      .catch(() => { setSt('blocked') })

    return () => {
      disposed = true
      clearTimeout(blockTimer)
      try { playerRef.current?.destroy?.() } catch {}
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])

  function tryPlay() {
    const p = playerRef.current
    try {
      if (p) {
        p.setMuted(true)
        p.play()
      }
    } catch {}
  }

  useImperativeHandle(ref, () => ({
    playMuted() { tryPlay() },
  }), [])

  const showOverlay = status === 'blocked' || status === 'paused' || status === 'offline'
  const overlayMessage =
    status === 'offline'
      ? 'This channel is offline.'
      : 'The player needs your permission to start.'

  return (
    <div className="twitch-wrap">
      <div ref={mountRef} className="twitch-embed" />
      {showOverlay && (
        <div className="twitch-overlay" onClick={tryPlay} role="button" title="Click to start">
          <div className="panel">
            <strong>{overlayMessage}</strong>
            {status !== 'offline' && (
              <ul>
                <li>Click to start playback.</li>
                <li>Allow autoplay on this site (Brave Shields/Autoplay).</li>
                <li>Allow third‑party cookies for twitch.tv.</li>
                <li>If needed, press play inside the player.</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
})
