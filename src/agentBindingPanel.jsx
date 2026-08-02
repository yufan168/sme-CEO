import { useEffect, useState } from 'react'
import {
  bindableNodes,
  bindingLevelNote,
  bindingNote,
  bindingRule,
  bindingSummary,
  fixedNodes,
  humanGateNote,
  isNodeEnabled,
  resetFlow,
  subscribeBinding,
  toggleNode,
} from './agentBinding.js'

const executorLabels = {
  human: '人工關卡',
  system: '系統節點',
}

export function AgentBindingPanel({ flow }) {
  const [, tick] = useState(0)
  const [message, setMessage] = useState(null)
  useEffect(() => subscribeBinding(() => tick((n) => n + 1)), [])

  const agents = bindableNodes(flow)
  const fixed = fixedNodes(flow)
  const summary = bindingSummary(flow)

  const onToggle = (nodeId) => setMessage(toggleNode(flow, nodeId, 'SUSU（負責人）'))
  const onReset = () => setMessage(resetFlow(flow, 'SUSU（負責人）'))

  return (
    <article className="card">
      <h3 className="dept-name">綁定 AI 員工</h3>
      <p className="gov-stamp">
        {bindingRule.ruleId}　v{bindingRule.ruleVersion}　生效 {bindingRule.effectiveFrom}
        <span className="gov-level gov-level-L4">Level 4</span>
      </p>
      <p className="group-note">{bindingNote}</p>

      <div className="bind-grid">
        {agents.map((node, index) => {
          const on = isNodeEnabled(flow.id, node.id)
          return (
            <label className={on ? 'bind-chip' : 'bind-chip is-off'} key={node.id}>
              <input type="checkbox" checked={on} onChange={() => onToggle(node.id)} />
              <span className="bind-order">{index + 1}</span>
              <span className="bind-name">
                {node.agentName ?? node.name}
                <span className="bind-id">{node.agentId}</span>
              </span>
            </label>
          )
        })}
      </div>

      <p className="dept-step-reason">
        目前 {summary.enabled} / {summary.total} 位上工
        {summary.disabled > 0 && `，${summary.disabled} 位已停用`}。
      </p>

      <p className="dept-step-name">不可停用的節點</p>
      <div className="bind-grid">
        {fixed.map((node) => (
          <span className="bind-chip is-locked" key={node.id}>
            <span className="bind-lock">鎖定</span>
            <span className="bind-name">
              {node.name}
              <span className="bind-id">{executorLabels[node.executor] ?? node.executor}</span>
            </span>
          </span>
        ))}
      </div>
      <p className="dept-step-reason">{humanGateNote}</p>
      <p className="dept-step-reason">{bindingLevelNote}</p>

      <div className="field-actions">
        <button type="button" className="ghost-button" onClick={onReset}>
          還原為預設編制
        </button>
      </div>
      {message && (
        <p className={message.ok ? 'gov-allow' : 'run-error'}>{message.reason}</p>
      )}
    </article>
  )
}
