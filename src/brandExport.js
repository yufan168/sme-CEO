// 品牌資料與設計的 JSON 匯出。
// 給外部工具使用：品牌內容引擎、n8n、簡報、提案範本等。
//
// 兩條規則：
//   1. 設計代幣直接讀 CSS 變數的實際計算值，不另外維護一份，避免匯出與畫面不一致。
//   2. 絕不匯出 API 金鑰。金鑰只存在 sessionStorage，這裡不碰它。

import { blueprint, blueprintPrinciple, governanceChain } from './agentBlueprint.js'
import { businessLines } from './businessLines.js'
import { knowledgeCards } from './knowledgeCards.js'
import { workflows } from './workflows.js'
import { approvalLevels, riskKeywordGroups } from './govApproval.js'
import { systemRoles } from './govRoles.js'
import { aiPolicies } from './govSystem.js'
import { MOCK_LABEL, mockData, mockIsolationNote, mockStats } from './mockData.js'

export const EXPORT_VERSION = '1.0'

export const exportNotice =
  '本檔含享洺內部知識與治理規則，visibility 為 Internal 者不得原文對外。檔案不含 API 金鑰。'

export const companyProfile = {
  name: '享洺有限公司',
  industry: '企業管理顧問',
  founded: '2021',
  size: '5 人以下',
  owner: 'SUSU',
  tagline: '運用 AI 協助企業提升管理效率',
  contact: '【請填入：正式電話、Email、官方網站】',
  serviceHours: '【請填入：正式服務時間與回覆時限】',
}

// 設計代幣。分組只是為了可讀，值一律以 CSS 為準。
export const designTokenGroups = [
  {
    id: 'brand',
    label: '品牌色',
    vars: [
      '--brand-brown',
      '--brand-brown-deep',
      '--brand-brown-mid',
      '--brand-yellow',
      '--brand-gold',
      '--brand-gold-hover',
      '--brand-gold-soft',
    ],
  },
  {
    id: 'neutral',
    label: '版面中性色',
    vars: ['--ink', '--muted', '--paper', '--warm-white', '--cream', '--line', '--line-soft'],
  },
  {
    id: 'alias',
    label: '沿用別名',
    vars: ['--bg', '--surface', '--text', '--text-muted', '--border'],
  },
]

// 讀 CSS 實際生效的值。沒有 document 時回傳空物件，不猜。
export function readDesignTokens() {
  if (typeof document === 'undefined') return {}
  const style = getComputedStyle(document.documentElement)
  const out = {}
  designTokenGroups.forEach((group) => {
    out[group.id] = { label: group.label, tokens: {} }
    group.vars.forEach((name) => {
      const value = style.getPropertyValue(name).trim()
      out[group.id].tokens[name] = value || '（未定義）'
    })
  })
  return out
}

export function readTypography() {
  if (typeof document === 'undefined') return {}
  const body = getComputedStyle(document.body)
  return {
    fontFamily: body.fontFamily,
    fontSize: body.fontSize,
    lineHeight: body.lineHeight,
    note: '中文優先使用系統內建正黑體，未載入外部字型。',
  }
}

function countAgents() {
  return blueprint.reduce((n, dept) => n + dept.agents.length, 0)
}

