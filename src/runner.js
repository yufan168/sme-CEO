import { hasApiKey } from './aiSettings.js'
import { callAI } from './callAI.js'

// 通用執行器：只讀 Workflow 定義，不寫死任何流程順序。
// 換一份定義就能執行另一條流程，不需要修改這個檔案。

export const companyContext = [
  '公司名稱：享洺有限公司',
  '產業：企業管理顧問',
  '成立年份：2023 年',
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

  const userPrompt = [
    `本次流程目標：${workflow.goal}`,
    '',
    `你這一步的職責：${node.instruction}`,
    '',
    '前置節點產出：',
    previousText,
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
    return {
      status: 'completed',
      mode: 'demo',
      summary: node.demoOutput.summary,
      basis: node.demoOutput.basis,
      output: node.demoOutput.result,
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
export async function runWorkflow(workflow, run, onUpdate) {
  let current = findNode(workflow, workflow.exec[0].id)
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
