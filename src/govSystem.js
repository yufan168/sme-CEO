// Governance Center 模組四、六、七、八：
// AI Policies｜AI 治理政策、Prompt Policies｜Prompt 治理、
// Audit Log｜操作紀錄、System Settings｜系統設定

// ── AI Policies ───────────────────────────────────────────────────

export const aiPolicyRule = {
  ruleId: 'GOV-AI',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const aiPolicies = [
  {
    id: 'AI-001',
    name: '不得猜測',
    text: 'AI 找不到可靠資料時，必須表示無法確認並轉交人工。',
  },
  {
    id: 'AI-002',
    name: '不得引用未核准知識',
    text: '不可引用 Draft、PendingReview、ChangesRequested、NeedsReview、Expired、Archived、Rejected。',
    items: ['Draft', 'PendingReview', 'ChangesRequested', 'NeedsReview', 'Expired', 'Archived', 'Rejected'],
  },
  {
    id: 'AI-003',
    name: '不得自行建立公司事實',
    text: '以下一律不得由 AI 自行產生。',
    items: [
      '公司地址',
      '聯絡方式',
      '價格',
      '付款條件',
      '服務時間',
      '專案交期',
      '顧問成果',
      '客戶資料',
      '法規內容',
      '政府計畫條件',
    ],
  },
  {
    id: 'AI-004',
    name: '不得自行承諾',
    text: '以下一律不得由 AI 承諾。',
    items: ['一定承接', '一定完成', '一定通過', '一定改善', '退款', '補償', '折扣', '交期', '合約條件'],
  },
  {
    id: 'AI-005',
    name: '不得自行對外送出高風險內容',
    text: 'Level 3 與 Level 4 必須人工核准並由人正式送出。',
  },
  {
    id: 'AI-006',
    name: '必須保留來源',
    text: 'AI 回覆必須記錄使用的 Knowledge Card ID 與版本。',
  },
  {
    id: 'AI-007',
    name: '低可信知識不得直接回答',
    text: 'High 可依審核規則使用；Medium 僅供內部參考，對外需人工確認；Low 不得引用，轉人工。',
  },
  {
    id: 'AI-008',
    name: '過期知識不得使用',
    text: '超過 validUntil 或複審期限的知識不得作為正式回答依據。',
  },
  {
    id: 'AI-009',
    name: '人的決定優先',
    text: 'AI 建議與授權人員決定不同時，以人員決定為準，並保留紀錄。',
  },
  {
    id: 'AI-010',
    name: 'AI 起草、人審核、人發送',
    text: '所有正式承諾、決策與高風險內容遵守此原則。',
  },
]

// ── Prompt Policies ───────────────────────────────────────────────

export const promptRule = {
  ruleId: 'GOV-PROMPT',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const promptCardFields = [
  { key: 'promptId', label: 'Prompt ID' },
  { key: 'agentId', label: 'Agent ID' },
  { key: 'agentName', label: 'Agent 名稱' },
  { key: 'name', label: 'Prompt 名稱' },
  { key: 'version', label: '版本' },
  { key: 'systemPrompt', label: 'System Prompt' },
  { key: 'inputContract', label: 'Input Contract' },
  { key: 'outputContract', label: 'Output Contract' },
  { key: 'allowedTools', label: 'Allowed Tools' },
  { key: 'knowledgeScope', label: 'Knowledge Scope' },
  { key: 'approvalLevel', label: 'Approval Level' },
  { key: 'status', label: '狀態' },
  { key: 'changedBy', label: '修改人' },
  { key: 'changeReason', label: '修改原因' },
  { key: 'createdAt', label: '建立時間' },
  { key: 'reviewer', label: '審核人' },
  { key: 'approvedAt', label: '核准時間' },
  { key: 'testCases', label: '測試案例數' },
  { key: 'testPassed', label: '測試通過數' },
  { key: 'knownLimits', label: '已知限制' },
]

export const promptStatuses = ['Draft', 'PendingReview', 'Published', 'Rejected', 'Archived']

export const promptFlow = [
  'Published v1.0 繼續使用',
  '建立 v1.1 Draft',
  '測試',
  '送審',
  'Owner 核准',
  'v1.1 生效',
  'v1.0 保留',
]

export const promptRules = [
  '只有 Published Prompt 可供 Agent 使用。',
  '絕對不能直接覆蓋 Published Prompt，必須建立新版本。',
  'Prompt 文字沒改，但 Allowed Tools 或 Knowledge Scope 改了，行為仍可能完全不同，因此一併版本化。',
  '送審前必須附上測試案例數、通過數與已知限制。',
]

export const promptCards = [
  {
    promptId: 'PROMPT-X04',
    agentId: 'X04',
    agentName: '回覆草擬員',
    name: '客服回覆草擬',
    version: '1.0',
    systemPrompt: '依客戶問題與查詢結果撰寫供人審核的回覆草稿，不得對外承諾，不得自行補充知識庫沒有的內容。',
    inputContract: ['客戶問題', '查詢結果', '適用知識卡片 ID'],
    outputContract: ['回覆草稿', '引用來源', '待確認事項', '需人工判斷處'],
    allowedTools: ['知識檢索'],
    knowledgeScope: ['FAQ', 'Template', 'Escalation'],
    approvalLevel: 3,
    status: 'Published',
    changedBy: 'SUSU（負責人）',
    changeReason: '初版',
    createdAt: '2026-08-02',
    reviewer: 'SUSU（負責人）',
    approvedAt: '2026-08-02',
    testCases: '【請填入】',
    testPassed: '【請填入】',
    knownLimits: '【請填入：已知限制】',
  },
  {
    promptId: 'PROMPT-S01',
    agentId: 'S01',
    agentName: '經營資料整理員',
    name: '營運摘要',
    version: '1.0',
    systemPrompt: '彙整案件、營收、政府計畫與課程資料，形成可供經營判斷的摘要。只整理資料，不解釋公司應採取何種策略。',
    inputContract: ['期間', '案件清單', '收支資料'],
    outputContract: ['本期摘要', '主要變化', '資料缺口', '需負責人判斷處'],
    allowedTools: ['知識檢索'],
    knowledgeScope: ['Company', 'Policy'],
    approvalLevel: 0,
    status: 'Published',
    changedBy: 'SUSU（負責人）',
    changeReason: '初版',
    createdAt: '2026-08-02',
    reviewer: 'SUSU（負責人）',
    approvedAt: '2026-08-02',
    testCases: '【請填入】',
    testPassed: '【請填入】',
    knownLimits: '【請填入：已知限制】',
  },
  {
    promptId: 'PROMPT-C04',
    agentId: 'C04',
    agentName: '社群內容草擬員',
    name: '內容撰寫',
    version: '1.0',
    systemPrompt: '草擬社群貼文與導流文案。不得寫入價格、優惠、活動規則或成果保證，這些一律標為待負責人確認。',
    inputContract: ['主題', '目標受眾', '可引用的已發布知識'],
    outputContract: ['貼文草稿', '引用來源', '不得自行決定的項目', '建議搭配素材'],
    allowedTools: ['知識檢索'],
    knowledgeScope: ['Service', 'Company', 'Glossary'],
    approvalLevel: 2,
    status: 'Published',
    changedBy: 'SUSU（負責人）',
    changeReason: '初版',
    createdAt: '2026-08-02',
    reviewer: 'SUSU（負責人）',
    approvedAt: '2026-08-02',
    testCases: '【請填入】',
    testPassed: '【請填入】',
    knownLimits: '【請填入：已知限制】',
  },
]

// 送審檢查。缺欄位、覆蓋已發布版本、沒有測試結果都要擋。
export function promptCardIssues(card, existing) {
  const issues = []
  promptCardFields.forEach((field) => {
    const value = card[field.key]
    const text = Array.isArray(value) ? value.join('') : String(value ?? '')
    if (!text || text.includes('【請填入')) issues.push(`缺少 ${field.label}`)
  })

  const clash = (existing ?? []).find(
    (item) =>
      item.promptId === card.promptId &&
      item.version === card.version &&
      item.status === 'Published' &&
      item !== card
  )
  if (clash) issues.push(`版本 ${card.version} 已發布，不得覆蓋，請建立新版本`)

  return issues
}

// ── Audit Log ─────────────────────────────────────────────────────

export const auditRule = {
  ruleId: 'GOV-AUDIT',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const humanEvents = [
  '建立草稿',
  '修改內容',
  '送審',
  '核准',
  '退回',
  '拒絕',
  '封存',
  '修改權限',
  '修改治理設定',
  '修改 Prompt',
]

export const agentEvents = [
  '執行哪個 Agent',
  'Prompt 版本',
  '引用知識版本',
  '使用工具',
  '執行模式',
  '風險等級',
  '是否觸發人工閘門',
  '是否正式送出',
  '由誰送出',
]

export const auditFields = [
  '時間',
  '操作者',
  '操作者類型',
  '角色',
  '動作',
  '對象類型',
  '對象 ID',
  '對象名稱',
  '舊狀態',
  '新狀態',
  '原因',
  '結果',
  'Prompt 版本',
  'Knowledge 版本',
  'Approval Level',
]

export const auditForbidden = ['API 金鑰', '密碼', '不必要的完整個資', '未遮罩的敏感資料']

const REDACT_KEYS = [
  'apikey',
  'api_key',
  'token',
  'password',
  'secret',
  'authorization',
  'idnumber',
  'phone',
  'email',
  'address',
  'account',
]

// 寫入前一律遮罩。這是程式，不是提醒。
export function redactAuditEntry(entry) {
  const clean = {}
  Object.keys(entry).forEach((field) => {
    if (REDACT_KEYS.some((word) => field.toLowerCase().includes(word))) {
      clean[field] = '【已遮罩】'
      return
    }
    const value = entry[field]
    clean[field] =
      value && typeof value === 'object' && !Array.isArray(value) ? redactAuditEntry(value) : value
  })
  return clean
}

const AUDIT_KEY = 'xm-gov-audit'
const AUDIT_LIMIT = 200
const listeners = new Set()

export function subscribeAudit(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function readAuditLog() {
  try {
    const raw = localStorage.getItem(AUDIT_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// 治理設定的實際修改一律寫進這裡。金鑰與敏感欄位在寫入前就被遮罩掉。
export function writeAudit(entry) {
  const record = redactAuditEntry({
    id: `AUDIT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  })
  try {
    const next = [record, ...readAuditLog()].slice(0, AUDIT_LIMIT)
    localStorage.setItem(AUDIT_KEY, JSON.stringify(next))
  } catch {
    // 寫入失敗不影響畫面，但也不會假裝成功。
    return { ok: false, record }
  }
  listeners.forEach((fn) => fn())
  return { ok: true, record }
}

// Audit Log 不可刪除是治理紅線，因此只提供清除「本機展示紀錄」，並且自己也留一筆。
export const auditDeleteNote =
  '正式系統不允許刪除 Audit Log。本頁的紀錄存在這台瀏覽器的 localStorage，僅供治理展示。'

export const auditHumanExample = {
  id: 'AUDIT-001',
  timestamp: '2026-08-02T13:30:00+08:00',
  actorType: 'human',
  actorId: 'USER-001',
  role: 'owner',
  action: 'approve',
  resourceType: 'KnowledgeVersion',
  resourceId: 'FAQ-004-V2',
  beforeStatus: 'PendingReview',
  afterStatus: 'Published',
  reason: '更新服務說明',
  result: 'success',
}

export const auditAgentExample = {
  id: 'AUDIT-002',
  timestamp: '2026-08-02T13:32:00+08:00',
  actorType: 'agent',
  actorId: 'X04',
  action: 'draft_reply',
  promptVersion: 'PROMPT-X04-1.0',
  knowledgeVersions: ['FAQ-004-V1', 'POLICY-002-V1'],
  approvalLevel: 3,
  riskLevel: 'L3',
  humanGateTriggered: true,
  sent: false,
  result: 'waiting_human',
}

// ── System Settings ───────────────────────────────────────────────

export const settingsRule = {
  ruleId: 'GOV-SETTINGS',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

// 固定鎖定，任何角色都不能關閉。
export const lockedSettings = [
  { key: 'quoteDraft', label: 'AI 引用 Draft', value: '關閉' },
  { key: 'quotePendingReview', label: 'AI 引用 PendingReview', value: '關閉' },
  { key: 'quoteNeedsReview', label: 'AI 引用 NeedsReview', value: '關閉' },
  { key: 'quoteExpired', label: 'AI 引用 Expired', value: '關閉' },
  { key: 'lowConfidenceDirect', label: 'Low confidence 直接引用', value: '關閉' },
  { key: 'level3HumanApproval', label: 'Level 3 必須人工核准', value: '開啟' },
  { key: 'level4OwnerOnly', label: 'Level 4 僅 Owner 核准', value: '開啟' },
  { key: 'humanSendRequired', label: '正式送出必須由人操作', value: '開啟' },
  { key: 'allowAuditDelete', label: '允許刪除 Audit Log', value: '關閉' },
  { key: 'apiKeyInAudit', label: 'API 金鑰寫入 Audit Log', value: '關閉' },
]

export const adjustableSettings = [
  { key: 'reviewCompany', label: '一般知識複審週期', value: '365 天' },
  { key: 'reviewService', label: '服務知識複審週期', value: '180 天' },
  { key: 'reviewGovernment', label: '政府計畫知識複審週期', value: '90 天' },
  { key: 'reviewContact', label: '聯絡方式複審週期', value: '180 天' },
  { key: 'samplingRatio', label: 'Level 2 抽查比例', value: '【請填入】' },
  { key: 'auditRetention', label: 'Audit Log 保存期限', value: '【請填入】' },
  { key: 'mediumInternal', label: 'Medium confidence 內部使用', value: '開啟' },
  { key: 'mediumExternal', label: 'Medium confidence 對外使用', value: '關閉' },
]

const LOCKED_KEYS = lockedSettings.map((item) => item.key)

// 設定的唯一寫入入口。鎖定的鍵一律拒絕，可調整的鍵寫入 Audit Log。
export function applySetting(key, value, actor) {
  const locked = lockedSettings.find((item) => item.key === key)
  if (LOCKED_KEYS.includes(key)) {
    writeAudit({
      actorType: 'human',
      actorId: actor ?? 'unknown',
      action: 'modify_setting_rejected',
      resourceType: 'Setting',
      resourceId: key,
      reason: `嘗試將「${locked.label}」改為「${value}」`,
      result: 'rejected',
    })
    return {
      ok: false,
      reason: `「${locked.label}」屬於治理紅線，固定為「${locked.value}」，不提供開關。這次嘗試已記入 Audit Log。`,
    }
  }

  const item = adjustableSettings.find((row) => row.key === key)
  if (!item) return { ok: false, reason: `設定 ${key} 不存在。` }

  const before = item.value
  item.value = value
  writeAudit({
    actorType: 'human',
    actorId: actor ?? 'unknown',
    action: 'modify_setting',
    resourceType: 'Setting',
    resourceId: key,
    beforeStatus: before,
    afterStatus: value,
    reason: '治理設定調整',
    result: 'success',
  })
  return { ok: true, reason: `「${item.label}」已由「${before}」改為「${value}」，並記入 Audit Log。` }
}

// ── 架構總覽 ──────────────────────────────────────────────────────

export const centerTitle = 'Governance Center'

export const centerIntro =
  '管理享洺有限公司的角色權限、AI 審核、升級規則、知識使用、Prompt 版本與治理設定。'

export const governanceModules = [
  { id: 'roles', name: 'Roles & Permissions', zh: '角色與權限', purpose: '決定誰能做' },
  { id: 'approval', name: 'Approval Rules', zh: '審核規則', purpose: '決定什麼需要幾級審核' },
  { id: 'escalation', name: 'Escalation Rules', zh: '升級規則', purpose: '決定出事找誰' },
  { id: 'aiPolicies', name: 'AI Policies', zh: 'AI 治理政策', purpose: '決定所有 Agent 必須遵守什麼' },
  { id: 'knowledge', name: 'Knowledge Policies', zh: '知識治理', purpose: '決定什麼知識可以被引用' },
  { id: 'prompt', name: 'Prompt Policies', zh: 'Prompt 治理', purpose: '決定 Agent 指令如何變更' },
  { id: 'audit', name: 'Audit Log', zh: '操作紀錄', purpose: '記錄誰做過什麼' },
  { id: 'settings', name: 'System Settings', zh: '系統設定', purpose: '調整可配置參數' },
]

export const crossCuttingControls = [
  { id: 'lifecycle', name: 'Knowledge Lifecycle', zh: '知識生命週期', purpose: '控制知識何時生效、複審與失效' },
  { id: 'confidence', name: 'AI Confidence Gate', zh: 'AI 信心門檻', purpose: '控制 Agent 能否引用及如何回答' },
]

export const governanceChainOrder = [
  '角色決定能不能做',
  'Scope 決定能處理哪些資料',
  'Knowledge Lifecycle 決定知識是否有效',
  'Confidence Gate 決定能否引用',
  'Approval Level 決定是否可對外',
  'Escalation Matrix 決定要找誰',
  'Audit Log 記錄完整過程',
]

export const mockIdentityNote =
  'Mock 身分切換，僅供前端治理展示，不是正式登入或權限系統。切換身分不會改變任何資料的實際存取權。'
