import { Screen } from './App'
import { X, Edit } from './icons.tsx'
// chats-only: no TwitchPlayer; keep only TwitchChat
import { TwitchChat } from './TwitchChat.tsx'

export function ScreenGrid({
  screens,
  layout,
  onRemove,
  onChangeChannel,
  // chats-only: drop status and refs
}: {
  screens: Screen[]
  layout: { rows: number; cols: number }
  onRemove: (id: string) => void
  onChangeChannel: (id: string) => void
  // onStatusChange?: (id: string, status: any) => void
  // onRegisterRefs?: (refs: Array<React.RefObject<PlayerHandle>>) => void
}) {
  // chats-only: no refs to manage
  return (
    <div className="screens" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
      {screens.map((s, i) => (
        <div key={s.id} className="screen">
          <div className="screen-controls">
            <button className="icon" onClick={() => onChangeChannel(s.id)} title="Change channel" aria-label={`Change channel for ${s.channel}`}>
              <Edit />
            </button>
            <button className="icon" onClick={() => onRemove(s.id)} title="Remove" aria-label={`Remove ${s.channel}`}>
              <X />
            </button>
          </div>
          <div className="screen-chat-only">
            <TwitchChat channel={s.channel} />
          </div>
        </div>
      ))}
    </div>
  )
}
