import React, { useRef, useEffect, useState } from 'react'

export default function RadarChart({ data, size = 260 }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!data || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const labels = data.map(d => d.label)
    const values = data.map(d => d.value)
    const n = labels.length
    const cx = size / 2
    const cy = size / 2
    const maxR = size / 2 - 50

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = size + 'px'
    canvas.style.height = size + 'px'
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, size, size)

    const angles = Array.from({ length: n }, (_, i) => (Math.PI * 2 * i) / n - Math.PI / 2)

    // Grid circles
    [20, 40, 60, 80, 100].forEach(level => {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= n; i++) {
        const a = angles[i % n]
        const r = (maxR * level) / 100
        const x = cx + r * Math.cos(a)
        const y = cy + r * Math.sin(a)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    })

    // Axis lines
    angles.forEach(a => {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 0.5
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + maxR * Math.cos(a), cy + maxR * Math.sin(a))
      ctx.stroke()
    })

    // Data polygon
    ctx.beginPath()
    values.forEach((v, i) => {
      const r = (maxR * v) / 100
      const x = cx + r * Math.cos(angles[i])
      const y = cy + r * Math.sin(angles[i])
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.closePath()

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
    gradient.addColorStop(0, 'rgba(147, 51, 234, 0.25)')
    gradient.addColorStop(1, 'rgba(236, 72, 153, 0.15)')
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Data points
    values.forEach((v, i) => {
      const r = (maxR * v) / 100
      const x = cx + r * Math.cos(angles[i])
      const y = cy + r * Math.sin(angles[i])
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#a78bfa'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Labels
    ctx.font = '12px "Noto Sans SC", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    labels.forEach((label, i) => {
      const lr = maxR + 22
      const x = cx + lr * Math.cos(angles[i])
      const y = cy + lr * Math.sin(angles[i])
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText(label, x, y)
    })

    setReady(true)
  }, [data, size])

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className={ready ? 'opacity-100' : 'opacity-0 transition-opacity duration-500'}
      />
    </div>
  )
}
