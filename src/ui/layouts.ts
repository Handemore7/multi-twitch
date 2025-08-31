type Layout = { rows: number; cols: number }

const presets: Record<number, Layout> = {
  0: { rows: 1, cols: 1 },
  1: { rows: 1, cols: 1 },
  2: { rows: 1, cols: 2 },
  3: { rows: 2, cols: 2 },
  4: { rows: 2, cols: 2 },
  5: { rows: 2, cols: 3 },
  6: { rows: 2, cols: 3 },
  7: { rows: 3, cols: 3 },
  8: { rows: 3, cols: 3 },
  9: { rows: 3, cols: 3 },
}

export function getLayoutForCount(count: number): Layout {
  const capped = Math.min(count, 9)
  if (capped in presets) return presets[capped as keyof typeof presets]
  // default safe
  return { rows: 3, cols: 3 }
}
