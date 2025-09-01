import { useEffect, useMemo, useState } from 'react'
import { Plus, Share2 } from './icons.tsx'
import { ScreenGrid } from './ScreenGrid.tsx'
// chats-only view; no TwitchPlayer imports needed
import { getLayoutForCount } from './layouts.ts'
import { parseQuery, toQuery } from '../utils/share'
import { useToast } from './Toast'

export type Screen = {
  id: string
  channel: string
  muted?: boolean
}

function newId() {
  return Math.random().toString(36).slice(2, 9)
}

export function App() {
  const [screens, setScreens] = useState<Screen[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [pendingChannel, setPendingChannel] = useState('')
  const { show } = useToast()
  // chats-only: no player statuses or refs

  // initialize from URL
  useEffect(() => {
    const qs = parseQuery(location.search)
    if (qs.channels && Array.isArray(qs.channels)) {
      const initial = (qs.channels as string[])
        .slice(0, 9)
        .map((c) => ({ id: newId(), channel: c }))
      setScreens(initial)
    }
  }, [])

  // keep URL in sync for easy sharing
  useEffect(() => {
    const params = toQuery({ channels: screens.map((s) => s.channel) })
    const url = `${location.pathname}?${params}`
    history.replaceState(null, '', url)
  }, [screens])

  const layout = useMemo(() => getLayoutForCount(screens.length), [screens.length])

  useEffect(() => {
    if (!showAdd) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowAdd(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showAdd])

  function addScreenFromValue(value: string) {
    const channel = value.trim()
    if (!channel) return
    setScreens((prev) => [...prev, { id: newId(), channel }])
    setPendingChannel('')
    setShowAdd(false)
    show(`Added chat: ${channel}`, 'success')
  }

  function addScreen() {
    if (screens.length >= 9) {
      show('Maximum of 9 chats reached', 'error')
      return
    }
    setShowAdd(true)
    setTimeout(() => {
      const el = document.getElementById('add-channel-input') as HTMLInputElement | null
      el?.focus()
    }, 0)
  }

  function removeScreen(id: string) {
    setScreens((prev) => prev.filter((s) => s.id !== id))
  }

  function updateChannel(id: string) {
    const current = screens.find((s) => s.id === id)?.channel ?? ''
    const next = prompt('Enter Twitch channel name:', current)?.trim() || ''
    if (!next || next === current) return
    setScreens((prev) => prev.map((s) => (s.id === id ? { ...s, channel: next } : s)))
    show(`Updated chat: ${next}`, 'success')
  }

  function share() {
    const url = location.href
    navigator.clipboard.writeText(url)
      .then(() => show('Share URL copied', 'success'))
      .catch(() => show('Could not copy URL', 'error'))
  }

  return (
    <div className="app">
      <header className="topbar" role="banner">
        <h1 aria-label="App name">multichatter</h1>
        <div className="actions" role="toolbar" aria-label="Actions">
          <button className="btn" onClick={addScreen} title="Add chat" aria-label="Add chat">
            <Plus />
            <span>Add chat</span>
          </button>
          <button className="btn" onClick={share} title="Copy shareable URL" aria-label="Share">
            <Share2 />
            <span>Share</span>
          </button>
        </div>
      </header>
      <main className={`grid grid-${layout.rows}x${layout.cols}`}>
        <ScreenGrid
          screens={screens}
          layout={layout}
          onRemove={removeScreen}
          onChangeChannel={updateChannel}
        />
      </main>
      {screens.length === 0 && (
        <div className="empty">
          <p>Add a chat to start following multiple conversations at once.</p>
          <p style={{ opacity: 0.8, fontSize: 13 }}>Tip: share the URL to keep your layout.</p>
        </div>
      )}

      {showAdd && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="add-title" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 id="add-title">Add Twitch chat</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addScreenFromValue(pendingChannel)
              }}
            >
              <label htmlFor="add-channel-input" className="sr-only">Channel</label>
              <input
                id="add-channel-input"
                type="text"
                inputMode="text"
                placeholder="Channel name (e.g. pokimane)"
                value={pendingChannel}
                onChange={(e) => setPendingChannel(e.target.value)}
                className="input"
                autoComplete="off"
                aria-label="Channel name"
              />
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
