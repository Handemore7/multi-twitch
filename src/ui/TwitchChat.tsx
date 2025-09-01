// Twitch chat embed
// Docs: https://dev.twitch.tv/docs/embed/chat/

export function TwitchChat({ channel }: { channel: string }) {
  const parent = typeof location !== 'undefined' ? location.hostname : 'localhost'
  const url = `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?parent=${encodeURIComponent(parent)}&darkpopout`;
  return (
    <iframe
      src={url}
      title={`Twitch chat for ${channel}`}
      width="100%"
      height="100%"
      frameBorder={0}
      scrolling="no"
    />
  )
}
