// 金鑰只存在目前瀏覽器工作階段（sessionStorage）：
// 重新整理仍在，關閉分頁即清除，不寫進原始碼或 Git。
// 呼叫模型時金鑰會送給所選的 AI 供應商，只是不經過本系統的伺服器（本版無後端）。

const KEY_STORAGE = 'xm.ai.key'
const MODEL_STORAGE = 'xm.ai.model'
const PROVIDER_STORAGE = 'xm.ai.provider'

export const providers = [
  {
    id: 'anthropic',
    name: 'Anthropic（Claude）',
    defaultModel: 'claude-sonnet-4-5',
    keyHint: '以 sk-ant- 開頭',
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI 相容 API',
    defaultModel: 'gpt-4o-mini',
    keyHint: '多數相容服務以 sk- 開頭',
  },
]

function safeGet(name) {
  try {
    return sessionStorage.getItem(name) ?? ''
  } catch {
    return ''
  }
}

function safeSet(name, value) {
  try {
    sessionStorage.setItem(name, value)
    return true
  } catch {
    return false
  }
}

function safeRemove(name) {
  try {
    sessionStorage.removeItem(name)
  } catch {
    // sessionStorage 不可用時無需處理
  }
}

export function hasApiKey() {
  return safeGet(KEY_STORAGE).length > 0
}

// 僅供 callAI 使用，不得寫入畫面、網址、執行紀錄、錯誤訊息或 Prompt。
export function readApiKey() {
  return safeGet(KEY_STORAGE)
}

export function getModel() {
  return safeGet(MODEL_STORAGE)
}

export function getProvider() {
  return safeGet(PROVIDER_STORAGE) || providers[0].id
}

export function saveSettings({ apiKey, model, provider }) {
  const trimmedKey = apiKey.trim()
  const trimmedModel = model.trim()

  if (!trimmedKey) {
    return { ok: false, message: '請先貼入 API 金鑰。' }
  }
  if (!trimmedModel) {
    return { ok: false, message: '請填寫模型名稱。' }
  }
  if (!providers.some((item) => item.id === provider)) {
    return { ok: false, message: '請選擇供應商。' }
  }
  if (!safeSet(KEY_STORAGE, trimmedKey)) {
    return { ok: false, message: '瀏覽器不允許儲存，請確認未停用 sessionStorage。' }
  }
  safeSet(MODEL_STORAGE, trimmedModel)
  safeSet(PROVIDER_STORAGE, provider)
  return { ok: true, message: '已啟用。金鑰只存在這個瀏覽器分頁的工作階段。' }
}

export function clearSettings() {
  safeRemove(KEY_STORAGE)
  return { ok: true, message: '金鑰已清除，回到示範模式。' }
}

// 只顯示長度與末四碼，永遠不顯示完整金鑰。
export function maskedKeyInfo() {
  const key = safeGet(KEY_STORAGE)
  if (!key) return ''
  const tail = key.length > 4 ? key.slice(-4) : ''
  return `已儲存（共 ${key.length} 字元，末四碼 ${tail}）`
}
