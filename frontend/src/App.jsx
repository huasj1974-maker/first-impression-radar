import { useState, useRef, useCallback } from 'react'
import Home from './pages/Home'
import Result from './pages/Result'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

function App() {
  const [result, setResult] = useState(null)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleAnalyze = useCallback(async (imageFile) => {
    setAnalyzing(true)
    setError(null)
    setErrorMsg(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '分析失败，请重试')
      }

      setResult(data)
      setUploadedImage(URL.createObjectURL(imageFile))
    } catch (err) {
      setError(true)
      setErrorMsg(err.message)
    } finally {
      setAnalyzing(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setResult(null)
    setUploadedImage(null)
    setError(null)
    setErrorMsg(null)
  }, [])

  return (
    <div className="min-h-screen">
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl p-10 text-center max-w-sm mx-4">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-radar-scan"></div>
              <div className="absolute inset-3 rounded-full border-2 border-purple-400/30 animate-pulse"></div>
              <div className="absolute inset-6 rounded-full bg-purple-500/20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">AI 正在分析</h3>
            <p className="text-gray-400 text-sm">正在扫描你的第一印象特征...</p>
            <p className="text-gray-500 text-xs mt-4" id="analyzing-step">识别面部特征中</p>
          </div>
        </div>
      )}
      {error ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-strong rounded-3xl p-10 text-center max-w-md">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-xl font-bold mb-2">出错了</h2>
            <p className="text-gray-400 mb-6">{errorMsg || '分析失败，请重试'}</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-medium transition-all"
            >
              重新尝试
            </button>
          </div>
        </div>
      ) : result ? (
        <Result
          result={result}
          uploadedImage={uploadedImage}
          onReset={handleReset}
        />
      ) : (
        <Home onAnalyze={handleAnalyze} />
      )}
    </div>
  )
}

export default App
