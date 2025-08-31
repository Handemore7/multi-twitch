// Allow importing SVGs if needed later
declare module '*.svg' {
  const content: string
  export default content
}
