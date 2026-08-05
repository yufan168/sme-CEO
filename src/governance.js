// 享洺有限公司的 AI 治理規則：角色權限與審核規則。
// 原則：AI 起草 → 人審核 → 人發送。越接近金錢、承諾、責任與公開聲明，人工控制越嚴格。
// 這份檔案是規範層，不是技術強制層。系統沒有登入與後端，
// 因此角色權限是設計上的約束；真正在程式裡會擋下來的只有風險分級與人工關卡。

export const governancePrinciple =
  'AI 起草・人審核・人發送；越接近金錢、承諾、責任與公開聲明，人工控制越嚴格。'

export const governanceScopeNote =
  '本系統沒有登入與後端，角色權限屬於制度約束，不是技術強制。實際會在程式裡生效的是風險分級與流程中的人工關卡。'

// 一、角色

export const roles = [
  {
    id: 'owner',
    name: 'owner',
    title: '系統最高管理與最終責任者',
    who: '公司負責人、實際經營決策者',
    can: [
      '決定公司策略、服務範圍與重大例外',
      '核准正式知識及政策',
      '核准報價、折扣、退款、補償與交付承諾',
      '發布或授權他人發布正式內容',
      '正式回覆重大客訴',
      '核准政府計畫送件與申報',
      '核准付款、用印及合約',
      '管理 API 金鑰、角色與系統治理規則',
    ],
    cannotDelegateToAi: [
      '最終策略決定',
      '合約法律責任判斷',
      '專業顧問結論',
      '付款與銀行操作',
      '重大客訴定責',
      '政府申報承諾',
    ],
  },
  {
    id: 'editor',
    name: 'editor',
    title: '日常內容維護與工作執行者',
    who: '部門負責人、顧問、專案或行政核心人員',
    can: [
      '建立與修改草稿',
      '匯入文件並整理成待確認知識',
      '執行 Agent Workflow',
      '準備提案、報告、教材、客服與行銷草稿',
      '將草稿送交 owner 審核',
      '在明確授權範圍內，處理低風險例行回覆',
    ],
    cannot: [
      '直接核准自己的知識草稿',
      '改寫正式政策後立即生效',
      '自行決定價格、折扣或退款',
      '自行作出交期、成果或法律承諾',
      '未經授權發布重大行銷內容',
      '自行提交政府申請或執行付款',
      '管理其他人的角色權限',
    ],
  },
  {
    id: 'viewer',
    name: 'viewer',
    title: '查閱資訊、不改變正式資料',
    who: '一般協作人員、新進人員、短期支援或外部合作夥伴',
    can: [
      '查看其工作所需的已發布知識',
      '查看組織、部門、Agent 與已核准流程',
      '查看被授權的工作成果',
    ],
    cannot: [
      '建立、修改或送審知識',
      '執行 Workflow',
      '查看不屬於其工作範圍的個資或財務資料',
      '對外發送 AI 產出',
      '下載、轉傳或另作他用未授權內容',
      '修改任何正式紀錄',
    ],
  },
]

export const ownerCountRule =
  '全公司原則上只設 1 位主要 owner，最多再設 1 位備援 owner。小公司不需要每個部門都設一位 owner。'

// 權限矩陣。值只有四種：yes 可以、no 不可以、conditional 有條件、asNeeded 視需要。
export const permissionLegend = {
  yes: '可以',
  no: '不可以',
  proposal: '只能提建議案',
  authorized: '經授權可',
  byWork: '依工作授權',
  asNeeded: '視需要',
}

