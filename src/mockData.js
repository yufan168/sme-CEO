// Agent 示範資料（Mock Data）。
// 用途：AI 員工頁的情境範例、Workflow 示範模式的備援輸出、測試與課堂展示。
//
// 隔離規則（由 normalizeMock() 強制寫進每一筆資料，不靠檔頭一句聲明）：
//   mode: 'demo'              永遠是示範模式
//   isFictional: true         全部虛構，不代表真實客戶、金額或承諾
//   companyData: false        不是享洺的公司資料
//   canSendExternally: false  不得對外送出
//   allowKnowledgeRetrieval: false  不得進入正式知識檢索
// 這五個旗標寫在每一筆上，離開這個檔案也認得出來。

export const MOCK_LABEL = '【示範資料，非享洺真實數據】'

export const mockNote =
  '每位 Agent 三筆示範情境。輸入情境可作為節點輸入，預期輸出可作為示範內容或驗收依據。資料均為虛構，不代表真實客戶、金額或承諾。'

export const mockIsolationNote =
  '示範資料不得進入正式知識檢索、不得寫回 CRM 或財務、不得出現在正式營運數字、不得對外送出。示範模式與真實模式不得混用。'

// 每一筆都強制帶上隔離旗標，並在每個情境前加註示範標記。
function normalizeMock(row) {
  return {
    ...row,
    mode: 'demo',
    isFictional: true,
    companyData: false,
    canSendExternally: false,
    allowKnowledgeRetrieval: false,
    cases: row.cases.map((item) => ({
      ...item,
      label: MOCK_LABEL,
      input: item.input.startsWith(MOCK_LABEL) ? item.input : MOCK_LABEL + item.input,
      output: item.output.startsWith(MOCK_LABEL) ? item.output : MOCK_LABEL + item.output,
    })),
  }
}

export const mockSourceNote =
  '標示為負責人提供者來自上傳的知識庫檔案，逐字收錄未經改寫；標示為系統補寫者為制度與認證輔導部、永續與碳管理部兩個新部門依同一格式補齊，內容待負責人確認。'

