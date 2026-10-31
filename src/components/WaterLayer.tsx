import { useLayoutEffect, useRef, useState } from 'react'

export function WaterLayer({ chartId, l, r, waterH, maxH, chartHeight }: {
  chartId: string; l: number; r: number; waterH: number; maxH: number; chartHeight: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const chart = document.getElementById(chartId)
    if (!chart) return
    const lb = chart.querySelector(`[data-bar-index="${l}"]`) as HTMLElement | null
    const rb = chart.querySelector(`[data-bar-index="${r}"]`) as HTMLElement | null
    if (!lb || !rb) return
    const cr = chart.getBoundingClientRect()
    const lr = lb.getBoundingClientRect()
    const rr = rb.getBoundingClientRect()
    setPos({
      left: lr.left - cr.left,
      width: rr.right - cr.left - (lr.left - cr.left),
    })
  }, [chartId, l, r])

  const h = (waterH / maxH) * chartHeight

  return <div ref={ref} className="bar-water-area" style={pos ? {
    left: pos.left,
    width: pos.width,
    height: h,
  } : { display: 'none' }} />
}
