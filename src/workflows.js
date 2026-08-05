export const workflows = [
  {
    id: "wf-s01",
    code: "WF-S01",
    name: "經營方案分析與決策流程",
    department: "經營策略與決策部",
    shape: "Chain 為主，Branch 出現在負責人審核：資料不足回 S01，方案需調整回 S02，可用則進入決策。",
    goal: "把營運資料整理成決策資訊，形成方案比較，供負責人做最終策略決定。",
    definition: "flowchart LR\n  start([\"開始\"])\n  issue[\"提出決策議題\"]\n  gather[\"彙整經營資料\"]\n  compare[\"比較方案\"]\n  review{\"負責人審核\"}\n  decide[\"做出策略決策\"]\n  finish([\"流程完成\"])\n  start --> issue\n  issue --> gather\n  gather --> compare\n  compare --> review\n  review -->|核准| decide\n  review -->|退回修改| gather\n  decide --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class gather,compare agentNode;\n  class issue,decide humanNode;\n  class review decisionNode;",
    nodes: [
      {
        id: "－",
        work: "開始",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "提出決策議題",
        owner: "人",
        kind: "human"
      },
      {
        id: "B",
        work: "彙整經營資料",
        owner: "Agent：經營資料整理員（S01）",
        kind: "agent"
      },
      {
        id: "C",
        work: "比較方案",
        owner: "Agent：方案比較分析員（S02）",
        kind: "agent"
      },
      {
        id: "D",
        work: "負責人審核",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "E",
        work: "做出策略決策",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "開始",
        executor: "system",
        systemType: "start",
        next: "issue"
      },
      {
        id: "issue",
        name: "提出決策議題",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人提出要分析什麼",
        next: "gather"
      },
      {
        id: "gather",
        name: "彙整經營資料",
        executor: "agent",
        agentId: "S01",
        agentName: "經營資料整理員",
        instruction: "彙整營收、客戶、專案與營運資料，形成可供判斷的經營摘要，缺漏要標出。",
        readsFrom: [],
        outputContract: [
          "期間",
          "營收與結構",
          "客戶集中度",
          "案件狀態",
          "缺漏資料"
        ],
        demoOutput: {
          summary: "彙整示範期間的營收與案件結構。",
          basis: [
            "示範營收表",
            "示範案件清單"
          ],
          result: "【期間】\n2026 上半年\n\n【營收與結構】\n合計 3,000,000。內訓 41%、19+1 佔 30%、服務業補助 16%、SBIR 13%。\n\n【客戶集中度】\n前三大客戶合計 44%。\n\n【案件狀態】\n執行中 1、審查中 1、已結案 2、排課中 1。\n\n【缺漏資料】\n線上課程無資料；6 月講師費尚未入帳。"
        },
        next: "compare"
      },
      {
        id: "compare",
        name: "比較方案",
        executor: "agent",
        agentId: "S02",
        agentName: "方案比較分析員",
        instruction: "整理不同方案的效益、成本、條件與風險，不得替公司決定方向。",
        readsFrom: [
          "gather"
        ],
        outputContract: [
          "方案一",
          "方案二",
          "預期效益",
          "所需資源",
          "主要風險",
          "限制與未知事項",
          "需主管決定"
        ],
        demoOutput: {
          summary: "依示範資料比較兩個資源投入方案。",
          basis: [
            "經營資料整理員的摘要"
          ],
          result: "【方案一】\n加開企業內訓梯次\n\n【方案二】\n主攻政府計畫\n\n【預期效益】\n方案一新增 300,000 至 390,000；方案二約 600,000。\n\n【所需資源】\n方案一 120 小時；方案二 320 小時且期限剛性。\n\n【主要風險】\n方案一單價天花板明顯；方案二錯過期限即損失整個梯次。\n\n【限制與未知事項】\n19+1 下半年是否開辦未公告。\n\n【需主管決定】\n是否為政府計畫預留排他性量能。"
        },
        next: "review"
      },
      {
        id: "review",
        name: "負責人審核",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人審核",
        rejectTo: "gather",
        next: "decide"
      },
      {
        id: "decide",
        name: "做出策略決策",
        executor: "human",
        gateType: "send",
        waitingMessage: "等待負責人決策",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-c01",
    code: "WF-C01",
    name: "商機開發與提案流程",
    department: "客戶開發與行銷部",
    focus: "商機與提案",
    shape: "Chain 為主，Branch 出現在負責人審核：退回修改回 C03，資料不足回 C02。",
    goal: "把進線商機完成分類、背景查詢與提案草擬，由人負責訪談、報價、談判與簽約。",
    definition: "flowchart LR\n  start([\"接收潛在商機\"])\n  classify[\"商機分類\"]\n  lookup[\"查詢客戶與計畫資料\"]\n  interview[\"需求訪談\"]\n  draft[\"草擬提案與報價\"]\n  approve{\"負責人審核\"}\n  negotiate[\"提案、議價與承諾\"]\n  crm[\"整理 CRM 紀錄\"]\n  finish([\"流程完成\"])\n  start --> classify\n  classify --> lookup\n  lookup --> interview\n  interview --> draft\n  draft --> approve\n  approve -->|核准| negotiate\n  approve -->|退回修改| draft\n  negotiate --> crm\n  crm --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class classify,lookup,draft,crm agentNode;\n  class interview,negotiate humanNode;\n  class approve decisionNode;",
    nodes: [
      {
        id: "－",
        work: "接收潛在商機",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "商機分類",
        owner: "Agent：商機分類員（C01）",
        kind: "agent"
      },
      {
        id: "B",
        work: "查詢客戶與計畫資料",
        owner: "Agent：客戶與計畫資料查詢員（C02）",
        kind: "agent"
      },
      {
        id: "C",
        work: "需求訪談",
        owner: "人",
        kind: "human"
      },
      {
        id: "D",
        work: "草擬提案與報價",
        owner: "Agent：提案與報價草擬員（C03）",
        kind: "agent"
      },
      {
        id: "E",
        work: "負責人審核",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "F",
        work: "提案、議價與承諾",
        owner: "人",
        kind: "human"
      },
      {
        id: "G",
        work: "整理 CRM 紀錄",
        owner: "Agent：CRM 紀錄整理員（C05）",
        kind: "agent"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "接收潛在商機",
        executor: "system",
        systemType: "start",
        next: "classify"
      },
      {
        id: "classify",
        name: "商機分類",
        executor: "agent",
        agentId: "C01",
        agentName: "商機分類員",
        instruction: "把進線分為企業顧問、教育訓練、政府計畫、行銷合作、一般詢問或無法判斷。",
        readsFrom: [],
        outputContract: [
          "分類結果",
          "判斷依據",
          "是否需人工判斷"
        ],
        demoOutput: {
          summary: "把示範進線逐筆分類。",
          basis: [
            "示範進線訊息"
          ],
          result: "【分類結果】\n宏昇：政府計畫；永盛：教育訓練；某商會：行銷合作；未具名：無法判斷。\n\n【判斷依據】\n依訊息中明確提到的需求類型。\n\n【是否需人工判斷】\n未具名那筆需人處理，僅問線上課程時間且無其他資訊。"
        },
        next: "lookup"
      },
      {
        id: "lookup",
        name: "查詢客戶與計畫資料",
        executor: "agent",
        agentId: "C02",
        agentName: "客戶與計畫資料查詢員",
        instruction: "查找客戶公開背景、過往合作紀錄，以及政府計畫的資格條件與文件清單。",
        readsFrom: [
          "classify"
        ],
        outputContract: [
          "已確認資料",
          "資料來源",
          "缺少資訊",
          "是否涉及例外"
        ],
        demoOutput: {
          summary: "查詢示範客戶背景與計畫資格。",
          basis: [
            "商機分類結果"
          ],
          result: "【已確認資料】\n宏昇為製造業，資本額 2,000 萬，2025 年曾合作內訓一場。\n\n【資料來源】\n商業司公開登記、內部案件紀錄。\n\n【缺少資訊】\n員工數為客戶自述，未取得投保名冊；近三年受補助紀錄未取得證明。\n\n【是否涉及例外】\n否。"
        },
        next: "interview"
      },
      {
        id: "interview",
        name: "需求訪談",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人完成訪談",
        next: "draft"
      },
      {
        id: "draft",
        name: "草擬提案與報價",
        executor: "agent",
        agentId: "C03",
        agentName: "提案與報價草擬員",
        instruction: "依已確認需求草擬服務方案與報價文件，不得決定價格與付款條件。",
        readsFrom: [
          "lookup"
        ],
        outputContract: [
          "提案架構",
          "建議內容",
          "交付物",
          "報價區間",
          "需負責人確認",
          "未確認資訊"
        ],
        demoOutput: {
          summary: "依示範需求草擬提案。",
          basis: [
            "查詢結果",
            "訪談紀錄"
          ],
          result: "【提案架構】\n一日實作課程，四個單元。\n\n【建議內容】\nAI 能幫與不能幫、報價單整理、排程溝通、實作演練。\n\n【交付物】\n簡報、講義、可帶走的範例檔。\n\n【報價區間】\n80,000 至 130,000（草案，待核定）。\n\n【需負責人確認】\n最終報價、是否含交通費。\n\n【未確認資訊】\n客戶預算僅口頭暗示。"
        },
        next: "approve"
      },
      {
        id: "approve",
        name: "負責人審核",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人審核",
        rejectTo: "draft",
        next: "negotiate"
      },
      {
        id: "negotiate",
        name: "提案、議價與承諾",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定提案與簽約",
        next: "crm"
      },
      {
        id: "crm",
        name: "整理 CRM 紀錄",
        executor: "agent",
        agentId: "C05",
        agentName: "CRM 紀錄整理員",
        instruction: "把接觸、會議與追蹤內容整理成標準化 CRM 紀錄，階段變更僅供建議。",
        readsFrom: [
          "lookup",
          "draft"
        ],
        outputContract: [
          "客戶名稱",
          "接觸日期",
          "需求摘要",
          "目前階段",
          "待辦事項",
          "下次追蹤日期",
          "需人確認資訊"
        ],
        demoOutput: {
          summary: "整理示範 CRM 紀錄。",
          basis: [
            "查詢結果",
            "提案草稿"
          ],
          result: "（本節點在人工關卡之後，示範執行不會走到這裡）"
        },
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-c02",
    code: "WF-C02",
    name: "品牌內容企劃與發布流程",
    department: "客戶開發與行銷部",
    focus: "品牌內容",
    shape: "Chain 為主，Branch 出現在負責人審核：退回修改回 C04，資料不足回 C02。",
    goal: "依品牌需求草擬社群內容，經負責人審核後由人正式發布。",
    definition: "flowchart LR\n  start([\"開始\"])\n  request[\"提出品牌內容需求\"]\n  brand[\"查詢品牌與服務資料\"]\n  content[\"草擬社群內容\"]\n  approve{\"負責人審核\"}\n  publish[\"正式發布\"]\n  record[\"整理互動與商機紀錄\"]\n  finish([\"流程完成\"])\n  start --> request\n  request --> brand\n  brand --> content\n  content --> approve\n  approve -->|核准| publish\n  approve -->|退回修改| content\n  publish --> record\n  record --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class brand,content,record agentNode;\n  class request,publish humanNode;\n  class approve decisionNode;",
    nodes: [
      {
        id: "－",
        work: "開始",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "提出品牌內容需求",
        owner: "人",
        kind: "human"
      },
      {
        id: "B",
        work: "查詢品牌與服務資料",
        owner: "Agent：客戶與計畫資料查詢員（C02）",
        kind: "agent"
      },
      {
        id: "C",
        work: "草擬社群內容",
        owner: "Agent：社群內容草擬員（C04）",
        kind: "agent"
      },
      {
        id: "D",
        work: "負責人審核",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "E",
        work: "正式發布",
        owner: "人",
        kind: "human"
      },
      {
        id: "F",
        work: "整理互動與商機紀錄",
        owner: "Agent：CRM 紀錄整理員（C05）",
        kind: "agent"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "開始",
        executor: "system",
        systemType: "start",
        next: "request"
      },
      {
        id: "request",
        name: "提出品牌內容需求",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人提出行銷需求",
        next: "brand"
      },
      {
        id: "brand",
        name: "查詢品牌與服務資料",
        executor: "agent",
        agentId: "C02",
        agentName: "客戶與計畫資料查詢員",
        instruction: "整理已核准的品牌定位、服務資訊、語氣規範與可用素材。",
        readsFrom: [],
        outputContract: [
          "已確認品牌資料",
          "服務資訊",
          "品牌語氣",
          "可使用素材",
          "資料來源",
          "待確認資訊"
        ],
        demoOutput: {
          summary: "整理示範品牌資料包。",
          basis: [
            "品牌規範",
            "素材授權清單"
          ],
          result: "【已確認品牌資料】\n享洺有限公司，企業管理顧問，2021 年成立。\n\n【服務資訊】\n企業內訓、政府計畫輔導。\n\n【品牌語氣】\n穩重務實，不用誇大詞，不承諾成效。\n\n【可使用素材】\n品牌 LOGO；圖庫 A 方案授權至 2026-09-30。\n\n【資料來源】\n品牌語氣規範、素材授權清單。\n\n【待確認資訊】\n可公開的客戶案例。"
        },
        next: "content"
      },
      {
        id: "content",
        name: "草擬社群內容",
        executor: "agent",
        agentId: "C04",
        agentName: "社群內容草擬員",
        instruction: "依主題與品牌資料撰寫貼文與短影音腳本草稿，不得自動發布或承諾優惠。",
        readsFrom: [
          "brand"
        ],
        outputContract: [
          "內容主題",
          "貼文標題",
          "貼文正文",
          "行動呼籲",
          "建議標籤",
          "引用資料",
          "需負責人確認事項"
        ],
        demoOutput: {
          summary: "依示範品牌資料草擬貼文。",
          basis: [
            "品牌資料包"
          ],
          result: "【內容主題】\n補助申請最常被退件的三個原因\n\n【貼文標題】\n不是你不符合資格，是文件沒到位\n\n【貼文正文】\n（示範內容）投保名冊與申請書員工數對不起來、經費科目與核定用途不一致、近三年受補助紀錄沒先查清楚。\n\n【行動呼籲】\n手上有計畫想申請，歡迎私訊。\n\n【建議標籤】\n#政府補助 #中小企業\n\n【引用資料】\n公開申請須知，未引用客戶個案。\n\n【需負責人確認事項】\n是否放聯絡方式。"
        },
        next: "approve"
      },
      {
        id: "approve",
        name: "負責人審核",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人審核",
        rejectTo: "content",
        next: "publish"
      },
      {
        id: "publish",
        name: "正式發布",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定發布",
        next: "record"
      },
      {
        id: "record",
        name: "整理互動與商機紀錄",
        executor: "agent",
        agentId: "C05",
        agentName: "CRM 紀錄整理員",
        instruction: "把貼文互動與衍生詢問整理成 CRM 紀錄與後續機會建議。",
        readsFrom: [
          "content"
        ],
        outputContract: [
          "內容基本資料",
          "互動摘要",
          "衍生詢問",
          "建議追蹤",
          "資料限制"
        ],
        demoOutput: {
          summary: "整理示範互動紀錄。",
          basis: [
            "已發布內容"
          ],
          result: "（本節點在人工關卡之後，示範執行不會走到這裡）"
        },
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-t01",
    code: "WF-T01",
    name: "課程設計與交付流程",
    department: "教育訓練交付部",
    focus: "課程交付",
    shape: "Chain 為主，Branch 出現在講師審核：依問題退回對應 Agent（課綱回 T01、簡報回 T02、講義回 T03、講稿回 T04）。",
    goal: "從課程需求做到可上場的教材，經講師審核後正式授課，最後整理回饋。",
    definition: "flowchart LR\n  start([\"開始\"])\n  need[\"確認課程需求與學習目標\"]\n  outline[\"設計課綱\"]\n  slides[\"草擬簡報\"]\n  handout[\"編寫講義與範例\"]\n  script[\"撰寫講師講稿\"]\n  review{\"講師審核教材\"}\n  teach[\"正式授課\"]\n  collect([\"蒐集課後回饋\"])\n  feedback[\"整理課後回饋\"]\n  improve[\"講師決定改善內容\"]\n  finish([\"流程完成\"])\n  start --> need\n  need --> outline\n  outline --> slides\n  slides --> handout\n  handout --> script\n  script --> review\n  review -->|核准| teach\n  review -->|退回修改| outline\n  teach --> collect\n  collect --> feedback\n  feedback --> improve\n  improve --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,collect,finish systemNode;\n  class outline,slides,handout,script,feedback agentNode;\n  class need,teach,improve humanNode;\n  class review decisionNode;",
    nodes: [
      {
        id: "－",
        work: "開始",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "確認課程需求與學習目標",
        owner: "人",
        kind: "human"
      },
      {
        id: "B",
        work: "設計課綱",
        owner: "Agent：課綱設計員（T01）",
        kind: "agent"
      },
      {
        id: "C",
        work: "草擬簡報",
        owner: "Agent：簡報草擬員（T02）",
        kind: "agent"
      },
      {
        id: "D",
        work: "編寫講義與範例",
        owner: "Agent：講義與範例編寫員（T03）",
        kind: "agent"
      },
      {
        id: "E",
        work: "撰寫講師講稿",
        owner: "Agent：講師講稿撰寫員（T04）",
        kind: "agent"
      },
      {
        id: "F",
        work: "講師審核教材",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "G",
        work: "正式授課",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "蒐集課後回饋",
        owner: "系統／人",
        kind: "system"
      },
      {
        id: "H",
        work: "整理課後回饋",
        owner: "Agent：課後回饋整理員（T05）",
        kind: "agent"
      },
      {
        id: "I",
        work: "講師決定改善內容",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "開始",
        executor: "system",
        systemType: "start",
        next: "need"
      },
      {
        id: "need",
        name: "確認課程需求與學習目標",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人確認課程目標",
        next: "outline"
      },
      {
        id: "outline",
        name: "設計課綱",
        executor: "agent",
        agentId: "T01",
        agentName: "課綱設計員",
        instruction: "依課程目標、對象與時數草擬課程單元與教學順序，不得承諾學習成果。",
        readsFrom: [],
        outputContract: [
          "課程目標",
          "學習對象",
          "單元架構",
          "各單元時間",
          "教學活動",
          "學習成果",
          "需講師確認"
        ],
        demoOutput: {
          summary: "依示範需求單設計課綱。",
          basis: [
            "課程需求單"
          ],
          result: "【課程目標】\n讓學員能用手邊工具處理報價整理與排程溝通。\n\n【學習對象】\n現場、行政與主管共 20 人，電腦程度不一。\n\n【單元架構】\n四單元：能與不能、報價整理、排程溝通、實作演練。\n\n【各單元時間】\n45／90／90／45 分鐘。\n\n【教學活動】\n單元二三為分組實作。\n\n【學習成果】\n完成一份自己的報價整理表。\n\n【需講師確認】\n是否提供電腦。"
        },
        next: "slides"
      },
      {
        id: "slides",
        name: "草擬簡報",
        executor: "agent",
        agentId: "T02",
        agentName: "簡報草擬員",
        instruction: "依核准課綱產出逐頁大綱與講述提示，需查證項目必須標出。",
        readsFrom: [
          "outline"
        ],
        outputContract: [
          "投影片頁次",
          "每頁標題",
          "每頁重點",
          "講述提示",
          "圖表建議",
          "需查證項目"
        ],
        demoOutput: {
          summary: "依示範課綱草擬簡報。",
          basis: [
            "課綱定稿"
          ],
          result: "【投影片頁次】\nP07 至 P12（單元二）\n\n【每頁標題】\n你現在的報價單長什麼樣／三種常見的混亂／先決定要查什麼／動手：拍照轉表格／動手：加上版本與日期／這一段你可以帶走什麼\n\n【每頁重點】\n先讓學員看自己的單，再談方法。\n\n【講述提示】\n請學員拿出手邊真實報價單。\n\n【圖表建議】\n三欄對照，不放統計數據。\n\n【需查證項目】\n無，本單元不引用外部數據。"
        },
        next: "handout"
      },
      {
        id: "handout",
        name: "編寫講義與範例",
        executor: "agent",
        agentId: "T03",
        agentName: "講義與範例編寫員",
        instruction: "編寫講義、練習題與範例檔說明，範例一律標示示範用，不得使用真實客戶資料。",
        readsFrom: [
          "outline",
          "slides"
        ],
        outputContract: [
          "講義大綱",
          "逐節說明",
          "練習題",
          "範例檔說明",
          "操作步驟",
          "常見錯誤",
          "需講師確認"
        ],
        demoOutput: {
          summary: "依示範簡報編寫講義。",
          basis: [
            "課綱定稿",
            "簡報大綱"
          ],
          result: "【講義大綱】\n單元二：把紙本報價單變成可查的表格\n\n【逐節說明】\n先決定查什麼、拍照轉文字注意事項、建立最小欄位。\n\n【練習題】\n用示範報價單建立表格，找出同品名不同單價的兩筆。\n\n【範例檔說明】\n附件 A 為虛構公司示範報價單，金額為示範資料。\n\n【操作步驟】\n一行一動作，共五步。\n\n【常見錯誤】\n拍歪、0 與 O 混淆、沒記版本日期。\n\n【需講師確認】\n附件是否改為線上試算表以便手機操作。"
        },
        next: "script"
      },
      {
        id: "script",
        name: "撰寫講師講稿",
        executor: "agent",
        agentId: "T04",
        agentName: "講師講稿撰寫員",
        instruction: "依定稿簡報產出逐段講稿與時間提示，不得代講師承諾課後服務。",
        readsFrom: [
          "slides",
          "handout"
        ],
        outputContract: [
          "開場",
          "逐段講稿",
          "每段時間",
          "轉場語",
          "互動提問",
          "結語",
          "備用內容"
        ],
        demoOutput: {
          summary: "依示範簡報撰寫講稿。",
          basis: [
            "簡報大綱",
            "講義草稿"
          ],
          result: "【開場】\n今天不講 AI 是什麼，直接從各位手上的報價單開始。\n\n【逐段講稿】\nP07：請各位拿出最近一張報價單，自己看就好。\n\n【每段時間】\nP07 8 分鐘、P08 10 分鐘、P10 25 分鐘實作。\n\n【轉場語】\n剛剛找出問題，接下來動手處理其中一個。\n\n【互動提問】\n找一份要超過三分鐘的，請舉手。\n\n【結語】\n今天帶走的不是系統，是自己做的一張表。\n\n【備用內容】\n交期延誤時怎麼回訊息的情境演練。"
        },
        next: "review"
      },
      {
        id: "review",
        name: "講師審核教材",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待講師審核",
        rejectTo: "outline",
        next: "teach"
      },
      {
        id: "teach",
        name: "正式授課",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你完成授課",
        next: "collect"
      },
      {
        id: "collect",
        name: "蒐集課後回饋",
        executor: "system",
        systemType: "data",
        next: "feedback"
      },
      {
        id: "feedback",
        name: "整理課後回饋",
        executor: "agent",
        agentId: "T05",
        agentName: "課後回饋整理員",
        instruction: "彙整問卷、提問與課堂紀錄，提出教材改善建議，不得直接修改正式教材。",
        readsFrom: [
          "script"
        ],
        outputContract: [
          "整體滿意度",
          "學員肯定事項",
          "常見問題",
          "需要改善事項",
          "建議調整方向",
          "資料限制"
        ],
        demoOutput: {
          summary: "整理示範課後回饋。",
          basis: [
            "學員問卷",
            "課堂紀錄"
          ],
          result: "（本節點在人工關卡之後，示範執行不會走到這裡）"
        },
        next: "improve"
      },
      {
        id: "improve",
        name: "講師決定改善內容",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定教材怎麼改",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-g01",
    code: "WF-G01",
    name: "政府計畫申請與執行管理流程",
    department: "政府計畫部",
    focus: "申請與核銷",
    shape: "Chain 為主，兩個 Branch：是否申請的決定，以及計畫書審核的退回。三條計畫線共用。",
    goal: "完成資格初步比對、計畫書草擬、人工送件、期限追蹤與核銷文件檢查。",
    definition: "flowchart LR\n  start([\"開始\"])\n  need[\"提出申請需求與企業資料\"]\n  eligible[\"比對計畫資格\"]\n  goNoGo[\"負責人確認是否申請\"]\n  proposal[\"草擬計畫書\"]\n  approve{\"審核計畫書、預算與承諾\"}\n  submit[\"正式送件\"]\n  monitor[\"監測期限與查核事項\"]\n  execute[\"執行計畫與準備文件\"]\n  check[\"檢查核銷文件\"]\n  accConfirm{\"會計或負責人確認\"}\n  declare[\"正式核銷申報\"]\n  finish([\"流程完成\"])\n  start --> need\n  need --> eligible\n  eligible --> goNoGo\n  goNoGo --> proposal\n  proposal --> approve\n  approve -->|核准| submit\n  approve -->|退回修改| proposal\n  submit --> monitor\n  monitor --> execute\n  execute --> check\n  check --> accConfirm\n  accConfirm -->|核准| declare\n  accConfirm -->|退回修改| check\n  declare --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class eligible,proposal,monitor,check agentNode;\n  class need,goNoGo,submit,execute,declare humanNode;\n  class approve,accConfirm decisionNode;",
    nodes: [
      {
        id: "－",
        work: "開始",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "提出申請需求與企業資料",
        owner: "人",
        kind: "human"
      },
      {
        id: "B",
        work: "比對計畫資格",
        owner: "Agent：計畫資格比對員（G01）",
        kind: "agent"
      },
      {
        id: "C",
        work: "負責人確認是否申請",
        owner: "人",
        kind: "human"
      },
      {
        id: "D",
        work: "草擬計畫書",
        owner: "Agent：計畫書草擬員（G02）",
        kind: "agent"
      },
      {
        id: "E",
        work: "審核計畫書、預算與承諾",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "F",
        work: "正式送件",
        owner: "人",
        kind: "human"
      },
      {
        id: "G",
        work: "監測期限與查核事項",
        owner: "Agent：查核與期限監測員（G03）",
        kind: "agent"
      },
      {
        id: "H",
        work: "執行計畫與準備文件",
        owner: "人",
        kind: "human"
      },
      {
        id: "I",
        work: "檢查核銷文件",
        owner: "Agent：核銷文件檢查員（G04）",
        kind: "agent"
      },
      {
        id: "J",
        work: "會計或負責人確認",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "K",
        work: "正式核銷申報",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "開始",
        executor: "system",
        systemType: "start",
        next: "need"
      },
      {
        id: "need",
        name: "提出申請需求與企業資料",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人提供企業資料",
        next: "eligible"
      },
      {
        id: "eligible",
        name: "比對計畫資格",
        executor: "agent",
        knowledge: ["icg-mfg", "icg-svc"],
        agentId: "G01",
        agentName: "計畫資格比對員",
        instruction: "比對企業條件與計畫規定，結果一律標示為初步比對，不得宣稱必然通過。",
        readsFrom: [],
        outputContract: [
          "計畫名稱與梯次",
          "可能符合項目",
          "可能不符合項目",
          "尚待確認條件",
          "必備文件缺件清單",
          "送件期限"
        ],
        demoOutput: {
          summary: "比對示範企業與 19+1 資格。",
          basis: [
            "企業基本資料",
            "申請須知"
          ],
          result: "【計畫名稱與梯次】\n製造業 19+1 AI 診斷，2026 下半年梯次（尚未公告）\n\n【可能符合項目】\n行業別為製造業；資本額與員工數落在中小企業範圍。\n\n【可能不符合項目】\n目前無明確不符合項目。\n\n【尚待確認條件】\n近三年是否受過同一補助；前年營業額未提供。\n\n【必備文件缺件清單】\n投保名冊、營業稅申報、負責人身分證明。\n\n【送件期限】\n梯次尚未公告，建議 7 月底前備齊文件。"
        },
        next: "goNoGo"
      },
      {
        id: "goNoGo",
        name: "負責人確認是否申請",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人決定是否申請",
        next: "proposal"
      },
      {
        id: "proposal",
        name: "草擬計畫書",
        executor: "agent",
        knowledge: ["icg-mfg", "icg-svc"],
        agentId: "G02",
        agentName: "計畫書草擬員",
        instruction: "依計畫規定與企業資料草擬章節與經費表初稿，未確認數字一律留白。",
        readsFrom: [
          "eligible"
        ],
        outputContract: [
          "計畫摘要",
          "現況與問題分析",
          "執行方法與工作項目",
          "預期效益與查核指標",
          "經費表初稿",
          "未確認資訊",
          "需負責人決定事項"
        ],
        demoOutput: {
          summary: "依示範資格結果草擬計畫書。",
          basis: [
            "資格比對結果",
            "訪廠紀錄"
          ],
          result: "【計畫摘要】\n協助示範企業將生產排程與品質檢驗紀錄數位化。\n\n【現況與問題分析】\n排程以白板與通訊軟體管理，檢驗紀錄事後補登。\n\n【執行方法與工作項目】\n現況盤點、方案設計、表單導入、教育訓練、成效追蹤。\n\n【預期效益與查核指標】\n交期達成率、排程調整時間、檢驗即時登錄比例。基期待補。\n\n【經費表初稿】\n（金額待核定，暫留白）\n\n【未確認資訊】\n交期延誤比例無統計；自籌款金額未確認。\n\n【需負責人決定事項】\n經費配置與自籌比例。"
        },
        next: "approve"
      },
      {
        id: "approve",
        name: "審核計畫書、預算與承諾",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人審核",
        rejectTo: "proposal",
        next: "submit"
      },
      {
        id: "submit",
        name: "正式送件",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定送件",
        next: "monitor"
      },
      {
        id: "monitor",
        name: "監測期限與查核事項",
        executor: "agent",
        knowledge: ["icg-mfg", "icg-svc"],
        agentId: "G03",
        agentName: "查核與期限監測員",
        instruction: "追蹤送件、執行、查核與核銷的重要期限，只提醒不代辦。",
        readsFrom: [
          "eligible"
        ],
        outputContract: [
          "重要期限",
          "目前狀態",
          "尚缺文件",
          "即將逾期事項",
          "需負責人處理"
        ],
        demoOutput: {
          summary: "監測示範案件的期限。",
          basis: [
            "計畫期程表"
          ],
          result: "（本節點在人工關卡之後，示範執行不會走到這裡）"
        },
        next: "execute"
      },
      {
        id: "execute",
        name: "執行計畫與準備文件",
        executor: "human",
        gateType: "input",
        waitingMessage: "等待人執行計畫並備齊文件",
        next: "check"
      },
      {
        id: "check",
        name: "檢查核銷文件",
        executor: "agent",
        knowledge: ["icg-mfg", "icg-svc"],
        agentId: "G04",
        agentName: "核銷文件檢查員",
        instruction: "檢查欄位、附件與一致性，只指出缺漏，不核准也不修改憑證。",
        readsFrom: [
          "monitor"
        ],
        outputContract: [
          "檢查日期",
          "通過項目",
          "缺漏項目",
          "不一致項目",
          "需人確認事項"
        ],
        demoOutput: {
          summary: "檢查示範核銷批次。",
          basis: [
            "核銷單據清單",
            "核定經費表"
          ],
          result: "（本節點在人工關卡之後，示範執行不會走到這裡）"
        },
        next: "accConfirm"
      },
      {
        id: "accConfirm",
        name: "會計或負責人確認",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待會計或負責人確認",
        rejectTo: "check",
        next: "declare"
      },
      {
        id: "declare",
        name: "正式核銷申報",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定申報",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-k01",
    code: "WF-K01",
    name: "知識與教材入庫流程",
    department: "知識與教材管理部",
    shape: "Chain 為主，Branch 出現在專業審核：內容需修正回 K02 或 K03，來源不足則退回補充。",
    goal: "檢查版本時效、整理成知識條目與模板，經專業審核後納入正式知識庫。",
    definition: "flowchart LR\n  start([\"提交知識或教材來源\"])\n  version[\"檢查版本與時效\"]\n  entry[\"整理知識條目\"]\n  template[\"草擬模板或檢核表\"]\n  review{\"專業人員審核\"}\n  publish[\"正式納入知識庫\"]\n  finish([\"流程完成\"])\n  start --> version\n  version --> entry\n  entry --> template\n  template --> review\n  review -->|核准| publish\n  review -->|退回修改| entry\n  publish --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class version,entry,template agentNode;\n  class publish humanNode;\n  class review decisionNode;",
    nodes: [
      {
        id: "－",
        work: "提交知識或教材來源",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "檢查版本與時效",
        owner: "Agent：版本與時效監測員（K01）",
        kind: "agent"
      },
      {
        id: "B",
        work: "整理知識條目",
        owner: "Agent：知識條目整理員（K02）",
        kind: "agent"
      },
      {
        id: "C",
        work: "草擬模板或檢核表",
        owner: "Agent：模板與檢核表草擬員（K03）",
        kind: "agent"
      },
      {
        id: "D",
        work: "專業人員審核",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "E",
        work: "正式納入知識庫",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "提交知識或教材來源",
        executor: "system",
        systemType: "start",
        next: "version"
      },
      {
        id: "version",
        name: "檢查版本與時效",
        executor: "agent",
        agentId: "K01",
        agentName: "版本與時效監測員",
        instruction: "檢查版本、日期、授權與過期狀態，只能標記可能過期，不得直接刪除。",
        readsFrom: [],
        outputContract: [
          "檢查日期",
          "已過期",
          "即將到期",
          "建議檢視",
          "狀態良好",
          "需人確認"
        ],
        demoOutput: {
          summary: "檢查示範教材清單。",
          basis: [
            "教材與文件清單"
          ],
          result: "【檢查日期】\n2026-06-27\n\n【已過期】\n19+1 申請須知摘要為 2025 年版；公司簡介英文版逾 12 個月。\n\n【即將到期】\n圖庫 A 方案 2026-09-30 到期，課程簡報使用其中 6 張圖。\n\n【建議檢視】\n核銷檢核表 v2 已逾 6 個月。\n\n【狀態良好】\n中文簡介 v3、課程簡報 v5、講義範本 v4。\n\n【需人確認】\n英文簡介重做或翻譯；圖庫是否續約。"
        },
        next: "entry"
      },
      {
        id: "entry",
        name: "整理知識條目",
        executor: "agent",
        agentId: "K02",
        agentName: "知識條目整理員",
        instruction: "整理成可搜尋、可引用的知識條目，不得改變原意或省略限制。",
        readsFrom: [
          "version"
        ],
        outputContract: [
          "知識標題",
          "內容摘要",
          "適用情境",
          "資料來源",
          "版本日期",
          "關鍵字",
          "限制與注意事項"
        ],
        demoOutput: {
          summary: "把示範素材整理成知識條目。",
          basis: [
            "版本檢查結果",
            "課後回饋彙整"
          ],
          result: "【知識標題】\n內訓附件用線上試算表，不要用需下載的檔案\n\n【內容摘要】\n三場內訓回饋都出現附件在手機打不開，造成實作中斷。\n\n【適用情境】\n學員以現場人員為主、未提供電腦的場次。\n\n【資料來源】\n2026 年三場內訓回饋彙整（去識別化）。\n\n【版本日期】\n2026-06-27\n\n【關鍵字】\n內訓、教材、附件、手機\n\n【限制與注意事項】\n樣本三場屬初步觀察；部分企業封鎖外部雲端服務。"
        },
        next: "template"
      },
      {
        id: "template",
        name: "草擬模板或檢核表",
        executor: "agent",
        agentId: "K03",
        agentName: "模板與檢核表草擬員",
        instruction: "把重複性工作整理成模板與檢核表初稿，須經專業審核才能正式使用。",
        readsFrom: [
          "entry"
        ],
        outputContract: [
          "模板名稱",
          "適用範圍",
          "使用時機",
          "高風險項目",
          "一般項目",
          "需人確認",
          "版本"
        ],
        demoOutput: {
          summary: "草擬示範核銷自檢表。",
          basis: [
            "知識條目",
            "重複性工作盤點"
          ],
          result: "【模板名稱】\n核銷送件前自檢表\n\n【適用範圍】\n19+1、服務業補助、SBIR\n\n【使用時機】\n核銷送件前逐案填寫\n\n【高風險項目】\n憑證日期在執行期間內、無重複發票、科目未超支、委外附報價與驗收單。\n\n【一般項目】\n抬頭統編、金額一致、人事費附簽收、成果照片、驗收單用印。\n\n【需人確認】\n前置作業費用可否核銷；科目認定疑義。\n\n【版本】\nv0.1，未經專業審核。"
        },
        next: "review"
      },
      {
        id: "review",
        name: "專業人員審核",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待專業審核",
        rejectTo: "entry",
        next: "publish"
      },
      {
        id: "publish",
        name: "正式納入知識庫",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定是否入庫",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    id: "wf-x01",
    code: "WF-X01",
    name: "客戶來訊處理流程",
    department: "客戶服務部",
    shape: "Chain 為主，Branch 出現在主管審核：內容需修改回 X04，資料不足回 X03。",
    goal: "把客戶來訊整理、分類、查詢並草擬回覆，最後由主管審核並由人正式送出。",
    definition: "flowchart LR\n  start([\"接收客戶來訊\"])\n  tidy[\"整理來訊\"]\n  route[\"問題分派\"]\n  lookup[\"查詢客服資料\"]\n  draft[\"草擬回覆\"]\n  approve{\"主管審核\"}\n  send[\"正式送出\"]\n  finish([\"流程完成\"])\n  start --> tidy\n  tidy --> route\n  route --> lookup\n  lookup --> draft\n  draft --> approve\n  approve -->|核准| send\n  approve -->|退回修改| draft\n  send --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class tidy,route,lookup,draft agentNode;\n  class send humanNode;\n  class approve decisionNode;",
    nodes: [
      {
        id: "－",
        work: "接收客戶來訊",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "整理來訊",
        owner: "Agent：來訊整理員（X01）",
        kind: "agent"
      },
      {
        id: "B",
        work: "問題分派",
        owner: "Agent：問題分派員（X02）",
        kind: "agent"
      },
      {
        id: "C",
        work: "查詢客服資料",
        owner: "Agent：客服資料查詢員（X03）",
        kind: "agent"
      },
      {
        id: "D",
        work: "草擬回覆",
        owner: "Agent：回覆草擬員（X04）",
        kind: "agent"
      },
      {
        id: "E",
        work: "主管審核",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "F",
        work: "正式送出",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "接收客戶來訊",
        executor: "system",
        systemType: "start",
        next: "tidy"
      },
      {
        id: "tidy",
        name: "整理來訊",
        executor: "agent",
        agentId: "X01",
        agentName: "來訊整理員",
        instruction: "把 LINE、FB、Email 與電話紀錄整理成清楚的問題摘要，不補寫客戶未提供的資訊。",
        readsFrom: [],
        outputContract: [
          "問題摘要",
          "已提供資訊",
          "缺少的必要資訊"
        ],
        demoOutput: {
          summary: "整理示範多管道來訊。",
          basis: [
            "LINE 與 Email 原始訊息"
          ],
          result: "【問題摘要】\n1. 確認 19+1 所需文件是否含投保名冊\n2. 詢問七月中出國是否影響送件時程\n\n【已提供資訊】\n客戶宏昇、聯絡人林經理、出國時間七月中（未說明確切日期）。\n\n【缺少的必要資訊】\n出國起訖日期；下半年梯次尚未公告，無法比對送件日。"
        },
        next: "route"
      },
      {
        id: "route",
        name: "問題分派",
        executor: "agent",
        agentId: "X02",
        agentName: "問題分派員",
        instruction: "判斷問題類型並分派，無法明確分類時交人處理，不得自行猜測。",
        readsFrom: [
          "tidy"
        ],
        outputContract: [
          "分類結果",
          "判斷依據",
          "需人工判斷"
        ],
        demoOutput: {
          summary: "對示範來訊分類。",
          basis: [
            "來訊摘要"
          ],
          result: "【分類結果】\n文件確認：政府計畫；出國與送件時程：政府計畫。\n\n【判斷依據】\n兩項皆涉及申請文件與送件期限。\n\n【需人工判斷】\n送件時程該項需人處理，因梯次尚未公告。"
        },
        next: "lookup"
      },
      {
        id: "lookup",
        name: "查詢客服資料",
        executor: "agent",
        agentId: "X03",
        agentName: "客服資料查詢員",
        instruction: "依問題類型查詢案件進度、合約、課程安排與已核准說法，只能查詢不得修改。",
        readsFrom: [
          "tidy",
          "route"
        ],
        outputContract: [
          "已確認資料",
          "資料來源",
          "缺少資訊",
          "是否涉及例外"
        ],
        demoOutput: {
          summary: "查詢示範案件資料。",
          basis: [
            "來訊摘要",
            "分類結果"
          ],
          result: "【已確認資料】\n宏昇 XM-2601-003 執行中，期中報告期限 07-31。必備文件含投保名冊。\n\n【資料來源】\n內部案件紀錄、19+1 公開申請須知（2025 年版）。\n\n【缺少資訊】\n2026 下半年梯次尚未公告。\n\n【是否涉及例外】\n否。"
        },
        next: "draft"
      },
      {
        id: "draft",
        name: "草擬回覆",
        executor: "agent",
        agentId: "X04",
        agentName: "回覆草擬員",
        instruction: "依問題與已確認資料撰寫供主管審核的回覆草稿，不得承諾價格、退費或交期。",
        readsFrom: [
          "tidy",
          "lookup"
        ],
        outputContract: [
          "問題摘要",
          "已確認資料",
          "回覆草稿",
          "需主管確認事項",
          "是否涉及對客承諾"
        ],
        demoOutput: {
          summary: "依示範資料草擬回覆。",
          basis: [
            "來訊摘要",
            "查詢結果"
          ],
          result: "【問題摘要】\n確認必備文件；詢問出國是否影響送件。\n\n【已確認資料】\n投保名冊為必備文件；下半年梯次尚未公告。\n\n【回覆草稿】\n林經理您好，投保名冊確實是必備文件之一，另需公司登記、最近一期營業稅申報與負責人身分證明。送件時程尚未公告，實際以主管機關公告為準，公告後我們會第一時間通知您。方便先告訴我們出國的確切日期嗎？\n\n【需主管確認事項】\n是否主動建議出國前先備齊文件，這會形成時程期待。\n\n【是否涉及對客承諾】\n否，已避開送件日期承諾。"
        },
        next: "approve"
      },
      {
        id: "approve",
        name: "主管審核",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待主管審核",
        rejectTo: "draft",
        next: "send"
      },
      {
        id: "send",
        name: "正式送出",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定送出",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    "id": "wf-q01",
    "code": "WF-Q01",
    "name": "詢價與一般訊息處理流程",
    "department": "客戶服務部",
    "focus": "詢價與一般訊息",
    "shape": "Chain 加兩個人工決策點。負責人審核可退回重寫；結案確認未通過則回到追蹤。前段五步由機器完成，送出與結案一律由人決定。",
    "goal": "把詢價與一般訊息自動建案、摘要、分類、查資料並草擬回覆，停在人工閘門；人送出後再由機器建立追蹤與結案摘要。金額、時程、承諾與是否承接全部保留給人。",
    "definition": "flowchart LR\n  start([\"收到詢價或訊息\"])\n  intake[\"建案並保存原文\"]\n  tidy[\"整理需求摘要\"]\n  route[\"分類與風險標記\"]\n  lookup[\"查詢已核准資料\"]\n  draft[\"草擬回覆\"]\n  approve{\"負責人審核\"}\n  send[\"由人正式送出\"]\n  track[\"建立追蹤事項\"]\n  close{\"負責人確認結案\"}\n  wrap[\"整理結案摘要\"]\n  finish([\"流程完成\"])\n  start --> intake\n  intake --> tidy\n  tidy --> route\n  route --> lookup\n  lookup --> draft\n  draft --> approve\n  approve -->|核准| send\n  approve -->|退回重寫| draft\n  send --> track\n  track --> close\n  close -->|結案| wrap\n  close -->|尚未結案| track\n  wrap --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,intake,track,wrap,finish systemNode;\n  class tidy,route,lookup,draft agentNode;\n  class send humanNode;\n  class approve,close decisionNode;",
    "nodes": [
      {
        "id": "－",
        "work": "收到詢價或訊息",
        "owner": "系統起點",
        "kind": "system"
      },
      {
        "id": "A",
        "work": "建案並保存原文",
        "owner": "系統",
        "kind": "system"
      },
      {
        "id": "B",
        "work": "整理需求摘要",
        "owner": "Agent：來訊整理員（X01）",
        "kind": "agent"
      },
      {
        "id": "C",
        "work": "分類與風險標記",
        "owner": "Agent：問題分派員（X02）",
        "kind": "agent"
      },
      {
        "id": "D",
        "work": "查詢已核准資料",
        "owner": "Agent：客服資料查詢員（X03）",
        "kind": "agent"
      },
      {
        "id": "E",
        "work": "草擬回覆",
        "owner": "Agent：提案與報價草擬員（C03）",
        "kind": "agent"
      },
      {
        "id": "F",
        "work": "負責人審核",
        "owner": "人（可退回重寫）",
        "kind": "decision"
      },
      {
        "id": "G",
        "work": "由人正式送出",
        "owner": "人",
        "kind": "human"
      },
      {
        "id": "H",
        "work": "建立追蹤事項",
        "owner": "系統",
        "kind": "system"
      },
      {
        "id": "I",
        "work": "負責人確認結案",
        "owner": "人（未結案則回到追蹤）",
        "kind": "decision"
      },
      {
        "id": "J",
        "work": "整理結案摘要",
        "owner": "系統",
        "kind": "system"
      },
      {
        "id": "－",
        "work": "流程完成",
        "owner": "系統終點",
        "kind": "system"
      }
    ],
    "exec": [
      {
        "id": "intake",
        "name": "建案並保存原文",
        "executor": "system",
        "systemType": "start",
        "next": "tidy"
      },
      {
        "id": "tidy",
        "name": "整理需求摘要",
        "executor": "agent",
        "agentId": "X01",
        "agentName": "來訊整理員",
        "instruction": "把原始訊息整理成需求摘要、客戶訴求、已知資料與缺少資料，不得補寫客戶未提供的資訊，不得改變原意。",
        "readsFrom": [],
        "outputContract": [
          "問題摘要",
          "客戶訴求",
          "已知資料",
          "缺少資料",
          "緊急程度"
        ],
        "demoOutput": {
          "summary": "整理示範詢價訊息。",
          "basis": [
            "原始訊息"
          ],
          "result": "【問題摘要】\\n客戶詢問三十人規模的 ISO 9001 改版內訓，想了解課程安排與費用。\\n\\n【客戶訴求】\\n希望取得課程規劃與報價。\\n\\n【已知資料】\\n人數約三十人；產業為金屬加工；希望於下季進行。\\n\\n【缺少資料】\\n上課地點、實際日期、是否需要輔導文件、預算範圍。\\n\\n【緊急程度】\\n一般，客戶未表示急迫。"
        },
        "next": "route"
      },
      {
        "id": "route",
        "name": "分類與風險標記",
        "executor": "agent",
        "agentId": "X02",
        "agentName": "問題分派員",
        "instruction": "判斷案件類型與風險等級，建議承辦部門。不得判斷客戶是否值得承接，也不得預估成交機率。",
        "readsFrom": [
          "tidy"
        ],
        "outputContract": [
          "問題類型",
          "風險等級",
          "建議承辦部門",
          "是否立即通知負責人"
        ],
        "demoOutput": {
          "summary": "對示範詢價分類並標記風險。",
          "basis": [
            "需求摘要"
          ],
          "result": "【問題類型】\\n課程與內訓諮詢，同時含詢價需求。\\n\\n【風險等級】\\nHigh。訊息中出現「費用」，屬 Level 4，金額只有負責人能決定。\\n\\n【建議承辦部門】\\n教育訓練交付部，報價由客戶開發與行銷部協同。\\n\\n【是否立即通知負責人】\\n是，因涉及報價。"
        },
        "next": "lookup"
      },
      {
        "id": "lookup",
        "name": "查詢已核准資料",
        "executor": "agent",
        "agentId": "X03",
        "agentName": "客服資料查詢員",
        "instruction": "查詢已核准且未過期的服務說明、過往合作與報價政策。只能引用通過知識治理檢查的內容，找不到可靠資料時標示資料不足，不得猜測。",
        "readsFrom": [
          "tidy",
          "route"
        ],
        "outputContract": [
          "已確認事實",
          "引用知識與版本",
          "資料矛盾",
          "缺少資料",
          "需人工確認事項"
        ],
        "demoOutput": {
          "summary": "查詢示範詢價可引用的已核准資料。",
          "basis": [
            "需求摘要",
            "分類結果"
          ],
          "result": "【已確認事實】\\n教育訓練可依學習對象、產業情境、課程目標與時數規劃；正式課綱、交付內容、費用與時程須經需求確認後另行提供。\\n\\n【引用知識與版本】\\nSERVICE-002 v1.0、POLICY-003 v1.0。\\n\\n【資料矛盾】\\n無。\\n\\n【缺少資料】\\n知識庫沒有任何課程價目，POLICY-003 明定報價須個案確認。\\n\\n【需人工確認事項】\\n本案報價區間、是否含教材與輔導文件、講師安排。"
        },
        "next": "draft"
      },
      {
        "id": "draft",
        "name": "草擬回覆",
        "executor": "agent",
        "agentId": "C03",
        "agentName": "提案與報價草擬員",
        "instruction": "依需求與已確認事實草擬回覆，列出需負責人決定的項目。不得寫入任何金額、單價、折扣、完成日期，也不得承諾一定承接或一定達成。",
        "readsFrom": [
          "tidy",
          "lookup"
        ],
        "outputContract": [
          "詢問摘要",
          "已確認事實",
          "回覆草稿",
          "建議處理方向",
          "需負責人決定",
          "引用知識與版本",
          "風險等級"
        ],
        "demoOutput": {
          "summary": "依示範資料草擬回覆，金額留空給負責人。",
          "basis": [
            "需求摘要",
            "查詢結果"
          ],
          "result": "【詢問摘要】\\n三十人規模的 ISO 9001 改版內訓，欲了解課程安排與費用。\\n\\n【已確認事實】\\n課程可依產業情境與時數規劃；費用須經需求確認後另行提供。\\n\\n【回覆草稿】\\n您好，感謝來訊。三十人規模的 ISO 9001 改版內訓我們可以規劃，課程內容會依貴公司現行文件狀況與改版重點調整。為了提供合適的規劃與報價，想先確認幾件事：預計上課日期與地點、是否需要一併協助文件改版、以及希望的總時數。收到後我們會盡快提供正式規劃給您。\\n\\n【建議處理方向】\\n先取得四項缺少資料再出正式提案，避免在資訊不足下報價。\\n\\n【需負責人決定】\\n報價金額：待負責人決定\\n是否含教材與文件輔導：待負責人決定\\n可承諾的時程：待負責人決定\\n是否承接本案：待負責人決定\\n\\n【引用知識與版本】\\nSERVICE-002 v1.0、POLICY-003 v1.0。\\n\\n【風險等級】\\nHigh，涉及報價，須負責人核准後由人送出。"
        },
        "next": "approve"
      },
      {
        "id": "approve",
        "name": "負責人審核",
        "executor": "human",
        "gateType": "review",
        "waitingMessage": "等待負責人審核，需決定服務範圍、金額、時程與是否承接",
        "rejectTo": "draft",
        "next": "send"
      },
      {
        "id": "send",
        "name": "由人正式送出",
        "executor": "human",
        "gateType": "send",
        "waitingMessage": "等你決定送出，送出後才會建立追蹤",
        "next": "track"
      },
      {
        "id": "track",
        "name": "建立追蹤事項",
        "executor": "system",
        "next": "close"
      },
      {
        "id": "close",
        "name": "負責人確認結案",
        "executor": "human",
        "gateType": "review",
        "waitingMessage": "等待負責人確認是否結案",
        "rejectTo": "track",
        "next": "wrap"
      },
      {
        "id": "wrap",
        "name": "整理結案摘要",
        "executor": "system",
        "next": "finish"
      },
      {
        "id": "finish",
        "name": "流程完成",
        "executor": "system",
        "systemType": "end"
      }
    ]
  },
  {
    id: "wf-o01",
    code: "WF-O01",
    name: "營運與財務檢視流程",
    department: "營運與財務管理部",
    shape: "Chain 為主，Branch 出現在確認關卡：資料或憑證不完整回 O02 或 O04。",
    goal: "整理待辦與帳務、監測期限與異常、檢查憑證完整性，交由人確認並執行正式財務動作。",
    definition: "flowchart LR\n  start([\"收集營運與財務資料\"])\n  todo[\"整理待辦\"]\n  books[\"整理帳務資料\"]\n  anomaly[\"監測期限與異常\"]\n  voucher[\"檢查憑證完整性\"]\n  confirm{\"負責人或會計確認\"}\n  execute[\"執行付款、請款、申報或歸檔\"]\n  finish([\"流程完成\"])\n  start --> todo\n  todo --> books\n  books --> anomaly\n  anomaly --> voucher\n  voucher --> confirm\n  confirm -->|核准| execute\n  confirm -->|退回修改| books\n  execute --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class todo,books,anomaly,voucher agentNode;\n  class execute humanNode;\n  class confirm decisionNode;",
    nodes: [
      {
        id: "－",
        work: "收集營運與財務資料",
        owner: "系統起點",
        kind: "system"
      },
      {
        id: "A",
        work: "整理待辦",
        owner: "Agent：待辦整理員（O01）",
        kind: "agent"
      },
      {
        id: "B",
        work: "整理帳務資料",
        owner: "Agent：帳務資料整理員（O02）",
        kind: "agent"
      },
      {
        id: "C",
        work: "監測期限與異常",
        owner: "Agent：期限與異常監測員（O03）",
        kind: "agent"
      },
      {
        id: "D",
        work: "檢查憑證完整性",
        owner: "Agent：憑證完整性檢查員（O04）",
        kind: "agent"
      },
      {
        id: "E",
        work: "負責人或會計確認",
        owner: "人（判斷節點）",
        kind: "decision"
      },
      {
        id: "F",
        work: "執行付款、請款、申報或歸檔",
        owner: "人",
        kind: "human"
      },
      {
        id: "－",
        work: "流程完成",
        owner: "系統終點",
        kind: "system"
      }
    ],
    exec: [
      {
        id: "start",
        name: "收集營運與財務資料",
        executor: "system",
        systemType: "start",
        next: "todo"
      },
      {
        id: "todo",
        name: "整理待辦",
        executor: "agent",
        agentId: "O01",
        agentName: "待辦整理員",
        instruction: "把郵件、會議與各案事項整理成責任人、期限與待辦清單，排序僅為建議。",
        readsFrom: [],
        outputContract: [
          "高優先待辦",
          "一般待辦",
          "可延後事項",
          "負責人待確認",
          "期限待確認"
        ],
        demoOutput: {
          summary: "整理示範本週待辦。",
          basis: [
            "郵件與會議紀錄"
          ],
          result: "【高優先待辦】\n鼎新 SBIR 補件（07-08，剩 12 天，尚未開始）；樂沐核銷彙整（07-15，完成 60%）；回覆永盛提案調整。\n\n【一般待辦】\n宏昇診斷方向、提供五月傳票、宏昇期中報告。\n\n【可延後事項】\n英文簡介重做、圖庫續約評估。\n\n【負責人待確認】\n永盛提案涉及服務範圍與付款條件變更。\n\n【期限待確認】\n會計師未給明確期限。"
        },
        next: "books"
      },
      {
        id: "books",
        name: "整理帳務資料",
        executor: "agent",
        agentId: "O02",
        agentName: "帳務資料整理員",
        instruction: "彙整收入、支出、應收款、請款與各案帳務，不得執行付款或入帳。",
        readsFrom: [
          "todo"
        ],
        outputContract: [
          "本期收入",
          "本期支出",
          "應收款",
          "專案帳務",
          "缺少資料",
          "需人確認"
        ],
        demoOutput: {
          summary: "整理示範本月帳務。",
          basis: [
            "收支明細"
          ],
          result: "【本期收入】\n已入帳 256,000，應收 150,000。\n\n【本期支出】\n40,150，全部具備憑證。\n\n【應收款】\n宏昇 150,000，收款日 06-30，尚未逾期。\n\n【專案帳務】\n宏昇合約 300,000，已請款一半；樂沐已全數入帳但核銷未完成。\n\n【缺少資料】\n6 月講師費尚未請款。\n\n【需人確認】\n講師費請款金額與時點。"
        },
        next: "anomaly"
      },
      {
        id: "anomaly",
        name: "監測期限與異常",
        executor: "agent",
        agentId: "O03",
        agentName: "期限與異常監測員",
        instruction: "依既有規則標示期限與異常，無明確規則者標示需人判斷。",
        readsFrom: [
          "books"
        ],
        outputContract: [
          "異常項目",
          "觸發規則",
          "相關資料",
          "可能影響",
          "建議由人確認事項"
        ],
        demoOutput: {
          summary: "監測示範帳務異常。",
          basis: [
            "帳務摘要",
            "期限清單"
          ],
          result: "【異常項目】\n發票 AB12345690 重複出現；6 月交通住宿為月均 2.4 倍；樂沐核銷完成度 60%；鼎新補件尚未開始。\n\n【觸發規則】\n重複紀錄、單筆超過科目月均 2 倍、文件缺漏、里程碑逾期風險。\n\n【相關資料】\n樂沐核銷批次一、6 月支出明細。\n\n【可能影響】\n重複請領可能導致退件甚至追回；補件逾期影響審查。\n\n【建議由人確認事項】\n發票是否誤植；交通增加是否因訪廠次數增加。"
        },
        next: "voucher"
      },
      {
        id: "voucher",
        name: "檢查憑證完整性",
        executor: "agent",
        agentId: "O04",
        agentName: "憑證完整性檢查員",
        instruction: "檢查必要欄位與附件，只指出缺漏，不認定合法性也不核准付款。",
        readsFrom: [
          "books",
          "anomaly"
        ],
        outputContract: [
          "檢查日期",
          "通過項目",
          "缺漏項目",
          "不一致項目",
          "需人確認事項"
        ],
        demoOutput: {
          summary: "檢查示範憑證。",
          basis: [
            "憑證清單"
          ],
          result: "【檢查日期】\n2026-06-27\n\n【通過項目】\n圖庫年費、記帳費欄位齊全並附件。\n\n【缺漏項目】\n交通住宿缺出差事由；委任顧問費收據無簽收；講師費缺簽到表。\n\n【不一致項目】\n講師費日期 02-28 早於計畫執行起日 03-01。\n\n【需人確認事項】\n講師費是否用於計畫核銷；若是須先確認可否認列。"
        },
        next: "confirm"
      },
      {
        id: "confirm",
        name: "負責人或會計確認",
        executor: "human",
        gateType: "review",
        waitingMessage: "等待負責人或會計確認",
        rejectTo: "books",
        next: "execute"
      },
      {
        id: "execute",
        name: "執行付款、請款、申報或歸檔",
        executor: "human",
        gateType: "send",
        waitingMessage: "等你決定執行",
        next: "finish"
      },
      {
        id: "finish",
        name: "流程完成",
        executor: "system",
        systemType: "end"
      }
    ]
  },
  {
    "id": "wf-i01",
    "code": "WF-I01",
    "name": "ISO 改版導入流程",
    "department": "制度與認證輔導部",
    "shape": "Chain 為主，Branch 出現在負責人審核：文件需調整回 I02，差距判斷有疑義回 I01。",
    "goal": "把標準改版要求轉成可運行的文件與流程，並完成查證前的準備。",
    "exec": [
      {
        "id": "start",
        "name": "開始",
        "executor": "system",
        "systemType": "start",
        "next": "intake"
      },
      {
        "id": "intake",
        "name": "提供現行文件與標準版本",
        "executor": "human",
        "gateType": "input",
        "waitingMessage": "等待人提供客戶現行文件清單與適用標準版本",
        "next": "gap"
      },
      {
        "id": "gap",
        "name": "比對條文差距",
        "executor": "agent",
        "agentId": "I01",
        "agentName": "條文差距比對員",
        "instruction": "逐條比對新舊版標準與現行文件，列出差距、受影響文件與風險初判，不判定是否符合標準。",
        "readsFrom": [],
        "outputContract": [
          "標準與版本",
          "逐條差距",
          "受影響文件",
          "風險等級初判",
          "需人確認事項"
        ],
        "demoOutput": {
          "summary": "比對示範客戶的現行文件與新版標準。",
          "basis": [
            "示範文件清單"
          ],
          "result": "【標準與版本】\nISO9001，現行文件為 2015 版架構。\n\n【逐條差距】\n風險與機會的鑑別未留下紀錄；變更管理缺少審查證據；供應商評鑑準則未文件化。\n\n【受影響文件】\n品質手冊、採購程序書、變更管理程序書共 3 份。\n\n【風險等級初判】\n變更管理為高，其餘為中。\n\n【需人確認事項】\n客戶是否已有未文件化的既有做法可直接轉為紀錄。"
        },
        "next": "draft"
      },
      {
        "id": "draft",
        "name": "草擬文件與流程調整",
        "executor": "agent",
        "agentId": "I02",
        "agentName": "文件精簡與流程草擬員",
        "instruction": "依差距結果草擬程序書與表單調整建議，標出可合併或刪除的冗餘文件，不得直接刪除客戶文件。",
        "readsFrom": [
          "gap"
        ],
        "outputContract": [
          "建議保留文件",
          "建議合併文件",
          "建議刪除文件",
          "流程調整草案",
          "需人決定事項"
        ],
        "demoOutput": {
          "summary": "依差距草擬文件調整方案。",
          "basis": [
            "條文差距比對員的產出"
          ],
          "result": "【建議保留文件】\n品質手冊、採購程序書。\n\n【建議合併文件】\n三份表單合併為一份變更申請單。\n\n【建議刪除文件】\n兩份無人填寫且無條文要求的月報表，需人確認後才可刪。\n\n【流程調整草案】\n變更管理加入審查與核准兩個必要欄位。\n\n【需人決定事項】\n權責分工由誰核准變更。"
        },
        "next": "review"
      },
      {
        "id": "review",
        "name": "負責人審核文件草案",
        "executor": "human",
        "gateType": "review",
        "waitingMessage": "等待負責人審核文件與流程草案",
        "rejectTo": "draft",
        "next": "teach"
      },
      {
        "id": "teach",
        "name": "編寫內稽教材",
        "executor": "agent",
        "agentId": "I03",
        "agentName": "內稽教材與題庫草擬員",
        "instruction": "依調整後的文件草擬內部稽核員訓練教材、模擬情境與查檢表題庫。",
        "readsFrom": [
          "draft"
        ],
        "outputContract": [
          "教材大綱",
          "模擬稽核情境",
          "查檢表題庫",
          "時間分配",
          "待補內容"
        ],
        "demoOutput": {
          "summary": "產出內稽訓練教材初稿。",
          "basis": [
            "文件精簡與流程草擬員的產出"
          ],
          "result": "【教材大綱】\n稽核概念、稽核計畫、現場技巧、報告撰寫共四單元。\n\n【模擬稽核情境】\n變更管理未留審查紀錄的情境一則。\n\n【查檢表題庫】\n對應三份受影響文件共 18 題。\n\n【時間分配】\n合計 6 小時。\n\n【待補內容】\n客戶實際發生過的不符合案例。"
        },
        "next": "precheck"
      },
      {
        "id": "precheck",
        "name": "檢查查證準備",
        "executor": "agent",
        "agentId": "I04",
        "agentName": "查證準備檢查員",
        "instruction": "檢查查證前的文件、紀錄與矯正措施是否齊全，只指出缺漏，不預告查證結果。",
        "readsFrom": [
          "draft",
          "teach"
        ],
        "outputContract": [
          "檢查日期",
          "齊全項目",
          "缺漏項目",
          "不一致項目",
          "需人確認事項"
        ],
        "demoOutput": {
          "summary": "查證前的完整性檢查。",
          "basis": [
            "文件草案",
            "內稽教材"
          ],
          "result": "【檢查日期】\n示範日期\n\n【齊全項目】\n品質手冊、採購程序書皆為現行版。\n\n【缺漏項目】\n管理審查紀錄僅有一次，未涵蓋完整週期。\n\n【不一致項目】\n變更管理程序書版次與表單版次不一致。\n\n【需人確認事項】\n是否補辦一次管理審查。"
        },
        "next": "sign"
      },
      {
        "id": "sign",
        "name": "簽署發行與面對查證",
        "executor": "human",
        "gateType": "send",
        "waitingMessage": "等待負責人簽署文件版次並面對外部查證",
        "next": "finish"
      },
      {
        "id": "finish",
        "name": "流程完成",
        "executor": "system",
        "systemType": "end"
      }
    ],
    "definition": "flowchart LR\n  start([\"開始\"])\n  intake[\"提供現行文件與標準版本\"]\n  gap[\"比對條文差距\"]\n  draft[\"草擬文件與流程調整\"]\n  review{\"負責人審核文件草案\"}\n  teach[\"編寫內稽教材\"]\n  precheck[\"檢查查證準備\"]\n  sign[\"簽署發行與面對查證\"]\n  finish([\"流程完成\"])\n  start --> intake\n  intake --> gap\n  gap --> draft\n  draft --> review\n  review -->|核准| teach\n  review -->|退回修改| draft\n  teach --> precheck\n  precheck --> sign\n  sign --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class gap,draft,teach,precheck agentNode;\n  class intake,sign humanNode;\n  class review decisionNode;",
    "nodes": [
      {
        "id": "－",
        "work": "開始",
        "owner": "系統起點",
        "kind": "system"
      },
      {
        "id": "A",
        "work": "提供現行文件與標準版本",
        "owner": "人",
        "kind": "human"
      },
      {
        "id": "B",
        "work": "比對條文差距",
        "owner": "Agent：條文差距比對員（I01）",
        "kind": "agent"
      },
      {
        "id": "C",
        "work": "草擬文件與流程調整",
        "owner": "Agent：文件精簡與流程草擬員（I02）",
        "kind": "agent"
      },
      {
        "id": "D",
        "work": "負責人審核文件草案",
        "owner": "人（判斷節點）",
        "kind": "decision"
      },
      {
        "id": "E",
        "work": "編寫內稽教材",
        "owner": "Agent：內稽教材與題庫草擬員（I03）",
        "kind": "agent"
      },
      {
        "id": "F",
        "work": "檢查查證準備",
        "owner": "Agent：查證準備檢查員（I04）",
        "kind": "agent"
      },
      {
        "id": "G",
        "work": "簽署發行與面對查證",
        "owner": "人",
        "kind": "human"
      },
      {
        "id": "－",
        "work": "流程完成",
        "owner": "系統終點",
        "kind": "system"
      }
    ]
  },
  {
    "id": "wf-e01",
    "code": "WF-E01",
    "name": "溫室氣體盤查與報告流程",
    "department": "永續與碳管理部",
    "shape": "Chain 為主，Branch 出現在負責人確認數據：數據不足回 E02，計算有疑點回 E03。",
    "goal": "從盤查邊界到報告書架構完成資料整理與檢查，數據真實性與對外揭露由人負責。",
    "exec": [
      {
        "id": "start",
        "name": "開始",
        "executor": "system",
        "systemType": "start",
        "next": "scopeIn"
      },
      {
        "id": "scopeIn",
        "name": "提供組織資料與盤查目的",
        "executor": "human",
        "gateType": "input",
        "waitingMessage": "等待人提供組織範圍、據點清單與適用準則",
        "next": "boundary"
      },
      {
        "id": "boundary",
        "name": "整理盤查邊界與範疇",
        "executor": "agent",
        "agentId": "E01",
        "agentName": "盤查邊界與範疇整理員",
        "instruction": "整理組織邊界、營運邊界與範疇一二三的涵蓋項目，尚未界定者一律標出，不代為決定邊界。",
        "readsFrom": [],
        "outputContract": [
          "組織邊界",
          "營運邊界",
          "範疇一項目",
          "範疇二項目",
          "範疇三項目",
          "尚未界定"
        ],
        "demoOutput": {
          "summary": "整理示範組織的盤查邊界。",
          "basis": [
            "示範據點清單"
          ],
          "result": "【組織邊界】\n採營運控制權法，涵蓋總公司與一處廠區。\n\n【營運邊界】\n固定燃燒、外購電力、員工通勤。\n\n【範疇一項目】\n鍋爐天然氣、公務車汽油、冷媒逸散。\n\n【範疇二項目】\n外購電力。\n\n【範疇三項目】\n員工通勤、商務旅運，其餘尚未納入。\n\n【尚未界定】\n租賃倉庫是否納入營運控制權範圍。"
        },
        "next": "datalist"
      },
      {
        "id": "datalist",
        "name": "草擬活動數據清單",
        "executor": "agent",
        "agentId": "E02",
        "agentName": "活動數據清單草擬員",
        "instruction": "依邊界產出應蒐集的活動數據清單、資料來源與負責單位建議，缺漏留白不得代填。",
        "readsFrom": [
          "boundary"
        ],
        "outputContract": [
          "應蒐集數據",
          "資料來源",
          "建議負責單位",
          "蒐集期間",
          "目前缺漏"
        ],
        "demoOutput": {
          "summary": "列出應蒐集的活動數據。",
          "basis": [
            "盤查邊界與範疇整理員的產出"
          ],
          "result": "【應蒐集數據】\n天然氣用量、汽油加油紀錄、冷媒補充量、電費單、通勤問卷。\n\n【資料來源】\n瓦斯帳單、加油卡月報、設備維修單、台電帳單、人資調查。\n\n【建議負責單位】\n總務、車輛管理、設備、財務、人資。\n\n【蒐集期間】\n完整一個曆年。\n\n【目前缺漏】\n冷媒補充量無紀錄，需向維修廠商調閱。"
        },
        "next": "calc"
      },
      {
        "id": "calc",
        "name": "檢查排放量試算",
        "executor": "agent",
        "agentId": "E03",
        "agentName": "排放量試算檢查員",
        "instruction": "檢查單位、係數版本、加總一致性與異常值，只指出疑點，不出具排放量結論。",
        "readsFrom": [
          "datalist"
        ],
        "outputContract": [
          "檢查日期",
          "單位與係數檢查",
          "加總一致性",
          "異常值",
          "需人確認事項"
        ],
        "demoOutput": {
          "summary": "檢查試算結果的一致性。",
          "basis": [
            "活動數據清單草擬員的產出"
          ],
          "result": "【檢查日期】\n示範日期\n\n【單位與係數檢查】\n電力係數未標註年度版本。\n\n【加總一致性】\n三個範疇加總與總量相符。\n\n【異常值】\n第三季天然氣用量為其他季的 3.2 倍。\n\n【需人確認事項】\n第三季是否有特殊生產活動；電力係數採用哪一年度公告值。"
        },
        "next": "confirm"
      },
      {
        "id": "confirm",
        "name": "負責人確認數據與係數",
        "executor": "human",
        "gateType": "review",
        "waitingMessage": "等待負責人確認活動數據真實性與係數選用",
        "rejectTo": "datalist",
        "next": "report"
      },
      {
        "id": "report",
        "name": "草擬報告書架構",
        "executor": "agent",
        "agentId": "E04",
        "agentName": "報告書與揭露架構草擬員",
        "instruction": "依適用準則草擬章節架構與揭露項目對照表，不得撰寫減碳承諾。",
        "readsFrom": [
          "boundary",
          "calc"
        ],
        "outputContract": [
          "適用準則",
          "章節架構",
          "揭露項目對照",
          "待補內容",
          "需人決定事項"
        ],
        "demoOutput": {
          "summary": "草擬報告書架構。",
          "basis": [
            "盤查邊界",
            "試算檢查結果"
          ],
          "result": "【適用準則】\nISO 14064-1:2018。\n\n【章節架構】\n組織描述、邊界、量化方法、排放量、不確定性、改善機會共六章。\n\n【揭露項目對照】\n逐條對應準則要求，目前 4 項待補。\n\n【待補內容】\n不確定性評估、基準年設定理由。\n\n【需人決定事項】\n是否設定減碳目標並對外揭露，此項不得由 AI 草擬。"
        },
        "next": "declare"
      },
      {
        "id": "declare",
        "name": "簽署聲明與面對查證",
        "executor": "human",
        "gateType": "send",
        "waitingMessage": "等待負責人簽署聲明並面對外部查證",
        "next": "finish"
      },
      {
        "id": "finish",
        "name": "流程完成",
        "executor": "system",
        "systemType": "end"
      }
    ],
    "definition": "flowchart LR\n  start([\"開始\"])\n  scopeIn[\"提供組織資料與盤查目的\"]\n  boundary[\"整理盤查邊界與範疇\"]\n  datalist[\"草擬活動數據清單\"]\n  calc[\"檢查排放量試算\"]\n  confirm{\"負責人確認數據與係數\"}\n  report[\"草擬報告書架構\"]\n  declare[\"簽署聲明與面對查證\"]\n  finish([\"流程完成\"])\n  start --> scopeIn\n  scopeIn --> boundary\n  boundary --> datalist\n  datalist --> calc\n  calc --> confirm\n  confirm -->|核准| report\n  confirm -->|退回修改| datalist\n  report --> declare\n  declare --> finish\n  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;\n  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;\n  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;\n  classDef decisionNode fill:#372C27,stroke:#F7B729,color:#FFFFFF,stroke-width:3px;\n  class start,finish systemNode;\n  class boundary,datalist,calc,report agentNode;\n  class scopeIn,declare humanNode;\n  class confirm decisionNode;",
    "nodes": [
      {
        "id": "－",
        "work": "開始",
        "owner": "系統起點",
        "kind": "system"
      },
      {
        "id": "A",
        "work": "提供組織資料與盤查目的",
        "owner": "人",
        "kind": "human"
      },
      {
        "id": "B",
        "work": "整理盤查邊界與範疇",
        "owner": "Agent：盤查邊界與範疇整理員（E01）",
        "kind": "agent"
      },
      {
        "id": "C",
        "work": "草擬活動數據清單",
        "owner": "Agent：活動數據清單草擬員（E02）",
        "kind": "agent"
      },
      {
        "id": "D",
        "work": "檢查排放量試算",
        "owner": "Agent：排放量試算檢查員（E03）",
        "kind": "agent"
      },
      {
        "id": "E",
        "work": "負責人確認數據與係數",
        "owner": "人（判斷節點）",
        "kind": "decision"
      },
      {
        "id": "F",
        "work": "草擬報告書架構",
        "owner": "Agent：報告書與揭露架構草擬員（E04）",
        "kind": "agent"
      },
      {
        "id": "G",
        "work": "簽署聲明與面對查證",
        "owner": "人",
        "kind": "human"
      },
      {
        "id": "－",
        "work": "流程完成",
        "owner": "系統終點",
        "kind": "system"
      }
    ]
  }
]