// 完整資料包。外部工具通常只吃得下其中幾段，因此分段清楚、各段可獨立取用。
export function buildBrandExport() {
  return {
    _meta: {
      schema: 'xiangming-brand-export',
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      source: '享洺 AI 公司管理系統',
      notice: exportNotice,
      containsApiKey: false,
    },

    company: companyProfile,

    positioning: {
      tagline: companyProfile.tagline,
      principle: blueprintPrinciple,
      governanceChain,
      scope: [
        '企業管理顧問',
        '教育訓練與企業內訓',
        '政府計畫輔導',
        '知識與教材管理',
        '企業 AI 應用規劃',
        'ISO 制度升級與改版輔導',
        'ESG 與碳管理',
      ],
    },

    design: {
      colors: readDesignTokens(),
      typography: readTypography(),
      note: '色票直接讀自實際生效的 CSS 變數，與畫面一致。',
    },

    businessLines: businessLines.map((line) => ({
      name: line.name,
      note: line.note ?? '',
    })),

    organization: {
      departmentCount: blueprint.length,
      agentCount: countAgents(),
      departments: blueprint.map((dept) => ({
        name: dept.department,
        gateChain: dept.gateChain,
        flow: dept.flow,
        agents: dept.agents.map((agent) => ({
          id: agent.id,
          name: agent.name,
          type: agent.type,
          duty: agent.duty,
          limit: agent.limit,
        })),
      })),
    },

    workflows: workflows.map((flow) => ({
      code: flow.code,
      name: flow.name,
      department: flow.department,
      focus: flow.focus ?? '',
      goal: flow.goal,
      steps: flow.exec.map((node) => ({
        name: node.name,
        executor: node.executor,
        agentId: node.agentId ?? '',
        agentName: node.agentName ?? '',
      })),
    })),

    governance: {
      roles: systemRoles.map((role) => ({
        name: role.name,
        note: role.note,
        who: role.who,
        read: role.read,
        write: role.write,
        approve: role.approve,
        manage: role.manage,
      })),
      approvalLevels: approvalLevels.map((level) => ({
        level: level.id,
        name: level.name,
        approverRole: level.approverRole,
        humanSendRequired: level.humanSendRequired,
      })),
      riskKeywords: riskKeywordGroups.map((group) => ({
        name: group.name,
        words: group.words,
      })),
      aiPolicies: aiPolicies.map((policy) => ({
        id: policy.id,
        name: policy.name,
        text: policy.text,
      })),
    },

    knowledge: {
      total: knowledgeCards.length,
      published: knowledgeCards.filter((card) => card.status === 'Published').length,
      quotableExternally: knowledgeCards.filter((card) => card.canQuoteExternally).length,
      cards: knowledgeCards.map((card) => ({
        id: card.id,
        title: card.title,
        category: card.category,
        summary: card.summary,
        content: card.content,
        owner: card.owner,
        status: card.status,
        visibility: card.visibility,
        allowAIUse: card.allowAIUse,
        canQuoteExternally: card.canQuoteExternally,
        tags: card.tags,
      })),
    },

    mockData: buildMockSection(),
  }
}

// 示範資料。五個隔離旗標與每一句的示範標記都原樣帶出去，
// 匯進別的系統後仍然看得出來這不是享洺的真實數據。
function buildMockSection() {
  return {
    label: MOCK_LABEL,
    isolation: mockIsolationNote,
    agents: mockStats.agents,
    cases: mockStats.cases,
    rows: mockData.map((row) => ({
      agentId: row.agentId,
      agentName: row.agentName,
      department: row.dept,
      source: row.source,
      mode: row.mode,
      isFictional: row.isFictional,
      companyData: row.companyData,
      canSendExternally: row.canSendExternally,
      allowKnowledgeRetrieval: row.allowKnowledgeRetrieval,
      cases: row.cases.map((item) => ({
        id: item.id,
        title: item.title,
        input: item.input,
        output: item.output,
      })),
    })),
  }
}

// 示範資料指到的 Agent 必須真的存在，反過來也要每位都有示範資料。
// 匯進外部系統前先擋掉對不上的情況，不要等匯完才發現少人。
export function mockReferenceIssues() {
  const blueprintIds = new Set(blueprint.flatMap((dept) => dept.agents.map((agent) => agent.id)))
  const mockIds = new Set(mockData.map((row) => row.agentId))
  const issues = []
  mockData.forEach((row) => {
    if (!blueprintIds.has(row.agentId)) {
      issues.push(`示範資料 ${row.agentId} 找不到對應的 Agent。`)
    }
  })
  blueprint.forEach((dept) => {
    dept.agents.forEach((agent) => {
      if (!mockIds.has(agent.id)) {
        issues.push(`${agent.id}（${agent.name}）沒有示範資料。`)
      }
    })
  })
  return issues
}