const rawMockData = [
  {
    "agentId": "S01",
    "agentName": "經營資料整理員",
    "dept": "經營策略與決策部",
    "source": "provided",
    "cases": [
      {
        "id": "S01-001",
        "title": "月營運摘要",
        "input": "本月營收 420,000 元、完成 6 案、在談 4 案。",
        "output": "整理出營收、案件數、成交率與主要風險摘要。"
      },
      {
        "id": "S01-002",
        "title": "客戶結構盤點",
        "input": "企業客戶 8 家、政府計畫客戶 3 家、教育訓練客戶 5 家。",
        "output": "依客戶類型整理占比與集中度。"
      },
      {
        "id": "S01-003",
        "title": "專案負荷盤點",
        "input": "目前同時執行 7 個專案，其中 2 個延遲。",
        "output": "列出專案負荷、延遲原因與待主管確認事項。"
      }
    ]
  },
  {
    "agentId": "S02",
    "agentName": "方案比較分析員",
    "dept": "經營策略與決策部",
    "source": "provided",
    "cases": [
      {
        "id": "S02-001",
        "title": "新增課程方案比較",
        "input": "比較實體班、線上班、企業內訓三種模式。",
        "output": "整理成本、效益、風險與所需資源。"
      },
      {
        "id": "S02-002",
        "title": "CRM 工具方案比較",
        "input": "比較 Notion、HubSpot、Zoho CRM。",
        "output": "產出功能、費用、導入難度與適配性表格。"
      },
      {
        "id": "S02-003",
        "title": "擴編方案比較",
        "input": "比較聘正職、兼職、外包三種人力方式。",
        "output": "列出現金流壓力、彈性與管理成本。"
      }
    ]
  },
  {
    "agentId": "C01",
    "agentName": "商機分類員",
    "dept": "客戶開發與行銷部",
    "source": "provided",
    "cases": [
      {
        "id": "C01-001",
        "title": "教育訓練商機",
        "input": "客戶詢問 AI 工作坊與 ESG 內訓。",
        "output": "分類為教育訓練商機，標記需安排需求訪談。"
      },
      {
        "id": "C01-002",
        "title": "政府計畫商機",
        "input": "客戶詢問 SBTR 補助申請。",
        "output": "分類為政府計畫商機，轉交政府計畫流程。"
      },
      {
        "id": "C01-003",
        "title": "顧問案商機",
        "input": "客戶希望改善內部流程與 KPI。",
        "output": "分類為企業顧問商機，標記中高優先。"
      }
    ]
  },
  {
    "agentId": "C02",
    "agentName": "客戶與計畫資料查詢員",
    "dept": "客戶開發與行銷部",
    "source": "provided",
    "cases": [
      {
        "id": "C02-001",
        "title": "客戶背景查詢",
        "input": "查詢某製造業公司公開資訊與過往接觸紀錄。",
        "output": "整理產業、規模、主要需求與既有互動。"
      },
      {
        "id": "C02-002",
        "title": "政府計畫資料查詢",
        "input": "查詢數位轉型補助資格與截止日。",
        "output": "整理申請條件、截止日、必備文件與資料來源。"
      },
      {
        "id": "C02-003",
        "title": "合作紀錄查詢",
        "input": "查詢某客戶過去報價與會議紀錄。",
        "output": "彙整歷史提案、價格區間與未完成事項。"
      }
    ]
  },
  {
    "agentId": "C03",
    "agentName": "提案與報價草擬員",
    "dept": "客戶開發與行銷部",
    "source": "provided",
    "cases": [
      {
        "id": "C03-001",
        "title": "企業內訓提案",
        "input": "需求為 6 小時 AI 管理課程。",
        "output": "草擬課程目標、模組、交付內容與報價欄位。"
      },
      {
        "id": "C03-002",
        "title": "顧問專案提案",
        "input": "需求為流程優化與 KPI 建置。",
        "output": "草擬專案範圍、里程碑、交付物與時程。"
      },
      {
        "id": "C03-003",
        "title": "政府計畫輔導提案",
        "input": "需求為申請文件與簡報輔導。",
        "output": "草擬服務內容、次數、責任邊界與費用欄位。"
      }
    ]
  },
  {
    "agentId": "C04",
    "agentName": "社群內容草擬員",
    "dept": "客戶開發與行銷部",
    "source": "provided",
    "cases": [
      {
        "id": "C04-001",
        "title": "AI 管理貼文",
        "input": "主題為小企業如何導入 AI。",
        "output": "產出標題、貼文正文、CTA 與標籤。"
      },
      {
        "id": "C04-002",
        "title": "ESG 課程宣傳",
        "input": "宣傳下一期 ESG 實務班。",
        "output": "草擬課程亮點、適合對象與報名引導。"
      },
      {
        "id": "C04-003",
        "title": "案例分享貼文",
        "input": "分享顧問案前後改善成果。",
        "output": "產出不揭露客戶機密的案例型貼文。"
      }
    ]
  },
  {
    "agentId": "C05",
    "agentName": "CRM 紀錄整理員",
    "dept": "客戶開發與行銷部",
    "source": "provided",
    "cases": [
      {
        "id": "C05-001",
        "title": "首次接觸紀錄",
        "input": "客戶來電詢問企業內訓。",
        "output": "建立需求摘要、聯絡人、下一步與追蹤日。"
      },
      {
        "id": "C05-002",
        "title": "提案後追蹤",
        "input": "提案已寄出，等待主管確認。",
        "output": "更新商機階段、風險與追蹤提醒。"
      },
      {
        "id": "C05-003",
        "title": "成交紀錄",
        "input": "客戶確認合作並約定啟動會議。",
        "output": "更新成交狀態、金額、啟動日期與責任人。"
      }
    ]
  },
  {
    "agentId": "T01",
    "agentName": "課綱設計員",
    "dept": "教育訓練交付部",
    "source": "provided",
    "cases": [
      {
        "id": "T01-001",
        "title": "AI 管理課綱",
        "input": "對象為中小企業主管，時數 6 小時。",
        "output": "設計 4 單元、學習目標與時間配置。"
      },
      {
        "id": "T01-002",
        "title": "ESG 入門課綱",
        "input": "對象為一般員工，時數 3 小時。",
        "output": "設計概念、案例、活動與測驗。"
      },
      {
        "id": "T01-003",
        "title": "行銷策略課綱",
        "input": "對象為創業者，時數 4 小時。",
        "output": "設計定位、客群、內容與行動計畫。"
      }
    ]
  },
  {
    "agentId": "T02",
    "agentName": "簡報草擬員",
    "dept": "教育訓練交付部",
    "source": "provided",
    "cases": [
      {
        "id": "T02-001",
        "title": "AI 課程簡報",
        "input": "依核准課綱產出 30 頁簡報架構。",
        "output": "列出每頁標題、重點與講者提示。"
      },
      {
        "id": "T02-002",
        "title": "ESG 課程簡報",
        "input": "將 ESG 概念轉成案例式教材。",
        "output": "產出章節、圖表建議與練習頁。"
      },
      {
        "id": "T02-003",
        "title": "行銷工作坊簡報",
        "input": "加入分組活動與實作步驟。",
        "output": "產出活動流程、範例與成果頁。"
      }
    ]
  },
  {
    "agentId": "T03",
    "agentName": "講義與範例編寫員",
    "dept": "教育訓練交付部",
    "source": "provided",
    "cases": [
      {
        "id": "T03-001",
        "title": "AI 導入講義",
        "input": "撰寫 AI 導入檢核表與案例。",
        "output": "產出講義初稿與 2 個練習。"
      },
      {
        "id": "T03-002",
        "title": "ESG 案例講義",
        "input": "整理碳管理與利害關係人案例。",
        "output": "產出案例摘要、討論題與解答重點。"
      },
      {
        "id": "T03-003",
        "title": "行銷 persona 範例",
        "input": "建立顧客人物誌範本。",
        "output": "產出可直接填寫的範例與空白模板。"
      }
    ]
  },
  {
    "agentId": "T04",
    "agentName": "講師講稿撰寫員",
    "dept": "教育訓練交付部",
    "source": "provided",
    "cases": [
      {
        "id": "T04-001",
        "title": "AI 管理講稿",
        "input": "依簡報撰寫每頁講解重點。",
        "output": "產出逐頁講稿與提問提示。"
      },
      {
        "id": "T04-002",
        "title": "ESG 課程講稿",
        "input": "補充概念比喻與企業案例。",
        "output": "產出講解順序與轉場語。"
      },
      {
        "id": "T04-003",
        "title": "工作坊引導稿",
        "input": "設計分組活動的主持話術。",
        "output": "產出開場、時間提醒與收斂問題。"
      }
    ]
  },
  {
    "agentId": "T05",
    "agentName": "課後回饋整理員",
    "dept": "教育訓練交付部",
    "source": "provided",
    "cases": [
      {
        "id": "T05-001",
        "title": "AI 課程回饋",
        "input": "收集 28 份問卷。",
        "output": "整理滿意度、常見問題與改善建議。"
      },
      {
        "id": "T05-002",
        "title": "ESG 課程回饋",
        "input": "學員反映案例偏少。",
        "output": "彙整正負面意見與新增案例建議。"
      },
      {
        "id": "T05-003",
        "title": "企業內訓回饋",
        "input": "主管希望增加實作時間。",
        "output": "整理需求並提出下次調整方向。"
      }
    ]
  },
  {
    "agentId": "G01",
    "agentName": "計畫資格比對員",
    "dept": "政府計畫部",
    "source": "provided",
    "cases": [
      {
        "id": "G01-001",
        "title": "SBTR 資格初判",
        "input": "企業成立 3 年、員工 8 人。",
        "output": "列出符合條件、待確認條件與風險。"
      },
      {
        "id": "G01-002",
        "title": "數位轉型補助比對",
        "input": "企業要導入 CRM。",
        "output": "比對補助範圍、資格與自籌款要求。"
      },
      {
        "id": "G01-003",
        "title": "人才發展計畫比對",
        "input": "公司欲辦理內訓。",
        "output": "比對訓練對象、時數與申請限制。"
      }
    ]
  },
  {
    "agentId": "G02",
    "agentName": "計畫書草擬員",
    "dept": "政府計畫部",
    "source": "provided",
    "cases": [
      {
        "id": "G02-001",
        "title": "數位轉型計畫書",
        "input": "主題為導入 CRM 與 AI 客服。",
        "output": "草擬背景、目標、方法、時程與效益。"
      },
      {
        "id": "G02-002",
        "title": "ESG 輔導計畫書",
        "input": "主題為碳盤查與管理制度。",
        "output": "草擬執行步驟、成果指標與預算欄位。"
      },
      {
        "id": "G02-003",
        "title": "人才培訓計畫書",
        "input": "主題為主管數位能力培訓。",
        "output": "草擬課程、對象、成效評估與附件清單。"
      }
    ]
  },
  {
    "agentId": "G03",
    "agentName": "查核與期限監測員",
    "dept": "政府計畫部",
    "source": "provided",
    "cases": [
      {
        "id": "G03-001",
        "title": "送件期限提醒",
        "input": "截止日剩 14 天。",
        "output": "列出未完成文件與每日建議進度。"
      },
      {
        "id": "G03-002",
        "title": "期中查核提醒",
        "input": "期中報告將於 30 天後到期。",
        "output": "整理查核項目與缺少證據。"
      },
      {
        "id": "G03-003",
        "title": "核銷期限提醒",
        "input": "核銷文件剩 10 天。",
        "output": "標示高風險缺件與責任人。"
      }
    ]
  },
  {
    "agentId": "G04",
    "agentName": "核銷文件檢查員",
    "dept": "政府計畫部",
    "source": "provided",
    "cases": [
      {
        "id": "G04-001",
        "title": "發票檢查",
        "input": "檢查 12 張發票。",
        "output": "標示缺統編、日期錯誤與附件不足。"
      },
      {
        "id": "G04-002",
        "title": "講師費核銷",
        "input": "檢查講師費收據與簽到表。",
        "output": "列出缺少文件與金額不一致。"
      },
      {
        "id": "G04-003",
        "title": "設備費核銷",
        "input": "檢查報價單、發票與驗收紀錄。",
        "output": "產出完整性檢查結果。"
      }
    ]
  },
  {
    "agentId": "K01",
    "agentName": "版本與時效監測員",
    "dept": "知識與教材管理部",
    "source": "provided",
    "cases": [
      {
        "id": "K01-001",
        "title": "法規版本檢查",
        "input": "檢查教材中的法規引用。",
        "output": "標示 2 筆可能過期內容。"
      },
      {
        "id": "K01-002",
        "title": "課程版本檢查",
        "input": "檢查 AI 課程簡報日期。",
        "output": "標示模型資訊與工具頁待更新。"
      },
      {
        "id": "K01-003",
        "title": "政府計畫資料檢查",
        "input": "檢查申請辦法版本。",
        "output": "標示截止日與補助上限已更新。"
      }
    ]
  },
  {
    "agentId": "K02",
    "agentName": "知識條目整理員",
    "dept": "知識與教材管理部",
    "source": "provided",
    "cases": [
      {
        "id": "K02-001",
        "title": "顧問案例入庫",
        "input": "整理某專案經驗。",
        "output": "建立背景、方法、成果與適用情境條目。"
      },
      {
        "id": "K02-002",
        "title": "課程 FAQ 入庫",
        "input": "整理學員常見問題。",
        "output": "建立問題、答案、關鍵字與版本日期。"
      },
      {
        "id": "K02-003",
        "title": "政府計畫知識入庫",
        "input": "整理申請重點。",
        "output": "建立資格、文件、期限與注意事項。"
      }
    ]
  },
  {
    "agentId": "K03",
    "agentName": "模板與檢核表草擬員",
    "dept": "知識與教材管理部",
    "source": "provided",
    "cases": [
      {
        "id": "K03-001",
        "title": "提案書模板",
        "input": "依既有提案結構建立模板。",
        "output": "產出章節、欄位與填寫說明。"
      },
      {
        "id": "K03-002",
        "title": "課程開發檢核表",
        "input": "整理課程開發必要步驟。",
        "output": "產出課綱、簡報、講義與審核清單。"
      },
      {
        "id": "K03-003",
        "title": "核銷文件檢核表",
        "input": "依核銷規範建立清單。",
        "output": "產出文件、欄位與附件檢核項目。"
      }
    ]
  },
  {
    "agentId": "X01",
    "agentName": "來訊整理員",
    "dept": "客戶服務部",
    "source": "provided",
    "cases": [
      {
        "id": "X01-001",
        "title": "專案進度詢問",
        "input": "客戶問：報告什麼時候完成？",
        "output": "整理成專案名稱、問題、期限與缺少資訊。"
      },
      {
        "id": "X01-002",
        "title": "課程資訊詢問",
        "input": "客戶問：下期課程何時開？",
        "output": "整理成課程、日期、名額與聯絡需求。"
      },
      {
        "id": "X01-003",
        "title": "帳務問題",
        "input": "客戶問：發票何時寄出？",
        "output": "整理成發票、訂單與寄送資訊摘要。"
      }
    ]
  },
  {
    "agentId": "X02",
    "agentName": "問題分派員",
    "dept": "客戶服務部",
    "source": "provided",
    "cases": [
      {
        "id": "X02-001",
        "title": "課程問題分派",
        "input": "來訊詢問企業內訓。",
        "output": "分類為教育訓練並轉交相關流程。"
      },
      {
        "id": "X02-002",
        "title": "計畫問題分派",
        "input": "來訊詢問補助資格。",
        "output": "分類為政府計畫並標示高優先。"
      },
      {
        "id": "X02-003",
        "title": "帳務問題分派",
        "input": "來訊詢問付款與發票。",
        "output": "分類為營運財務並要求人工確認。"
      }
    ]
  },
  {
    "agentId": "X03",
    "agentName": "客服資料查詢員",
    "dept": "客戶服務部",
    "source": "provided",
    "cases": [
      {
        "id": "X03-001",
        "title": "專案資料查詢",
        "input": "查詢專案進度與交付日。",
        "output": "回傳已確認進度、來源與待確認事項。"
      },
      {
        "id": "X03-002",
        "title": "課程資料查詢",
        "input": "查詢課程時間、費用與名額。",
        "output": "回傳核准資料與資料版本。"
      },
      {
        "id": "X03-003",
        "title": "合約資料查詢",
        "input": "查詢付款條件與發票資訊。",
        "output": "回傳合約條款摘要，不做承諾。"
      }
    ]
  },
  {
    "agentId": "X04",
    "agentName": "回覆草擬員",
    "dept": "客戶服務部",
    "source": "provided",
    "cases": [
      {
        "id": "X04-001",
        "title": "專案進度回覆",
        "input": "根據進度資料草擬回覆。",
        "output": "產出禮貌回覆並標示需主管確認的交期。"
      },
      {
        "id": "X04-002",
        "title": "課程詢問回覆",
        "input": "根據課程資料草擬回覆。",
        "output": "產出課程資訊、報名方式與注意事項。"
      },
      {
        "id": "X04-003",
        "title": "帳務詢問回覆",
        "input": "根據合約與發票資料草擬回覆。",
        "output": "產出回覆草稿並標示金額事項需人工確認。"
      }
    ]
  },
  {
    "agentId": "O01",
    "agentName": "待辦整理員",
    "dept": "營運與財務管理部",
    "source": "provided",
    "cases": [
      {
        "id": "O01-001",
        "title": "每日待辦",
        "input": "彙整今日郵件、會議與專案事項。",
        "output": "產出高優先、一般、可延後清單。"
      },
      {
        "id": "O01-002",
        "title": "專案待辦",
        "input": "整理三個專案的未完成任務。",
        "output": "列出責任人、期限與阻塞事項。"
      },
      {
        "id": "O01-003",
        "title": "行政待辦",
        "input": "整理請款、合約與文件需求。",
        "output": "產出行政追蹤清單。"
      }
    ]
  },
  {
    "agentId": "O02",
    "agentName": "帳務資料整理員",
    "dept": "營運與財務管理部",
    "source": "provided",
    "cases": [
      {
        "id": "O02-001",
        "title": "本月收支整理",
        "input": "彙整收入 420,000 元、支出 185,000 元。",
        "output": "產出收支摘要與未分類項目。"
      },
      {
        "id": "O02-002",
        "title": "應收帳款整理",
        "input": "整理 5 筆未收款項。",
        "output": "列出客戶、金額、到期日與逾期天數。"
      },
      {
        "id": "O02-003",
        "title": "專案損益整理",
        "input": "整理 3 個專案收入與成本。",
        "output": "產出專案毛利與資料缺口。"
      }
    ]
  },
  {
    "agentId": "O03",
    "agentName": "期限與異常監測員",
    "dept": "營運與財務管理部",
    "source": "provided",
    "cases": [
      {
        "id": "O03-001",
        "title": "應收款異常",
        "input": "有 2 筆款項逾期超過 30 天。",
        "output": "標示風險與需主管處理事項。"
      },
      {
        "id": "O03-002",
        "title": "合約期限異常",
        "input": "1 份合約將於 14 天後到期。",
        "output": "產出續約提醒與缺少文件。"
      },
      {
        "id": "O03-003",
        "title": "費用異常",
        "input": "某筆費用高於歷史平均 45%。",
        "output": "標示異常原因待查。"
      }
    ]
  },
  {
    "agentId": "O04",
    "agentName": "憑證完整性檢查員",
    "dept": "營運與財務管理部",
    "source": "provided",
    "cases": [
      {
        "id": "O04-001",
        "title": "請款文件檢查",
        "input": "檢查報價單、合約、驗收單與發票。",
        "output": "列出缺少驗收單。"
      },
      {
        "id": "O04-002",
        "title": "費用報支檢查",
        "input": "檢查收據與用途說明。",
        "output": "標示 2 筆缺日期與簽核。"
      },
      {
        "id": "O04-003",
        "title": "發票資料檢查",
        "input": "檢查統編、日期、金額與品名。",
        "output": "產出完整性結果與異常清單。"
      }
    ]
  },
  {
    "agentId": "I01",
    "agentName": "條文差距比對員",
    "dept": "制度與認證輔導部",
    "source": "system",
    "cases": [
      {
        "id": "I01-001",
        "title": "ISO9001 改版差距初判",
        "input": "客戶現行文件為 2015 版架構，需比對新版要求。",
        "output": "列出逐條差距、受影響文件與風險等級初判。"
      },
      {
        "id": "I01-002",
        "title": "文件現況盤點",
        "input": "客戶提供品質手冊與 12 份程序書。",
        "output": "標示現行版次、條文對應與待確認項目。"
      },
      {
        "id": "I01-003",
        "title": "風險思維條文比對",
        "input": "檢查風險與機會鑑別的紀錄要求。",
        "output": "列出現有做法、缺少證據與建議補強方向。"
      }
    ]
  },
  {
    "agentId": "I02",
    "agentName": "文件精簡與流程草擬員",
    "dept": "制度與認證輔導部",
    "source": "system",
    "cases": [
      {
        "id": "I02-001",
        "title": "表單合併建議",
        "input": "現有 3 份變更相關表單欄位重複。",
        "output": "產出合併草案與需人決定的權責欄位。"
      },
      {
        "id": "I02-002",
        "title": "程序書精簡",
        "input": "採購程序書 18 頁，段落重複。",
        "output": "產出精簡後架構與建議刪除段落，刪除需人核准。"
      },
      {
        "id": "I02-003",
        "title": "流程調整草案",
        "input": "變更管理缺少審查與核准節點。",
        "output": "產出流程草案與需負責人決定事項。"
      }
    ]
  },
  {
    "agentId": "I03",
    "agentName": "內稽教材與題庫草擬員",
    "dept": "制度與認證輔導部",
    "source": "system",
    "cases": [
      {
        "id": "I03-001",
        "title": "內稽訓練教材",
        "input": "對象為 6 位內部稽核員，時數 6 小時。",
        "output": "產出四單元大綱、時間配置與待補案例。"
      },
      {
        "id": "I03-002",
        "title": "模擬稽核情境",
        "input": "以變更管理未留紀錄為題。",
        "output": "產出情境敘述、稽核路徑與預期發現。"
      },
      {
        "id": "I03-003",
        "title": "查檢表題庫",
        "input": "針對三份受影響文件出題。",
        "output": "產出 18 題查檢項目與對應條文。"
      }
    ]
  },
  {
    "agentId": "I04",
    "agentName": "查證準備檢查員",
    "dept": "制度與認證輔導部",
    "source": "system",
    "cases": [
      {
        "id": "I04-001",
        "title": "文件版次檢查",
        "input": "檢查 15 份文件的版次一致性。",
        "output": "標示 2 份文件與表單版次不一致。"
      },
      {
        "id": "I04-002",
        "title": "紀錄週期檢查",
        "input": "檢查管理審查與內稽紀錄。",
        "output": "標示管理審查僅一次，未涵蓋完整週期。"
      },
      {
        "id": "I04-003",
        "title": "矯正措施檢查",
        "input": "檢查前次不符合事項的結案狀態。",
        "output": "列出未結案項目與缺少的驗證證據。"
      }
    ]
  },
  {
    "agentId": "E01",
    "agentName": "盤查邊界與範疇整理員",
    "dept": "永續與碳管理部",
    "source": "system",
    "cases": [
      {
        "id": "E01-001",
        "title": "組織邊界整理",
        "input": "總公司與一處廠區，另有租賃倉庫。",
        "output": "整理邊界方法、涵蓋據點與尚未界定項目。"
      },
      {
        "id": "E01-002",
        "title": "範疇一與範疇二盤點",
        "input": "有鍋爐、公務車與外購電力。",
        "output": "列出範疇一與範疇二的涵蓋項目。"
      },
      {
        "id": "E01-003",
        "title": "範疇三初判",
        "input": "討論員工通勤與商務旅運是否納入。",
        "output": "列出建議納入項目與需人決定事項。"
      }
    ]
  },
  {
    "agentId": "E02",
    "agentName": "活動數據清單草擬員",
    "dept": "永續與碳管理部",
    "source": "system",
    "cases": [
      {
        "id": "E02-001",
        "title": "數據清單產出",
        "input": "依已確認邊界列出應蒐集資料。",
        "output": "產出數據項目、來源、負責單位與蒐集期間。"
      },
      {
        "id": "E02-002",
        "title": "缺漏盤點",
        "input": "冷媒補充量無紀錄。",
        "output": "標示缺漏項目與可能的替代來源，不代填數值。"
      },
      {
        "id": "E02-003",
        "title": "蒐集期間確認",
        "input": "客戶提供跨兩個曆年的帳單。",
        "output": "標示期間不一致與需重新取得的資料。"
      }
    ]
  },
  {
    "agentId": "E03",
    "agentName": "排放量試算檢查員",
    "dept": "永續與碳管理部",
    "source": "system",
    "cases": [
      {
        "id": "E03-001",
        "title": "單位一致性檢查",
        "input": "檢查 24 筆活動數據的單位。",
        "output": "標示 3 筆單位不一致。"
      },
      {
        "id": "E03-002",
        "title": "係數版本檢查",
        "input": "電力係數未標註年度版本。",
        "output": "標示係數來源不明與需人選用。"
      },
      {
        "id": "E03-003",
        "title": "異常值檢查",
        "input": "第三季天然氣用量為其他季的 3.2 倍。",
        "output": "標示異常值與需確認的生產活動。"
      }
    ]
  },
  {
    "agentId": "E04",
    "agentName": "報告書與揭露架構草擬員",
    "dept": "永續與碳管理部",
    "source": "system",
    "cases": [
      {
        "id": "E04-001",
        "title": "章節架構草擬",
        "input": "依 ISO 14064-1:2018 產出報告架構。",
        "output": "產出六章架構與揭露項目對照表。"
      },
      {
        "id": "E04-002",
        "title": "揭露缺口盤點",
        "input": "對照準則要求檢查現有內容。",
        "output": "列出 4 項待補內容。"
      },
      {
        "id": "E04-003",
        "title": "基準年說明草擬",
        "input": "需說明基準年設定理由。",
        "output": "產出說明草稿並標示減碳目標須由人決定。"
      }
    ]
  }
]

export const mockData = rawMockData.map(normalizeMock)

export function findMock(agentId) {
  return mockData.find((row) => row.agentId === agentId) ?? null
}

export const mockStats = {
  agents: mockData.length,
  cases: mockData.reduce((total, row) => total + row.cases.length, 0),
  provided: mockData.filter((row) => row.source === 'provided').length,
  system: mockData.filter((row) => row.source === 'system').length,
}
