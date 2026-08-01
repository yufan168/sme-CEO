export const authorityNote =
  '部門是責任範圍，不是人頭。目前為一人公司，必要時由委任顧問與臨時行政人員協力。'

export const authority = [
  {
    name: '經營策略與決策部',
    owner: '全部權責，不對外授權',
    consultant: '不授權',
    admin: '不授權',
  },
  {
    name: '客戶開發與關係管理部',
    owner: '需求判斷、定價、談判與簽約',
    consultant: '協助需求訪談與資料判讀',
    admin: '客戶資料整理、追蹤提醒',
  },
  {
    name: '顧問專案交付部',
    owner: '問題診斷、專業判斷、最終建議責任',
    consultant: '執行、分析、輔導，交付前須經審查',
    admin: '文件排版、會議安排、紀錄整理',
  },
  {
    name: '研究與知識管理部',
    owner: '方法論設計、專業內容審核、機密權限',
    consultant: '案例與方法回饋',
    admin: '歸檔、標籤、索引維護',
  },
  {
    name: '客戶服務部',
    owner: '客訴處理、爭議回應、補救承諾',
    consultant: '不授權',
    admin: '訊息彙整、進度追蹤提醒',
  },
  {
    name: '營運與財務管理部',
    owner: '核准、用印、稅務與法定申報、期限責任',
    consultant: '不授權',
    admin: '建檔、請款文件、核銷單據整理',
  },
]
