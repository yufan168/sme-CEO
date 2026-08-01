export const opsTeam = {
  department: '營運與財務管理部',
  note: '四個 Agent 擔任營運助理，負責資訊整理、異常提醒與摘要產出。所有涉及人員調度、工作指派與營運決策的事項，一律由負責人執行。',
  scopeNote:
    '本配置涵蓋每日營運的資訊整理流程。合約、請款與核銷的 Agent 配置尚未定義，待後續補上。',
  flow: [
    { step: '彙整今日營運資訊', owner: 'Agent：營運資訊整理員（Worker）' },
    { step: '整理待辦事項', owner: 'Agent：待辦整理員（Worker）' },
    { step: '檢查異常狀況', owner: 'Agent：營運監測員（Knowledge）' },
    { step: '產出每日營運摘要', owner: 'Agent：營運摘要員（Worker）' },
    { step: '負責人檢視', owner: '留人' },
    { step: '決定今日工作安排', owner: '留人' },
    { step: '通知各部門', owner: '留人' },
  ],
  agents: [
    {
      id: '01',
      name: '營運資訊整理員',
      type: 'Worker 執行員',
      duty: '彙整今日案件進度、工時、應收付款與行程等營運資訊。',
      assignee: '待指派',
      step: '彙整今日營運資訊',
    },
    {
      id: '02',
      name: '待辦整理員',
      type: 'Worker 執行員',
      duty: '整理今日待辦事項並依優先順序列出工作清單。',
      assignee: '待指派',
      step: '整理待辦事項',
    },
    {
      id: '03',
      name: '營運監測員',
      type: 'Knowledge 知識員',
      duty: '依據既有營運規則找出需要注意的異常，例如逾期案件、逾期應收與即將到期的計畫期限。',
      assignee: '待指派',
      step: '檢查異常狀況',
    },
    {
      id: '04',
      name: '營運摘要員',
      type: 'Worker 執行員',
      duty: '整理每日重點資訊並產出供負責人閱讀的營運摘要。',
      assignee: '待指派',
      step: '產出每日營運摘要',
    },
  ],
  gates: [
    {
      name: '負責人檢視（留人）',
      rule: '需要綜合考量人力、訂單、庫存、活動與突發事件，確認 AI 提供的資訊是否符合實際情況。',
    },
    {
      name: '決定今日工作安排（留人）',
      rule: '工作優先順序、人員調度、臨時調整與資源分配屬於營運決策，應由負責人負責。',
    },
    {
      name: '通知各部門（留人）',
      rule: '正式指派工作代表公司的管理指令，應由負責人或授權主管發布。',
    },
  ],
  notConfigured: [
    {
      type: 'Router 分派員',
      reason: '每日固定流程，不需要依案件自動分派不同路徑',
    },
    {
      type: 'Reviewer 審查員',
      reason: '每日營運摘要由負責人直接檢視，不需要增加 AI 審查層',
    },
    {
      type: 'Manager 管理員',
      reason: '目前只有少數 Agent，沒有由 AI 管理其他 Agent 的需求',
    },
    {
      type: 'Executive 決策員',
      reason: '排班、人力調度、營運方向與重大決策應由負責人決定',
    },
  ],
}
