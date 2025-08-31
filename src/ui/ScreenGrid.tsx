import { Screen } from './App'
import { X, Edit } from './icons'
import { TwitchEmbed } from './TwitchEmbed'
import { TwitchChat } from './TwitchChat'

export function ScreenGrid({
  screens,
  layout,
  onRemove,
  onChangeChannel,
}: {
  screens: Screen[]
  layout: { rows: number; cols: number }
  onRemove: (id: string) => void
  onChangeChannel: (id: string) => void
}) {
  return (
    <div className="screens" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
      {screens.map((s, i) => (
        <div key={s.id} className="screen">
          <div className="screen-controls">
            <button className="icon" onClick={() => onChangeChannel(s.id)} title="Change channel">
              <Edit />
            </button>
            <button className="icon" onClick={() => onRemove(s.id)} title="Remove">
              <X />
            </button>
          </div>
          <div className="screen-body">
            <div className="screen-video">
              <TwitchEmbed channel={s.channel} />
            </div>
            <div className="screen-chat">
              <TwitchChat channel={s.channel} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
