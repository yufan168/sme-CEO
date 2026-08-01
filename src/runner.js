import { hasApiKey } from './aiSettings.js'
import { callAI } from './callAI.js'
import { findMock } from './mockData.js'
import { buildProgramBrief } from './programs.js'

// 通用執行器：只讀 Workflow 定義，不寫死任何流程順序。
// 換一份定義就能執行另一條流程，不需要修改這個檔案。

export const companyContext = [
  '公司名稱：享洺有限公司',
  '產業：企業管理顧問',
  '成立年份：2021 年',
  '規模：5 人以下',
  '主要業務：企業管理顧問、政府計畫輔導',
  '負責人：SUSU',
].join('\n')

export function createRun(workflow) {
  const nodes = {}
  workflow.exec.forEach((node) => {
    nodes[node.id] = { status: 'pending' }
  })
  return {
    workflowId: workflow.id,
    mode: hasApiKey() ? 'real-ai' : 'demo',
    status: 'idle',
    currentNodeId: null,
    nodes,
  }
}

function findNode(workflow, id) {
  return workflow.exec.find((node) => node.id === id) ?? null
}

function collectPreviousOutputs(workflow, run, node) {
  const ids = node.readsFrom ?? []
  return ids
    .map((id) => {
      const source = findNode(workflow, id)
      const record = run.nodes[id]
      if (!source || !record || record.status !== 'completed') return null
      return { id, name: source.name, output: record.output }
    })
    .filter(Boolean)
}

function buildPrompt(workflow, node, previous) {
  const systemPrompt = [
    `你是「${workflow.name}」中的 ${node.name}（${node.agentName}）。`,
    '你只負責這一個步驟，不得代替其他節點做事，也不得對外承諾。',
    '無法確定的資訊必須明確標示為待確認，不得自行編造。',
    '',
    '公司資料：',
    companyContext,
  ].join('\n')

  const previousText = previous.length
    ? previous.map((item) => `【${item.name} 的產出】\n${item.output}`).join('\n\n')
    : '（本節點為流程中第一個 Agent，沒有前置產出）'

  // 節點宣告 knowledge 時帶入政府計畫條件，讓 Agent 有事實可依據。
  const brief = buildProgramBrief(node.knowledge)
  const knowledgeText = brief
    ? ['', '參考資料（只能引用，不得推翻或自行補充）：', brief].join('\n')
    : ''

  const userPrompt = [
    `本次流程目標：${workflow.goal}`,
    '',
    `你這一步的職責：${node.instruction}`,
    '',
    '前置節點產出：',
    previousText,
    knowledgeText,
    '',
    '請依下列格式輸出，每一項各自成段：',
    node.outputContract.map((item) => `【${item}】`).join('\n'),
  ].join('\n')

  return { systemPrompt, userPrompt }
}

async function executeAgentNode(workflow, run, node) {
  const previous = collectPreviousOutputs(workflow, run, node)
  const basis = previous.length
    ? previous.map((item) => `${item.name} 的產出`)
    : ['公司基本資料']

  if (!hasApiKey()) {
    if (node.demoOutput) {
      return {
        status: 'completed',
        mode: 'demo',
        summary: node.demoOutput.summary,
        basis: node.demoOutput.basis,
        output: node.demoOutput.result,
      }
    }
    // 節點未附示範產出時，退回使用該 Agent 的示範資料，流程不中斷。
    const mock = findMock(node.agentId)
    if (mock) {
      return {
        status: 'completed',
        mode: 'demo',
        summary: mock.cases[0].title,
        basis: ['Agent 示範資料 ' + mock.cases[0].id],
        output: mock.cases
          .map((item) => `【${item.id}　${item.title}】\n輸入：${item.input}\n輸出：${item.output}`)
          .join('\n\n'),
      }
    }
    return {
      status: 'failed',
      mode: 'demo',
      error: `節點 ${node.name} 沒有示範產出，${node.agentId} 也沒有示範資料。`,
    }
  }

  const { systemPrompt, userPrompt } = buildPrompt(workflow, node, previous)
  const result = await callAI({ systemPrompt, userPrompt })

  if (!result.ok) {
    return { status: 'failed', mode: 'real-ai', error: result.error }
  }

  return {
    status: 'completed',
    mode: 'real-ai',
    summary: node.instruction,
    basis: [...basis, '公司基本資料'],
    output: result.text,
  }
}

// onUpdate 會在每次狀態改變時被呼叫，讓畫面即時反映進度。
export async function runWorkflow(workflow, run, onUpdate, startId) {
  let current = findNode(workflow, startId ?? workflow.exec[0].id)
  run.status = 'running'
  onUpdate({ ...run })

  while (current) {
    // 只看 executor，不看節點名稱，改名不影響閘門。
    if (current.executor === 'human') {
      run.nodes[current.id] = {
        status: 'waiting_human',
        waitingMessage: current.waitingMessage,
      }
      run.status = 'waiting_human'
      run.currentNodeId = current.id
      onUpdate({ ...run })
      return run
    }

    if (current.executor === 'agent') {
      run.nodes[current.id] = { status: 'running' }
      run.currentNodeId = current.id
      onUpdate({ ...run })

      const result = await executeAgentNode(workflow, run, current)
      run.nodes[current.id] = result

      if (result.status === 'failed') {
        run.status = 'failed'
        onUpdate({ ...run })
        return run
      }
      onUpdate({ ...run })
    }

    if (current.executor === 'system') {
      run.nodes[current.id] = { status: 'completed', summary: current.name }
      onUpdate({ ...run })
    }

    current = current.next ? findNode(workflow, current.next) : null
  }

  run.status = 'completed'
  run.currentNodeId = null
  onUpdate({ ...run })
  return run
}

// 人工關卡的決定。核准後從下一個節點續跑；退回則把指定節點之後全部重置再跑一次。
export async function decideGate(workflow, run, nodeId, decision, onUpdate, note) {
  const node = findNode(workflow, nodeId)
  if (!node || node.executor !== 'human') return run

  if (decision === 'approve') {
    run.nodes[nodeId] = { status: 'completed', summary: '人工核准', decidedBy: '人' }
    if (!node.next) {
      run.status = 'completed'
      run.currentNodeId = null
      onUpdate({ ...run })
      return run
    }
    return runWorkflow(workflow, run, onUpdate, node.next)
  }

  // 退回修改：必須指定回到哪個節點，否則不動作。
  const target = node.rejectTo
  if (!target) return run

  run.nodes[nodeId] = {
    status: 'pending',
    rejectedNote: note || '退回修改，未附意見',
  }
  // 從退回目標開始，之後的節點全部重置。
  let cursor = findNode(workflow, target)
  while (cursor) {
    run.nodes[cursor.id] = { status: 'pending' }
    cursor = cursor.next ? findNode(workflow, cursor.next) : null
  }
  run.rejectNote = note || ''
  return runWorkflow(workflow, run, onUpdate, target)
}
