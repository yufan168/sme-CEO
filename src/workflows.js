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
    id: 'inventory',
    name: '商品與庫存管理流程',
    department: '商品與庫存管理部',
    shape: 'Chain（一條龍）。Branch 與 Parallel 暫不使用。核心治理原則：AI 分析與建議，人決策與交易。',
    definition: `flowchart LR
  start(["開始"])
  inventory["盤點庫存"]
  monitor["檢查安全存量"]
  analyze["分析補貨需求"]
  suggest["產生採購建議"]
  confirm["負責人確認"]
  purchase["執行採購"]
  update["更新庫存紀錄"]
  finish(["結束"])
  start --> inventory --> monitor --> analyze --> suggest --> confirm --> purchase --> update --> finish
  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;
  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;
  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;
  class start,finish systemNode;
  class monitor,analyze,suggest,update agentNode;
  class inventory,confirm,purchase humanNode;`,
    nodes: [
      { id: '－', work: '開始', owner: '系統起點', kind: 'system' },
      { id: 'A', work: '盤點庫存', owner: '人', kind: 'human' },
      { id: 'B', work: '檢查安全存量', owner: 'Agent：庫存監測員（I01）', kind: 'agent' },
      { id: 'C', work: '分析補貨需求', owner: 'Agent：補貨分析員（I02）', kind: 'agent' },
      { id: 'D', work: '產生採購建議', owner: 'Agent：採購建議員（I03）', kind: 'agent' },
      { id: 'E', work: '負責人確認', owner: '人', kind: 'human' },
      { id: 'F', work: '執行採購', owner: '人', kind: 'human' },
      { id: 'G', work: '更新庫存紀錄', owner: 'Agent：庫存紀錄員（I04）', kind: 'agent' },
      { id: '－', work: '結束', owner: '系統終點', kind: 'system' },
    ],
    keyRule: {
      title: '必須寫入系統的控制條件',
      text: '節點 G 不可依「已下單」就增加庫存。正式描述為：庫存紀錄員依據經人員確認的實際到貨品項與數量，更新庫存紀錄。條件鏈為「收到採購完成資訊 → 人員確認商品或原料已實際到貨 → 庫存紀錄員更新庫存」。這不增加新 Agent，也不改變流程主體，只防止帳面庫存與實際庫存不一致。',
    },
    humanGates: [
      {
        id: 'A',
        name: '盤點庫存',
        items: [
          '實際數量',
          '商品與原料狀態',
          '保存期限',
          '損耗或報廢',
          '系統資料與現場差異',
        ],
        rule: 'AI 不應以帳面數字取代實際盤點。',
      },
      {
        id: 'E',
        name: '負責人確認',
        items: [
          '是否採購',
          '實際採購品項',
          '最終採購數量',
          '預算與現金流安排',
          '供應商選擇',
          '是否延後或取消採購',
        ],
        rule: 'Agent 產出的內容只能是建議，不能直接變成採購指令。',
      },
      {
        id: 'F',
        name: '執行採購',
        items: [
          '正式向供應商下單',
          '確認價格與付款條件',
          '確認數量與交付日期',
          '執行付款或簽訂交易',
          '承擔公司的採購承諾',
        ],
        rule: 'Agent 不得自動送出訂單或執行付款。',
      },
    ],
    contracts: [
      {
        node: '節點 B：庫存監測員',
        inputs: ['最新盤點數量', '安全存量規則', '商品或原料基本資料'],
        outputs: ['低庫存品項', '目前數量', '安全存量', '缺口數量', '資料異常或缺漏'],
      },
      {
        node: '節點 C：補貨分析員',
        inputs: ['低庫存清單', '近期銷售資料', '近期耗用資料', '已知活動或訂單需求'],
        outputs: [
          '建議補貨數量',
          '計算依據',
          '預估使用期間',
          '資料限制',
          '需負責人確認事項',
        ],
      },
      {
        node: '節點 D：採購建議員',
        inputs: ['補貨分析結果'],
        outputs: ['建議採購品項', '建議採購數量', '採購原因', '優先程度', '未確認資訊'],
      },
      {
        node: '節點 G：庫存紀錄員',
        inputs: ['經人員確認的實際到貨資料', '原庫存紀錄'],
        outputs: [
          '更新後庫存數量',
          '更新日期',
          '本次增加數量',
          '資料來源',
          '異常或差異紀錄',
        ],
      },
    ],
    permissions: [
      { action: '讀取最新庫存資料', allowed: true },
      { action: '比對安全存量', allowed: true },
      { action: '分析銷售與耗用', allowed: true },
      { action: '建議補貨數量', allowed: true },
      { action: '產生採購建議清單', allowed: true },
      { action: '依確認到貨資料更新紀錄', allowed: true },
      { action: '修改安全存量規則', allowed: false },
      { action: '選擇供應商', allowed: false },
      { action: '決定採購數量', allowed: false },
      { action: '正式向供應商下單', allowed: false },
      { action: '執行付款', allowed: false },
      { action: '未確認到貨就增加庫存', allowed: false },
    ],
    responsibilityLine:
      '人提供真實盤點 → AI 監測與分析 → AI 提出採購建議 → 人決定並執行採購 → AI 依確認到貨資料更新紀錄',
  },
]
