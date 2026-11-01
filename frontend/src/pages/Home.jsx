import { useState, useRef } from 'react'

export default function Home({ onAnalyze }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onAnalyze(file)
    }
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }

  if (preview) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl shadow-purple-500/20">
            <img src={preview} alt="预览" className="w-full h-full object-cover" />
          </div>
          <p className="text-gray-400 text-sm animate-pulse">正在启动 AI 分析...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-6xl mb-6 animate-float">🔮</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            初见雷达
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-3 font-light">
          你给陌生人的第一印象
        </p>
        <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          上传一张照片，AI 从多个维度深度分析你的面部特征，<br className="hidden md:block" />
          为你生成专属的美学印象报告
        </p>
      </div>

      {/* Upload Area */}
      <div className="mt-12 w-full max-w-md">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer transition-all duration-300
            ${dragActive
              ? 'border-purple-400 bg-purple-500/10 scale-105'
              : 'border-white/20 hover:border-purple-400/50 hover:bg-white/5'
            }
            border-2 border-dashed rounded-3xl p-12 text-center group
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📸</div>
          <p className="text-white font-medium mb-2">点击或拖拽上传照片</p>
          <p className="text-gray-500 text-sm">支持 JPG / PNG / WebP</p>

          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-xl"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-500/30 rounded-tr-xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-500/30 rounded-bl-xl"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-purple-500/30 rounded-br-xl"></div>
        </div>
      </div>

      {/* Feature hints */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full px-4">
        {[
          { icon: '🎯', title: '多维分析', desc: '颜值 / 气质 / 亲和力 / 风格等 6 大维度' },
          { icon: '✨', title: '正向表达', desc: 'AI 用鼓励式语言给出专属美学建议' },
          { icon: '📊', title: '可视化雷达', desc: '六边形雷达图，一眼看懂你的魅力坐标' },
        ].map((f, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center hover:bg-white/[0.08] transition-all">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-white mb-1">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-600 text-xs">
        <p>所有分析仅用于娱乐参考 · 照片不会保存</p>
        <p className="mt-1">Powered by StepFun AI</p>
      </footer>
    </div>
  )
}
