import { useEffect, useState } from 'react'

const STEPS = [
  '识别面部特征中',
  '分析气质类型中',
  '评估社交印象中',
  '生成雷达数据中',
  '优化建议生成中',
]

export default function AnalyzingOverlay() {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % STEPS.length)
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glass-strong rounded-3xl p-10 text-center max-w-sm mx-4">
        {/* Radar Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-purple-500/10"></div>
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/15"></div>
          <div className="absolute inset-4 rounded-full border-2 border-purple-500/20"></div>
          <div className="absolute inset-6 rounded-full border-2 border-purple-500/25"></div>
          <div className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent animate-radar-scan"></div>
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🔮</div>
        </div>

        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI 正在分析
        </h3>
        <p className="text-gray-300 text-sm mb-6 h-6">
          {STEPS[step]}{dots}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-gray-500 text-xs mt-3">
          预计需要 5-8 秒
        </p>
      </div>
    </div>
  )
}
