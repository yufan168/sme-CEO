// Knowledge Hub 第一批知識資料。
// 只做知識資料，不含新增、編輯、刪除、搜尋、篩選、匯出，也不連資料庫。
// 五條控制規則由 normalizeEntry() 在載入時強制套用，不是只寫在註解。

// 待填標記。實際寫法可能帶冒號與說明，例如【請填入：官方聯絡方式】，
// 因此一律比對前綴，不比對完整字串。
export const PLACEHOLDER = '【請填入'
export const PLACEHOLDER_LABEL = '【請填入】'

export const hubNote =
  '第一批知識共 24 條，全部尚未核准。未核准的知識不得被 Agent 當成正式答案使用，也不得對外引用。'

export const hubRules = [
  '只有 status 為 approved 的知識，才可被 Agent 當成正式知識使用。',
  '只要內容包含「【請填入】」，canQuoteExternally 一律為 false。',
  'riskLevel 為 high 時，requiresHumanReview 一律為 true。',
  'FAQ 標準答案只供 Agent 草擬回覆，不代表 Agent 可以自動送出。',
  '涉及價格、折扣、退款、補償、合約、法律責任、個人資料、政府申報、重大客訴、正式承諾者，一律需要人工處理。',
  '尚未核准的知識在畫面上必須明顯標示，不得看起來像正式答案。',
]

// 規則五：命中任一關鍵字即強制人工處理。
export const escalationKeywords = [
  '價格',
  '報價',
  '折扣',
  '退款',
  '退費',
  '補償',
  '賠償',
  '合約',
  '法律責任',
  '個人資料',
  '個資',
  '政府申報',
  '核銷',
  '客訴',
  '申訴',
  '承諾',
]

const statusLabels = {
  draft: '草稿',
  pending: '待審核',
  approved: '已核准',
  disabled: '已停用',
}

const riskLabels = {
  low: '低風險',
  medium: '中風險',
  high: '高風險',
}

export function statusLabel(status) {
  return statusLabels[status] ?? status
}

export function riskLabel(risk) {
  return riskLabels[risk] ?? risk
}

// 內容欄位才是「知識本身」。metadata 的待填不影響能否引用，但會另外列管。
function contentOf(entry) {
  return [entry.title, entry.question, entry.answer, entry.policyContent]
    .filter(Boolean)
    .join('\n')
}

function metaOf(entry) {
  return [entry.source, entry.owner, entry.effectiveDate, entry.nextReviewDate]
    .filter(Boolean)
    .join('\n')
}

export function hasContentPlaceholder(entry) {
  return contentOf(entry).includes(PLACEHOLDER)
}

export function hasMetaPlaceholder(entry) {
  return metaOf(entry).includes(PLACEHOLDER)
}

export function matchedEscalationKeywords(entry) {
  const text = contentOf(entry)
  return escalationKeywords.filter((word) => text.includes(word))
}

// 規則一：只有 approved 才是正式知識。
export function canAgentUse(entry) {
  return entry.status === 'approved'
}

// 規則四：FAQ 標準答案只供草擬，永遠不等於可以自動送出。
export function canAgentSend() {
  return false
}

function normalizeEntry(raw) {
  const matched = matchedEscalationKeywords(raw)
  const placeholder = hasContentPlaceholder(raw)

  return {
    ...raw,
    // 規則二
    canQuoteExternally: placeholder ? false : raw.canQuoteExternally === true,
    // 規則三與規則五
    requiresHumanReview:
      raw.riskLevel === 'high' || matched.length > 0 ? true : raw.requiresHumanReview === true,
    hasPlaceholder: placeholder,
    hasMetaPlaceholder: hasMetaPlaceholder(raw),
    escalationMatched: matched,
    agentUsable: canAgentUse(raw),
  }
}

