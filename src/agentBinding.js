// 綁定 AI 員工：勾選一條流程裡要讓哪些 Agent 上工。
// 沒有後端，勾選結果只存在這台瀏覽器的 localStorage。
//
// 三條寫成程式的限制：
//   1. 只有 Agent 節點可以勾選。人工關卡與系統節點永遠存在，不出現在勾選清單裡。
//   2. 停用的節點會顯示「已停用，本次不執行」，不是靜默跳過。
//   3. 修改流程定義在治理規則裡是 Level 4，每次變更都寫進 Audit Log。

import { writeAudit } from './govSystem.js'

const KEY = 'xm-agent-binding'
const listeners = new Set()

export const bindingRule = {
  ruleId: 'GOV-BINDING',
  ruleVersion: '1.0',
  effectiveFrom: '2026-08-02',
}

export const bindingNote =
  '勾選這條流程要讓哪些 AI 員工上工，執行時依流程既有順序進行。取消勾選的節點會被標示為已停用並跳過，不會靜默消失。'

export const bindingLevelNote =
  '修改流程定義在審核規則裡屬 Level 4，只有 Owner 可以決定。每次變更都會寫進 Audit Log。'

export const humanGateNote =
  '人工關卡與系統節點不列在勾選清單裡，也無法停用。這是不可自動化紅線，不提供開關。'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function write(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    return false
  }
  listeners.forEach((fn) => fn())
  return true
}

export function subscribeBinding(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// 只有 executor 為 agent 的節點可以被勾選。
export function bindableNodes(flow) {
  return flow.exec.filter((node) => node.executor === 'agent')
}

export function fixedNodes(flow) {
  return flow.exec.filter((node) => node.executor !== 'agent')
}

function disabledSet(flowId) {
  const all = read()
  return new Set(all[flowId] ?? [])
}

// 預設全部上工。只有明確被停用的才會關掉。
export function isNodeEnabled(flowId, nodeId) {
  return !disabledSet(flowId).has(nodeId)
}

export function disabledCount(flowId) {
  return disabledSet(flowId).size
}

export function bindingSummary(flow) {
  const bindable = bindableNodes(flow)
  const off = disabledSet(flow.id)
  const on = bindable.filter((node) => !off.has(node.id))
  return { total: bindable.length, enabled: on.length, disabled: bindable.length - on.length }
}

// 切換單一節點。人工關卡與系統節點一律拒絕，這是紅線不是設定。
export function toggleNode(flow, nodeId, actor) {
  const node = flow.exec.find((item) => item.id === nodeId)
  if (!node) return { ok: false, reason: `節點 ${nodeId} 不存在。` }
  if (node.executor !== 'agent') {
    return {
      ok: false,
      reason: `「${node.name}」是${node.executor === 'human' ? '人工關卡' : '系統節點'}，不可停用。`,
    }
  }

  const all = read()
  const current = new Set(all[flow.id] ?? [])
  const turningOff = !current.has(nodeId)
  if (turningOff) current.add(nodeId)
  else current.delete(nodeId)

  all[flow.id] = [...current]
  if (all[flow.id].length === 0) delete all[flow.id]
  write(all)

  writeAudit({
    actorType: 'human',
    actorId: actor ?? 'owner',
    action: turningOff ? 'disable_agent_node' : 'enable_agent_node',
    resourceType: 'Workflow',
    resourceId: `${flow.code}／${node.id}`,
    beforeStatus: turningOff ? '上工' : '已停用',
    afterStatus: turningOff ? '已停用' : '上工',
    approvalLevel: 4,
    reason: `${flow.name} 的「${node.name}」（${node.agentName ?? node.agentId}）`,
    result: 'success',
  })

  return {
    ok: true,
    reason: turningOff
      ? `已停用「${node.name}」，執行時會標示為已停用並跳過。`
      : `已恢復「${node.name}」上工。`,
  }
}

export function resetFlow(flow, actor) {
  const all = read()
  if (!all[flow.id]) return { ok: true, reason: '本來就是預設編制，沒有變更。' }
  delete all[flow.id]
  write(all)
  writeAudit({
    actorType: 'human',
    actorId: actor ?? 'owner',
    action: 'reset_agent_binding',
    resourceType: 'Workflow',
    resourceId: flow.code,
    approvalLevel: 4,
    reason: `${flow.name} 還原為預設編制`,
    result: 'success',
  })
  return { ok: true, reason: '已還原為預設編制，全部 Agent 恢復上工。' }
}

export function hasAnyBinding() {
  return Object.keys(read()).length > 0
}
