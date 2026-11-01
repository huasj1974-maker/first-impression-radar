import RadarChart from '../components/RadarChart'
import ShareButtons from '../components/ShareButtons'

export default function Result({ result, uploadedImage, onReset }) {
  const { summary, radarData, tags, suggestions } = result

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔮</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            初见雷达
          </h1>
          <p className="text-gray-500 text-sm mt-1">你的第一印象分析报告</p>
        </div>

        {/* Main Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-10">
          {/* Photo + Summary */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {uploadedImage && (
              <div className="flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-lg shadow-purple-500/15">
                  <img src={uploadedImage} alt="上传的照片" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs mb-3">
                ✨ 分析完成
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{summary.title}</h2>
              <p className="text-gray-400 leading-relaxed">{summary.description}</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="flex justify-center mb-8">
            <RadarChart data={radarData} size={280} />
          </div>

          {/* Dimension Scores */}
          <div className="space-y-3 mb-8">
            {radarData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-20 flex-shrink-0 text-right">{item.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-purple-300 w-8 flex-shrink-0">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {(tags || []).map((tag, i) => (
              <span key={i} className="px-4 py-1.5 bg-purple-500/15 text-purple-300 rounded-full text-sm border border-purple-500/20">
                {tag}
              </span>
            ))}
          </div>

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <span>💡</span> 专属建议
              </h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-purple-400 mt-0.5">·</span>
                    <p className="text-sm text-gray-400 leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share & Retry */}
          <ShareButtons result={result} uploadedImage={uploadedImage} />

          {/* Retest */}
          <div className="text-center mt-8">
            <button
              onClick={onReset}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ↺ 再测一次
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
