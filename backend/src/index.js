// StepFun Step-1v-flash — face impression prompt
const ANALYSIS_PROMPT = `你是一位专业的社交印象分析师。请根据用户上传的照片，从以下6个维度进行深度分析，给出1-100的评分和详细文字描述：

1. **颜值印象** — 五官协调度、面部对称性带来的整体美感
2. **气质类型** — 知性/甜美/酷感/温柔/干练 等气质关键词
3. **亲和力** — 让人想靠近的程度，有没有距离感
4. **记忆点** — 什么特征最容易被记住，独特在哪里
5. **穿搭风格** — 现在的穿搭给人什么印象，适合什么风格
6. **妆容建议** — 最适合的妆容方向和具体建议

输出格式要求（严格JSON，不要markdown代码块包裹）：
{
  "summary": {
    "title": "一句话概括第一印象（8-15字，要有温度感）",
    "description": "2-3句详细描述，语言风格温暖、鼓励、专业，像朋友聊天"
  },
  "radarData": [
    {"label": "颜值印象", "value": 分数},
    {"label": "气质类型", "value": 分数},
    {"label": "亲和力", "value": 分数},
    {"label": "记忆点", "value": 分数},
    {"label": "穿搭风格", "value": 分数},
    {"label": "妆容建议", "value": 分数}
  ],
  "tags": ["3-5个印象标签，如"甜妹感""氛围感美女""高级感""少年感"等"],
  "suggestions": [
    "具体可操作的美学建议1（10-30字）",
    "具体可操作的美学建议2（10-30字）",
    "具体可操作的美学建议3（10-30字）"
  ]
}

重要：
- 评分要客观但偏正向（毕竟是娱乐类产品）
- 描述要具体、有画面感，不要泛泛而谈
- tags 要符合中文互联网审美语境
- 所有文字用中文输出`

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Health check
    if (request.url.includes('/api/health')) {
      return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Main analyze endpoint
    if (request.method === 'POST' && request.url.includes('/api/analyze')) {
      try {
        const formData = await request.formData()
        const imageFile = formData.get('image')

        if (!imageFile) {
          return new Response(JSON.stringify({ error: '请上传照片' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        // Convert image to base64
        const bytes = await imageFile.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const mime = imageFile.type || 'image/jpeg'
        const dataUrl = `data:${mime};base64,${base64}`

        // Call StepFun Step-1v-flash API
        const apiKey = env.STEPFUN_API_KEY
        if (!apiKey) {
          return new Response(JSON.stringify({ error: '服务器未配置 API Key' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        const response = await fetch('https://api.stepfun.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'step-1v-flash',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: { url: dataUrl },
                  },
                  {
                    type: 'text',
                    text: ANALYSIS_PROMPT,
                  },
                ],
              },
            ],
            temperature: 0.8,
            max_tokens: 2000,
          }),
        })

        if (!response.ok) {
          const errText = await response.text().catch(() => '')
          console.error('StepFun API error:', response.status, errText)
          return new Response(JSON.stringify({ error: `AI 分析服务暂时不可用 (${response.status})` }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        const apiData = await response.json()
        const rawContent = apiData.choices?.[0]?.message?.content

        if (!rawContent) {
          return new Response(JSON.stringify({ error: 'AI 未返回有效结果' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        // Parse JSON from response (handle markdown code block wrappers)
        let parsed
        try {
          // Remove markdown code fences if present
          let cleaned = rawContent.trim()
          if (cleaned.startsWith('```')) {
            const firstLineEnd = cleaned.indexOf('\n')
            cleaned = cleaned.slice(firstLineEnd).trim()
          }
          if (cleaned.endsWith('```')) {
            cleaned = cleaned.slice(0, cleaned.lastIndexOf('```')).trim()
          }
          parsed = JSON.parse(cleaned)
        } catch {
          console.error('JSON parse error, raw content:', rawContent.slice(0, 500))
          return new Response(JSON.stringify({ error: 'AI 结果解析失败，请重试' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        // Ensure radarData has 6 dimensions
        if (!parsed.radarData || parsed.radarData.length < 6) {
          return new Response(JSON.stringify({ error: 'AI 分析结果不完整' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        return new Response(JSON.stringify(parsed), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      } catch (err) {
        console.error('Server error:', err)
        return new Response(JSON.stringify({ error: '服务器内部错误' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }
    }

    return new Response('初见雷达 API — POST /api/analyze 上传照片进行分析', {
      headers: { 'Content-Type': 'text/plain;charset=utf-8', ...corsHeaders },
    })
  }
}
