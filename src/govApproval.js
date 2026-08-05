// Governance Center 模組二與三：Approval Rules｜審核規則、Escalation Rules｜升級規則

export const approvalRule = {
  ruleId: 'GOV-APPROVAL',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const approvalLevels = [
  {
    id: 0,
    name: '僅內部使用',
    uses: ['內部摘要', '內部待辦', '已發布 SOP 查詢', 'Knowledge Hub 搜尋', '內部會議整理', '內部專案進度摘要'],
    rules: ['不對外發送', '不含正式承諾', '不修改正式資料', '仍需記錄引用來源'],
    approverRole: '不需核准',
    humanSendRequired: false,
  },
  {
    id: 1,
    name: '低風險固定回覆',
    uses: ['收件確認', '缺件提醒', '轉交通知', '已發布 FAQ 原文', '已核准聯絡方式', '已確認會議資訊', '已核准服務流程說明'],
    rules: [
      '來源為 Published',
      'Confidence 為 High',
      '未過期',
      '不增加知識庫沒有的內容',
      '不涉及金額',
      '不涉及時程或成果承諾',
      '不涉及個資、合約或專業判斷',
    ],
    approverRole: '授權 Editor',
    humanSendRequired: true,
    note: '任一條件不符即升為 Level 3。第一版由授權 Editor 發送，不開放完全無人操作的自動對外發送。',
  },
  {
    id: 2,
    name: '抽查或 Editor 核對',
    uses: ['一般社群內容草稿', '一般品牌或服務介紹', '內部分析建議', '行銷成效摘要', '已發布內容的格式改寫', '一般課程宣傳草稿'],
    rules: [
      'AI 可產出草稿',
      'Editor 可整理',
      '正式發布仍由人操作',
      '每批內容需依設定比例抽查',
      '出現價格、優惠、時程、成果或法律資訊時升為 Level 3',
    ],
    approverRole: 'Editor',
    humanSendRequired: true,
  },
  {
    id: 3,
    name: '強制人工核准',
    uses: ['金額相關內容', '各類承諾', '專業結論', '正式對外內容'],
    rules: ['AI 只能草擬', 'Editor 整理與送審', 'Owner 或授權審核人核准', '人員正式送出'],
    approverRole: 'Owner 或授權審核人',
    humanSendRequired: true,
  },
  {
    id: 4,
    name: 'Owner 專屬核准',
    uses: ['治理與權限修改', '合約法律', '公開聲明', '政府正式送件', '正式付款'],
    rules: ['只有 Owner 可以決定'],
    approverRole: 'Owner',
    humanSendRequired: true,
  },
]

export const level3Groups = [
  {
    name: '金額',
    items: ['正式價格', '報價', '折扣', '費用', '訂金', '付款條件', '退款', '補償', '賠償', '核銷金額'],
  },
  {
    name: '承諾',
    items: ['專案交期', '完成日期', '顧問成果', '課程成果', '申請進度', '是否承接', '是否可提供額外服務'],
  },
  {
    name: '專業內容',
    items: ['正式顧問結論', 'ESG 判斷', '管理診斷', '政府計畫資格初判', '教材中的法規與數據', '核銷文件完整性結論'],
  },
  {
    name: '對外內容',
    items: ['正式客戶回覆', '客訴回覆', '正式提案', '顧問報告', '課程教材', '社群正式發布'],
  },
]

export const level4Items = [
  '正式報價與重大折扣',
  '高額退款或補償',
  '合約及法律責任',
  '公司正式公告',
  '媒體回應',
  '品牌危機聲明',
  '個資或機密事件',
  '政府計畫正式送件',
  '正式核銷或申報',
  '大型企業合作',
  '長期合作條件',
  'AI 治理政策修改',
  '角色權限修改',
  '核心 Prompt 修改',
  '正式付款或銀行操作',
]

// 享洺版高風險提示詞。只做風險提醒，不得作為唯一判斷依據。
export const riskKeywordGroups = [
  {
    id: 'money',
    name: '金額類',
    words: ['價格', '報價', '費用', '折扣', '優惠', '訂金', '付款', '匯款', '發票', '退款', '退費', '補償', '賠償', '稅金', '核銷'],
  },
  {
    id: 'promise',
    name: '承諾類',
    words: ['一定', '保證', '承諾', '確定', '沒問題', '如期交付', '準時完成', '一定通過', '一定核准', '一定有效', '保證改善'],
  },
  {
    id: 'legal',
    name: '專業與合約類',
    words: ['合約', '法律', '違約', '責任', '顧問結論', '診斷', '法規', '會計', '稅務', '政府申報', '資格認定'],
  },
  {
    id: 'complaint',
    name: '客訴與公開聲明類',
    words: ['道歉', '公司疏失', '客訴', '投訴', '申訴', '負評', '媒體', '記者', '公開聲明', '主管機關', '提告'],
  },
  {
    id: 'privacy',
    name: '個資與機密類',
    words: ['身分證', '電話', 'Email', '地址', '帳戶', '密碼', '薪資', '客戶名單', '財務報表', '合約內容', '商業機密', '未公開資料'],
  },
]

export const keywordNote = '關鍵字只做風險提醒，不得作為唯一判斷依據。'

export const evaluateInputFields = [
  'type',
  'content',
  'sourceKnowledgeIds',
  'internalOnly',
  'usesPublishedKnowledge',
  'knowledgeConfidence',
  'containsAmount',
  'containsPromise',
  'containsApology',
  'containsLegal',
  'containsPersonalData',
  'containsGovernmentFiling',
  'containsProfessionalConclusion',
  'containsMajorComplaint',
  'externalAction',
  'governanceChange',
]

function levelOf(id) {
  return approvalLevels.find((item) => item.id === id) ?? null
}

// 唯一的審核等級判斷入口。判定順序固定，由高到低。
export function evaluateApprovalLevel(output) {
  const reasons = []
  const o = output ?? {}

  if (o.governanceChange) reasons.push('修改治理政策或角色權限')
  if (o.containsLegal) reasons.push('涉及合約或法律責任')
  if (o.containsPersonalData) reasons.push('涉及個資或客戶機密')
  if (o.containsGovernmentFiling) reasons.push('涉及政府正式申報或核銷')
  if (String(o.type ?? '').includes('媒體') || String(o.type ?? '').includes('公開聲明')) {
    reasons.push('屬於媒體回應或公開聲明')
  }
  if (reasons.length) {
    return { level: 4, label: levelOf(4).name, reasons, approverRole: 'owner', humanSendRequired: true }
  }

  if (o.containsAmount) reasons.push('涉及金額')
  if (o.containsPromise) reasons.push('包含對外承諾')
  if (o.containsApology) reasons.push('涉及正式道歉或責任認定')
  if (o.containsMajorComplaint) reasons.push('涉及重大客訴')
  if (o.containsProfessionalConclusion) reasons.push('包含正式專業結論')
  if (reasons.length) {
    return { level: 3, label: levelOf(3).name, reasons, approverRole: 'owner', humanSendRequired: true }
  }

  if (o.internalOnly) {
    return {
      level: 0,
      label: levelOf(0).name,
      reasons: ['純內部整理，不對外'],
      approverRole: 'none',
      humanSendRequired: false,
    }
  }

  const lowRiskOk =
    o.usesPublishedKnowledge === true &&
    o.knowledgeConfidence === 'High' &&
    (o.sourceKnowledgeIds ?? []).length > 0
  if (lowRiskOk) {
    return {
      level: 1,
      label: levelOf(1).name,
      reasons: ['完整引用有效的 Published 知識，且未新增內容'],
      approverRole: 'editor',
      humanSendRequired: true,
    }
  }

  return {
    level: 2,
    label: levelOf(2).name,
    reasons: [
      o.usesPublishedKnowledge
        ? `知識可信度為 ${o.knowledgeConfidence ?? '未知'}，不符合 Level 1 條件`
        : '未完整引用 Published 知識',
    ],
    approverRole: 'editor',
    humanSendRequired: true,
  }
}

// Level 2 的抽查機制。未填的參數會誠實顯示為尚未設定。
export const samplingSettings = {
  minPerWeek: '【請填入】',
  ratioPercent: '【請填入】',
  failThreshold: '【請填入】',
  onFail: '該流程暫時升級 Level 3。',
}

export function samplingConfigured() {
  return !['minPerWeek', 'ratioPercent', 'failThreshold'].some((key) =>
    String(samplingSettings[key]).includes('【請填入')
  )
}

// ── Escalation Rules ──────────────────────────────────────────────

export const escalationRule = {
  ruleId: 'GOV-ESCALATION',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const escalationFields = [
  'ID',
  '事件名稱',
  '風險等級',
  '指派角色',
  '指派部門',
  '回應時限',
  '備援指派對象',
  'AI 應做',
  'AI 不應做',
  '是否阻擋自動送出',
  '狀態',
]

export const escalationMatrix = [
  {
    id: 'ESC-G01',
    event: '一般知識不足',
    severity: 'Medium',
    assigneeRole: 'Knowledge Owner／Editor',
    department: '該知識所屬部門',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '停止猜測，建立待確認事項',
    aiShouldNot: '不得自行補答案',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G02',
    event: '一般客戶抱怨',
    severity: 'High',
    assigneeRole: '客戶服務負責人',
    department: '客戶服務部',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '整理事實與草擬回覆',
    aiShouldNot: '不得認定責任',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G03',
    event: '退款或補償',
    severity: 'Critical',
    assigneeRole: 'Owner',
    department: '全公司',
    responseTarget: '【請填入】',
    fallback: '無（已是最高層級）',
    aiShould: '彙整資訊與方案草稿',
    aiShouldNot: '不得決定金額',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G04',
    event: '合約或法律問題',
    severity: 'Critical',
    assigneeRole: 'Owner',
    department: '全公司',
    responseTarget: '【請填入】',
    fallback: '無（已是最高層級）',
    aiShould: '整理文件與爭點',
    aiShouldNot: '不得提供正式法律結論',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G05',
    event: '個資或機密疑慮',
    severity: 'Critical',
    assigneeRole: 'Owner',
    department: '全公司',
    responseTarget: '立即',
    fallback: '無（已是最高層級）',
    aiShould: '立即停止相關流程',
    aiShouldNot: '不得繼續處理或外傳',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G06',
    event: '政府計畫資格爭議',
    severity: 'High',
    assigneeRole: '政府計畫部負責人',
    department: '政府計畫部',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '整理規定與資料來源',
    aiShouldNot: '不得保證資格',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G07',
    event: '正式申報或核銷問題',
    severity: 'Critical',
    assigneeRole: 'Owner ＋ 專業人員',
    department: '政府計畫部',
    responseTarget: '【請填入】',
    fallback: '無（已是最高層級）',
    aiShould: '整理缺漏與來源',
    aiShouldNot: '不得正式認定',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G08',
    event: '顧問結論爭議',
    severity: 'High',
    assigneeRole: '顧問專案負責人',
    department: '客戶開發與行銷部',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '整理依據與不同意見',
    aiShouldNot: '不得自行改變結論',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G09',
    event: '教材錯誤或著作權問題',
    severity: 'High',
    assigneeRole: '教育訓練負責人',
    department: '教育訓練交付部',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '停止使用並標示問題',
    aiShouldNot: '不得繼續發布',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G10',
    event: '媒體或公開聲明',
    severity: 'Critical',
    assigneeRole: 'Owner',
    department: '全公司',
    responseTarget: '立即',
    fallback: '無（已是最高層級）',
    aiShould: '只確認收到並轉交',
    aiShouldNot: '不得代表公司回答',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G11',
    event: '大型企業合作',
    severity: 'High',
    assigneeRole: 'Owner',
    department: '全公司',
    responseTarget: '【請填入】',
    fallback: '無（已是最高層級）',
    aiShould: '整理需求與背景',
    aiShouldNot: '不得承諾條件',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G12',
    event: '系統錯誤',
    severity: 'High',
    assigneeRole: 'Owner／系統維護人員',
    department: '營運與財務管理部',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '停止相關自動流程',
    aiShouldNot: '不得假裝成功',
    blockAutoSend: true,
    status: 'Active',
  },
  {
    id: 'ESC-G13',
    event: 'AI 找不到可靠知識',
    severity: 'Medium',
    assigneeRole: 'Knowledge Owner',
    department: '該知識所屬部門',
    responseTarget: '【請填入】',
    fallback: 'Owner',
    aiShould: '使用知識不足模板',
    aiShouldNot: '不得推測',
    blockAutoSend: true,
    status: 'Active',
  },
]

export function escalationFor(event) {
  return escalationMatrix.find((item) => item.event === event) ?? null
}

// 時限未填就說出來，不能假裝規則已完備。
export function escalationGaps() {
  return escalationMatrix
    .filter((item) => String(item.responseTarget).includes('【請填入'))
    .map((item) => `${item.id}　${item.event}：未設回應時限，逾時無法自動升級給備援對象`)
}

export const escalationFlow = ['事件產生', '指派第一責任人', '超過時限未處理', '自動升級給備援對象']
