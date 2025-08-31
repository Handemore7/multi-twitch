import { useEffect, useMemo, useState } from 'react'
import { Plus, Share2 } from './icons'
import { ScreenGrid } from './ScreenGrid'
import { getLayoutForCount } from './layouts'
import { parseQuery, toQuery } from '../utils/share'

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

  // initialize from URL
  useEffect(() => {
    const qs = parseQuery(location.search)
    if (qs.channels && Array.isArray(qs.channels)) {
      const initial = (qs.channels as string[]).map((c) => ({ id: newId(), channel: c }))
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

  function addScreen() {
    if (screens.length >= 9) {
      alert('Maximum of 9 screens reached.')
      return
    }
    const channel = prompt('Enter Twitch channel name:')?.trim() || ''
    if (!channel) return
    setScreens((prev) => [...prev, { id: newId(), channel }])
  }

  function removeScreen(id: string) {
    setScreens((prev) => prev.filter((s) => s.id !== id))
  }

  function updateChannel(id: string) {
    const channel = prompt('Enter Twitch channel name:')?.trim() || ''
    if (!channel) return
    setScreens((prev) => prev.map((s) => (s.id === id ? { ...s, channel } : s)))
  }

  function share() {
    const url = location.href
    navigator.clipboard.writeText(url).catch(() => {})
    alert('Shareable URL copied to clipboard!')
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Multi twitch viewer</h1>
        <div className="actions">
          <button className="btn" onClick={addScreen} title="Add screen">
            <Plus />
            <span>Add</span>
          </button>
          <button className="btn" onClick={share} title="Copy shareable URL">
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
          <p>Add a screen to start watching multiple streamers at once.</p>
        </div>
      )}
    </div>
  )
}
