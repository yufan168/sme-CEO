import { useEffect, useMemo, useState } from 'react'
import {
  canRolePerform,
  capabilities,
  functionLegend,
  functionMatrix,
  knowledgeOwnerMap,
  knowledgeRuleList,
  knowledgeRoles,
  resourceTypes,
  roleAssignments,
  rolesRule,
  scopeExample,
  scopeRule,
  scopeTypes,
  systemOwnerNote,
  systemRoles,
} from './govRoles.js'
import {
  approvalLevels,
  approvalRule,
  escalationFlow,
  escalationGaps,
  escalationMatrix,
  escalationRule,
  evaluateApprovalLevel,
  keywordNote,
  level3Groups,
  level4Items,
  riskKeywordGroups,
  samplingConfigured,
  samplingSettings,
} from './govApproval.js'
import {
  canAIUseKnowledge,
  computeConfidence,
  confidenceDefinitions,
  confidenceLimitNote,
  confidenceRule,
  confidenceSourceNote,
  effectiveStatusNote,
  evaluateKnowledgeReviewStatus,
  knowledgePolicies,
  knowledgeRule,
  lifecycleStates,
  lifecycleTransitions,
  reviewIntervals,
} from './govKnowledge.js'
import {
  adjustableSettings,
  agentEvents,
  aiPolicies,
  aiPolicyRule,
  applySetting,
  auditAgentExample,
  auditDeleteNote,
  auditFields,
  auditForbidden,
  auditHumanExample,
  auditRule,
  centerIntro,
  centerTitle,
  crossCuttingControls,
  governanceChainOrder,
  governanceModules,
  humanEvents,
  lockedSettings,
  mockIdentityNote,
  promptCardFields,
  promptCardIssues,
  promptCards,
  promptFlow,
  promptRule,
  promptRules,
  promptStatuses,
  readAuditLog,
  settingsRule,
  subscribeAudit,
} from './govSystem.js'
import { knowledgeCards } from './knowledgeCards.js'

function RuleStamp({ rule }) {
  return (
    <p className="gov-stamp">
      {rule.ruleId}　v{rule.ruleVersion}　生效 {rule.effectiveFrom}
    </p>
  )
}

function SummarySection({ identity }) {
  const stats = [
    { label: '角色數量', value: systemRoles.length },
    { label: '強制審核規則', value: level3Groups.reduce((n, g) => n + g.items.length, 0) + level4Items.length },
    { label: '升級規則', value: escalationMatrix.length },
    { label: '啟用中的治理政策', value: aiPolicies.length },
  ]

  return (
    <section className="card">
      <h2 className="card-title">{centerTitle}</h2>
      <p className="group-note">{centerIntro}</p>
      <div className="metric-grid">
        {stats.map((item) => (
          <article className="card metric-card" key={item.label}>
            <p className="metric-value">{item.value}</p>
            <p className="metric-label">{item.label}</p>
          </article>
        ))}
      </div>
      <p className="dept-step-reason">
        目前檢視身分：{identity}。{mockIdentityNote}
      </p>
    </section>
  )
}

function ArchitectureSection() {
  return (
    <section className="card">
      <h2 className="card-title">治理中心架構</h2>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>模組</th>
              <th>中文</th>
              <th>負責決定什麼</th>
            </tr>
          </thead>
          <tbody>
            {governanceModules.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.zh}</td>
                <td>{item.purpose}</td>
              </tr>
            ))}
            {crossCuttingControls.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.name}
                  <span className="gov-cross">橫向</span>
                </td>
                <td>{item.zh}</td>
                <td>{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dept-step-name">控制鏈</p>
      <div className="dept-block">
        {governanceChainOrder.map((item, index) => (
          <p className="dept-step-text" key={item}>
            {index + 1}. {item}
          </p>
        ))}
      </div>
    </section>
  )
}

