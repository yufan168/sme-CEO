// 第一條自動化：詢價與一般訊息處理。
// 機器負責前段的建案、摘要、分類、查資料與草擬，以及後段的追蹤與結案整理。
// 責任判斷、金額、承諾、正式回覆與送出全部留給人。

export const inquiryRule = {
  ruleId: 'AUTO-INQUIRY',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const inquiryOverview = [
  '詢價或一般訊息進入',
  '機器建案、摘要、分類、查資料、草擬',
  '人工閘門：審核、決定內容、由人送出',
  '機器更新紀錄、建立追蹤、整理結案資料',
]

export const inquiryPrinciple =
  '這條流程節省的是整理、查找、草擬、建檔與追蹤；保留下來的是金額、承諾、審核與正式送出。'

// ── 觸發條件 ──────────────────────────────────────────────────────

export const triggerEvent = '指定客服管道收到一則尚未處理的新訊息'

export const channels = ['Email', '官方 LINE', '網站表單', '其他實際使用的客服管道']

export const inquiryConditions = [
  '客戶詢問服務內容、費用、時程或合作方式。',
  '客戶要求報價、試算或提供方案。',
  '客戶詢問課程、政府計畫、ISO 或碳管理等服務範圍。',
  '客戶提出合作、轉介或洽談需求。',
  '一般詢問、資料索取或聯絡事項。',
  'AI 無法判斷屬於哪一類。',
]

export const inquiryKeywords = [
  '報價', '費用', '價格', '收費', '多少錢', '預算',
  '方案', '規劃', '時程', '什麼時候', '可以做嗎',
  '課程', '內訓', '講師', '政府計畫', '補助', '申請',
  'ISO', '碳盤查', '合作', '洽談', '想了解', '請問',
]

export const keywordNote =
  '關鍵字只作為提示。即使沒有命中，只要語意涉及費用、時程或承諾，仍須進入人工閘門。'

// ── 案件狀態 ──────────────────────────────────────────────────────

export const caseStates = [
  { id: 'New', label: '新案件', autoSendAllowed: false, note: '剛收到，尚未整理' },
  { id: 'Processing', label: '自動整理中', autoSendAllowed: false, note: '機器正在摘要、分類與查詢' },
  { id: 'WaitingHuman', label: '等待人審核', autoSendAllowed: false, note: '草稿完成，等人判斷' },
  { id: 'FollowUp', label: '追蹤中', autoSendAllowed: false, note: '已由人送出，追蹤後續' },
  { id: 'Closed', label: '已結案', autoSendAllowed: false, note: '由負責人確認結案' },
  { id: 'Escalated', label: '已升級', autoSendAllowed: false, note: '轉 Owner，停止一般流程' },
  { id: 'Failed', label: '流程失敗', autoSendAllowed: false, note: '資料不足或模型失敗，已停下' },
]

export const stateFlow = ['New', 'Processing', 'WaitingHuman', 'FollowUp', 'Closed']
export const exceptionStates = ['Escalated', 'Failed']

export const blockingStates = ['WaitingHuman', 'Escalated', 'Failed']

export const autoSendRule =
  'status 為 WaitingHuman、Escalated 或 Failed 時，系統不得執行任何自動對外發送。'

// 這條是硬規則，寫成程式而不是說明文字。
export function canAutoSend(caseRecord) {
  const state = caseRecord?.status
  const found = caseStates.find((item) => item.id === state)
  if (!found) {
    return { allowed: false, reason: `案件狀態 ${state} 不在允許清單內，一律不得自動送出。` }
  }
  if (blockingStates.includes(state)) {
    return { allowed: false, reason: `案件狀態為 ${state}（${found.label}），禁止任何自動對外發送。` }
  }
  return {
    allowed: false,
    reason: `案件狀態為 ${state}（${found.label}）。本流程第一版不開放任何無人操作的自動對外發送，一律由人送出。`,
  }
}

// ── 分類與風險 ────────────────────────────────────────────────────

export const inquiryTypes = [
  { id: 'quote', label: '詢價與報價需求', department: '客戶開發與行銷部', agent: '提案與報價草擬員' },
  { id: 'consulting', label: '顧問服務諮詢', department: '客戶開發與行銷部', agent: '商機分類員' },
  { id: 'training', label: '課程與內訓諮詢', department: '教育訓練交付部', agent: '課綱設計員' },
  { id: 'government', label: '政府計畫諮詢', department: '政府計畫部', agent: '計畫資格比對員' },
  { id: 'iso', label: 'ISO 與碳管理諮詢', department: '制度與認證輔導部', agent: '條文差距比對員' },
  { id: 'partnership', label: '合作與轉介洽談', department: '客戶開發與行銷部', agent: '商機分類員' },
  { id: 'general', label: '一般詢問與資料索取', department: '客戶服務部', agent: '回覆草擬員' },
  { id: 'unknown', label: '無法判斷', department: '客戶服務部', agent: '回覆草擬員' },
]

export const riskLevels = [
  { id: 'Medium', label: '一般詢問，未涉及金額、承諾或公開風險' },
  { id: 'High', label: '涉及報價、折扣、交期、成果或合作條件' },
  { id: 'Critical', label: '涉及合約、法律、個資、媒體或大型合作' },
]

const CRITICAL_WORDS = ['合約', '法律', '律師', '個資', '媒體', '記者', '主管機關', '併購', '標案']
const HIGH_WORDS = ['報價', '費用', '價格', '收費', '多少錢', '折扣', '優惠', '預算', '交期', '完成日', '保證']

// 風險標記。命中即升級，不看語氣客氣與否。
export function classifyInquiry(text) {
  const content = String(text ?? '')
  const critical = CRITICAL_WORDS.filter((word) => content.includes(word))
  if (critical.length) {
    return {
      risk: 'Critical',
      matched: critical,
      approvalLevel: 4,
      reason: `命中 ${critical.join('、')}，屬於 Owner 專屬核准範圍。`,
      aiAllowed: '只能準備一段「已收到，將由負責人處理」的待審草稿。',
    }
  }
  const high = HIGH_WORDS.filter((word) => content.includes(word))
  if (high.length) {
    return {
      risk: 'High',
      matched: high,
      approvalLevel: 4,
      reason: `命中 ${high.join('、')}。報價與折扣屬 Level 4，只有 Owner 能決定金額。`,
      aiAllowed: '可整理需求與服務範圍，不得寫入任何金額、折扣或交期。',
    }
  }
  return {
    risk: 'Medium',
    matched: [],
    approvalLevel: 2,
    reason: '未命中金額、承諾或合約類提示詞。',
    aiAllowed: '可草擬回覆，仍須由人檢查後送出。',
  }
}

export const criticalRule =
  '判定為 Critical 時，立即停止一般自動流程、標示 Escalated、通知 Owner，不得自動草擬實質回覆。'

// ── Event → Action ────────────────────────────────────────────────

export const inquiryEvents = [
  {
    no: 1,
    event: '收到疑似詢價或一般訊息',
    actor: '系統',
    actions: [
      '產生案件編號',
      '保存原始訊息，不修改也不覆蓋',
      '記錄來源管道與收到時間',
      '狀態設為 Processing',
    ],
    outputs: ['案件編號', '收到時間', '來源管道', '原始訊息'],
  },
  {
    no: 2,
    event: '案件建立完成',
    actor: 'Agent：來訊整理員（X01）',
    actions: ['整理問題摘要', '標出涉及的服務或專案', '整理客戶訴求', '列出已知資訊與缺少資料', '標示緊急程度'],
    forbidden: ['不自行補寫客戶沒提供的資訊', '不改變客戶原意', '不刪除重要原話'],
    outputs: ['問題摘要', '客戶訴求', '已知資料', '缺少資料', '緊急程度'],
  },
  {
    no: 3,
    event: '摘要完成',
    actor: 'Agent：問題分派員（X02）',
    actions: ['判斷案件類型', '標示風險等級', '建議承辦部門', '判斷是否需立即通知 Owner'],
    forbidden: ['不判斷客戶是否值得承接', '不預估成交機率'],
    outputs: ['問題類型', '風險等級', '建議承辦部門', '是否立即通知 Owner'],
  },
  {
    no: 4,
    event: '分類完成',
    actor: 'Agent：客服資料查詢員（X03）',
    actions: [
      '查詢客戶與過往合作紀錄',
      '查詢正式報價與合約範圍',
      '查詢已發布服務說明與 FAQ',
      '列出報價所需但尚未取得的資訊',
    ],
    forbidden: [
      '只使用 canAIUseKnowledge() 判定可引用的知識',
      '不得引用 Draft、NeedsReview、Expired 或 Low confidence 內容',
      '找不到可靠資料時停止猜測，標示資料不足並建立主管確認事項',
    ],
    outputs: ['已確認事實', '引用知識 ID 與版本', '資料矛盾', '缺少資料', '需人工確認事項'],
  },
  {
    no: 5,
    event: '資料查詢完成',
    actor: 'Agent：提案與報價草擬員（C03）或回覆草擬員（X04）',
    actions: ['產出回覆草稿', '整理建議處理方向', '列出需負責人決定的項目', '標示風險等級與引用知識'],
    forbidden: [
      '不得寫入任何金額、單價、折扣或優惠',
      '不得寫入完成日期或交付日期',
      '不得承諾一定承接或一定達成',
      '不得自行解釋合約條件',
    ],
    outputs: ['詢問摘要', '已確認事實', '客戶訴求', '回覆草稿', '建議處理方向', '需負責人決定', '引用知識 ID 與版本', '風險等級'],
  },
  {
    no: 6,
    event: '草稿完成',
    actor: '系統',
    actions: ['狀態改為 WaitingHuman', '鎖住後續自動動作', '通知指定審核人', '不執行任何對外發送'],
    outputs: ['等待人審核'],
  },
  {
    no: 7,
    event: '人完成審核並正式送出',
    actor: '系統（在人送出之後才啟動）',
    actions: [
      '記錄送出時間',
      '記錄核准人與送出人',
      '保存實際送出的最終版本',
      '狀態改為 FollowUp',
      '建立後續追蹤事項',
    ],
    outputs: ['sentBy', 'approvedBy', 'sentAt', '最終版本'],
  },
  {
    no: 8,
    event: '案件進入追蹤中',
    actor: '系統',
    actions: ['整理客戶是否回覆', '列出待完成事項與內部責任人', '列出尚未完成的人工承諾', '設定下一次追蹤日期'],
    forbidden: ['追蹤日期未由人指定時顯示【請負責人設定追蹤日期】，機器不得自行對客戶承諾時間'],
    outputs: ['追蹤清單', '下一次追蹤日期'],
  },
  {
    no: 9,
    event: '收到同一案件的後續訊息',
    actor: '系統',
    actions: ['連結至原案件', '更新案件時間軸', '摘要客戶是否接受方案', '標示仍未解決的問題'],
    forbidden: [
      '不自動結案',
      '客戶表示不接受、要求折讓、將提告或公開時，重新標示 Escalated、停止自動回覆、轉 Owner',
    ],
    outputs: ['案件時間軸', '未解決問題'],
  },
  {
    no: 10,
    event: '負責人確認可結案',
    actor: '系統',
    actions: [
      '狀態改為 Closed',
      '產生內部結案摘要',
      '整理需求、處理方式與成交與否',
      '更新詢價類型統計',
      '產生 SOP 或知識改善建議草稿',
    ],
    forbidden: ['要形成 Knowledge Card 只能建立 Draft，不可自動發布'],
    outputs: ['結案摘要', '改善建議草稿'],
  },
]

// ── 人工閘門 ──────────────────────────────────────────────────────

export const humanGateTitle = '一定要人審核'

export const humanGateNote = '這是詢價流程不可移除的控制點。報價與折扣屬 Level 4，只有 Owner 能決定。'

export const humanChecks = [
  { item: '事實', duty: '查到的客戶背景、過往合作與服務範圍是否正確' },
  { item: '客戶訴求', duty: '客戶要的是報價、方案說明、可行性評估還是其他' },
  { item: '是否承接', duty: '這個需求是否符合享洺定位與可承接範圍' },
  { item: '服務範圍', duty: '要納入哪些工作，哪些明確排除' },
  { item: '金額', duty: '報價、折扣與付款條件，以及實際金額' },
  { item: '時程', duty: '可以承諾的交付期限與里程碑' },
  { item: '承諾', duty: '可以承諾什麼，不能承諾什麼' },
  { item: '升級', duty: '是否轉 Owner、專業人員或法律顧問' },
  { item: '最終文字', duty: '是否核准對外使用' },
]

export const humanDecisions = [
  { decision: '核准', next: '由人正式送出' },
  { decision: '修改後核准', next: '人修改內容後由人正式送出' },
  { decision: '退回補資料', next: '回到資料查詢階段' },
  { decision: '退回重寫', next: '回到草擬階段' },
  { decision: '升級 Owner', next: '狀態改為 Escalated，停止一般流程' },
  { decision: '暫不回覆', next: '記錄原因，維持 WaitingHuman' },
]

export const neverAutomate = [
  '決定報價、單價或折扣',
  '決定付款條件',
  '承諾完成或交付日期',
  '承諾服務成果',
  '決定是否承接案件',
  '解釋合約與法律責任',
  '回應媒體、主管機關或法律行動',
  '正式送出詢價回覆',
]

// ── 效益 ──────────────────────────────────────────────────────────

export const savedWork = [
  { before: '複製客戶訊息到記事本或試算表', after: '自動建案並保存原文' },
  { before: '逐字讀完再整理重點', after: '自動產生問題摘要與客戶訴求' },
  { before: '判斷該找哪個部門處理', after: '自動分類並建議承辦部門' },
  { before: '翻找過往合作紀錄與服務說明', after: '自動查詢已核准且未過期的知識' },
  { before: '從零寫第一版回覆', after: '自動產生草稿與需決定事項清單' },
  { before: '整理報價需要哪些資訊', after: '自動列出缺少資料' },
  { before: '手動建立追蹤待辦', after: '人送出後自動建立' },
  { before: '手動維護往來紀錄', after: '自動維護案件時間軸' },
  { before: '月底統計詢價類型與成交率', after: '自動累積分類與結案資料' },
]

export const savingNote =
  '目前沒有享洺每日詢價件數與人工處理時間，因此不預先承諾節省時數。建議試行兩週後以「每日案件數 ×（原平均處理時間 − 自動化後人工時間）」計算。'

export const stillYours = [
  '判斷需求是否值得承接',
  '決定服務範圍',
  '決定報價、折扣與付款條件',
  '決定可承諾的時程與成果',
  '處理合約、法律、個資與大型合作',
  '核准最終回覆文字',
  '由人正式送出',
  '確認案件是否結案',
  '決定是否修改服務、SOP 或正式知識',
]

export const firstVersionCan = [
  '收件與建案',
  '摘要與分類',
  '查詢已核准知識',
  '草擬回覆與列出需決定事項',
  '停在人工閘門',
  '人送出後自動追蹤與整理',
]

export const firstVersionCannot = [
  'AI 自動發送詢價回覆',
  'AI 自行決定報價或折扣',
  'AI 自行承諾交期',
  'AI 自行決定是否承接',
  'AI 自動結案',
  'AI 自動把詢價紀錄轉成正式知識',
  'AI 自動修改 CRM、合約或財務紀錄',
]
