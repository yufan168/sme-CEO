// Knowledge Hub 的修正與上傳。
// 沒有後端與資料庫，修正只存在這台瀏覽器的 localStorage，
// 要進入正式版必須用匯出功能把 JSON 帶回專案。

import { knowledgeHub, normalizeEntry } from './knowledgeHub.js'

const OVERRIDE_KEY = 'xm-hub-overrides'
const ADDED_KEY = 'xm-hub-added'

// 只允許人工修改這些欄位，其餘由規則推導或維持原值。
const EDITABLE = [
  'title',
  'question',
  'answer',
  'policyContent',
  'category',
  'status',
  'riskLevel',
  'canQuoteExternally',
  'owner',
  'effectiveDate',
  'nextReviewDate',
  'source',
  'version',
]

const listeners = new Set()

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 儲存失敗不影響畫面，只是這次修正不會保留。
  }
}

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribeHub(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getOverrides() {
  return read(OVERRIDE_KEY) ?? {}
}

export function getAdded() {
  return read(ADDED_KEY) ?? []
}

// 合併：原始資料 → 套用修正 → 加上新增條目 → 一律重跑規則。
export function getEntries() {
  const overrides = getOverrides()
  const base = knowledgeHub.map((entry) => {
    const patch = overrides[entry.id]
    if (!patch) return entry
    return normalizeEntry({ ...entry, ...patch, edited: true })
  })
  const added = getAdded().map((entry) => normalizeEntry({ ...entry, imported: true }))
  return [...base, ...added]
}

export function hasLocalChanges() {
  return Object.keys(getOverrides()).length > 0 || getAdded().length > 0
}

export function localChangeCount() {
  return { edited: Object.keys(getOverrides()).length, imported: getAdded().length }
}

// 核准前的把關。人可以按核准，但這幾條不成立就不讓過。
export function approvalBlockers(entry) {
  const blockers = []
  const text = [entry.title, entry.question, entry.answer, entry.policyContent]
    .filter(Boolean)
    .join('\n')
  if (text.includes('【請填入')) blockers.push('內容仍有待填欄位')
  if (String(entry.owner ?? '').includes('【請填入')) blockers.push('尚未指定知識負責人')
  if (String(entry.effectiveDate ?? '').includes('【請填入')) blockers.push('尚未填生效日')
  return blockers
}

export function updateEntry(id, patch) {
  const clean = {}
  EDITABLE.forEach((key) => {
    if (key in patch) clean[key] = patch[key]
  })
  const overrides = getOverrides()
  overrides[id] = { ...(overrides[id] ?? {}), ...clean }
  write(OVERRIDE_KEY, overrides)
  notify()
}

export function resetEntry(id) {
  const overrides = getOverrides()
  delete overrides[id]
  write(OVERRIDE_KEY, overrides)
  const added = getAdded().filter((entry) => entry.id !== id)
  write(ADDED_KEY, added)
  notify()
}

export function resetAll() {
  write(OVERRIDE_KEY, {})
  write(ADDED_KEY, [])
  notify()
}

const REQUIRED = ['id', 'type', 'title']
const TYPES = ['faq', 'policy']
const STATUSES = ['draft', 'pending', 'approved', 'disabled']
const RISKS = ['low', 'medium', 'high']

// 上傳檢查。不合格的整批擋下並回報原因，不做部分匯入。
export function validateImport(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, errors: ['檔案不是有效的 JSON。目前只接受 JSON，請先下載範本。'] }
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, errors: ['最外層必須是陣列，例如 [ { ... }, { ... } ]。'] }
  }
  if (!parsed.length) {
    return { ok: false, errors: ['檔案裡沒有任何知識條目。'] }
  }

  const errors = []
  const existing = new Set(getEntries().map((entry) => entry.id))
  const seen = new Set()

  const cleaned = parsed.map((row, index) => {
    const where = `第 ${index + 1} 筆`
    REQUIRED.forEach((key) => {
      if (!row[key]) errors.push(`${where} 缺少 ${key}`)
    })
    if (row.type && !TYPES.includes(row.type)) {
      errors.push(`${where} 的 type 必須是 faq 或 policy`)
    }
    if (row.type === 'faq' && !row.answer) errors.push(`${where} 是 faq 但沒有 answer`)
    if (row.type === 'policy' && !row.policyContent) {
      errors.push(`${where} 是 policy 但沒有 policyContent`)
    }
    if (row.status && !STATUSES.includes(row.status)) {
      errors.push(`${where} 的 status 不在允許值內`)
    }
    if (row.riskLevel && !RISKS.includes(row.riskLevel)) {
      errors.push(`${where} 的 riskLevel 不在允許值內`)
    }
    if (row.id) {
      if (existing.has(row.id)) errors.push(`${where} 的編號 ${row.id} 已存在`)
      if (seen.has(row.id)) errors.push(`${where} 的編號 ${row.id} 在檔案中重複`)
      seen.add(row.id)
    }

    return {
      escalationConditions: [],
      tags: [],
      category: '常見問題',
      version: 'v1.0',
      source: '外部匯入',
      owner: '【請填入：知識負責人】',
      effectiveDate: '【請填入】',
      nextReviewDate: '【請填入】',
      ...row,
      // 上傳一律進草稿，風險預設最高，不可對外引用，需人工審核。
      // 上傳的檔案不能自己宣稱已核准。
      status: 'draft',
      riskLevel: RISKS.includes(row.riskLevel) ? row.riskLevel : 'high',
      canQuoteExternally: false,
      requiresHumanReview: true,
      lastUpdated: row.lastUpdated ?? new Date().toISOString().slice(0, 10),
    }
  })

  if (errors.length) return { ok: false, errors }
  return { ok: true, entries: cleaned, count: cleaned.length }
}

export function commitImport(entries) {
  write(ADDED_KEY, [...getAdded(), ...entries])
  notify()
}

// 匯出時去掉由規則推導的欄位，只留可以放回專案的原始資料。
const DERIVED = [
  'hasPlaceholder',
  'hasMetaPlaceholder',
  'escalationMatched',
  'agentUsable',
  'edited',
  'imported',
]

export function exportJson() {
  return JSON.stringify(
    getEntries().map((entry) => {
      const rest = { ...entry }
      DERIVED.forEach((key) => delete rest[key])
      return rest
    }),
    null,
    2
  )
}

export const importTemplate = JSON.stringify(
  [
    {
      id: 'FAQ-025',
      type: 'faq',
      category: '常見問題',
      title: '標題',
      question: '客戶會怎麼問？',
      answer: '標準答案。不知道的具體事實請寫【請填入：說明】，不要編造。',
      riskLevel: 'medium',
      escalationConditions: ['什麼情況要轉人工'],
      tags: ['標籤一', '標籤二'],
    },
    {
      id: 'POL-013',
      type: 'policy',
      category: '政策與原則',
      title: '政策名稱',
      policyContent: '政策內容。',
      riskLevel: 'high',
      escalationConditions: ['什麼情況要轉人工'],
      tags: ['標籤'],
    },
  ],
  null,
  2
)