// 給外部 Agent 管理系統匯入用。攤平成「部門 → Agent → 示範情境」三層，
// 不用巢狀的品牌結構，因為多數管理工具只吃得下一份扁平的 agent 清單。
export function buildAgentImportExport() {
  const mockByAgent = new Map(mockData.map((row) => [row.agentId, row]))

  return {
    _meta: {
      schema: 'xiangming-agent-import',
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      source: '享洺 AI 公司管理系統',
      scope: 'agent-manager-import',
      notice:
        '含享洺內部編制與治理規則，僅供內部管理系統使用。示範情境為虛構資料，已逐句標記。檔案不含 API 金鑰。',
      containsApiKey: false,
      referenceIssues: mockReferenceIssues(),
    },

    company: companyProfile,

    principle: blueprintPrinciple,
    governanceChain,

    design: {
      colors: readDesignTokens(),
      typography: readTypography(),
    },

    departments: blueprint.map((dept) => ({
      name: dept.department,
      agentCount: dept.agents.length,
      gateChain: dept.gateChain,
      flow: dept.flow,
    })),

    agents: blueprint.flatMap((dept) =>
      dept.agents.map((agent) => {
        const mock = mockByAgent.get(agent.id)
        return {
          id: agent.id,
          name: agent.name,
          department: dept.department,
          type: agent.type,
          duty: agent.duty,
          limit: agent.limit,
          outputContract: agent.output ?? [],
          // 每位 Agent 帶自己的示範情境，匯入端不必再做一次 join。
          demoCases: mock
            ? mock.cases.map((item) => ({
                id: item.id,
                title: item.title,
                input: item.input,
                output: item.output,
                isFictional: true,
                canSendExternally: false,
              }))
            : [],
          demoSource: mock?.source ?? '',
        }
      })
    ),

    workflows: workflows.map((flow) => ({
      code: flow.code,
      name: flow.name,
      department: flow.department,
      goal: flow.goal,
      steps: flow.exec.map((node, index) => ({
        order: index + 1,
        name: node.name,
        executor: node.executor,
        agentId: node.agentId ?? '',
        agentName: node.agentName ?? '',
      })),
    })),

    governance: {
      roles: systemRoles.map((role) => ({ name: role.name, who: role.who, note: role.note })),
      approvalLevels: approvalLevels.map((level) => ({
        level: level.id,
        name: level.name,
        approverRole: level.approverRole,
        humanSendRequired: level.humanSendRequired,
      })),
      aiPolicies: aiPolicies.map((policy) => ({ id: policy.id, name: policy.name, text: policy.text })),
    },

    knowledge: knowledgeCards.map((card) => ({
      id: card.id,
      title: card.title,
      category: card.category,
      summary: card.summary,
      content: card.content,
      owner: card.owner,
      status: card.status,
      visibility: card.visibility,
      allowAIUse: card.allowAIUse,
      canQuoteExternally: card.canQuoteExternally,
      tags: card.tags,
    })),

    demoDataNote: mockIsolationNote,
  }
}

// 只給對外用的精簡版：拿掉 Internal 知識與治理細節。
export function buildPublicExport() {
  const full = buildBrandExport()
  return {
    _meta: { ...full._meta, scope: 'public-safe', notice: '本檔已移除 Internal 知識與治理細節。' },
    company: {
      name: full.company.name,
      industry: full.company.industry,
      founded: full.company.founded,
      owner: full.company.owner,
      tagline: full.company.tagline,
      contact: full.company.contact,
    },
    positioning: { tagline: full.positioning.tagline, scope: full.positioning.scope },
    design: full.design,
    businessLines: full.businessLines,
    knowledge: {
      note: '僅含標示可原文對外的知識。',
      cards: full.knowledge.cards.filter((card) => card.canQuoteExternally),
    },
  }
}

// 檔名一律用 ASCII。瀏覽器會把 download 屬性裡的非 ASCII 檔名整個丟掉，
// 下載結果會變成沒有副檔名的 download，使用者拿到手不知道那是什麼檔。
export function exportFilename(kind) {
  const stamp = new Date().toISOString().slice(0, 10)
  return `xiangming-brand-${kind}-${stamp}.json`
}

export function downloadJson(filename, data) {
  const text = JSON.stringify(data, null, 2)
  try {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 立刻 revoke 會讓瀏覽器來不及讀取建議檔名，下載檔會變成沒有副檔名的 download。
    setTimeout(() => URL.revokeObjectURL(url), 30000)
    return { ok: true, reason: `已下載 ${filename}。` }
  } catch (error) {
    return { ok: false, reason: `下載失敗：${String(error?.message ?? error)}` }
  }
}
