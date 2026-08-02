// Knowledge Hub v2 的公司知識卡片。
// 只做靜態資料、分類瀏覽、關鍵字搜尋與詳細內容檢視。
// 未知的公司事實一律使用【請填入】，不得自行補造。

export const PLACEHOLDER = '【請填入'

export const hubIntro =
  '享洺有限公司的公司知識中心。所有 AI 員工應優先引用這裡的已發布知識，不自行補充未確認資訊。'

export const categories = [
  { value: 'All', label: '全部' },
  { value: 'Company', label: '公司知識' },
  { value: 'Service', label: '服務知識' },
  { value: 'FAQ', label: '常見問題' },
  { value: 'SOP', label: '標準流程' },
  { value: 'Policy', label: '政策與原則' },
  { value: 'Template', label: '回覆範本' },
  { value: 'Glossary', label: '統一用語' },
  { value: 'Escalation', label: '升級規則' },
]

export const statusLabels = { Published: '已發布', Draft: '草稿', Archived: '封存' }
export const levelLabels = { High: '高', Medium: '中', Low: '低' }

export const knowledgeCards = [
  {
    "id": "COMPANY-001",
    "title": "公司名稱",
    "category": "Company",
    "tags": [
      "公司",
      "基本資料"
    ],
    "summary": "享洺有限公司的正式公司名稱。",
    "content": "享洺有限公司",
    "owner": "營運與財務管理部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": []
  },
  {
    "id": "COMPANY-002",
    "title": "公司定位",
    "category": "Company",
    "tags": [
      "公司",
      "定位",
      "業務範圍"
    ],
    "summary": "說明享洺有限公司的主要專業定位。",
    "content": "享洺有限公司以企業管理顧問、教育訓練、政府計畫輔導、知識與教材整理，以及企業 AI 應用規劃為主要發展方向。實際承接範圍須依個案需求與書面合作內容確認。",
    "owner": "經營策略與決策部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "Medium",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-001",
      "POLICY-002"
    ]
  },
  {
    "id": "COMPANY-003",
    "title": "公司工作原則",
    "category": "Company",
    "tags": [
      "公司",
      "原則",
      "治理"
    ],
    "summary": "定義享洺 AI 公司管理系統的核心工作原則。",
    "content": "AI 起草，人審核，人發送。AI 可以協助整理、查詢、分析與草擬；涉及決策、審核、承諾、發布、送出、付款或申報時，必須由人員處理。",
    "owner": "經營策略與決策部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-001",
      "ESC-001"
    ]
  },
  {
    "id": "COMPANY-004",
    "title": "正式聯絡方式",
    "category": "Company",
    "tags": [
      "公司",
      "聯絡方式"
    ],
    "summary": "記錄享洺有限公司對外使用的正式聯絡管道。",
    "content": "【請填入：正式電話、Email、官方網站或其他聯絡方式】",
    "owner": "營運與財務管理部",
    "appliesTo": [
      "回覆草擬員",
      "CRM 紀錄整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Draft",
    "confidence": "Low",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-003"
    ]
  },
  {
    "id": "COMPANY-005",
    "title": "服務時間",
    "category": "Company",
    "tags": [
      "公司",
      "服務時間",
      "回覆時限"
    ],
    "summary": "記錄享洺有限公司的正式服務時間與回覆原則。",
    "content": "【請填入：正式服務時間與回覆時限】",
    "owner": "營運與財務管理部",
    "appliesTo": [
      "回覆草擬員",
      "客服資料查詢員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Draft",
    "confidence": "Low",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-006"
    ]
  },
  {
    "id": "SERVICE-001",
    "title": "企業管理顧問服務",
    "category": "Service",
    "tags": [
      "顧問",
      "服務範圍"
    ],
    "summary": "說明企業管理顧問服務可能涵蓋的範圍。",
    "content": "企業管理顧問服務可能包含需求訪談、問題診斷、資料分析、流程改善、管理制度設計、執行輔導與成果檢視。每一案件實際服務內容，以正式提案與合約為準。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "商機分類員",
      "提案與報價草擬員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-001",
      "FAQ-007",
      "POLICY-003"
    ]
  },
  {
    "id": "SERVICE-002",
    "title": "教育訓練服務",
    "category": "Service",
    "tags": [
      "教育訓練",
      "課程",
      "內訓"
    ],
    "summary": "說明享洺的課程與企業內訓服務。",
    "content": "教育訓練可依學習對象、產業情境、課程目標、時數與實際需求規劃。正式課綱、授課方式、交付內容、費用與時程須經需求確認後另行提供。",
    "owner": "教育訓練交付部",
    "appliesTo": [
      "課綱設計員",
      "簡報草擬員",
      "提案與報價草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SOP-TRAINING-001"
    ]
  },
  {
    "id": "SERVICE-003",
    "title": "政府計畫輔導服務",
    "category": "Service",
    "tags": [
      "政府計畫",
      "補助",
      "責任邊界"
    ],
    "summary": "說明享洺可協助的政府計畫工作及責任邊界。",
    "content": "享洺可協助計畫資訊整理、資格初步比對、申請文件草擬、期限提醒與文件完整性檢查。是否符合資格、是否通過、核准金額、會計稅務適法性及正式核銷認定，仍由客戶、專業人員與主管機關確認。",
    "owner": "政府計畫部",
    "appliesTo": [
      "計畫資格比對員",
      "計畫書草擬員",
      "查核與期限監測員",
      "核銷文件檢查員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-008",
      "POLICY-007",
      "ESC-001"
    ]
  },
  {
    "id": "SERVICE-004",
    "title": "知識與教材整理服務",
    "category": "Service",
    "tags": [
      "知識管理",
      "教材",
      "模板"
    ],
    "summary": "說明知識整理、教材與模板相關服務。",
    "content": "可依專案需求協助整理知識條目、課程教材、文件模板與檢核表。正式使用前，須完成內容、來源、版本與權利確認。",
    "owner": "知識與教材管理部",
    "appliesTo": [
      "知識條目整理員",
      "模板與檢核表草擬員",
      "簡報草擬員"
    ],
    "visibility": "Internal",
    "priority": "Medium",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-006",
      "POLICY-008"
    ]
  },
  {
    "id": "SERVICE-005",
    "title": "企業 AI 應用規劃",
    "category": "Service",
    "tags": [
      "AI",
      "導入規劃",
      "流程"
    ],
    "summary": "說明享洺可協助企業進行的 AI 應用規劃。",
    "content": "可依企業需求協助盤點流程、設計 AI Agent 職責、規劃 Workflow、知識管理與人工審核機制。實際導入成果受企業資料、執行能力、工具限制與使用情境影響，不保證特定營運成果。",
    "owner": "經營策略與決策部",
    "appliesTo": [
      "方案比較分析員",
      "提案與報價草擬員",
      "知識條目整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-001",
      "POLICY-004"
    ]
  },
  {
    "id": "FAQ-001",
    "title": "享洺有限公司提供哪些服務？",
    "category": "FAQ",
    "tags": [
      "服務",
      "顧問",
      "教育訓練"
    ],
    "summary": "說明享洺目前可評估提供的主要服務範圍。",
    "content": "享洺有限公司可依實際需求評估企業管理顧問、教育訓練、政府計畫輔導、知識與教材整理及企業 AI 應用規劃等合作。是否承接及實際服務內容，須經需求訪談與雙方書面確認。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "商機分類員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "COMPANY-002",
      "SERVICE-001",
      "SERVICE-002",
      "SERVICE-003",
      "SERVICE-004",
      "SERVICE-005"
    ]
  },
  {
    "id": "FAQ-002",
    "title": "哪些企業適合與享洺合作？",
    "category": "FAQ",
    "tags": [
      "客戶輪廓",
      "合作評估"
    ],
    "summary": "說明適合提出需求的企業與組織類型。",
    "content": "希望改善經營管理、人才培訓、流程效率、政府計畫申請、ESG 或 AI 應用的企業與組織，可以先提出需求。是否適合合作，仍須經初步訪談與專業評估。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "商機分類員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "Medium",
    "status": "Published",
    "confidence": "Medium",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-001",
      "SERVICE-002",
      "SERVICE-003",
      "SERVICE-005"
    ]
  },
  {
    "id": "FAQ-003",
    "title": "如何提出合作或諮詢需求？",
    "category": "FAQ",
    "tags": [
      "諮詢流程",
      "聯絡方式"
    ],
    "summary": "說明提出需求時應提供的資訊與後續聯繫方式。",
    "content": "請透過【請填入：官方聯絡方式】提供公司名稱、聯絡人、需求背景、預計時程及希望解決的問題。收到後將由人員確認並安排後續聯繫。",
    "owner": "客戶服務部",
    "appliesTo": [
      "回覆草擬員",
      "CRM 紀錄整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Draft",
    "confidence": "Low",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "COMPANY-004"
    ]
  },
  {
    "id": "FAQ-004",
    "title": "第一次諮詢前需要準備哪些資料？",
    "category": "FAQ",
    "tags": [
      "諮詢準備",
      "資料安全"
    ],
    "summary": "說明初次諮詢建議準備的資料與不應提供的敏感資訊。",
    "content": "建議準備公司基本資料、目前問題、希望達成的目標、預計時程及相關文件。初次諮詢請勿提供帳號密碼、身分證件、完整客戶名單、未遮蔽財務資料或其他高度敏感資訊。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "商機分類員",
      "客戶與計畫資料查詢員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "Medium",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-005"
    ]
  },
  {
    "id": "FAQ-005",
    "title": "享洺如何報價？",
    "category": "FAQ",
    "tags": [
      "報價",
      "費用"
    ],
    "summary": "說明報價的評估依據與正式報價的認定方式。",
    "content": "報價會依服務內容、專案範圍、執行時程、投入人力及交付成果評估。AI 回覆、口頭說明及初步估算均不構成正式報價；實際費用、付款條件及追加需求，以正式報價單或合約為準。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "提案與報價草擬員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-003",
      "POLICY-011"
    ]
  },
  {
    "id": "FAQ-006",
    "title": "提出需求後多久會收到回覆？",
    "category": "FAQ",
    "tags": [
      "服務時效",
      "諮詢流程"
    ],
    "summary": "說明初步回覆的時限與可能延長的情況。",
    "content": "一般情況下，我們會於【請填入：正式回覆時限】內進行初步回覆。若需求涉及複雜評估、政府計畫或跨部門資料，所需時間可能較長，將另行說明。",
    "owner": "客戶服務部",
    "appliesTo": [
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Draft",
    "confidence": "Low",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "COMPANY-005"
    ]
  },
  {
    "id": "FAQ-007",
    "title": "顧問專案通常如何進行？",
    "category": "FAQ",
    "tags": [
      "顧問專案",
      "執行流程"
    ],
    "summary": "說明顧問專案可能包含的階段與範圍認定依據。",
    "content": "顧問專案可能包含需求訪談、診斷、資料分析、方案建議、執行輔導或成果檢視等階段；每一專案實際包含哪些工作，以正式提案及合約範圍為準。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "提案與報價草擬員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "Medium",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-001",
      "SOP-CONSULTING-001"
    ]
  },
  {
    "id": "FAQ-008",
    "title": "享洺可以協助政府計畫或補助申請嗎？",
    "category": "FAQ",
    "tags": [
      "政府計畫",
      "補助申請"
    ],
    "summary": "說明政府計畫協助範圍與不由享洺認定的事項。",
    "content": "可協助計畫資訊整理、資格初步比對、申請文件草擬、文件清單整理、欄位完整性檢查與期限提醒。是否符合資格、是否通過、核准金額、會計稅務適法性及正式核銷認定，仍由客戶、專業人員與主管機關確認。",
    "owner": "政府計畫部",
    "appliesTo": [
      "計畫資格比對員",
      "計畫書草擬員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-003",
      "POLICY-007"
    ]
  },
  {
    "id": "SOP-CUSTOMER-001",
    "title": "客戶來訊處理流程",
    "category": "SOP",
    "tags": [
      "客服",
      "來訊",
      "流程"
    ],
    "summary": "客戶來訊從接收到正式送出的完整處理順序。",
    "content": "接收客戶來訊 → 來訊整理員整理 → 問題分派員分類 → 客服資料查詢員查詢 → 回覆草擬員草擬 → 主管審核 → 人員正式送出。\n\n附註：主管審核留人。正式送出留人。Agent 不得自行對外發送。",
    "owner": "客戶服務部",
    "appliesTo": [
      "來訊整理員",
      "問題分派員",
      "客服資料查詢員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-001",
      "POLICY-002",
      "ESC-001"
    ]
  },
  {
    "id": "SOP-CONSULTING-001",
    "title": "顧問專案交付流程",
    "category": "SOP",
    "tags": [
      "顧問專案",
      "交付",
      "流程"
    ],
    "summary": "顧問專案從需求確認到客戶驗收的處理順序。",
    "content": "確認客戶需求（人）→ 整理需求與資料 → 進行初步分析 → 草擬顧問方案 → 顧問審核（人）→ 執行輔導（人）→ 整理成果 → 客戶驗收（人）。\n\n附註：專業診斷、最終顧問結論、對客戶提出正式建議與成果驗收，必須由人員負責。",
    "owner": "顧問專案交付部",
    "appliesTo": [
      "需求紀錄員",
      "專案資料分析員",
      "顧問報告草擬員",
      "專案進度整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-001",
      "POLICY-001",
      "POLICY-004"
    ]
  },
  {
    "id": "SOP-TRAINING-001",
    "title": "課程設計與交付流程",
    "category": "SOP",
    "tags": [
      "教育訓練",
      "課程",
      "流程"
    ],
    "summary": "課程從需求確認到課後改善的處理順序。",
    "content": "確認課程需求與學習目標（人）→ 課綱設計員設計 → 簡報草擬員草擬 → 講義與範例編寫員編寫 → 講師講稿撰寫員撰寫 → 講師審核（人）→ 正式授課（人）→ 蒐集課後回饋 → 課後回饋整理員整理 → 講師決定改善內容（人）。",
    "owner": "教育訓練交付部",
    "appliesTo": [
      "課綱設計員",
      "簡報草擬員",
      "講義與範例編寫員",
      "講師講稿撰寫員",
      "課後回饋整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-002",
      "POLICY-008"
    ]
  },
  {
    "id": "SOP-GOV-001",
    "title": "政府計畫申請與管理流程",
    "category": "SOP",
    "tags": [
      "政府計畫",
      "申請",
      "核銷"
    ],
    "summary": "政府計畫從提出需求到正式申報的處理順序。",
    "content": "提出申請需求（人）→ 計畫資格比對員初步比對 → 負責人確認是否申請（人）→ 計畫書草擬員草擬 → 負責人審核計畫書與預算（人）→ 正式送件（人）→ 查核與期限監測員追蹤 → 執行計畫與準備文件（人）→ 核銷文件檢查員檢查完整性 → 會計或負責人確認（人）→ 正式申報（人）。",
    "owner": "政府計畫部",
    "appliesTo": [
      "計畫資格比對員",
      "計畫書草擬員",
      "查核與期限監測員",
      "核銷文件檢查員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-003",
      "POLICY-007",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-001",
    "title": "AI 工作定位",
    "category": "Policy",
    "tags": [
      "AI 治理",
      "人工閘門"
    ],
    "summary": "定義 AI 可以做與不可以做的事。",
    "content": "AI 可以：查詢知識、整理資料、草擬內容、提供分析與建議、提出紀錄更新草稿。\n\nAI 不可以：最終決策、自行核准、正式發布、正式送出、執行付款、正式申報、對外承諾。\n\n正式紀錄寫入須依系統權限與人工確認執行。",
    "owner": "經營策略與決策部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "COMPANY-003",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-002",
    "title": "對外回覆政策",
    "category": "Policy",
    "tags": [
      "對外回覆",
      "客服"
    ],
    "summary": "規範對外回覆可使用的資料與必須轉人工的情況。",
    "content": "所有對外回覆只能使用已核准且未過期的公司資料。資料不足時不得自行推測。涉及價格、退款、補償、合約、法律責任、重大客訴、政府申報或正式承諾時，必須轉交人工處理。正式回覆須由人員審核並送出。",
    "owner": "客戶服務部",
    "appliesTo": [
      "回覆草擬員",
      "客服資料查詢員",
      "社群內容草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SOP-CUSTOMER-001",
      "TEMPLATE-001",
      "TEMPLATE-002",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-003",
    "title": "報價與承諾政策",
    "category": "Policy",
    "tags": [
      "報價",
      "承諾"
    ],
    "summary": "規範報價草擬與正式承諾的權限界線。",
    "content": "Agent 可以草擬提案與報價文件，但正式價格、折扣、付款條件、交付範圍、交付期限、追加服務及責任條款，只能由授權人員核准。口頭說明與 AI 草稿不構成正式承諾。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "提案與報價草擬員",
      "回覆草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-005",
      "POLICY-011",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-004",
    "title": "資料正確性政策",
    "category": "Policy",
    "tags": [
      "資料正確性",
      "不得編造"
    ],
    "summary": "規範知識與 Agent 輸出必須區分事實與推測。",
    "content": "所有知識與 Agent 輸出必須區分已確認資料、推測、資料缺口與待人工確認事項。不得將推測寫成事實，不得編造日期、金額、法規、案例、來源或客戶資料。",
    "owner": "知識與教材管理部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-006",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-005",
    "title": "客戶資料與保密政策",
    "category": "Policy",
    "tags": [
      "個資",
      "保密",
      "資料治理"
    ],
    "summary": "規範客戶資料與機密內容的使用限制。",
    "content": "未經授權，不得將客戶機密、個人資料、帳號密碼、未公開財務資料或第三方受保護內容輸入外部 AI 工具。資料保存期限、刪除方式、權限與事件處理規則為【請填入：正式資料管理政策】。",
    "owner": "營運與財務管理部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Draft",
    "confidence": "Medium",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-004",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-006",
    "title": "知識入庫政策",
    "category": "Policy",
    "tags": [
      "知識治理",
      "入庫審核"
    ],
    "summary": "規範內容進入正式 Knowledge Hub 前的確認事項。",
    "content": "任何內容進入正式 Knowledge Hub 前，必須確認來源可追溯、內容未過期、適用情境清楚、未包含未授權資料，並由負責人或專業人員核准。AI 不得自行核准知識入庫。",
    "owner": "知識與教材管理部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-004",
      "SERVICE-004"
    ]
  },
  {
    "id": "POLICY-007",
    "title": "政府計畫服務政策",
    "category": "Policy",
    "tags": [
      "政府計畫",
      "不保證"
    ],
    "summary": "規範政府計畫服務的協助範圍與不保證事項。",
    "content": "享洺可協助資格初步比對、文件整理、草稿撰寫、期限提醒與文件完整性檢查；不保證符合資格、不保證通過、不保證核准金額，也不代替會計、法律專業人員或主管機關做正式認定。",
    "owner": "政府計畫部",
    "appliesTo": [
      "計畫資格比對員",
      "計畫書草擬員",
      "查核與期限監測員",
      "核銷文件檢查員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-003",
      "SOP-GOV-001",
      "ESC-001"
    ]
  },
  {
    "id": "POLICY-008",
    "title": "課程與教材政策",
    "category": "Policy",
    "tags": [
      "教材",
      "著作權",
      "版本"
    ],
    "summary": "規範課程與教材使用前的確認事項。",
    "content": "所有正式課程、講義、簡報、案例、數據與圖片在使用前，必須完成來源、版本、著作權與內容正確性確認。AI 產出的教材一律視為草稿。",
    "owner": "教育訓練交付部",
    "appliesTo": [
      "課綱設計員",
      "簡報草擬員",
      "講義與範例編寫員",
      "講師講稿撰寫員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "SERVICE-002",
      "SOP-TRAINING-001"
    ]
  },
  {
    "id": "POLICY-011",
    "title": "追加需求與範圍變更政策",
    "category": "Policy",
    "tags": [
      "範圍變更",
      "追加需求"
    ],
    "summary": "規範超出合約範圍的新增需求如何認定。",
    "content": "超出正式提案或合約範圍的新增需求，須另行確認工作內容、費用與時程。未經雙方書面確認前，不視為原服務範圍。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "提案與報價草擬員",
      "回覆草擬員",
      "專案進度整理員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "FAQ-005",
      "POLICY-003"
    ]
  },
  {
    "id": "TEMPLATE-001",
    "title": "知識不足回覆",
    "category": "Template",
    "tags": [
      "回覆範本",
      "資料不足"
    ],
    "summary": "資料不足時的標準回覆用語。",
    "content": "目前沒有足夠資訊確認，我會請相關人員確認後再回覆您。",
    "owner": "客戶服務部",
    "appliesTo": [
      "回覆草擬員",
      "客服資料查詢員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-002",
      "ESC-001"
    ]
  },
  {
    "id": "TEMPLATE-002",
    "title": "需要轉交人工",
    "category": "Template",
    "tags": [
      "回覆範本",
      "轉交人工"
    ],
    "summary": "需轉交負責人時的標準回覆用語。",
    "content": "此事項需要由相關負責人確認，我先協助轉交處理。",
    "owner": "客戶服務部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-002",
      "ESC-001"
    ]
  },
  {
    "id": "TERM-001",
    "title": "顧客",
    "category": "Glossary",
    "tags": [
      "用語",
      "客戶"
    ],
    "summary": "統一對外稱呼的用語規範。",
    "content": "正式用語：客戶\n避免使用：顧客\n\n使用原則：享洺為企業顧問與教育服務公司，對外原則上統一使用「客戶」。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "Medium",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": []
  },
  {
    "id": "TERM-002",
    "title": "提案",
    "category": "Glossary",
    "tags": [
      "用語",
      "提案"
    ],
    "summary": "提案一詞的正確使用範圍。",
    "content": "正式用語：提案\n避免使用：保證方案、一定有效的方案\n\n使用原則：提案代表依現有資料提出的服務建議，不代表成果保證或最終合約承諾。",
    "owner": "客戶開發與行銷部",
    "appliesTo": [
      "提案與報價草擬員",
      "回覆草擬員",
      "社群內容草擬員"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-003"
    ]
  },
  {
    "id": "ESC-001",
    "title": "必須轉交負責人的情況",
    "category": "Escalation",
    "tags": [
      "升級規則",
      "人工處理"
    ],
    "summary": "列出 Agent 必須停止自行處理並轉交人工的所有情況。",
    "content": "遇到以下情況，Agent 必須停止自行處理並轉交負責人或授權主管：\n\n正式報價、折扣、付款條件、退款、補償、合約、法律責任、個人資料、客戶機密、政府申報、政府計畫正式資格判定、重大客訴、品牌危機、專業顧問結論、正式對外承諾、正式發布、正式送出、執行付款、資料互相矛盾、缺少關鍵資料。",
    "owner": "經營策略與決策部",
    "appliesTo": [
      "全部 Agent"
    ],
    "visibility": "Internal",
    "priority": "High",
    "status": "Published",
    "confidence": "High",
    "version": "1.0",
    "validFrom": "2026-08-02",
    "validUntil": "",
    "lastUpdated": "2026-08-02",
    "reviewer": "【請填入】",
    "relatedCards": [
      "POLICY-001",
      "POLICY-002",
      "POLICY-003",
      "POLICY-004",
      "POLICY-005"
    ]
  }
]