export const permissionMatrix = [
  { action: '查看公司首頁與組織圖', owner: 'yes', editor: 'yes', viewer: 'yes' },
  { action: '查看部門與 Agent Card', owner: 'yes', editor: 'yes', viewer: 'yes' },
  { action: '查看已發布知識', owner: 'yes', editor: 'yes', viewer: 'yes' },
  { action: '查看內部工作流程', owner: 'yes', editor: 'yes', viewer: 'asNeeded' },
  { action: '執行低風險 Workflow', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '建立知識草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '編輯自己建立的草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '修改已發布知識並建立新版草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '送交知識審核', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '核准知識發布', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '退回或拒絕知識草稿', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '封存正式知識', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '查看版本與審核紀錄', owner: 'yes', editor: 'yes', viewer: 'asNeeded' },
  { action: '上傳知識檔案', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '匯入後建立草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { action: '修改 Agent 職責或工作邊界', owner: 'yes', editor: 'proposal', viewer: 'no' },
  { action: '修改 Workflow 定義', owner: 'yes', editor: 'proposal', viewer: 'no' },
  { action: '執行人工審核節點', owner: 'yes', editor: 'authorized', viewer: 'no' },
  { action: '正式發送客戶回覆', owner: 'yes', editor: 'authorized', viewer: 'no' },
  { action: '正式發布行銷內容', owner: 'yes', editor: 'authorized', viewer: 'no' },
  { action: '核准正式報價與折扣', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '決定退款、補償或例外處理', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '正式簽約、用印或申報', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '執行付款或銀行操作', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '設定 API 金鑰', owner: 'yes', editor: 'authorized', viewer: 'no' },
  { action: '清除或更換 API 金鑰', owner: 'yes', editor: 'authorized', viewer: 'no' },
  { action: '管理角色與權限', owner: 'yes', editor: 'no', viewer: 'no' },
  { action: '查看敏感財務或個資', owner: 'yes', editor: 'byWork', viewer: 'no' },
]

export const roleAssignment = [
  { people: '公司負責人', role: 'owner', reason: '承擔策略、合約、金額與對外責任' },
  {
    people: '備援主管或可信任核心主管',
    role: 'owner 或高權限 editor',
    reason: '僅在確實需要代理核准時設第二位 owner',
  },
  {
    people: '顧問、課程與專案核心人員',
    role: 'editor',
    reason: '需要建立文件、執行 Workflow 與送審',
  },
  {
    people: '行政、行銷或客服執行人員',
    role: 'editor',
    reason: '可整理與草擬，但金額和承諾仍交 owner',
  },
  { people: '新進人員', role: 'viewer 起步', reason: '完成訓練並確認工作範圍後再升 editor' },
  {
    people: '外部合作夥伴、講師或短期支援',
    role: 'viewer',
    reason: '只開放專案需要的最小資料範圍',
  },
  {
    people: '會計或專業顧問',
    role: 'viewer 或限域 editor',
    reason: '只開放其需處理的資料，不提供全站權限',
  },
]

export const assignmentStrictRules = [
  '不要為了方便，把所有人都設為 owner。',
  'Editor 不得核准自己提出的高風險內容。',
  '外部合作夥伴不得預設為 editor。',
  '無工作需要的人，不應看到客戶個資、財務、報價與政府計畫資料。',
  '已離職或合作結束者，應立即移除存取權。',
]

export const minimumSetup = [
  { count: '1 位', role: 'owner', who: '公司負責人' },
  { count: '2～4 位', role: 'editor', who: '顧問、專案、行政、客服或內容維護人員' },
  { count: '其他人員', role: 'viewer', who: '一般協作者、新進人員與外部合作夥伴' },
]

export const redLines = [
  'Editor 不能核准自己建立的正式知識或高風險對外內容。',
  '涉及金額、承諾、道歉定責、合約及政府申報，一律停在 owner。',
  '只有 Published、未過期且適用該 Agent 的知識，才能被用來產生正式回覆。',
]

// 二、審核規則

export const mandatoryReview = [
  {
    type: '金額',
    trigger: '價格、報價、折扣、費用、稅金、訂金、付款條件',
    approver: 'owner',
  },
  { type: '退款補償', trigger: '退款、退費、折讓、賠償、免費補作、贈品', approver: 'owner' },
  { type: '交付承諾', trigger: '完成日期、交付日、一定準時、保證如期', approver: 'owner' },
  { type: '成果承諾', trigger: '保證通過、保證改善、保證營收、一定有效', approver: 'owner' },
  {
    type: '合約法律',
    trigger: '合約解釋、違約責任、法律責任、權利義務',
    approver: 'owner；必要時外部專業人員',
  },
  {
    type: '政府計畫',
    trigger: '正式資格判定、通過機率、核准金額、申報、核銷',
    approver: 'owner；必要時會計或專業人員',
  },
  { type: '道歉定責', trigger: '承認公司過失、正式道歉、承認損害或賠償責任', approver: 'owner' },
  {
    type: '重大客訴',
    trigger: '威脅投訴、媒體、主管機關、法律行動或公開負評',
    approver: 'owner',
  },
  {
    type: '個資機密',
    trigger: '客戶名單、個資、財務資料、合約內容、未公開資料',
    approver: 'owner 或指定資料負責人',
  },
  {
    type: '公開發布',
    trigger: '官網、社群、新聞稿、公開聲明、媒體回應',
    approver: 'owner 或明確授權 editor',
  },
  {
    type: '專業結論',
    trigger: '正式顧問診斷、政策判斷、ESG／法規／會計結論',
    approver: 'owner 或具資格專業人員',
  },
  { type: '帳務交易', trigger: '請款核准、付款、發票更正、銀行操作', approver: 'owner' },
  { type: '人事管理', trigger: '工作指派、績效認定、懲處、解約或人力調整', approver: 'owner' },
]

export const mandatoryReviewNote =
  '以上內容無論 Agent 信心多高、是否引用 Knowledge Hub，都必須由人核准後才能對外發送。'

// 關鍵字只是保守攔截的第一層，不是唯一判斷。
export const riskKeywordGroups = [
  {
    id: 'money',
    name: '金額與交易',
    words: [
      '價格', '報價', '費用', '折扣', '優惠', '免費', '贈送', '訂金',
      '付款', '匯款', '發票', '稅金', '退款', '退費', '賠償', '補償',
    ],
  },
  {
    id: 'commitment',
    name: '承諾與時程',
    words: [
      '保證', '一定', '承諾', '確定', '沒問題', '準時', '如期',
      '完成日期', '交付日期', '截止日', '通過', '核准',
    ],
  },
  {
    id: 'liability',
    name: '道歉與責任',
    words: ['道歉', '抱歉造成', '我們的錯', '公司疏失', '負責', '賠償責任', '法律責任', '違約'],
  },
  {
    id: 'dispute',
    name: '爭議與升級',
    words: [
      '客訴', '投訴', '申訴', '消保', '主管機關', '律師', '提告',
      '媒體', '記者', '公開', '爆料', '負評',
    ],
  },
  {
    id: 'privacy',
    name: '個資與敏感資料',
    words: [
      '身分證', '電話', '地址', 'Email', '帳戶', '密碼', '薪資',
      '客戶名單', '財務報表', '合約', '機密',
    ],
  },
]

export const keywordBehaviour = [
  '偵測到高風險詞',
  'Agent 只能建立草稿',
  '標示「必須人工審核」',
  '停止自動發送',
  '送到 owner 或指定審核人',
]

// 知識卡片的敏感判定用這份較窄的清單，而不是全部風險詞。
// 全部風險詞用在「產出是否可送出」；知識卡片若用同一份，會把大半知識庫鎖成不可引用，
// 反而讓 Agent 無知識可用。兩者目的不同，清單也不同。
export const knowledgeSensitiveWords = [
  '價格', '報價', '折扣', '費用', '訂金', '付款', '發票', '稅',
  '退款', '退費', '賠償', '補償',
  '合約', '法律責任', '違約',
  '個資', '身分證', '機密', '保密', '客戶名單', '財務報表',
  '申報', '核銷',
]

export const keywordLimitNote =
  '關鍵字只能作為保守攔截，不能當成唯一判斷。即使沒有出現關鍵字，只要內容實質涉及上述風險，仍必須審核。'

export const mustReviewOutputs = [
  { output: '正式提案與報價', reason: '涉及範圍、價格與承諾' },
  { output: '顧問報告最終版本', reason: '涉及專業責任' },
  { output: '政府計畫申請書', reason: '涉及申報與真實性' },
  { output: '核銷或會計文件', reason: '涉及財務及法規' },
  { output: '對客戶的客訴回覆', reason: '涉及關係與責任' },
  { output: '退款或補償回覆', reason: '涉及金額' },
  { output: '社群與官網正式內容', reason: '代表公司公開發聲' },
  { output: '課程正式教材', reason: '涉及正確性、來源及著作權' },
  { output: '合約條款說明', reason: '涉及權利義務' },
  { output: '專案進度與交期回覆', reason: '可能形成交付承諾' },
  { output: '正式知識卡片發布', reason: '後續所有 Agent 可能引用' },
  { output: '工作指令或跨部門通知', reason: '代表正式管理指示' },
]

export const lowRiskTypes = [
  { type: '收到訊息確認', condition: '只說已收到、將安排人員確認，不承諾時程' },
  { type: '引導提供資料', condition: '請對方提供案件名稱、聯絡方式或缺少文件' },
  { type: '一般導航', condition: '提供已核准的官方聯絡管道或頁面位置' },
  { type: '已核准 FAQ', condition: '完整引用 Published FAQ，不增添新承諾' },
  { type: '會議提醒', condition: '已由人確認的日期、時間與地點' },
  { type: '文件收件確認', condition: '僅確認收到，不表示內容正確或完整' },
  { type: '知識不足回覆', condition: '說明目前無足夠資訊，將轉交人員' },
  { type: '轉交通知', condition: '告知已轉交負責人，不承諾處理結果或時間' },
  { type: '內部摘要', condition: '只供內部閱讀，不對外發送' },
  { type: '格式整理', condition: '改寫排版、摘要、分類，不改變實質意思' },
]

export const lowRiskConditions = [
  '使用 Published 知識',
  '使用已核准模板',
  '不涉及金額',
  '不涉及交期或成果承諾',
  '不涉及道歉定責或爭議',
  '不含個資或機密資料',
]

export const lowRiskConditionNote = '缺少任何一項，就轉人工。'

export const riskLevels = [
  {
    id: 'L3',
    name: 'L3：高風險',
    handling: '必須 owner 核准。',
    examples: [
      '正式報價與折扣',
      '退款或補償',
      '交付日期',
      '保證成果',
      '正式道歉或承認責任',
      '政府計畫正式判定',
      '合約與法律說明',
      '重大客訴',
      '公開聲明',
      '正式發布知識',
    ],
  },
  {
    id: 'L2',
    name: 'L2：中風險',
    handling: '需 editor 快速檢查後送出。',
    examples: [
      '說明一般服務流程',
      '回覆課程或顧問服務範圍',
      '說明需準備哪些資料',
      '引用多張知識卡組合成回答',
      '對客戶需求進行摘要與確認',
    ],
    checkPoints: [
      '是否引用正確版本',
      '是否新增未核准資訊',
      '是否可能被理解為承諾',
      '語氣是否合適',
    ],
  },
  {
    id: 'L1',
    name: 'L1：低風險',
    handling: '可由授權 editor 直接使用。',
    examples: [
      '「已收到您的訊息。」',
      '「此事項需要由相關負責人確認，我先協助轉交。」',
      '「請提供案件名稱與聯絡方式。」',
      '引用已發布的公司服務介紹，但不涉及價格或承諾。',
    ],
  },
]

export const decisionGates = [
  {
    step: '第一關',
    question: '是否對外？',
    no: '可保存為內部草稿或摘要',
    yes: '進入第二關',
  },
  {
    step: '第二關',
    question:
      '是否涉及金額、退款、補償、交期、成果承諾、合約、法律、政府申報、重大客訴、道歉定責、個資或公開發布？',
    yes: 'L3，停下並送 owner 審核',
    no: '進入第三關',
  },
  {
    step: '第三關',
    question: '是否完整引用 Published 知識與核准模板？',
    no: 'L2，送 editor 檢查',
    yes: '進入第四關',
  },
  {
    step: '第四關',
    question: '是否只是收件確認、資料補充要求、轉交通知或一般導航？',
    yes: 'L1，可由授權 editor 直接使用',
    no: 'L2，送 editor 檢查',
  },
]

export const selfApprovalRules = [
  { situation: 'Editor 建立高風險草稿', rule: '必須由 owner 核准' },
  {
    situation: 'Owner 自己建立重大合約或政府申報草稿',
    rule: '應由外部專業人員或另一位授權主管複核',
  },
  { situation: '一般低風險模板回覆', rule: '授權 editor 可直接使用' },
  { situation: '正式 Knowledge Card', rule: '建立者與核准者應不同' },
  { situation: '財務付款', rule: '製單與付款確認盡量由不同人完成' },
]

export const auditTrailFields = ['建立人', '審核人', '審核時間', '決策理由', '使用的知識版本']

export const auditTrailNote =
  '小公司無法完全職務分離時，至少要留下以上五項紀錄。'

// 寫進系統的治理規則物件。頁面與程式都讀這一份，不各自維護。
export const GOVERNANCE_RULES = {
  roles: {
    owner: { canApproveHighRisk: true, canPublishKnowledge: true, canManageRoles: true },
    editor: { canCreateDraft: true, canSubmitReview: true, canApproveHighRisk: false },
    viewer: { canViewPublished: true, canCreateDraft: false, canRunWorkflow: false },
  },
  mandatoryHumanReview: [
    'money',
    'discount',
    'refund',
    'compensation',
    'delivery_commitment',
    'outcome_guarantee',
    'apology_liability',
    'contract',
    'legal',
    'government_filing',
    'major_complaint',
    'personal_data',
    'public_release',
  ],
  lowRiskDirectUse: [
    'receipt_confirmation',
    'request_missing_information',
    'approved_faq_quote',
    'handoff_notice',
    'general_navigation',
  ],
}

// 三、隱性承諾偵測
// 關鍵字擋不住「我們會在下週完成」「這個方案應該沒問題」這類沒有風險詞的承諾。
// 這裡再加一層語意類型判斷，命中同樣升為 L3。

export const intentChecks = [
  {
    id: 'future_action',
    name: '承諾未來行動',
    example: '我們會在下週完成。',
    patterns: [
      /我們(會|將|可以|能)(在|於)?[^。\n]{0,12}(完成|處理|安排|送出|提供|交付|回覆)/,
      /(下週|下個月|本週|本月|明天|後天|月底|週內|工作天)[^。\n]{0,10}(完成|給|交|回|寄|送)/,
    ],
  },
  {
    id: 'amount_confirm',
    name: '確認金額',
    example: '這項費用可以再調整。',
    patterns: [/(費用|金額|價|款項)[^。\n]{0,10}(可以|能|再|調整|折|減|降|優惠|議)/, /\d[\d,]*\s*(元|萬)/],
  },
  {
    id: 'schedule_confirm',
    name: '確認時程',
    example: '這批文件下週三前給您。',
    patterns: [/(前|之前|以前|以內)[^。\n]{0,6}(給|交|完成|送|提供|回覆)/, /\d{1,2}\s*\/\s*\d{1,2}/],
  },
  {
    id: 'liability_admit',
    name: '承認責任',
    example: '這部分是我們沒注意到。',
    patterns: [
      /(我們|本公司|敝公司)[^。\n]{0,10}(沒(注意|處理|做)|疏忽|失誤|漏(了|掉)|不(周|對))/,
      /(造成|導致)[^。\n]{0,10}(不便|損失|困擾)/,
    ],
  },
  {
    id: 'company_position',
    name: '代表公司立場',
    example: '本公司的立場是不接受這項條件。',
    patterns: [/(本公司|敝公司|享洺)[^。\n]{0,10}(立場|認為|不接受|同意|拒絕|決定)/],
  },
  {
    id: 'call_to_action',
    name: '要求對方據此採取行動',
    example: '請依此金額先行匯款。',
    patterns: [/請[^。\n]{0,12}(匯款|付款|簽|用印|回簽|依此|據此|先行)/],
  },
]

export const intentCheckNote =
  '關鍵字只是第一層。這六類語意即使不含任何風險詞，只要成立就升為 L3，因為它們實質上就是承諾、金額、時程或責任。'

// 已核准組合回覆：完整引用已發布知識與已核准模板、且未新增文字者，可直接視為 L1。
// 這是刻意的放寬，避免每一句「已收到」都塞到人身上。
export const approvedComboConditions = [
  '完整引用 Published 知識',
  '使用已核准模板',
  '沒有新增文字',
  '沒有命中風險詞',
  '不含個資',
]

// 風險分級。這是系統裡真的會執行的部分，不是說明文字。
// options.approvedCombo 為 true 時代表以上五項都成立，且已由呼叫端確認。
export function classifyRisk(text, options = {}) {
  const content = String(text ?? '')
  const matched = []
  riskKeywordGroups.forEach((group) => {
    const hits = group.words.filter((word) => content.includes(word))
    if (hits.length) matched.push({ group: group.name, words: hits })
  })

  const intents = intentChecks
    .filter((check) => check.patterns.some((pattern) => pattern.test(content)))
    .map((check) => check.name)

  if (matched.length || intents.length) {
    const reasons = []
    if (matched.length) reasons.push('命中高風險關鍵字')
    if (intents.length) reasons.push(`偵測到隱性承諾（${intents.join('、')}）`)
    return {
      level: 'L3',
      matched,
      intents,
      approver: 'owner',
      reason: `${reasons.join('；')}。必須由 owner 核准後才能對外發送。`,
    }
  }

  if (options.approvedCombo) {
    return {
      level: 'L1',
      matched: [],
      intents: [],
      approver: 'editor',
      reason: '完整引用已發布知識與已核准模板且未新增文字，授權 editor 可直接送出。',
    }
  }

  return {
    level: 'L2',
    matched: [],
    intents: [],
    approver: 'editor',
    reason: '未命中風險詞與隱性承諾。仍須由人檢查是否新增未核准資訊或形成承諾後才可送出。',
  }
}

// 四、知識可引用條件
// 「看得到」與「能被 AI 引用」是兩件事。以下六項全數成立才可作為正式回覆的依據。

export const quotableConditions = [
  '狀態為 Published',
  '未封存',
  '未過期（validUntil 未到期）',
  '仍在複核期限內',
  '適用該 Agent（appliesTo 相符）',
  'allowAIUse 為 true',
]

export const fieldSeparationNote =
  'visibility 是誰看得到，allowAIUse 是 Agent 能不能拿來當判斷依據，canQuoteExternally 是能不能原文送給客戶。三者互不取代：報價政策要讓 Agent 讀到才知道該轉人工，但不能原文貼給客戶。'

export const externalQuoteConditions = [
  '可被 AI 引用（allowAIUse 為 true）',
  '不含敏感內容（價格、合約、個資、核銷等）',
  'visibility 為 Public',
]

// 複核期限：最後更新後多久必須重新確認。
export const REVIEW_INTERVAL_DAYS = 365

function dayDiff(fromText, toText) {
  const from = Date.parse(fromText)
  const to = Date.parse(toText)
  if (Number.isNaN(from) || Number.isNaN(to)) return null
  return Math.floor((to - from) / 86400000)
}

// 回傳可否引用與擋下來的原因。原因要能直接顯示給人看，不能只回 false。
export function knowledgeUsability(card, agentName, today) {
  const now = today ?? new Date().toISOString().slice(0, 10)
  const blockers = []

  if (card.status !== 'Published') blockers.push(`狀態為${card.status}，不是 Published`)
  if (card.status === 'Archived') blockers.push('已封存')
  if (card.validUntil && card.validUntil < now) blockers.push(`已於 ${card.validUntil} 過期`)

  const age = dayDiff(card.lastUpdated, now)
  if (age !== null && age > REVIEW_INTERVAL_DAYS) {
    blockers.push(`最後更新於 ${card.lastUpdated}，已超過 ${REVIEW_INTERVAL_DAYS} 天複核期限`)
  }

  if (agentName) {
    const applies = card.appliesTo.includes('全部 Agent') || card.appliesTo.includes(agentName)
    if (!applies) blockers.push(`不適用於 ${agentName}`)
  }

  if (card.allowAIUse !== true) blockers.push('未開放 AI 引用（allowAIUse 為 false）')

  return { usable: blockers.length === 0, blockers }
}

// 對外原文引用比內部引用嚴格一階。可讀不等於可貼給客戶。
export function externalQuoteCheck(card, agentName, today) {
  const base = knowledgeUsability(card, agentName, today)
  const blockers = [...base.blockers]
  if (card.canQuoteExternally !== true) {
    const hits = card.sensitiveHits ?? []
    blockers.push(
      hits.length
        ? `含敏感內容（${hits.join('、')}），只能作為判斷依據，不得原文對外`
        : '未開放對外原文引用'
    )
  }
  return { usable: blockers.length === 0, blockers }
}

// 五、授權要具體，不能只寫「經授權」

export const delegationFields = [
  { key: 'grantedBy', label: '授權人' },
  { key: 'scope', label: '授權範圍' },
  { key: 'period', label: '授權期間' },
  { key: 'allowedTypes', label: '允許的內容類型' },
  { key: 'forbidden', label: '禁止事項' },
]

export const delegationNote =
  '「經授權可」四個字本身不構成授權。沒有寫齊以下五欄的授權一律視為未授權，該動作仍停在 owner。'

// 目前尚未指派實際人員，因此授權對象留待填。規則本身已可運作。
export const delegations = [
  {
    id: 'DLG-001',
    title: '已核准 FAQ 原文回覆',
    grantedBy: 'SUSU（負責人）',
    grantee: '【請填入：受權人】',
    scope: '客戶來訊中屬於已發布 FAQ 範圍的詢問',
    period: '【請填入：起訖日】',
    allowedTypes: ['已核准 FAQ 原文引用', '收件確認', '缺件提醒', '轉交通知', '會議提醒'],
    forbidden: ['價格與折扣', '退款與補償', '合約與法律', '時程與成果承諾', '客訴回覆'],
    canSubDelegate: false,
  },
  {
    id: 'DLG-002',
    title: '日常社群貼文發布',
    grantedBy: 'SUSU（負責人）',
    grantee: '【請填入：受權人】',
    scope: '不涉及價格與活動規則的一般知識型貼文',
    period: '【請填入：起訖日】',
    allowedTypes: ['一般知識貼文', '已核准內容的格式改寫'],
    forbidden: ['品牌重大聲明', '課程價格與優惠', '活動規則', '媒體回應'],
    canSubDelegate: false,
  },
]

export function delegationIsValid(delegation, today) {
  const now = today ?? new Date().toISOString().slice(0, 10)
  const missing = delegationFields
    .filter((field) => {
      const value = delegation[field.key]
      const text = Array.isArray(value) ? value.join('') : String(value ?? '')
      return !text || text.includes('【請填入')
    })
    .map((field) => field.label)

  const granteeMissing = String(delegation.grantee ?? '').includes('【請填入')
  if (granteeMissing) missing.push('受權人')

  const expired = delegation.validUntil ? delegation.validUntil < now : false
  if (expired) missing.push('授權已過期')

  return { valid: missing.length === 0, missing }
}

// 六、不得自己建立、自己核准

export const separationRules = [
  '建立人不可核准自己的正式知識',
  '修改人不可核准自己的版本',
  '提出退款方案者不可同時核准',
  '報價草擬者不可自行定案',
]

export function separationCheck(record) {
  const createdBy = String(record.createdBy ?? '').trim()
  const reviewedBy = String(record.reviewedBy ?? '').trim()
  if (!createdBy || !reviewedBy) {
    return { ok: false, reason: '缺少建立人或審核人，無法判斷是否為同一人。' }
  }
  if (createdBy === reviewedBy) {
    return { ok: false, reason: `建立人與審核人同為「${createdBy}」，不得自行核准。` }
  }
  return { ok: true, reason: '建立人與審核人不同，符合職務分離。' }
}

// 七、停止條件
// AI 失敗或資料矛盾時不得自動降級成一個看起來合理的答案，必須停下來。

export const stopConditions = [
  '模型呼叫失敗',
  '格式驗證失敗',
  '前後 Agent 產出矛盾',
  '同一件事找到兩個不同版本',
  '無法確認最新來源',
  'output contract 缺漏',
  '引用的知識已過期或不可引用',
]

export const stopBehaviour = ['停止流程', '標示失敗原因', '保留已有產出', '轉人工']

// 依 outputContract 檢查 Agent 產出是否缺段。缺段就是停止條件，不是警告。
export function outputContractGaps(text, contract) {
  const content = String(text ?? '')
  return (contract ?? []).filter((item) => !content.includes(`【${item}】`))
}

// 八、Agent 不得直接寫入正式資料

export const agentWriteRule = 'Agent 只能提出變更建議 → 人確認 → 系統或人正式寫入。'

export const agentWriteForbidden = [
  '直接改 CRM 成交狀態',
  '直接改專案期限',
  '直接改付款狀態',
  '直接改政府計畫申報狀態',
  '直接改正式 Knowledge Card',
]

// 九、放寬：白名單可自動或由授權 editor 直接送出

export const autoSendWhitelist = [
  '收件確認',
  '缺件提醒',
  '轉交通知',
  '已核准 FAQ 原文回覆',
  '會議提醒',
  '一般頁面導航',
  '內部摘要',
  '內部分類',
  '標籤與格式整理',
  '已發布知識的檢索',
]

export const autoSendConditions = [
  '使用核准模板',
  '使用 Published 知識',
  '無金額',
  '無時程承諾',
  '無責任認定',
  '無個資',
]

export function canAutoSend(item) {
  const inWhitelist = autoSendWhitelist.includes(item.type)
  if (!inWhitelist) {
    return { ok: false, reason: `${item.type} 不在自動送出白名單內。` }
  }
  const risk = classifyRisk(item.text)
  if (risk.level === 'L3') {
    return { ok: false, reason: `雖在白名單內，但${risk.reason}` }
  }
  const missing = autoSendConditions.filter((condition) => !(item.conditions ?? []).includes(condition))
  if (missing.length) {
    return { ok: false, reason: `未確認：${missing.join('、')}。` }
  }
  return { ok: true, reason: '白名單情境且六項條件齊備，可直接送出。' }
}

// 十、分層核准：不是所有東西都由 owner 審

export const approvalTiers = [
  { kind: '價格、合約、保密、政府計畫', approver: 'owner' },
  { kind: '重大政策', approver: 'owner' },
  { kind: '課程內容、顧問方法', approver: '專業負責人' },
  { kind: 'FAQ、模板、名詞表', approver: '授權 editor' },
  { kind: '格式與標籤修改', approver: 'editor 可處理' },
]

export const socialTiers = [
  { kind: '品牌重大聲明', approver: 'owner' },
  { kind: '課程價格、優惠、活動規則', approver: 'owner' },
  { kind: '一般知識貼文', approver: '授權 editor' },
  { kind: '已核准內容的格式改寫', approver: 'editor 可直接處理' },
]

export const viewerWorkflowRule =
  'Viewer 可執行「不寫回、不對外、不使用敏感資料」的個人型流程，例如會議摘要、內部筆記整理、文件分類、個人待辦草稿。不是一刀切全部禁止。'

export const viewerVisibilityRule =
  'Published 不等於公開。Viewer 能看到的是「Published ＋ visibility 允許 ＋ 屬於其工作範圍」的知識，不是全部已發布知識。'

// 十一、不可自動化紅線

export const neverAutomate = [
  {
    area: '金額與交易',
    items: ['正式報價', '折扣', '付款條件', '退款', '補償', '免費追加', '發票更正', '付款與銀行操作'],
    note: '即使金額很小，也不能讓 Agent 自己決定。',
  },
  {
    area: '對外承諾',
    items: ['完成日期', '交付期限', '成果保證', '申請通過', '補助核准', '課程成效', '顧問結果'],
    note: 'Agent 可以說「建議」「預估」「待確認」，不能說「一定」。',
  },
  {
    area: '道歉與責任認定',
    items: ['承認公司疏失', '正式道歉', '認定責任', '承認違約', '承諾賠償'],
    note: '可以讓 AI 草擬，但一定要 owner 或具權責者審核。',
  },
  {
    area: '合約、法律與政府申報',
    items: ['合約條款確認', '簽署', '用印', '法律責任說明', '正式資格判定', '正式送件', '核銷申報', '稅務申報'],
    note: 'AI 只能整理、比對、提醒。',
  },
  {
    area: '重大客訴與品牌危機',
    items: ['威脅提告', '向主管機關申訴', '媒體詢問', '公開負評', '客戶要求賠償', '個資外洩'],
    note: '不能只依模板自動回。',
  },
  {
    area: '正式知識發布',
    items: ['來源', '版本', '適用範圍', '有效期限', '風險', '是否可對外引用'],
    note: '錯一張知識卡，可能讓所有 Agent 一起答錯。',
  },
  {
    area: '個資、機密與敏感資料',
    items: ['是否可輸入 AI', '是否可對外引用', '是否需遮罩', '是否有客戶授權', '是否超出原使用目的'],
    note: '不能因為內容看起來只是一般文字就放行。',
  },
  {
    area: '最終顧問結論與教學專業內容',
    items: ['正式顧問診斷', '改善建議', 'ESG 判斷', '政策解讀', '教材中的法規與數據'],
    note: 'AI 可以整理，但專業責任由人承擔。',
  },
]

export const practicalTiers = [
  {
    tier: '可自動化',
    handler: '系統或授權 editor 直接處理',
    items: autoSendWhitelist,
  },
  {
    tier: '可由 editor 審',
    handler: 'editor 快速檢查後送出',
    items: [
      '一般服務流程說明',
      '一般課程介紹',
      '日常社群貼文',
      '已核准內容的改寫',
      '客戶需求摘要',
      '低風險教材調整',
    ],
  },
  {
    tier: '必須 owner 審',
    handler: 'owner 核准後才可送出',
    items: [
      '金額', '折扣', '退款', '補償', '合約', '時程承諾', '成果保證',
      '道歉定責', '重大客訴', '政府申報', '正式公開聲明', '重大政策', '高風險知識發布',
    ],
  },
]

export const automationPrinciple =
  '真正該自動化的是重複、可逆、無承諾的工作；真正不能自動化的是金額、責任、承諾、正式發布與不可逆動作。'
