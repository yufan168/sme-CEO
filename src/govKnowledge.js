// Governance Center 模組五：Knowledge Policies｜知識治理
// 含兩個橫向治理機制：Knowledge Lifecycle 與 AI Confidence Gate。

export const knowledgeRule = {
  ruleId: 'GOV-KNOWLEDGE',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

// ── Knowledge Lifecycle ───────────────────────────────────────────

export const lifecycleStates = [
  { id: 'Draft', label: '草稿', aiUsable: false, note: '尚未送審' },
  { id: 'PendingReview', label: '待審核', aiUsable: false, note: '已送審，等待核准' },
  { id: 'ChangesRequested', label: '退回修改', aiUsable: false, note: '審核退回，需修改後重送' },
  {
    id: 'Published',
    label: '已發布',
    aiUsable: true,
    note: '仍須符合 confidence、期限及 appliesTo',
  },
  { id: 'NeedsReview', label: '待複審', aiUsable: false, note: '到達複審日，不可直接引用' },
  { id: 'Expired', label: '已過期', aiUsable: false, note: '超過有效期限' },
  { id: 'Rejected', label: '已拒絕', aiUsable: false, note: '審核拒絕' },
  { id: 'Archived', label: '已封存', aiUsable: false, note: '停用' },
]

export const lifecycleTransitions = [
  { from: 'Draft', to: 'PendingReview', trigger: '送審' },
  { from: 'PendingReview', to: 'Published', trigger: '核准' },
  { from: 'PendingReview', to: 'ChangesRequested', trigger: '退回' },
  { from: 'PendingReview', to: 'Rejected', trigger: '拒絕' },
  { from: 'ChangesRequested', to: 'PendingReview', trigger: '修改後重送' },
  { from: 'Rejected', to: 'Archived', trigger: '封存' },
  { from: 'Published', to: 'NeedsReview', trigger: '到達複審日' },
  { from: 'Published', to: 'Expired', trigger: '超過有效期限' },
  { from: 'Published', to: 'Published', trigger: '新版本核准' },
  { from: 'Published', to: 'Archived', trigger: '停用' },
]

// 複審週期依知識類型不同，不是一律 365 天。
export const reviewIntervals = [
  { kind: 'Company', label: '一般公司知識', days: 365 },
  { kind: 'Service', label: '服務說明', days: 180 },
  { kind: 'Contact', label: '聯絡方式與服務時間', days: 180 },
  { kind: 'Pricing', label: '報價與付款政策', days: 90 },
  { kind: 'GovernmentProgram', label: '政府計畫知識', days: 90, note: '依公告或 90 天，以較短者為準' },
  { kind: 'Regulation', label: '法規與 ESG 資料', days: 90, note: '90～180 天，取嚴者' },
  { kind: 'TrainingMaterial', label: '教材與 AI 工具資訊', days: 180 },
  { kind: 'Contract', label: '合約與保密政策', days: 180 },
]

const CATEGORY_INTERVAL = {
  Company: 365,
  Service: 180,
  FAQ: 180,
  SOP: 180,
  Policy: 180,
  Template: 180,
  Glossary: 365,
  Escalation: 180,
}

const PRICING_WORDS = ['報價', '價格', '付款', '折扣', '費用']
const GOV_WORDS = ['政府計畫', '補助', '核銷', '申報']
const CONTACT_WORDS = ['聯絡方式', '服務時間', '回覆時限']

// 依卡片內容決定它適用哪一種複審週期。取最短者，從嚴。
export function reviewIntervalFor(card) {
  const text = [card.title, card.summary, card.content, ...(card.tags ?? [])].join(' ')
  const candidates = [CATEGORY_INTERVAL[card.category] ?? 365]
  if (PRICING_WORDS.some((word) => text.includes(word))) candidates.push(90)
  if (GOV_WORDS.some((word) => text.includes(word))) candidates.push(90)
  if (CONTACT_WORDS.some((word) => text.includes(word))) candidates.push(180)
  return Math.min(...candidates)
}

function dayDiff(fromText, toText) {
  const from = Date.parse(fromText)
  const to = Date.parse(toText)
  if (Number.isNaN(from) || Number.isNaN(to)) return null
  return Math.floor((to - from) / 86400000)
}

export const effectiveStatusNote =
  '超過複審期限時只計算 effectiveStatus，第一版不直接覆寫儲存的 status。畫面上看到的 Published 是資料原值，實際能不能引用看 effectiveStatus。'

// 只計算，不覆寫。回傳的 effectiveStatus 才是實際生效的狀態。
export function evaluateKnowledgeReviewStatus(card, today) {
  const now = today ?? new Date().toISOString().slice(0, 10)
  const storedStatus = card.status
  const interval = reviewIntervalFor(card)

  if (storedStatus !== 'Published') {
    return {
      storedStatus,
      effectiveStatus: storedStatus,
      interval,
      reason: `卡片狀態為 ${storedStatus}。`,
      computed: false,
    }
  }

  if (card.validUntil && card.validUntil < now) {
    return {
      storedStatus,
      effectiveStatus: 'Expired',
      interval,
      reason: `有效期限 ${card.validUntil} 已過。`,
      computed: true,
    }
  }

  const age = dayDiff(card.lastUpdated, now)
  if (age !== null && age >= interval) {
    return {
      storedStatus,
      effectiveStatus: 'NeedsReview',
      interval,
      reason: `最後更新於 ${card.lastUpdated}，已達 ${interval} 天複審週期。`,
      computed: true,
      overdueDays: age - interval,
    }
  }

  return {
    storedStatus,
    effectiveStatus: 'Published',
    interval,
    reason:
      age === null
        ? '無法判讀最後更新日。'
        : `距離複審日剩 ${interval - age} 天（週期 ${interval} 天）。`,
    computed: false,
    daysToReview: age === null ? null : interval - age,
  }
}

// ── AI Confidence Gate ────────────────────────────────────────────

export const confidenceRule = {
  ruleId: 'GOV-CONFIDENCE',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const confidenceSourceNote =
  'Confidence 不由 AI 自評。「我對這個答案的信心是 High」沒有治理價值。這裡的 Confidence 由知識治理狀態推導。'

export const confidenceDefinitions = [
  {
    level: 'High',
    conditions: ['已核准', '來源明確', '未過期', '無資料矛盾', '不含【請填入】'],
    behaviour: ['可依 Approval Level 使用', '不代表可跳過人工審核'],
  },
  {
    level: 'Medium',
    conditions: ['已核准但接近複審日', '或僅適用特定情境', '或存在需再次確認的條件'],
    behaviour: ['內部可參考', '對外不得自動送出', '必須人工確認'],
  },
  {
    level: 'Low',
    conditions: ['來源不完整', '含待確認內容', '資料矛盾', '已過期', '尚未核准'],
    behaviour: ['不得直接引用', '使用知識不足回覆', '建立人工確認事項'],
  },
]

export const confidenceLimitNote =
  'High Confidence 不代表可以跳過 Approval Level。Confidence 決定能不能引用，Approval Level 決定能不能對外。'

const WARNING_RATIO = 0.1

// AI 能不能用這張知識。唯一入口，回傳 allowed、mode、reason 與 effectiveStatus。
export function canAIUseKnowledge(card, agentId, today) {
  const review = evaluateKnowledgeReviewStatus(card, today)
  const state = review.effectiveStatus

  const usableState = lifecycleStates.find((item) => item.id === state)
  if (!usableState || usableState.aiUsable !== true) {
    return {
      allowed: false,
      mode: 'escalate',
      reason: `狀態為 ${state}，不得引用。${review.reason}`,
      effectiveStatus: state,
      confidence: 'Low',
    }
  }

  if (card.allowAIUse !== true) {
    return {
      allowed: false,
      mode: 'escalate',
      reason: '未開放 AI 引用（allowAIUse 為 false）。',
      effectiveStatus: state,
      confidence: 'Low',
    }
  }

  if (agentId) {
    const applies =
      (card.appliesTo ?? []).includes('全部 Agent') || (card.appliesTo ?? []).includes(agentId)
    if (!applies) {
      return {
        allowed: false,
        mode: 'escalate',
        reason: `不適用於 ${agentId}（appliesTo 不符）。`,
        effectiveStatus: state,
        confidence: 'Low',
      }
    }
  }

  const confidence = computeConfidence(card, today)
  if (confidence.level === 'Low') {
    return {
      allowed: false,
      mode: 'escalate',
      reason: `知識可信度為 Low。${confidence.reasons.join('　')}`,
      effectiveStatus: state,
      confidence: 'Low',
    }
  }
  if (confidence.level === 'Medium') {
    return {
      allowed: true,
      mode: 'internal-only',
      reason: `知識可信度為 Medium，內部可參考，對外必須人工確認。${confidence.reasons.join('　')}`,
      effectiveStatus: state,
      confidence: 'Medium',
    }
  }

  return {
    allowed: true,
    mode: 'normal',
    reason: '已核准、來源明確、未過期、不含待確認欄位。',
    effectiveStatus: state,
    confidence: 'High',
  }
}

// Confidence 由治理狀態推導，不看 AI 自己的說法。
export function computeConfidence(card, today) {
  const review = evaluateKnowledgeReviewStatus(card, today)
  const state = review.effectiveStatus

  if (state !== 'Published') {
    return { level: 'Low', reasons: [review.reason] }
  }
  if (card.hasPlaceholderContent || card.allowAIUse !== true) {
    return { level: 'Low', reasons: ['內容含待確認欄位或未開放 AI 引用。'] }
  }
  if (card.confidence === 'Low') {
    return { level: 'Low', reasons: ['卡片標示來源不完整。'] }
  }

  const reasons = []
  if (card.confidence === 'Medium') reasons.push('卡片標示部分資料需再次確認。')
  if (
    review.daysToReview !== null &&
    review.daysToReview !== undefined &&
    review.daysToReview <= Math.ceil(review.interval * WARNING_RATIO)
  ) {
    reasons.push(`距離複審日僅剩 ${review.daysToReview} 天。`)
  }
  if (card.appliesTo && !card.appliesTo.includes('全部 Agent') && card.appliesTo.length <= 2) {
    reasons.push('僅適用特定 Agent 的情境。')
  }

  if (reasons.length) return { level: 'Medium', reasons }
  return { level: 'High', reasons: ['已核准、來源明確、未過期、無待確認欄位。'] }
}

export const knowledgePolicies = [
  'Published 不等於公開。可見範圍看 visibility，不是看狀態。',
  '可被 AI 引用與可原文對外是兩件事，分別由 allowAIUse 與 canQuoteExternally 控制。',
  'System Owner 不等於 Knowledge Owner，兩者責任不同。',
  '修改正式知識必須建立新版本，不得直接覆寫。',
  'NeedsReview 與 Expired 只計算 effectiveStatus，不覆寫儲存狀態。',
  'NeedsReview 不可直接引用，必須先完成複審。',
]