// 待補資料：主要文字欄位任一含【請填入】即計入。
const CHECKED_FIELDS = ['title', 'summary', 'content', 'reviewer', 'owner']

export function hasPlaceholder(card) {
  return CHECKED_FIELDS.some((key) => String(card[key] ?? '').includes(PLACEHOLDER))
}

export function categoryLabel(value) {
  return categories.find((item) => item.value === value)?.label ?? value
}

export function renderKnowledgeStats(cards) {
  return [
    { label: '知識總數', value: cards.length },
    { label: '已發布', value: cards.filter((card) => card.status === 'Published').length },
    { label: '高優先級', value: cards.filter((card) => card.priority === 'High').length },
    { label: '待補資料', value: cards.filter(hasPlaceholder).length },
  ]
}

export function filterKnowledgeCards(cards, category, keyword) {
  const word = keyword.trim().toLowerCase()
  return cards.filter((card) => {
    if (category !== 'All' && card.category !== category) return false
    if (!word) return true
    return [card.id, card.title, card.summary, card.content, ...card.tags]
      .join(' ')
      .toLowerCase()
      .includes(word)
  })
}

export function findCard(id) {
  return knowledgeCards.find((card) => card.id === id) ?? null
}

export function countByCategory(value) {
  if (value === 'All') return knowledgeCards.length
  return knowledgeCards.filter((card) => card.category === value).length
}
