export const workflows = [
  {
    id: 'customer-service',
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
    name: '文件與素材管理流程',
    department: '研究與知識管理部',
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
]
