import { getModel, getProvider, readApiKey } from './aiSettings.js'

// 所有供應商差異集中在這個檔案。執行器只呼叫 callAI()，
// 不需要知道 API 網址、標頭格式或回傳結構。
// 金鑰只在此處讀取與送出，不回傳、不記錄、不寫入錯誤訊息。

const endpoints = {
  anthropic: {
    url: 'https://api.anthropic.com/v1/messages',
    build(model, systemPrompt, userPrompt, apiKey) {
      return {
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      }
    },
    extract(data) {
      const parts = Array.isArray(data?.content) ? data.content : []
      return parts
        .filter((part) => part?.type === 'text')
        .map((part) => part.text)
        .join('\n')
        .trim()
    },
  },
  'openai-compatible': {
    url: 'https://api.openai.com/v1/chat/completions',
    build(model, systemPrompt, userPrompt, apiKey) {
      return {
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      }
    },
    extract(data) {
      return (data?.choices?.[0]?.message?.content ?? '').trim()
    },
  },
}

function describeStatus(status) {
  if (status === 401 || status === 403) return '金鑰無效或沒有存取權限'
  if (status === 404) return '模型名稱錯誤或端點不存在'
  if (status === 429) return '請求次數或額度已達上限'
  if (status >= 500) return '供應商伺服器錯誤'
  return `供應商回應狀態 ${status}`
}

export async function callAI({ systemPrompt, userPrompt }) {
  const provider = getProvider()
  const model = getModel()
  const apiKey = readApiKey()
  const adapter = endpoints[provider]

  if (!adapter) {
    return { ok: false, error: '未知的供應商設定' }
  }
  if (!apiKey) {
    return { ok: false, error: '尚未設定 API 金鑰' }
  }

  const request = adapter.build(model, systemPrompt, userPrompt, apiKey)

  let response
  try {
    response = await fetch(adapter.url, {
      method: 'POST',
      headers: request.headers,
      body: request.body,
    })
  } catch {
    // 不回傳原始例外訊息，避免夾帶請求內容。
    return {
      ok: false,
      error: 'API 無法連線。可能是網路問題，或供應商不允許瀏覽器直接呼叫（CORS）',
    }
  }

  if (!response.ok) {
    return { ok: false, error: describeStatus(response.status) }
  }

  let data
  try {
    data = await response.json()
  } catch {
    return { ok: false, error: '供應商回應格式無法解析' }
  }

  const text = adapter.extract(data)
  if (!text) {
    return { ok: false, error: '供應商回應中沒有可用內容' }
  }
  return { ok: true, text }
}