function RolesSection({ identity }) {
  const [assignmentId, setAssignmentId] = useState(roleAssignments[1].id)
  const [department, setDepartment] = useState('教育訓練交付部')
  const [capability, setCapability] = useState('write')

  const assignment = roleAssignments.find((item) => item.id === assignmentId)
  const result = useMemo(
    () =>
      canRolePerform(
        assignment.role,
        capability,
        { type: 'KnowledgeCard', department, id: 'SERVICE-002', createdBy: assignment.person },
        assignment
      ),
    [assignment, capability, department]
  )

  const departments = [...new Set(knowledgeCards.map((card) => card.owner))].sort()

  return (
    <section className="card">
      <h2 className="card-title">Roles &amp; Permissions｜角色與權限</h2>
      <RuleStamp rule={rolesRule} />
      <p className="gov-principle">{scopeRule}</p>
      <p className="group-note">{systemOwnerNote}</p>

      <h3 className="dept-name">基礎權限矩陣</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>角色</th>
              {capabilities.map((item) => (
                <th key={item.id}>{item.label}</th>
              ))}
              <th>建議人員</th>
            </tr>
          </thead>
          <tbody>
            {systemRoles.map((role) => (
              <tr key={role.id} className={role.id === identity ? 'gov-row-active' : undefined}>
                <td>{role.name}</td>
                {capabilities.map((item) => (
                  <td key={item.id} className={role[item.id] ? 'gov-yes' : 'gov-no'}>
                    {role[item.id] ? '✓' : '✕'}
                  </td>
                ))}
                <td>{role.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">完整功能權限</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>功能</th>
              <th>Owner</th>
              <th>Editor</th>
              <th>Viewer</th>
            </tr>
          </thead>
          <tbody>
            {functionMatrix.map((row) => (
              <tr key={row.fn}>
                <td>{row.fn}</td>
                {['owner', 'editor', 'viewer'].map((role) => (
                  <td
                    key={role}
                    className={
                      row[role] === 'yes' ? 'gov-yes' : row[role] === 'no' ? 'gov-no' : 'gov-cond'
                    }
                  >
                    {functionLegend[row[role]]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">Role Scope</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Scope</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            {scopeTypes.map((item) => (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dept-step-reason">{scopeExample}</p>

      <h3 className="dept-name">目前的指派</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>編號</th>
              <th>人員</th>
              <th>角色</th>
              <th>Scope</th>
              <th>範圍</th>
              <th>資源類型</th>
            </tr>
          </thead>
          <tbody>
            {roleAssignments.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.person}</td>
                <td>{item.role}</td>
                <td>{item.scope}</td>
                <td>
                  {item.scope === 'Department'
                    ? item.departmentScope.join('、')
                    : item.scope === 'Resource'
                      ? item.resourceScope.join('、')
                      : '全公司'}
                </td>
                <td>
                  {item.resourceTypes
                    .map((id) => resourceTypes.find((r) => r.id === id)?.label ?? id)
                    .join('、')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">權限判斷試算</h3>
      <p className="group-note">
        這是 canRolePerform() 實際執行的結果。角色與 Scope 兩項都成立才會放行。
      </p>
      <div className="gov-controls">
        <label className="gov-field">
          <span>指派</span>
          <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)}>
            {roleAssignments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}　{item.role}／{item.scope}
              </option>
            ))}
          </select>
        </label>
        <label className="gov-field">
          <span>動作</span>
          <select value={capability} onChange={(e) => setCapability(e.target.value)}>
            {capabilities.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="gov-field">
          <span>資源所屬部門</span>
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className={result.allowed ? 'gov-allow' : 'run-error'}>
        {result.allowed ? '放行' : '擋下'}：{result.reason}
      </p>

      <h3 className="dept-name">Knowledge Owner</h3>
      <div className="dept-grid agent-grid">
        <article className="card dept-card">
          <h3 className="dept-name">四種知識角色</h3>
          <div className="dept-block">
            {knowledgeRoles.map((item) => (
              <p className="dept-role" key={item.id}>
                <span className="dept-role-name">{item.name}</span>
                <span>{item.duty}</span>
              </p>
            ))}
          </div>
        </article>
        <article className="card dept-card">
          <h3 className="dept-name">規則</h3>
          <ul className="dept-list">
            {knowledgeRuleList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>知識類型</th>
              <th>Knowledge Owner</th>
            </tr>
          </thead>
          <tbody>
            {knowledgeOwnerMap.map((row) => (
              <tr key={row.kind}>
                <td>
                  {row.label}
                  <span className="gov-sub">{row.kind}</span>
                </td>
                <td>
                  {row.owner}
                  {row.note && <span className="gov-sub">{row.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const EVAL_FLAGS = [
  { key: 'internalOnly', label: '純內部使用' },
  { key: 'usesPublishedKnowledge', label: '完整引用 Published 知識' },
  { key: 'containsAmount', label: '涉及金額' },
  { key: 'containsPromise', label: '包含承諾' },
  { key: 'containsApology', label: '正式道歉或責任認定' },
  { key: 'containsLegal', label: '合約或法律' },
  { key: 'containsPersonalData', label: '個資或機密' },
  { key: 'containsGovernmentFiling', label: '政府申報或核銷' },
  { key: 'containsProfessionalConclusion', label: '正式專業結論' },
  { key: 'containsMajorComplaint', label: '重大客訴' },
  { key: 'governanceChange', label: '修改治理政策或權限' },
]

function ApprovalSection() {
  const [flags, setFlags] = useState({
    internalOnly: false,
    usesPublishedKnowledge: true,
    containsAmount: false,
  })
  const [confidence, setConfidence] = useState('High')

  const result = useMemo(
    () =>
      evaluateApprovalLevel({
        type: '客戶回覆',
        knowledgeConfidence: confidence,
        sourceKnowledgeIds: flags.usesPublishedKnowledge ? ['FAQ-001'] : [],
        ...flags,
      }),
    [flags, confidence]
  )

  const toggle = (key) => setFlags((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <section className="card">
      <h2 className="card-title">Approval Rules｜審核規則</h2>
      <RuleStamp rule={approvalRule} />

      {approvalLevels.map((level) => (
        <article className="card dept-card" key={level.id}>
          <h3 className="dept-name">
            Level {level.id}｜{level.name}
          </h3>
          <p className="dept-step-reason">核准者：{level.approverRole}</p>
          <p className="dept-step-name">用途</p>
          <p className="dept-step-text">{level.uses.join('、')}</p>
          <p className="dept-step-name">規則</p>
          <ul className="dept-list">
            {level.rules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {level.note && <p className="dept-step-reason">{level.note}</p>}
        </article>
      ))}

      <h3 className="dept-name">Level 3 涵蓋範圍</h3>
      <div className="dept-grid agent-grid">
        {level3Groups.map((group) => (
          <article className="card dept-card" key={group.name}>
            <h3 className="dept-name">{group.name}</h3>
            <p className="dept-step-text">{group.items.join('、')}</p>
          </article>
        ))}
      </div>

      <h3 className="dept-name">Level 4 僅 Owner 可決定</h3>
      <p className="dept-step-text">{level4Items.join('、')}</p>

      <h3 className="dept-name">審核判定試算</h3>
      <p className="group-note">
        這是 evaluateApprovalLevel() 實際執行的判定，順序由高到低，先命中先決定。
      </p>
      <div className="gov-checks">
        {EVAL_FLAGS.map((item) => (
          <label className="gov-check" key={item.key}>
            <input type="checkbox" checked={!!flags[item.key]} onChange={() => toggle(item.key)} />
            <span>{item.label}</span>
          </label>
        ))}
        <label className="gov-field">
          <span>知識可信度</span>
          <select value={confidence} onChange={(e) => setConfidence(e.target.value)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>
      <div className="dept-block">
        <p className="dept-role">
          <span className="dept-role-name">判定結果</span>
          <span>
            <span className={`gov-level gov-level-L${result.level}`}>Level {result.level}</span>
            {result.label}
          </span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">理由</span>
          <span>{result.reasons.join('、')}</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">核准角色</span>
          <span>{result.approverRole}</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">是否須由人送出</span>
          <span className={result.humanSendRequired ? 'gov-no' : 'gov-yes'}>
            {result.humanSendRequired ? '是' : '否'}
          </span>
        </p>
      </div>

      <h3 className="dept-name">Level 2 抽查機制</h3>
      <div className="dept-block">
        <p className="dept-role">
          <span className="dept-role-name">每週至少抽查</span>
          <span>{samplingSettings.minPerWeek} 筆</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">或每批抽查</span>
          <span>{samplingSettings.ratioPercent} %</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">連續錯誤門檻</span>
          <span>{samplingSettings.failThreshold} 筆</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">超過門檻時</span>
          <span>{samplingSettings.onFail}</span>
        </p>
      </div>
      {!samplingConfigured() && (
        <p className="run-error">
          抽查參數尚未設定，Level 2 目前無法自動判斷是否升級。在補齊前，這一級等同沒有抽查。
        </p>
      )}

      <h3 className="dept-name">高風險提示詞</h3>
      <p className="group-note">{keywordNote}</p>
      <div className="dept-grid agent-grid">
        {riskKeywordGroups.map((group) => (
          <article className="card dept-card" key={group.id}>
            <h3 className="dept-name">{group.name}</h3>
            <p className="gov-words">{group.words.join('、')}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function EscalationSection() {
  const gaps = escalationGaps()

  return (
    <section className="card">
      <h2 className="card-title">Escalation Rules｜升級規則</h2>
      <RuleStamp rule={escalationRule} />
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>事件</th>
              <th>等級</th>
              <th>第一指派</th>
              <th>時限</th>
              <th>備援</th>
              <th>AI 應做</th>
              <th>AI 不應做</th>
              <th>阻擋自動送出</th>
            </tr>
          </thead>
          <tbody>
            {escalationMatrix.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.event}</td>
                <td>{row.severity}</td>
                <td>
                  {row.assigneeRole}
                  <span className="gov-sub">{row.department}</span>
                </td>
                <td>{row.responseTarget}</td>
                <td>{row.fallback}</td>
                <td>{row.aiShould}</td>
                <td className="gov-no">{row.aiShouldNot}</td>
                <td className={row.blockAutoSend ? 'gov-yes' : 'gov-no'}>
                  {row.blockAutoSend ? '是' : '否'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="dept-step-name">無人接手的處理</p>
      <div className="dept-block">
        {escalationFlow.map((item, index) => (
          <p className="dept-step-text" key={item}>
            {index + 1}. {item}
          </p>
        ))}
      </div>

      {gaps.length > 0 && (
        <>
          <p className="dept-step-name">尚未生效的部分</p>
          <ul className="dept-list gov-deny">
            {gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function AiPolicySection() {
  return (
    <section className="card">
      <h2 className="card-title">AI Policies｜AI 治理政策</h2>
      <RuleStamp rule={aiPolicyRule} />
      <div className="dept-block">
        {aiPolicies.map((item) => (
          <div className="dept-step" key={item.id}>
            <p className="dept-step-name">
              {item.id}｜{item.name}
            </p>
            <p className="dept-step-text">{item.text}</p>
            {item.items && <p className="dept-step-reason">{item.items.join('、')}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

function KnowledgeSection() {
  const [cardId, setCardId] = useState('FAQ-001')
  const [today, setToday] = useState('2026-08-02')
  const card = knowledgeCards.find((item) => item.id === cardId) ?? knowledgeCards[0]
  const review = useMemo(() => evaluateKnowledgeReviewStatus(card, today), [card, today])
  const conf = useMemo(() => computeConfidence(card, today), [card, today])
  const gate = useMemo(() => canAIUseKnowledge(card, null, today), [card, today])

  return (
    <section className="card">
      <h2 className="card-title">Knowledge Policies｜知識治理</h2>
      <RuleStamp rule={knowledgeRule} />
      <ul className="dept-list">
        {knowledgePolicies.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h3 className="dept-name">Knowledge Lifecycle</h3>
      <p className="group-note">{effectiveStatusNote}</p>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>狀態</th>
              <th>AI 是否可引用</th>
              <th>說明</th>
            </tr>
          </thead>
          <tbody>
            {lifecycleStates.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.id}
                  <span className="gov-sub">{item.label}</span>
                </td>
                <td className={item.aiUsable ? 'gov-yes' : 'gov-no'}>
                  {item.aiUsable ? '可' : '不可'}
                </td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>由</th>
              <th>到</th>
              <th>觸發</th>
            </tr>
          </thead>
          <tbody>
            {lifecycleTransitions.map((row) => (
              <tr key={`${row.from}-${row.to}-${row.trigger}`}>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>{row.trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">複審週期</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>知識類型</th>
              <th>建議複審週期</th>
            </tr>
          </thead>
          <tbody>
            {reviewIntervals.map((row) => (
              <tr key={row.kind}>
                <td>{row.label}</td>
                <td>
                  {row.days} 天{row.note && <span className="gov-sub">{row.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">AI Confidence Gate</h3>
      <RuleStamp rule={confidenceRule} />
      <p className="group-note">{confidenceSourceNote}</p>
      <div className="dept-grid agent-grid">
        {confidenceDefinitions.map((item) => (
          <article className="card dept-card" key={item.level}>
            <h3 className="dept-name">
              <span className={`gov-conf gov-conf-${item.level}`}>{item.level}</span>
            </h3>
            <p className="dept-step-name">條件</p>
            <ul className="dept-list">
              {item.conditions.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
            <p className="dept-step-name">行為</p>
            <ul className="dept-list">
              {item.behaviour.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="gov-principle">{confidenceLimitNote}</p>

      <h3 className="dept-name">試算</h3>
      <p className="group-note">
        改變日期就能看到同一張卡片如何走到 NeedsReview、Confidence 如何跟著降、
        canAIUseKnowledge() 如何擋下來。
      </p>
      <div className="gov-controls">
        <label className="gov-field">
          <span>知識卡片</span>
          <select value={cardId} onChange={(e) => setCardId(e.target.value)}>
            {knowledgeCards.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}　{item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="gov-field">
          <span>假設今天是</span>
          <input type="date" value={today} onChange={(e) => setToday(e.target.value)} />
        </label>
      </div>
      <div className="dept-block">
        <p className="dept-role">
          <span className="dept-role-name">儲存狀態</span>
          <span>{review.storedStatus}</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">effectiveStatus</span>
          <span>
            {review.effectiveStatus}
            {review.computed && <span className="gov-cross">系統計算</span>}
            　{review.reason}
          </span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">Confidence</span>
          <span>
            <span className={`gov-conf gov-conf-${conf.level}`}>{conf.level}</span>
            {conf.reasons.join('　')}
          </span>
        </p>
        <p className={gate.allowed ? 'gov-allow' : 'run-error'}>
          canAIUseKnowledge：{gate.allowed ? `允許（${gate.mode}）` : '擋下'}　{gate.reason}
        </p>
      </div>
    </section>
  )
}

function PromptSection() {
  const [promptId, setPromptId] = useState(promptCards[0].promptId)
  const card = promptCards.find((item) => item.promptId === promptId) ?? promptCards[0]
  const issues = promptCardIssues(card, promptCards)

  return (
    <section className="card">
      <h2 className="card-title">Prompt Policies｜Prompt 治理</h2>
      <RuleStamp rule={promptRule} />
      <ul className="dept-list">
        {promptRules.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="dept-step-name">狀態</p>
      <p className="dept-step-text">{promptStatuses.join('　→　')}</p>

      <p className="dept-step-name">修改流程</p>
      <div className="dept-block">
        {promptFlow.map((item, index) => (
          <p className="dept-step-text" key={item}>
            {index + 1}. {item}
          </p>
        ))}
      </div>

      <div className="gov-controls">
        <label className="gov-field">
          <span>Prompt Card</span>
          <select value={promptId} onChange={(e) => setPromptId(e.target.value)}>
            {promptCards.map((item) => (
              <option key={item.promptId} value={item.promptId}>
                {item.promptId}　{item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>欄位</th>
              <th>
                {card.promptId} v{card.version}
              </th>
            </tr>
          </thead>
          <tbody>
            {promptCardFields.map((field) => {
              const value = card[field.key]
              const text = Array.isArray(value) ? value.join('、') : String(value ?? '')
              return (
                <tr key={field.key}>
                  <td>{field.label}</td>
                  <td className={text.includes('【請填入') ? 'gov-cond' : undefined}>{text}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="dept-step-name">送審檢查</p>
      {issues.length ? (
        <ul className="dept-list gov-deny">
          {issues.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="gov-allow">可送審。</p>
      )}
    </section>
  )
}

function AuditSection() {
  const [, tick] = useState(0)
  useEffect(() => subscribeAudit(() => tick((n) => n + 1)), [])
  const log = readAuditLog()

  return (
    <section className="card">
      <h2 className="card-title">Audit Log｜操作紀錄</h2>
      <RuleStamp rule={auditRule} />
      <div className="dept-grid agent-grid">
        <article className="card dept-card">
          <h3 className="dept-name">人員事件</h3>
          <ul className="dept-list">
            {humanEvents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card dept-card">
          <h3 className="dept-name">AI 事件</h3>
          <ul className="dept-list">
            {agentEvents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <p className="dept-step-name">Audit Log 欄位</p>
      <p className="dept-step-text">{auditFields.join('、')}</p>

      <p className="dept-step-name">禁止記錄</p>
      <ul className="dept-list gov-deny">
        {auditForbidden.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="dept-step-name">紀錄結構</p>
      <pre className="run-output">{JSON.stringify(auditHumanExample, null, 2)}</pre>
      <pre className="run-output">{JSON.stringify(auditAgentExample, null, 2)}</pre>

      <h3 className="dept-name">實際紀錄</h3>
      <p className="group-note">{auditDeleteNote}</p>
      {log.length === 0 ? (
        <p className="pending-text">
          目前沒有紀錄。到下方系統設定按下修改，就會在這裡出現一筆，包含被拒絕的嘗試。
        </p>
      ) : (
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>時間</th>
                <th>操作者</th>
                <th>動作</th>
                <th>對象</th>
                <th>變更</th>
                <th>結果</th>
              </tr>
            </thead>
            <tbody>
              {log.map((row) => (
                <tr key={row.id}>
                  <td>{row.timestamp?.slice(0, 19).replace('T', ' ')}</td>
                  <td>{row.actorId}</td>
                  <td>{row.action}</td>
                  <td>{row.resourceId}</td>
                  <td>
                    {row.beforeStatus !== undefined
                      ? `${row.beforeStatus} → ${row.afterStatus}`
                      : row.reason}
                  </td>
                  <td className={row.result === 'success' ? 'gov-yes' : 'gov-no'}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function SettingsSection({ identity }) {
  const [result, setResult] = useState(null)
  const [adjustKey, setAdjustKey] = useState(adjustableSettings[4].key)
  const [adjustValue, setAdjustValue] = useState('20%')
  const [lockKey, setLockKey] = useState(lockedSettings[0].key)

  return (
    <section className="card">
      <h2 className="card-title">System Settings｜系統設定</h2>
      <RuleStamp rule={settingsRule} />

      <h3 className="dept-name">固定鎖定，不可關閉</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>設定</th>
              <th>值</th>
              <th>可否調整</th>
            </tr>
          </thead>
          <tbody>
            {lockedSettings.map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td>{item.value}</td>
                <td className="gov-no">鎖定</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">可調整設定</h3>
      <div className="gov-table-wrap">
        <table className="gov-table">
          <thead>
            <tr>
              <th>設定</th>
              <th>目前值</th>
            </tr>
          </thead>
          <tbody>
            {adjustableSettings.map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td className={String(item.value).includes('【請填入') ? 'gov-cond' : undefined}>
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="dept-name">實際修改</h3>
      <p className="group-note">
        鎖定不是畫面上灰掉而已，applySetting() 會直接拒絕，而且拒絕本身也會寫進 Audit Log。
      </p>
      <div className="gov-controls">
        <label className="gov-field">
          <span>可調整設定</span>
          <select value={adjustKey} onChange={(e) => setAdjustKey(e.target.value)}>
            {adjustableSettings.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="gov-field">
          <span>改為</span>
          <input value={adjustValue} onChange={(e) => setAdjustValue(e.target.value)} />
        </label>
        <label className="gov-field">
          <span>鎖定設定</span>
          <select value={lockKey} onChange={(e) => setLockKey(e.target.value)}>
            {lockedSettings.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="field-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={() => setResult(applySetting(adjustKey, adjustValue, identity))}
        >
          修改可調整設定
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() => setResult(applySetting(lockKey, '開啟', identity))}
        >
          試著改鎖定設定
        </button>
      </div>
      {result && (
        <p className={result.ok ? 'gov-allow' : 'run-error'}>
          {result.ok ? '已接受' : '已拒絕'}：{result.reason}
        </p>
      )}
    </section>
  )
}

export function GovernanceCenterPage() {
  const [identity, setIdentity] = useState('owner')

  return (
    <>
      <section className="card">
        <h2 className="card-title">Mock 身分</h2>
        <p className="group-note">{mockIdentityNote}</p>
        <div className="field-actions">
          {systemRoles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={identity === role.id ? 'ghost-button is-active' : 'ghost-button'}
              onClick={() => setIdentity(role.id)}
            >
              {role.name}
            </button>
          ))}
        </div>
      </section>

      <SummarySection identity={identity} />
      <ArchitectureSection />
      <RolesSection identity={identity} />
      <ApprovalSection />
      <EscalationSection />
      <AiPolicySection />
      <KnowledgeSection />
      <PromptSection />
      <AuditSection />
      <SettingsSection identity={identity} />
    </>
  )
}
