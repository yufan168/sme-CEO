export const workflows = [
  {
    id: 'customer-service',
    goal: '把一則顧客來訊處理到可供主管審核的回覆草稿。',
    exec: [
      { id: 'intake', name: '接收顧客來訊', executor: 'system', systemType: 'start', next: 'tidy' },
      {
        id: 'tidy', name: '整理來訊', executor: 'agent', agentId: 'A01', agentName: '訊息整理員',
        instruction: '把顧客原始訊息整理成清楚的問題摘要，保留案件編號、日期、服務項目與需求。',
        readsFrom: [],
        outputContract: ['問題摘要', '已提供資訊', '缺少的必要資訊'],
        demoOutput: {
          summary: '把示範來訊整理成問題摘要。',
          basis: ['示範顧客來訊'],
          result: '【問題摘要】\n客戶詢問三月顧問案的結案報告何時交付。\n\n【已提供資訊】\n案件編號 C-2403、聯絡人王經理。\n\n【缺少的必要資訊】\n未說明希望的交付形式。',
        },
        next: 'classify',
      },
      {
        id: 'classify', name: '判斷問題類型', executor: 'agent', agentId: 'A02', agentName: '問題分派員',
        instruction: '依問題摘要判斷案件類型，無法明確分類時標為「無法判斷」。',
        readsFrom: ['tidy'],
        outputContract: ['問題類型', '判斷依據', '是否需人工判斷'],
        demoOutput: {
          summary: '依示範摘要判斷問題類型。',
          basis: ['訊息整理員的問題摘要'],
          result: '【問題類型】\n專案進度\n\n【判斷依據】\n來訊詢問結案報告交付時間。\n\n【是否需人工判斷】\n否。',
        },
        next: 'lookup',
      },
      {
        id: 'lookup', name: '查詢相關資料', executor: 'agent', agentId: 'A03', agentName: '訂單資料查詢員',
        instruction: '依問題類型查找案件、合約與服務規則資料，查不到時回報缺少資訊。',
        readsFrom: ['tidy', 'classify'],
        outputContract: ['已確認資料', '資料來源', '缺少資訊', '是否涉及例外'],
        demoOutput: {
          summary: '查詢示範案件資料。',
          basis: ['問題摘要', '問題類型'],
          result: '【已確認資料】\n案件 C-2403 已完成訪談與分析，報告撰寫中。\n\n【資料來源】\n示範專案進度表。\n\n【缺少資訊】\n尚未確認客戶偏好的交付形式。\n\n【是否涉及例外】\n否。',
        },
        next: 'draft',
      },
      {
        id: 'draft', name: '草擬客服回覆', executor: 'agent', agentId: 'A04', agentName: '客服回覆撰寫員',
        instruction: '依問題摘要與查詢結果撰寫供主管審核的回覆草稿，不得自行承諾期限。',
        readsFrom: ['tidy', 'lookup'],
        outputContract: ['問題摘要', '已確認資料', '回覆草稿', '需主管確認事項', '是否涉及對客承諾'],
        demoOutput: {
          summary: '依示範資料草擬回覆。',
          basis: ['問題摘要', '查詢結果'],
          result: '【問題摘要】\n詢問結案報告交付時間。\n\n【已確認資料】\n報告撰寫中。\n\n【回覆草稿】\n王經理您好，C-2403 的結案報告目前撰寫中，確切交付日期確認後立即回覆您。\n\n【需主管確認事項】\n可否給出預估交付日期。\n\n【是否涉及對客承諾】\n是，涉及交期，需主管決定。',
        },
        next: 'approve',
      },
      { id: 'approve', name: '主管審核', executor: 'human', gateType: 'review', waitingMessage: '等待人審核', rejectTo: 'draft', next: 'send' },
      { id: 'send', name: '送出回覆', executor: 'human', gateType: 'send', waitingMessage: '等你決定送出', next: 'done' },
      { id: 'done', name: '流程完成', executor: 'system', systemType: 'end' },
    ],
    name: '顧客來訊處理流程',
    department: '客戶服務部',
    shape: 'Chain（一條龍）。不使用 Branch：問題類型只是標記，後續仍走同一條流程。不使用 Parallel：查資料與草擬回覆有前後依賴。',
    definition: `flowchart LR
  intake["接收顧客來訊"]
  tidy["整理來訊"]
  classify["判斷問題類型"]
  lookup["查詢相關資料"]
  draft["草擬客服回覆"]
  approve["主管審核"]
  send["送出回覆"]
  done["流程完成"]
  intake --> tidy --> classify --> lookup --> draft --> approve --> send --> done
  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;
  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;
  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;
  class intake,done systemNode;
  class tidy,classify,lookup,draft agentNode;
  class approve,send humanNode;`,
    nodes: [
      { id: 'A', work: '接收顧客來訊', owner: '系統起點', kind: 'system' },
      { id: 'B', work: '整理來訊', owner: 'Agent：訊息整理員', kind: 'agent' },
      { id: 'C', work: '判斷問題類型', owner: 'Agent：問題分派員', kind: 'agent' },
      { id: 'D', work: '查詢相關資料', owner: 'Agent：訂單資料查詢員', kind: 'agent' },
      { id: 'E', work: '草擬客服回覆', owner: 'Agent：客服回覆撰寫員', kind: 'agent' },
      { id: 'F', work: '主管審核', owner: '人（H01）', kind: 'human' },
      { id: 'G', work: '送出回覆', owner: '人（H02）', kind: 'human' },
      { id: 'H', work: '流程完成', owner: '系統終點', kind: 'system' },
    ],
  },
  {
    id: 'assets',
    goal: '盤點文件與素材的缺口，產出供負責人決定的補件建議。',
    exec: [
      { id: 'start', name: '開始', executor: 'system', systemType: 'start', next: 'audit' },
      { id: 'audit', name: '清點文件與素材', executor: 'human', gateType: 'input', waitingMessage: '等待人實際清點', next: 'monitor' },
      {
        id: 'monitor', name: '檢查缺口與時效', executor: 'agent', agentId: 'D01', agentName: '文件監測員',
        instruction: '比對必備清單與保存規則，列出缺漏與過期項目。',
        readsFrom: [],
        outputContract: ['缺漏項目', '目前版本', '應有版本', '過期或即將到期項目', '資料異常或缺漏'],
        demoOutput: {
          summary: '比對示範清單找出缺口。',
          basis: ['示範清點結果', '必備文件清單'],
          result: '【缺漏項目】\n政府計畫用公司簡介（英文版）。\n\n【目前版本】\nv2（2024）。\n\n【應有版本】\nv3（2026）。\n\n【過期或即將到期項目】\n圖庫授權將於三個月後到期。\n\n【資料異常或缺漏】\n無。',
        },
        next: 'analyze',
      },
      {
        id: 'analyze', name: '分析補件需求', executor: 'agent', agentId: 'D02', agentName: '補件分析員',
        instruction: '依缺漏、使用頻率與即將啟動的專案需求，計算要補什麼。',
        readsFrom: ['monitor'],
        outputContract: ['建議補件項目', '建議規格', '預估使用期間', '資料限制', '需負責人確認事項'],
        demoOutput: {
          summary: '依示範缺口分析補件需求。',
          basis: ['文件監測員的缺口清單'],
          result: '【建議補件項目】\n英文版公司簡介、圖庫授權續約。\n\n【建議規格】\nA4 兩頁、PDF 與可編輯檔各一。\n\n【預估使用期間】\n一年。\n\n【資料限制】\n未取得今年度實績數字。\n\n【需負責人確認事項】\n是否納入最新客戶案例。',
        },
        next: 'suggest',
      },
      {
        id: 'suggest', name: '產生製作或取得建議', executor: 'agent', agentId: 'D03', agentName: '製作建議員',
        instruction: '整理要自製、委外或購買授權的項目、規格與原因。',
        readsFrom: ['analyze'],
        outputContract: ['建議取得方式', '建議項目與規格', '建議原因', '優先程度', '未確認資訊'],
        demoOutput: {
          summary: '依示範分析提出取得建議。',
          basis: ['補件分析員的建議項目'],
          result: '【建議取得方式】\n英文簡介委外翻譯；圖庫授權直接續約。\n\n【建議項目與規格】\n翻譯兩頁、授權一年期。\n\n【建議原因】\n政府計畫送件在即。\n\n【優先程度】\n高。\n\n【未確認資訊】\n委外報價尚未取得。',
        },
        next: 'confirm',
      },
      { id: 'confirm', name: '負責人確認', executor: 'human', gateType: 'review', waitingMessage: '等待人審核', rejectTo: 'analyze', next: 'execute' },
      { id: 'execute', name: '執行製作或採購', executor: 'human', gateType: 'send', waitingMessage: '等你決定執行', next: 'update' },
      {
        id: 'update', name: '更新文件庫紀錄', executor: 'agent', agentId: 'D04', agentName: '文件紀錄員',
        instruction: '依經人員確認的實際交付檔案更新紀錄，未確認交付不得更新。',
        readsFrom: ['suggest'],
        outputContract: ['更新後清單', '更新日期', '本次新增項目', '來源與授權狀態', '異常或差異紀錄'],
        demoOutput: { summary: '示範更新紀錄。', basis: ['經確認的交付檔案'], result: '（本節點在人工關卡之後，示範執行不會走到這裡）' },
        next: 'finish',
      },
      { id: 'finish', name: '結束', executor: 'system', systemType: 'end' },
    ],
    name: '文件與素材管理流程',
    department: '知識與教材管理部',
    shape: 'Chain（一條龍）。Branch 與 Parallel 暫不使用。核心治理原則：AI 分析與建議，人決策與交易。',
    definition: `flowchart LR
  start(["開始"])
  audit["清點文件與素材"]
  monitor["檢查缺口與時效"]
  analyze["分析補件需求"]
  suggest["產生製作或取得建議"]
  confirm["負責人確認"]
  execute["執行製作或採購"]
  update["更新文件庫紀錄"]
  finish(["結束"])
  start --> audit --> monitor --> analyze --> suggest --> confirm --> execute --> update --> finish
  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;
  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;
  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;
  class start,finish systemNode;
  class monitor,analyze,suggest,update agentNode;
  class audit,confirm,execute humanNode;`,
    nodes: [
      { id: '－', work: '開始', owner: '系統起點', kind: 'system' },
      { id: 'A', work: '清點文件與素材', owner: '人', kind: 'human' },
      { id: 'B', work: '檢查缺口與時效', owner: 'Agent：文件監測員（D01）', kind: 'agent' },
      { id: 'C', work: '分析補件需求', owner: 'Agent：補件分析員（D02）', kind: 'agent' },
      { id: 'D', work: '產生製作或取得建議', owner: 'Agent：製作建議員（D03）', kind: 'agent' },
      { id: 'E', work: '負責人確認', owner: '人', kind: 'human' },
      { id: 'F', work: '執行製作或採購', owner: '人', kind: 'human' },
      { id: 'G', work: '更新文件庫紀錄', owner: 'Agent：文件紀錄員（D04）', kind: 'agent' },
      { id: '－', work: '結束', owner: '系統終點', kind: 'system' },
    ],
    keyRule: {
      title: '必須寫入系統的控制條件',
      text: '節點 G 不可依「已委外下單」就把項目標記為已具備。正式描述為：文件紀錄員依據經人員確認的實際交付檔案，更新文件庫紀錄。條件鏈為「收到製作或採購完成資訊 → 人員確認檔案已實際收到、格式正確且授權齊全 → 文件紀錄員更新紀錄」。這不增加新 Agent，也不改變流程主體，只防止清單顯示已具備、實際卻拿不到可用檔案。',
    },
    humanGates: [
      {
        id: 'A',
        name: '清點文件與素材',
        items: [
          '實際檔案是否存在且可開啟',
          '版本是否為最新',
          '授權與可使用範圍',
          '是否含客戶機密或個資',
          '系統紀錄與實際檔案的差異',
        ],
        rule: 'AI 不應以索引紀錄取代實際檔案檢視。',
      },
      {
        id: 'E',
        name: '負責人確認',
        items: [
          '是否製作或取得',
          '實際項目',
          '規格與數量',
          '預算與現金流安排',
          '自製、委外或購買授權',
          '是否延後或取消',
        ],
        rule: 'Agent 產出的內容只能是建議，不能直接變成委外或採購指令。',
      },
      {
        id: 'F',
        name: '執行製作或採購',
        items: [
          '正式向廠商下單或簽約',
          '確認價格與付款條件',
          '確認交付範圍與日期',
          '確認授權條款與使用期限',
          '執行付款',
          '承擔公司的採購承諾',
        ],
        rule: 'Agent 不得自動送出訂單或執行付款。',
      },
    ],
    contracts: [
      {
        node: '節點 B：文件監測員（D01）',
        inputs: ['最新清點結果', '必備文件與素材清單', '保存與版本規則'],
        outputs: [
          '缺漏項目',
          '目前版本',
          '應有版本',
          '過期或即將到期項目',
          '資料異常或缺漏',
        ],
      },
      {
        node: '節點 C：補件分析員（D02）',
        inputs: [
          '缺漏清單',
          '近期使用紀錄',
          '即將啟動的專案需求',
          '政府計畫送件期程',
        ],
        outputs: [
          '建議補件項目',
          '建議規格',
          '預估使用期間',
          '資料限制',
          '需負責人確認事項',
        ],
      },
      {
        node: '節點 D：製作建議員（D03）',
        inputs: ['補件分析結果'],
        outputs: [
          '建議取得方式（自製、委外或購買授權）',
          '建議項目與規格',
          '建議原因',
          '優先程度',
          '未確認資訊',
        ],
      },
      {
        node: '節點 G：文件紀錄員（D04）',
        inputs: ['經人員確認的實際交付檔案', '原文件庫紀錄'],
        outputs: [
          '更新後清單',
          '更新日期',
          '本次新增項目',
          '來源與授權狀態',
          '異常或差異紀錄',
        ],
      },
    ],
    permissions: [
      { action: '讀取文件庫索引', allowed: true },
      { action: '比對必備清單', allowed: true },
      { action: '分析使用頻率與時效', allowed: true },
      { action: '建議補件項目', allowed: true },
      { action: '產生製作或取得建議清單', allowed: true },
      { action: '依確認交付資料更新紀錄', allowed: true },
      { action: '修改必備清單規則', allowed: false },
      { action: '選擇委外廠商', allowed: false },
      { action: '決定製作數量與規格', allowed: false },
      { action: '正式委外下單或簽約', allowed: false },
      { action: '執行付款', allowed: false },
      { action: '未確認交付就標記為已具備', allowed: false },
    ],
    responsibilityLine:
      '人提供真實清點 → AI 監測與分析 → AI 提出製作建議 → 人決定並執行 → AI 依確認交付資料更新紀錄',
  },
  {
    id: 'brand-content',
    goal: '從行銷需求產出一份可供負責人審核的貼文與素材包。',
    exec: [
      { id: 'start', name: '開始', executor: 'system', systemType: 'start', next: 'request' },
      { id: 'request', name: '提出行銷需求', executor: 'human', gateType: 'input', waitingMessage: '等待人提出行銷需求', next: 'topic' },
      {
        id: 'topic', name: '規劃行銷主題', executor: 'agent', agentId: 'M01', agentName: '主題企劃員',
        instruction: '依行銷目的與服務項目提出主題建議，不得決定預算或優惠。',
        readsFrom: [],
        outputContract: ['行銷目標', '建議主題', '目標受眾', '核心訊息', '建議內容形式', '需要負責人確認'],
        demoOutput: {
          summary: '依示範行銷需求整理出一個主題。',
          basis: ['示範公司資料與行銷需求'],
          result: '【行銷目標】\n提高中小企業主對 AI 導入的認知。\n\n【建議主題】\n企業顧問如何協助中小企業導入 AI。\n\n【目標受眾】\n5 至 50 人的中小企業負責人。\n\n【核心訊息】\n導入 AI 的第一步不是買工具，是把流程講清楚。\n\n【建議內容形式】\n單篇長文貼文加一張流程圖。\n\n【需要負責人確認】\n是否搭配政府計畫輔導的服務說明。',
        },
        next: 'brand',
      },
      {
        id: 'brand', name: '整理品牌資料', executor: 'agent', agentId: 'M02', agentName: '品牌資料員',
        instruction: '整理撰寫所需的品牌與服務資料，只能引用既有已核准內容。',
        readsFrom: ['topic'],
        outputContract: ['已確認品牌資料', '服務資訊', '品牌語氣與用語', '可使用歷史內容', '資料來源', '待確認資訊'],
        demoOutput: {
          summary: '整理示範品牌資料包。',
          basis: ['主題企劃員的主題建議', '示範品牌資料'],
          result: '【已確認品牌資料】\n享洺有限公司，企業管理顧問，2023 年成立。\n\n【服務資訊】\n企業管理顧問、政府計畫輔導。\n\n【品牌語氣與用語】\n穩重、務實，不用誇大詞。\n\n【可使用歷史內容】\n示範用的過往貼文兩則。\n\n【資料來源】\n公司資訊分頁。\n\n【待確認資訊】\n可公開的客戶案例。',
        },
        next: 'draft',
      },
      {
        id: 'draft', name: '撰寫內容初稿', executor: 'agent', agentId: 'M03', agentName: '內容撰寫員',
        instruction: '依主題與品牌資料撰寫貼文初稿，不得承諾優惠或宣稱未確認效果。',
        readsFrom: ['topic', 'brand'],
        outputContract: ['內容主題', '貼文標題', '貼文正文', '行動呼籲', '引用資料', '需負責人確認事項'],
        demoOutput: {
          summary: '依主題與品牌資料撰寫貼文初稿。',
          basis: ['主題企劃員的主題建議', '品牌資料員整理的品牌資料包'],
          result: '【內容主題】\n中小企業導入 AI 的第一步。\n\n【貼文標題】\n導入 AI 之前，先把流程講清楚\n\n【貼文正文】\n很多老闆問我們該買哪個 AI 工具。我們的回答通常是先別買。（示範內容）\n\n【行動呼籲】\n想聊聊你的流程，歡迎私訊。\n\n【引用資料】\n公司服務說明。\n\n【需負責人確認事項】\n是否放上聯絡方式。',
        },
        next: 'assets',
      },
      {
        id: 'assets', name: '整理發布素材', executor: 'agent', agentId: 'M04', agentName: '素材整理員',
        instruction: '把文案、圖片與發布資訊整理成待審素材包，不得決定最終發布時間。',
        readsFrom: ['draft'],
        outputContract: ['待審文案', '圖片或素材清單', '圖片順序', '發布平台', '建議發布時間', '標籤與連結', '尚缺素材', '需人工確認事項'],
        demoOutput: {
          summary: '把示範初稿整理成素材包。',
          basis: ['內容撰寫員的貼文初稿'],
          result: '【待審文案】\n同內容撰寫員初稿。\n\n【圖片或素材清單】\n流程圖一張（尚未製作）。\n\n【圖片順序】\n單張。\n\n【發布平台】\nFacebook 專頁。\n\n【建議發布時間】\n平日上午。\n\n【標籤與連結】\n#企業顧問 #AI導入\n\n【尚缺素材】\n流程圖。\n\n【需人工確認事項】\n流程圖要自製或委外。',
        },
        next: 'review',
      },
      { id: 'review', name: '負責人審核', executor: 'human', gateType: 'review', waitingMessage: '等待人審核', rejectTo: 'draft', next: 'publish' },
      { id: 'publish', name: '發布內容', executor: 'human', gateType: 'send', waitingMessage: '等你決定送出', next: 'collect' },
      { id: 'collect', name: '收集成效資料', executor: 'system', systemType: 'data', next: 'analyze' },
      {
        id: 'analyze', name: '整理成效分析', executor: 'agent', agentId: 'M05', agentName: '成效分析員',
        instruction: '整理成效數據並提出改善建議，不得把相關性說成因果。',
        readsFrom: ['assets'],
        outputContract: ['分析期間', '主要成效數據', '表現較佳之處', '表現較弱之處', '可能原因', '下次改善建議', '資料限制'],
        demoOutput: { summary: '示範成效分析。', basis: ['已發布內容'], result: '（本節點在人工關卡之後，示範執行不會走到這裡）' },
        next: 'result',
      },
      { id: 'result', name: '負責人檢視成效', executor: 'human', gateType: 'review', waitingMessage: '等待人檢視', next: 'finish' },
      { id: 'finish', name: '結束', executor: 'system', systemType: 'end' },
    ],
    name: '品牌內容企劃與發布流程',
    department: '客戶開發與行銷部',
    focus: '行銷與品牌經營',
    shape: 'Chain 為主，必要的 Branch 出現在負責人審核：核准往發布，退回修改則附上意見回到內容撰寫，形成修改迴圈。Parallel 不使用。核心原則：AI 起草、人審核、人發布。',
    definition: `flowchart LR
  start(["開始"])
  request["提出行銷需求"]
  topic["規劃行銷主題"]
  brand["整理品牌資料"]
  draft["撰寫內容初稿"]
  assets["整理發布素材"]
  review{"負責人審核"}
  publish["發布內容"]
  collect["收集成效資料"]
  analyze["整理成效分析"]
  result["負責人檢視成效"]
  finish(["結束"])
  start --> request --> topic --> brand --> draft --> assets --> review
  review -->|核准| publish
  publish --> collect --> analyze --> result --> finish
  review -->|退回修改並附上意見| draft
  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;
  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;
  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;
  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;
  class start,collect,finish systemNode;
  class topic,brand,draft,assets,analyze agentNode;
  class request,publish,result humanNode;
  class review decisionNode;`,
    nodes: [
      { id: '－', work: '開始', owner: '系統起點', kind: 'system' },
      { id: 'A', work: '提出行銷需求', owner: '人', kind: 'human' },
      { id: 'B', work: '規劃行銷主題', owner: 'Agent：主題企劃員（M01）', kind: 'agent' },
      { id: 'C', work: '整理品牌資料', owner: 'Agent：品牌資料員（M02）', kind: 'agent' },
      { id: 'D', work: '撰寫內容初稿', owner: 'Agent：內容撰寫員（M03）', kind: 'agent' },
      { id: 'E', work: '整理發布素材', owner: 'Agent：素材整理員（M04）', kind: 'agent' },
      { id: 'F', work: '負責人審核', owner: '人（判斷節點）', kind: 'decision' },
      { id: 'G', work: '發布內容', owner: '人', kind: 'human' },
      { id: 'H', work: '收集成效資料', owner: '系統／人', kind: 'system' },
      { id: 'I', work: '整理成效分析', owner: 'Agent：成效分析員（M05）', kind: 'agent' },
      { id: 'J', work: '負責人檢視成效', owner: '人', kind: 'human' },
      { id: '－', work: '結束', owner: '系統終點', kind: 'system' },
    ],
    keyRule: {
      title: '審核分岔的兩條路徑',
      text: '核准 → 發布內容 → 收集成效資料 → 整理成效分析 → 負責人檢視成效 → 結束。退回修改 → 附上修改意見 → 回到撰寫內容初稿 → 整理發布素材 → 負責人重新審核。退回時必須附上修改意見，否則內容撰寫員只能重猜。',
    },
    humanGates: [
      {
        id: 'A',
        name: '提出行銷需求',
        items: [
          '為什麼要做本次行銷',
          '要推廣的商品、服務或活動',
          '預計發布時間',
          '必須遵守的限制',
          '是否涉及價格、優惠或活動規則',
        ],
        rule: 'Agent 不應自行啟動行銷活動，也不應自行設定促銷政策。',
      },
      {
        id: 'F',
        name: '負責人審核（判斷節點）',
        items: [
          '商品與服務資訊是否正確',
          '價格與優惠是否已核准',
          '供應或服務量能是否符合現況',
          '文案是否符合品牌語氣',
          '圖片與文字是否相符',
          '是否含有誤導或過度承諾',
          '發布時機是否適當',
        ],
        rule: '這是整條流程的正式判斷節點。核准進入發布；退回修改必須附上意見，回到內容撰寫。',
      },
      {
        id: 'G',
        name: '發布內容',
        items: [
          '商品或服務供應',
          '活動規則',
          '價格或優惠',
          '品牌立場',
          '對顧客的公開說明',
        ],
        rule: '正式發布可能代表公司對以上任一項的承諾，Agent 不可登入社群平台自動發布。',
      },
      {
        id: 'J',
        name: '負責人檢視成效',
        items: [
          '哪些表現值得保留',
          '哪些問題需要修正',
          '是否採用 Agent 的改善建議',
          '是否影響下一次行銷方向',
        ],
        rule: '成效分析不應自動啟動下一次活動。',
      },
    ],
    contracts: [
      {
        node: '節點 B：主題企劃員（M01）',
        inputs: ['行銷目的', '商品或活動資訊', '預計發布時間', '限制條件'],
        outputs: [
          '建議主題',
          '目標受眾',
          '溝通重點',
          '建議內容方向',
          '待負責人確認事項',
        ],
      },
      {
        node: '節點 C：品牌資料員（M02）',
        inputs: ['行銷主題', '商品或活動名稱', '溝通重點'],
        outputs: [
          '已確認品牌資料',
          '商品或服務資訊',
          '品牌語氣與用語',
          '可使用歷史內容',
          '活動規則',
          '資料來源',
          '待確認資訊',
        ],
      },
      {
        node: '節點 D：內容撰寫員（M03）',
        inputs: ['行銷主題', '溝通重點', '品牌資料包', '退回修改意見（若有）'],
        outputs: [
          '內容標題',
          '內容初稿',
          '行動引導文字',
          '引用資料',
          '未確認資訊',
          '需負責人確認事項',
        ],
      },
      {
        node: '節點 E：素材整理員（M04）',
        inputs: ['內容初稿', '既有圖片或圖片清單', '商品與活動資料'],
        outputs: [
          '待審文案',
          '圖片或素材清單',
          '圖片順序',
          '發布平台',
          '建議發布時間',
          '標籤與連結',
          '尚缺素材',
          '需人工確認事項',
        ],
      },
      {
        node: '節點 I：成效分析員（M05）',
        inputs: [
          '已發布內容',
          '發布平台',
          '實際發布時間',
          '觸及與互動數據',
          '顧客回應資料',
        ],
        outputs: [
          '成效摘要',
          '主要成效數據',
          '表現較佳之處',
          '表現較弱之處',
          '可能原因',
          '下次改善建議',
          '資料限制',
        ],
      },
    ],
    permissions: [
      { action: '讀取已核准品牌資料', allowed: true },
      { action: '提出內容主題建議', allowed: true },
      { action: '整理商品與品牌資料', allowed: true },
      { action: '撰寫文案草稿', allowed: true },
      { action: '整理發布素材', allowed: true },
      { action: '整理成效數據', allowed: true },
      { action: '提出改善建議', allowed: true },
      { action: '決定促銷活動', allowed: false },
      { action: '核准價格與優惠', allowed: false },
      { action: '核准正式文案', allowed: false },
      { action: '自動登入平台發布', allowed: false },
      { action: '回應重大爭議', allowed: false },
      { action: '自動啟動下一次行銷', allowed: false },
    ],
    responsibilityLine:
      '人提出行銷目的 → AI 規劃、整理與起草 → 人審核品牌與承諾 → 人正式發布 → AI 整理成效 → 人決定下一步',
  },
]
