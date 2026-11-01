import React, { useRef } from 'react'

export default function ShareButtons({ result, uploadedImage }) {
  const cardRef = useRef(null)

  const generateCardHTML = () => {
    if (!result) return ''
    const { radarData, summary, tags } = result
    const radarHTML = radarData.map(d => `
      <div class="flex items-center justify-between py-2 border-b border-white/10">
        <span class="text-sm text-gray-300">${d.label}</span>
        <div class="flex items-center gap-3">
          <div class="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style="width:${d.value}%"></div>
          </div>
          <span class="text-sm font-bold text-purple-300 w-8 text-right">${d.value}</span>
        </div>
      </div>
    `).join('')
    const tagsHTML = (tags || []).map(t => `<span class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">${t}</span>`).join('')

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>初见雷达 - ${summary.title}</title><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans SC",sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
      .card{background:rgba(255,255,255,0.06);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:40px;max-width:420px;width:100%}
      .header{text-align:center;margin-bottom:30px}
      .header h1{font-size:24px;font-weight:700;background:linear-gradient(to right,#c084fc,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      .header p{color:#9ca3af;font-size:13px;margin-top:6px}
      .avatar-section{display:flex;align-items:center;gap:16px;margin-bottom:28px}
      .avatar{width:72px;height:72px;border-radius:16px;object-fit:cover;border:2px solid rgba(167,139,250,0.4)}
      .summary h2{font-size:18px;font-weight:600;color:#f5f5f5}
      .summary p{color:#9ca3af;font-size:13px;margin-top:4px;line-height:1.6}
      .section-title{font-size:14px;font-weight:500;color:#d1d5db;margin-bottom:16px;display:flex;align-items:center;gap:8px}
      .section-title::after{content:"";flex:1;height:1px;background:rgba(255,255,255,0.1)}
      ${radarHTML}
      .tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
      .tag{padding:4px 14px;background:rgba(167,139,250,0.15);color:#c084fc;border-radius:999px;font-size:13px}
      .footer{text-align:center;margin-top:30px;color:#6b7280;font-size:12px}
      .footer a{color:#a78bfa;text-decoration:none}
    </style></head><body><div class="card">
      <div class="header"><h1>🔮 初见雷达</h1><p>你给陌生人的第一印象</p></div>
      <div class="avatar-section"><img class="avatar" src="${uploadedImage}" alt="上传的照片" /></div>
      <div class="summary"><h2>${summary.title}</h2><p>${summary.description}</p></div>
      <div style="margin-top:28px"><div class="section-title">维度分析</div>${radarHTML}</div>
      <div class="tags">${tagsHTML}</div>
      <div class="footer">在「初见雷达」生成 · <a href="https://chagall1221.github.io/first-impression-radar/">立即体验 →</a></div>
    </div></body></html>`
  }

  const handleShareCard = async () => {
    const html = generateCardHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    // Open in new window for screenshot
    const win = window.open(url, '_blank', 'width=480,height=800')
    if (win) {
      win.focus()
      alert('结果卡片已在新窗口打开！\n\n📱 长按图片保存后即可分享到小红书/朋友圈\n💡 建议使用浏览器「截图」或系统截图功能保存')
    }
    URL.revokeObjectURL(url)
  }

  const copyText = () => {
    const text = `我在「初见雷达」测了我的第一印象！\n${result.summary.title}\n${result.summary.description}\n你也来测测→ https://chagall1221.github.io/first-impression-radar/`
    navigator.clipboard.writeText(text)
    alert('已复制分享文案！')
  }

  const shareXiaohongshu = () => {
    const text = `我在「初见雷达」测了第一印象～\n${result.summary.title}✨\n${result.tags.slice(0, 3).join(' · ')}\n快也来测测你的！\nhttps://chagall1221.github.io/first-impression-radar/`
    navigator.clipboard.writeText(text)
    window.open('https://www.xiaohongshu.com', '_blank')
    alert('分享文案已复制，粘贴到小红书发布吧！')
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-10">
      <button
        onClick={handleShareCard}
        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl font-medium transition-all shadow-lg shadow-purple-500/25"
      >
        <span>📸</span> 生成分享卡片
      </button>
      <button
        onClick={shareXiaohongshu}
        className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 rounded-2xl font-medium transition-all shadow-lg shadow-red-500/25"
      >
        <span>📕</span> 分享到小红书
      </button>
      <button
        onClick={copyText}
        className="flex items-center gap-2 px-6 py-3.5 glass hover:bg-white/10 rounded-2xl font-medium transition-all"
      >
        <span>📋</span> 复制文案
      </button>
    </div>
  )
}