const rawEntries = [
  {
    id: 'FAQ-001',
    type: 'faq',
    title: '享洺提供哪些服務',
    question: '享洺有限公司提供哪些服務？',
    answer:
      '享洺有限公司可依實際需求評估企業管理顧問、教育訓練、政府計畫輔導、知識與教材整理及企業 AI 應用規劃等合作。是否承接及實際服務內容，須經需求訪談與雙方書面確認。',
    status: 'pending',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求書面確認服務範圍', '客戶詢問是否一定承接'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['服務範圍', '公司介紹'],
  },
  {
    id: 'FAQ-002',
    type: 'faq',
    title: '適合合作的對象',
    question: '哪些企業或組織適合與享洺合作？',
    answer:
      '希望改善經營管理、人才培訓、流程效率、政府計畫申請、ESG 或 AI 應用的企業與組織，可先提出需求。是否適合合作，仍須經初步訪談與專業評估。',
    status: 'pending',
    riskLevel: 'low',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求先確認一定適合再談'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['客戶輪廓', '合作評估'],
  },
  {
    id: 'FAQ-003',
    type: 'faq',
    title: '如何提出需求',
    question: '如何提出合作或諮詢需求？',
    answer:
      '請透過【請填入：官方聯絡方式】提供公司名稱、聯絡人、需求背景、預計時程及希望解決的問題。收到後將由人員確認並安排後續聯繫。',
    status: 'draft',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['聯絡方式尚未確定，不得對外給出管道'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['聯絡方式', '諮詢流程'],
  },
  {
    id: 'FAQ-004',
    type: 'faq',
    title: '諮詢前的準備',
    question: '第一次諮詢前需要準備哪些資料？',
    answer:
      '建議準備公司基本資料、目前問題、希望達成的目標、預計時程及相關文件。初次諮詢請勿提供帳號密碼、身分證件、完整客戶名單、未遮蔽財務資料或其他高度敏感資訊。',
    status: 'pending',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶已提供敏感資料，須立即通知人員處理'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['諮詢準備', '資料安全'],
  },
  {
    id: 'FAQ-005',
    type: 'faq',
    title: '報價方式',
    question: '享洺如何報價？',
    answer:
      '報價會依服務內容、專案範圍、執行時程、投入人力及交付成果評估。AI 回覆、口頭說明及初步估算均不構成正式報價；實際費用、付款條件及追加需求，以正式報價單或合約為準。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求口頭報價', '客戶要求折扣', '客戶要求確認付款條件'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['報價', '費用'],
  },
  {
    id: 'FAQ-006',
    type: 'faq',
    title: '回覆時限',
    question: '提出需求後多久會收到回覆？',
    answer:
      '一般情況下，我們會於【請填入：正式回覆時限】內進行初步回覆。若需求涉及複雜評估、政府計畫或跨部門資料，所需時間可能較長，將另行說明。',
    status: 'draft',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求承諾具體回覆時間'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['服務時效', '諮詢流程'],
  },
  {
    id: 'FAQ-007',
    type: 'faq',
    title: '顧問專案的進行方式',
    question: '顧問專案通常如何進行？',
    answer:
      '顧問專案可能包含需求訪談、診斷、資料分析、方案建議、執行輔導或成果檢視等階段；每一專案實際包含哪些工作，以正式提案及合約範圍為準。',
    status: 'pending',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求先確認交付物清單', '客戶要求承諾專案期程'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['顧問專案', '執行流程'],
  },
  {
    id: 'FAQ-008',
    type: 'faq',
    title: '政府計畫協助範圍',
    question: '享洺可以協助政府計畫或補助申請嗎？',
    answer:
      '可協助進行計畫資訊整理、資格初步比對、申請文件草擬、文件清單整理、欄位完整性檢查與期限提醒。是否符合資格、是否通過、核准金額、會計稅務適法性及正式核銷認定，仍由客戶、專業人員與主管機關確認。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: [
      '客戶要求保證通過或保證金額',
      '客戶要求代為送件',
      '涉及核銷與申報認定',
    ],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['政府計畫', '補助申請'],
  },
  {
    id: 'FAQ-009',
    type: 'faq',
    title: '課程客製化',
    question: '課程或企業內訓可以客製化嗎？',
    answer:
      '課程內容可依學習對象、產業情境、課程目標、時數及實際需求規劃。正式課綱、授課方式、交付內容與費用，須經需求確認後另行提供。',
    status: 'pending',
    riskLevel: 'medium',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求先報價再談需求', '客戶要求承諾學習成效'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['教育訓練', '課程規劃'],
  },
  {
    id: 'FAQ-010',
    type: 'faq',
    title: '客戶資料的處理',
    question: '享洺如何處理客戶資料？',
    answer:
      '客戶資料的使用、保存、存取範圍及是否可使用 AI 工具處理，應於合作前依個案確認，並以雙方簽署的合約、保密約定或書面同意為準。',
    status: 'draft',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求書面保密承諾', '涉及個人資料的存取範圍'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['個資', '保密'],
  },
  {
    id: 'FAQ-011',
    type: 'faq',
    title: 'AI 產出的對外使用',
    question: 'AI 產出的內容會直接對外使用嗎？',
    answer:
      '依享洺的作業原則，AI 產出的內容不得未經人工審核即作為正式對外內容使用。涉及價格、合約、專業結論、客戶回覆、公開發布或其他承諾時，必須由授權人員確認。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求 AI 直接回覆', '要求即時公開發布'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['AI 使用', '人工審核'],
  },
  {
    id: 'FAQ-012',
    type: 'faq',
    title: '疑問與申訴',
    question: '如果對服務有疑問或需要申訴，應如何處理？',
    answer:
      '請透過【請填入：正式客服或申訴管道】提供案件名稱、問題說明與相關資料。涉及退款、補償、合約、責任認定或重大客訴時，必須轉交負責人或授權主管處理。',
    status: 'draft',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['涉及退款或補償', '涉及責任認定', '重大客訴'],
    source: '知識庫第一批建檔',
    owner: '【請填入：知識負責人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['客訴', '申訴管道'],
  },

  {
    id: 'POL-001',
    type: 'policy',
    title: 'AI 使用與人工閘門政策',
    policyContent:
      'AI 可協助整理、分類、查詢、分析與草擬；涉及審核、決策、正式發布、送出、付款、申報或對外承諾時，必須由人員執行。核心原則：AI 起草／人審核／人發送。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['任何要求 AI 自動送出的情境'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['AI 治理', '人工閘門'],
  },
  {
    id: 'POL-002',
    type: 'policy',
    title: '對外回覆政策',
    policyContent:
      '所有對外回覆只能使用已核准且未過期的公司資料。資料不足時不得自行推測；涉及價格、退款、補償、合約、法律責任、重大客訴或正式承諾時，必須轉交人工處理。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['知識未核准', '資料不足', '涉及承諾性內容'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['對外回覆', '客服'],
  },
  {
    id: 'POL-003',
    type: 'policy',
    title: '報價與承諾政策',
    policyContent:
      'Agent 可以草擬提案與報價文件，但正式價格、折扣、付款條件、交付範圍、交付期限、追加服務及責任條款，只能由授權人員核准。口頭說明與 AI 草稿不構成正式承諾。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['任何金額、折扣或付款條件的確認'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['報價', '承諾'],
  },
  {
    id: 'POL-004',
    type: 'policy',
    title: '資料正確性政策',
    policyContent:
      '所有知識與 Agent 輸出必須區分已確認資料、推測、缺少資料與待人工確認事項。不得將推測寫成事實，不得編造日期、金額、法規、案例或來源。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['資料來源無法追溯', '出現無法查證的數字或日期'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['資料正確性', '不得編造'],
  },
  {
    id: 'POL-005',
    type: 'policy',
    title: '客戶資料與保密政策',
    policyContent:
      '未經授權，不得將客戶機密、個人資料、帳號密碼、未公開財務資料或第三方受保護內容輸入外部 AI 工具。資料保存期限、刪除方式及權限規範為【請填入：正式資料管理政策】。',
    status: 'draft',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['需將客戶資料輸入外部工具', '客戶要求刪除資料'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['個資', '保密', '資料治理'],
  },
  {
    id: 'POL-006',
    type: 'policy',
    title: '知識入庫政策',
    policyContent:
      '任何內容進入正式 Knowledge Hub 前，必須確認來源可追溯、內容未過期、適用情境清楚、未包含未授權資料，並由負責人或專業人員核准。AI 不得自行核准知識入庫。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['來源不明的內容', 'AI 產出未經審核即欲入庫'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['知識治理', '入庫審核'],
  },
  {
    id: 'POL-007',
    type: 'policy',
    title: '政府計畫服務政策',
    policyContent:
      '享洺可協助資格初步比對、文件整理、草稿撰寫、期限提醒及文件完整性檢查；不保證符合資格、不保證通過、不保證核准金額，也不代替會計、法律專業人員或主管機關做正式認定。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求保證通過', '涉及正式核銷或申報認定'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['政府計畫', '不保證'],
  },
  {
    id: 'POL-008',
    type: 'policy',
    title: '課程與教材政策',
    policyContent:
      '所有正式課程、講義、簡報、案例、數據與圖片在使用前，必須完成來源、版本、著作權與內容正確性確認。AI 產出的教材一律視為草稿。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['素材授權不明', '引用第三方案例或數據'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['教材', '著作權'],
  },
  {
    id: 'POL-009',
    type: 'policy',
    title: '異常與升級處理政策',
    policyContent:
      '資料矛盾、缺少關鍵資訊、涉及價格、退款、補償、合約、個資、政府申報、重大客訴、品牌危機、專業結論或正式決策時，Agent 必須停止自動處理並轉交人工。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['資料矛盾', '缺少關鍵資訊', '任一升級關鍵字命中'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['異常處理', '升級機制'],
  },
  {
    id: 'POL-010',
    type: 'policy',
    title: '取消、改期與退款政策',
    policyContent:
      '取消、改期、訂金、已完成工作費用及退款規則，應依個案報價單、合約或課程公告辦理。正式規則尚未建立時，Agent 不得自行回答，必須轉交人工。正式規則：【請填入】',
    status: 'draft',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求取消或改期', '客戶要求退款或退訂金'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['退款', '取消改期'],
  },
  {
    id: 'POL-011',
    type: 'policy',
    title: '追加需求與範圍變更政策',
    policyContent:
      '超出正式提案或合約範圍的新增需求，須另行確認工作內容、費用與時程。未經雙方書面確認前，不視為原服務範圍。',
    status: 'pending',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶提出超出合約的新增需求'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['範圍變更', '追加需求'],
  },
  {
    id: 'POL-012',
    type: 'policy',
    title: '智慧財產權與成果使用政策',
    policyContent:
      '顧問報告、教材、簡報、模板、錄影及其他成果的所有權、使用權、修改權、公開權及轉授權範圍，以正式合約或書面約定為準。未經授權，不得複製、轉售、公開或提供第三方使用。',
    status: 'draft',
    riskLevel: 'high',
    canQuoteExternally: false,
    requiresHumanReview: true,
    escalationConditions: ['客戶要求轉授權或公開成果', '第三方要求引用'],
    source: '知識庫第一批建檔',
    owner: '【請填入：政策核准人】',
    effectiveDate: '【請填入】',
    lastUpdated: '2026-08-01',
    nextReviewDate: '【請填入】',
    tags: ['智慧財產權', '成果使用'],
  },
]

export const knowledgeHub = rawEntries.map(normalizeEntry)

export const hubFaq = knowledgeHub.filter((entry) => entry.type === 'faq')
export const hubPolicies = knowledgeHub.filter((entry) => entry.type === 'policy')

export const hubStats = {
  total: knowledgeHub.length,
  faq: hubFaq.length,
  policy: hubPolicies.length,
  approved: knowledgeHub.filter((entry) => entry.status === 'approved').length,
  pending: knowledgeHub.filter((entry) => entry.status === 'pending').length,
  draft: knowledgeHub.filter((entry) => entry.status === 'draft').length,
  disabled: knowledgeHub.filter((entry) => entry.status === 'disabled').length,
  quotable: knowledgeHub.filter((entry) => entry.canQuoteExternally).length,
  withPlaceholder: knowledgeHub.filter((entry) => entry.hasPlaceholder).length,
  needsReview: knowledgeHub.filter((entry) => entry.requiresHumanReview).length,
}

export function summaryOf(entry) {
  const text = entry.type === 'faq' ? entry.answer : entry.policyContent
  return text.length > 70 ? text.slice(0, 70) + '⋯' : text
}
