export function parseQuery(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search)
  const result: Record<string, string | string[]> = {}
  for (const [k, v] of params.entries()) {
    if (k in result) {
      const existing = result[k]
      result[k] = Array.isArray(existing) ? [...existing, v] : [existing as string, v]
    } else {
      result[k] = v
    }
  }
  // support channels as comma-separated or repeated params
  if (typeof result.channels === 'string') {
    result.channels = (result.channels as string).split(',').filter(Boolean)
  }
  return result
}

export function toQuery(data: { [k: string]: string | string[] | undefined }) {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue
    if (Array.isArray(v)) {
      if (v.length === 0) continue
      params.set(k, v.join(','))
    } else {
      params.set(k, v)
    }
  }
  return params.toString()
}
