// Governance Center 模組一：Roles & Permissions｜角色與權限
// 角色決定能不能做這個動作，Scope 決定能對哪個資源做。兩者都成立才放行。

export const rolesRule = {
  ruleId: 'GOV-ROLE',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const capabilities = [
  { id: 'read', label: 'Read', note: '讀取' },
  { id: 'write', label: 'Write', note: '建立與修改草稿' },
  { id: 'approve', label: 'Approve', note: '核准、退回、拒絕' },
  { id: 'manage', label: 'Manage', note: '管理治理規則與系統設定' },
]

export const systemRoles = [
  {
    id: 'owner',
    name: 'Owner',
    note: '最終治理與核准責任者',
    who: '公司負責人',
    read: true,
    write: true,
    approve: true,
    manage: true,
  },
  {
    id: 'editor',
    name: 'Editor',
    note: '日常內容、知識與流程維護者',
    who: '顧問、專案負責人、行政或知識維護人員',
    read: true,
    write: true,
    approve: false,
    manage: false,
  },
  {
    id: 'viewer',
    name: 'Viewer',
    note: '查閱已核准資料的使用者',
    who: '新進人員、短期協作人員、外部合作夥伴',
    read: true,
    write: false,
    approve: false,
    manage: false,
  },
]

// 完整功能權限。值：yes 可、no 不可、proposal 提出修改建議、byScope 依範圍。
export const functionMatrix = [
  { fn: '查看已發布知識', owner: 'yes', editor: 'yes', viewer: 'yes' },
  { fn: '搜尋已發布知識', owner: 'yes', editor: 'yes', viewer: 'yes' },
  { fn: '建立知識草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '修改自己的草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '上傳知識文件', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '提出 Published 新版本', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '送交審核', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '核准知識', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '退回或拒絕知識', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '發布正式知識', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '封存正式知識', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '查看版本紀錄', owner: 'yes', editor: 'yes', viewer: 'byScope' },
  { fn: '管理 AI Agent', owner: 'yes', editor: 'proposal', viewer: 'no' },
  { fn: '管理 Workflow', owner: 'yes', editor: 'proposal', viewer: 'no' },
  { fn: '建立 Prompt 草稿', owner: 'yes', editor: 'yes', viewer: 'no' },
  { fn: '核准 Prompt', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '修改治理政策', owner: 'yes', editor: 'no', viewer: 'no' },
  { fn: '查看全部 Audit Log', owner: 'yes', editor: 'byScope', viewer: 'no' },
  { fn: '修改系統設定', owner: 'yes', editor: 'no', viewer: 'no' },
]

export const functionLegend = {
  yes: '可',
  no: '不可',
  proposal: '提出修改建議',
  byScope: '依範圍',
}

export const scopeTypes = [
  { id: 'Global', label: 'Global', note: '全公司' },
  { id: 'Department', label: 'Department', note: '指定部門' },
  { id: 'Resource', label: 'Resource', note: '指定知識、Prompt、Agent 或 Workflow' },
  { id: 'Own', label: 'Own', note: '僅自己建立的草稿' },
]

export const resourceTypes = [
  { id: 'KnowledgeCard', label: '知識卡片' },
  { id: 'Prompt', label: 'Prompt' },
  { id: 'Agent', label: 'Agent' },
  { id: 'Workflow', label: 'Workflow' },
  { id: 'Setting', label: '系統設定' },
  { id: 'Role', label: '角色與權限' },
]

export const scopeRule = '角色允許此動作 ＋ 角色 Scope 涵蓋此資源 ＝ 可以執行。'

export const scopeExample =
  'Editor，Scope 為教育訓練交付部：可修改課程、教材與訓練 Prompt；不可修改財務政策與政府計畫知識。'

function roleOf(roleId) {
  return systemRoles.find((item) => item.id === roleId) ?? null
}

// 唯一的權限判斷入口。scope 可帶 departmentScope 或 resourceScope。
export function canRolePerform(roleId, capability, resource, scope) {
  const role = roleOf(roleId)
  if (!role) return { allowed: false, reason: `角色 ${roleId} 不存在。` }
  if (!role[capability]) {
    return { allowed: false, reason: `${role.name} 沒有 ${capability} 能力。` }
  }

  const kind = scope?.scope ?? 'Global'
  const types = scope?.resourceTypes
  if (types && !types.includes(resource.type)) {
    return { allowed: false, reason: `Scope 未涵蓋資源類型 ${resource.type}。` }
  }

  if (kind === 'Department') {
    const list = scope?.departmentScope ?? []
    if (!list.includes(resource.department)) {
      return {
        allowed: false,
        reason: `${role.name} 有 ${capability} 能力，但 Department Scope（${list.join('、') || '未設定'}）不涵蓋 ${resource.department}。`,
      }
    }
  }

  if (kind === 'Resource') {
    const list = scope?.resourceScope ?? []
    if (!list.includes(resource.id)) {
      return {
        allowed: false,
        reason: `${role.name} 有 ${capability} 能力，但 Resource Scope 不包含 ${resource.id}。`,
      }
    }
  }

  if (kind === 'Own' && resource.createdBy !== scope?.person) {
    return { allowed: false, reason: 'Own Scope 只涵蓋自己建立的草稿。' }
  }

  return { allowed: true, reason: `${role.name} 在 ${kind} 範圍內可執行 ${capability}。` }
}

// 目前的指派。尚未指定實際人員者留【請填入】，規則本身已可運作。
export const roleAssignments = [
  {
    id: 'RA-001',
    person: 'SUSU（負責人）',
    role: 'owner',
    scope: 'Global',
    departmentScope: [],
    resourceScope: [],
    resourceTypes: resourceTypes.map((item) => item.id),
    note: '全公司唯一的 System Owner。',
  },
  {
    id: 'RA-002',
    person: '【請填入：教育訓練承辦人】',
    role: 'editor',
    scope: 'Department',
    departmentScope: ['教育訓練交付部'],
    resourceScope: [],
    resourceTypes: ['KnowledgeCard', 'Prompt'],
    note: '可修改課程、教材與訓練 Prompt，不可修改財務政策與政府計畫知識。',
  },
  {
    id: 'RA-003',
    person: '【請填入：政府計畫承辦人】',
    role: 'editor',
    scope: 'Department',
    departmentScope: ['政府計畫部'],
    resourceScope: [],
    resourceTypes: ['KnowledgeCard'],
    note: '可建立政府計畫知識草稿，核准仍在 Owner。',
  },
  {
    id: 'RA-004',
    person: '【請填入：外部講師或合作夥伴】',
    role: 'viewer',
    scope: 'Resource',
    departmentScope: [],
    resourceScope: ['SERVICE-002', 'SOP-TRAINING-001'],
    resourceTypes: ['KnowledgeCard'],
    note: '只開放專案需要的特定卡片，不是全部已發布知識。',
  },
]

// ── 知識責任與系統角色分開 ────────────────────────────────────────

export const systemOwnerNote =
  'System Owner 管的是系統與權限；Knowledge Owner 管的是某一份知識的內容正確性。兩者不是同一件事，資料與畫面都分開稱呼。'

export const knowledgeRoles = [
  { id: 'knowledgeOwner', name: 'Knowledge Owner', duty: '對知識內容正確性與有效性負責' },
  { id: 'knowledgeEditor', name: 'Knowledge Editor', duty: '只能建立或修改草稿' },
  { id: 'knowledgeReviewer', name: 'Knowledge Reviewer', duty: '核准、退回或拒絕' },
  { id: 'knowledgeUser', name: 'Knowledge User', duty: '查詢與引用' },
]

export const knowledgeRuleList = [
  'System Owner 不等於 Knowledge Owner。',
  'Knowledge Owner 對內容正確性負責。',
  'Knowledge Editor 只能建立或修改草稿。',
  'Knowledge Reviewer 負責核准、退回或拒絕。',
  '修改正式知識必須建立新版本。',
  'Knowledge Owner 不能略過正式審核流程。',
]

// 知識類型對應的 Knowledge Owner。
// 規格中的「顧問專案交付部」不在現行九部門編制內，已對應到客戶開發與行銷部，
// 與 SOP-CONSULTING-001 的處理一致，並在此標明。
export const knowledgeOwnerMap = [
  { kind: 'Company', label: '公司知識', owner: '經營策略與決策部' },
  { kind: 'Service', label: '服務知識', owner: '客戶開發與行銷部' },
  { kind: 'FAQ', label: '常見問題', owner: '客戶服務部' },
  { kind: 'SOP', label: '標準流程', owner: '各流程所屬部門' },
  { kind: 'Policy', label: '政策與原則', owner: '經營策略與決策部' },
  { kind: 'Template', label: '回覆範本', owner: '知識與教材管理部或實際使用部門' },
  { kind: 'Glossary', label: '統一用語', owner: '知識與教材管理部' },
  { kind: 'Escalation', label: '升級規則', owner: '經營策略與決策部' },
  {
    kind: 'ConsultingMethod',
    label: '顧問方法',
    owner: '客戶開發與行銷部',
    note: '規格原寫「顧問專案交付部」，該部門不在現行九部門編制內，已對應到客戶開發與行銷部。',
  },
  { kind: 'TrainingMaterial', label: '教材', owner: '教育訓練交付部' },
  { kind: 'GovernmentProgram', label: '政府計畫', owner: '政府計畫部' },
  { kind: 'Finance', label: '財務', owner: '營運與財務管理部' },
]
