import { useEffect, useMemo, useState } from 'react'
import {
  blueprint,
  commonAllowed,
  commonForbidden,
  governanceChain,
} from './agentBlueprint.js'
import { authority, authorityNote } from './authority.js'
import { businessLines, caseLifecycle, channels } from './businessLines.js'
import { mockData, mockStats } from './mockData.js'
import { programNote, programs } from './programs.js'
import { workflows } from './workflows.js'
import { hasApiKey } from './aiSettings.js'
import { listWaiting, subscribe } from './runStore.js'

function useStoreTick() {
  const [, tick] = useState(0)
  useEffect(() => subscribe(() => tick((n) => n + 1)), [])
}

function countAgents() {
  const types = {}
  let total = 0
  blueprint.forEach((dept) =>
    dept.agents.forEach((agent) => {
      total += 1
      const key = agent.type.split(' ')[0]
      types[key] = (types[key] ?? 0) + 1
    })
  )
  return { total, types }
}

function countNodes() {
  let agent = 0
  let human = 0
  let system = 0
  workflows.forEach((flow) =>
    flow.exec.forEach((node) => {
      if (node.executor === 'agent') agent += 1
      else if (node.executor === 'human') human += 1
      else system += 1
    })
  )
  return { agent, human, system, total: agent + human + system }
}

export function WarRoomPage({ onNavigate }) {
  useStoreTick()
  const agents = countAgents()
  const nodes = countNodes()
  const waiting = listWaiting()
  const connected = hasApiKey()

  const metrics = [
    { label: '部門', value: String(blueprint.length), note: '責任範圍，非人頭' },
    {
      label: 'AI Agent',
      value: String(agents.total),
      note: Object.entries(agents.types)
        .map(([k, v]) => `${k} ${v}`)
        .join('　'),
    },
    { label: '業務線', value: String(businessLines.length), note: '共用同一組部門' },
    { label: '工作流程', value: String(workflows.length), note: `共 ${nodes.total} 個節點` },
    {
      label: '等待人工',
      value: String(waiting.length),
      note: waiting.length ? '有流程停在人工關卡' : '目前沒有待處理',
    },
    {
      label: 'AI 引擎',
      value: connected ? '已接' : '未接',
      note: connected ? '執行時呼叫真實模型' : '執行時使用示範內容',
    },
    {
      label: '示範資料',
      value: String(mockStats.cases),
      note: `涵蓋 ${mockStats.agents} 位 Agent`,
    },
  ]

  return (
    <>
      <section className="card-group">
        <h2 className="group-title">系統概況</h2>
        <p className="group-note">
          以下數字全部由系統自身的設定推導，不是估計值。營收、案件數與工時等營運數字需要
          接上資料來源才能顯示，本版尚未接入。
        </p>
        <div className="metric-grid">
          {metrics.map((item) => (
            <article className="card metric-card" key={item.label}>
              <p className="metric-label">{item.label}</p>
              <p className="metric-value">{item.value}</p>
              <p className="dept-step-reason">{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">責任邊界</h2>
        <p className="group-note">
          自動化程度不是越高越好。這裡看的是有多少步驟被刻意留給人。
        </p>
        <article className="card dept-card">
          <div className="dept-block">
            <div className="dept-step">
              <p className="dept-step-name">Agent 節點　{nodes.agent}</p>
              <p className="dept-step-text">可由 AI 執行的步驟</p>
            </div>
            <div className="dept-step">
              <p className="dept-step-name">人工關卡　{nodes.human}</p>
              <p className="dept-step-text">
                永遠留人的步驟，佔全部節點的{' '}
                {Math.round((nodes.human / nodes.total) * 100)}%
              </p>
            </div>
            <div className="dept-step">
              <p className="dept-step-name">系統節點　{nodes.system}</p>
              <p className="dept-step-text">起點、終點與資料節點</p>
            </div>
          </div>
          <div className="dept-block">
            <h4 className="dept-label">治理原則</h4>
            <p className="dept-step-text">{governanceChain}</p>
          </div>
        </article>
      </section>

      {waiting.length > 0 && (
        <section className="card-group">
          <h2 className="group-title">需要你處理</h2>
          <article className="card dept-card">
            <div className="dept-block">
              {waiting.map((item) => {
                const flow = workflows.find((w) => w.id === item.workflowId)
                const node = flow?.exec.find((n) => n.id === item.nodeId)
                if (!flow || !node) return null
                return (
                  <div className="dept-step" key={item.workflowId}>
                    <p className="dept-step-name">
                      <button
                        type="button"
                        className="jump-link"
                        onClick={() => onNavigate('workflow', 'flow-' + flow.id)}
                      >
                        {flow.name}
                      </button>
                    </p>
                    <p className="dept-step-text">
                      停在：{node.name}　{node.waitingMessage}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="field-actions">
              <button
                type="button"
                className="enter-button"
                onClick={() => onNavigate('review')}
              >
                前往審核中心
              </button>
            </div>
          </article>
        </section>
      )}

      <section className="card-group">
        <h2 className="group-title">案件生命週期</h2>
        <article className="card dept-card">
          <p className="dept-flow">
            {caseLifecycle.map((row, index) => (
              <span key={row.stage}>
                {index > 0 && <span className="dept-arrow"> → </span>}
                {row.stage}
              </span>
            ))}
          </p>
          <p className="dept-step-reason">
            七條業務線共用同一條。每一關的人工責任見部門分頁。
          </p>
        </article>
      </section>
    </>
  )
}

function buildEntries() {
  const entries = []
  blueprint.forEach((dept) => {
    entries.push({
      id: 'dept-' + dept.department,
      title: dept.department,
      kind: '部門流程',
      body: dept.flow.join(' → '),
      extra: '人工閘門：' + (dept.gateChain ?? ''),
      page: 'ai-staff',
      anchor: 'dept-' + dept.department,
      jump: '前往部門',
    })
    dept.agents.forEach((agent) => {
      entries.push({
        id: 'agent-' + agent.id,
        title: `${agent.id}　${agent.name}`,
        kind: dept.department,
        body: agent.duty,
        extra: '工作邊界：' + agent.limit,
        page: 'ai-staff',
        anchor: 'agent-' + agent.id,
        jump: '前往 Agent',
      })
    })
  })
  workflows.forEach((flow) => {
    entries.push({
      id: 'flow-' + flow.id,
      title: flow.code + '　' + flow.name,
      kind: '工作流程',
      body: flow.goal,
      extra: flow.keyRule ? flow.keyRule.title + '：' + flow.keyRule.text : flow.shape,
      page: 'workflow',
      anchor: 'flow-' + flow.id,
      jump: '前往流程',
    })
  })
  businessLines.forEach((line) => {
    entries.push({
      id: 'line-' + line.name,
      title: line.name,
      kind: '業務線',
      body: line.note ?? '',
      extra: line.rows.map((r) => `${r.dept}：${r.work}`).join('；'),
    })
  })
  channels.forEach((ch) => {
    entries.push({
      id: 'channel-' + ch.name,
      title: ch.name,
      kind: '接觸管道',
      body: ch.use,
      extra: '歸屬：' + ch.dept,
    })
  })
  programs.forEach((program) => {
    entries.push({
      id: 'program-' + program.id,
      title: program.code + '　' + program.name,
      kind: '政府計畫',
      body: program.background,
      extra: `主管機關：${program.authority}｜適用對象：${program.target}`,
    })
    program.stages.forEach((stage) => {
      entries.push({
        id: 'program-' + program.id + '-' + stage.code,
        title: `${program.name}　${stage.code} ${stage.name}`,
        kind: '政府計畫階段',
        body: stage.summary + '　' + stage.money.join('；'),
        extra: stage.note,
      })
    })
    entries.push({
      id: 'program-' + program.id + '-eligibility',
      title: program.name + '　申請資格',
      kind: '政府計畫資格',
      body: program.eligibility.join('；'),
      extra: '不得申請：' + program.excluded.join('；'),
    })
    if (program.ratioChecks.length) {
      entries.push({
        id: 'program-' + program.id + '-ratio',
        title: program.name + '　經費比例上限',
        kind: '政府計畫核銷',
        body: program.ratioChecks
          .map((row) => `${row.item} 不得超過${row.base}之 ${row.limit}%`)
          .join('；'),
        extra: program.accounting.join('；'),
      })
    }
    entries.push({
      id: 'program-' + program.id + '-deadline',
      title: program.name + '　期限與罰則',
      kind: '政府計畫期限',
      body: program.deadlines.map((row) => `${row.item}：${row.rule}`).join('；'),
      extra: '罰則：' + program.penalty,
    })
  })
  mockData.forEach((row) => {
    row.cases.forEach((item) => {
      entries.push({
        id: 'mock-' + item.id,
        title: `${item.id}　${item.title}`,
        kind: `示範情境｜${row.agentId} ${row.agentName}`,
        body: '輸入：' + item.input,
        extra: '輸出：' + item.output,
        page: 'ai-staff',
        anchor: 'agent-' + row.agentId,
        jump: '前往 Agent',
      })
    })
  })
  return entries
}

export function KnowledgePage({ onNavigate }) {
  const [query, setQuery] = useState('')
  const entries = useMemo(buildEntries, [])
  const keyword = query.trim()
  const shown = keyword
    ? entries.filter((e) =>
        (e.title + e.kind + e.body + e.extra).toLowerCase().includes(keyword.toLowerCase())
      )
    : entries

  return (
    <>
      <section className="card">
        <h2 className="card-title">知識庫</h2>
        <p className="group-note">
          收錄系統本身的設定：部門流程、Agent 職責與邊界、工作流程的關鍵控制條件、
          業務線與接觸管道，以及政府計畫的資格、金額、經費比例、期限與罰則。
          外部文件、教材與計畫 know-how 需要接上儲存來源才能收錄，本版尚未接入。
        </p>
        <p className="dept-step-reason">{programNote}</p>
        <div className="field">
          <label className="field-label" htmlFor="kb-search">
            搜尋
          </label>
          <input
            id="kb-search"
            className="field-input"
            type="search"
            placeholder="輸入關鍵字，例如：核銷、講義、退回、期限"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="dept-step-reason">
          共 {entries.length} 條，顯示 {shown.length} 條。
        </p>
      </section>

      <section className="card-group">
        <div className="dept-grid">
          {shown.map((entry) => (
            <article className="card dept-card" key={entry.id}>
              <h3 className="dept-name">{entry.title}</h3>
              <p className="agent-type">{entry.kind}</p>
              {entry.body && <p className="dept-duty">{entry.body}</p>}
              {entry.extra && <p className="dept-step-reason">{entry.extra}</p>}
              {entry.page && (
                <p className="dept-step-reason">
                  <button
                    type="button"
                    className="jump-link"
                    onClick={() => onNavigate(entry.page, entry.anchor)}
                  >
                    {entry.jump}
                  </button>
                </p>
              )}
            </article>
          ))}
        </div>
        {shown.length === 0 && (
          <article className="card card-pending">
            <p className="pending-text">找不到符合的條目。</p>
          </article>
        )}
      </section>
    </>
  )
}

export function PermissionPage({ onNavigate }) {
  const humanGates = []
  workflows.forEach((flow) =>
    flow.exec.forEach((node) => {
      if (node.executor === 'human') {
        humanGates.push({
          flowId: flow.id,
          flow: flow.name,
          node: node.name,
          type: node.gateType,
        })
      }
    })
  )

  return (
    <>
      <section className="card-group">
        <h2 className="group-title">人的授權範圍</h2>
        <p className="group-note">{authorityNote}</p>
        <div className="dept-grid">
          {authority.map((row) => (
            <article className="card dept-card" key={row.name}>
              <h3 className="dept-name">{row.name}</h3>
              <div className="dept-block">
                <p className="dept-role">
                  <span className="dept-role-name">負責人</span>
                  <span>{row.owner}</span>
                </p>
                <p className="dept-role">
                  <span className="dept-role-name">委任顧問</span>
                  <span>{row.consultant}</span>
                </p>
                <p className="dept-role">
                  <span className="dept-role-name">臨時行政</span>
                  <span>{row.admin}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">AI 的權限範圍</h2>
        <p className="group-note">
          適用全部 Agent，不因部門而異。任何部門要放寬，必須先改這份原則。
        </p>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">可以做</h3>
            <ul className="dept-list">
              {commonAllowed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">不可以做</h3>
            <ul className="dept-list">
              {commonForbidden.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">系統中實際生效的人工關卡</h2>
        <p className="group-note">
          這些不是宣示，是執行器真的會停下來的地方。執行器只看節點的 executor 欄位，
          改名不影響閘門。
        </p>
        <article className="card dept-card">
          <div className="dept-block">
            {humanGates.map((gate) => (
              <div className="dept-step" key={gate.flow + gate.node}>
                <p className="dept-step-name">{gate.node}</p>
                <p className="dept-step-text">
                  <button
                    type="button"
                    className="jump-link"
                    onClick={() => onNavigate('workflow', 'flow-' + gate.flowId)}
                  >
                    {gate.flow}
                  </button>
                </p>
                <p className="dept-step-reason">
                  類型：
                  {gate.type === 'send'
                    ? '送出關卡'
                    : gate.type === 'input'
                      ? '需人提供輸入'
                      : '審核關卡'}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card">
        <h2 className="card-title">本版沒有的東西</h2>
        <ul className="dept-list">
          <li>沒有登入與帳號系統，因此沒有逐人權限控管。</li>
          <li>沒有後端，權限是流程設計上的約束，不是技術上的強制。</li>
          <li>要做到技術強制，必須有後端與身分驗證，屬於下一階段。</li>
        </ul>
      </section>
    </>
  )
}

export function AutomationPage({ onNavigate }) {
  const nodes = countNodes()
  const perFlow = workflows.map((flow) => {
    const agent = flow.exec.filter((n) => n.executor === 'agent').length
    const human = flow.exec.filter((n) => n.executor === 'human').length
    return { id: flow.id, name: flow.name, agent, human, total: flow.exec.length }
  })

  return (
    <>
      <section className="card-group">
        <h2 className="group-title">目前的自動化程度</h2>
        <p className="group-note">
          自動化只到人工關卡為止。以下比例不是目標，是刻意設計的結果。
        </p>
        <article className="card dept-card">
          <div className="dept-block">
            {perFlow.map((row) => (
              <div className="dept-step" key={row.id}>
                <p className="dept-step-name">
                  <button
                    type="button"
                    className="jump-link"
                    onClick={() => onNavigate('workflow', 'flow-' + row.id)}
                  >
                    {row.name}
                  </button>
                </p>
                <p className="dept-step-text">
                  Agent 節點 {row.agent}　人工關卡 {row.human}　共 {row.total} 個節點
                </p>
              </div>
            ))}
            <div className="dept-step">
              <p className="dept-step-name">全部流程合計</p>
              <p className="dept-step-text">
                Agent {nodes.agent}　人工 {nodes.human}　系統 {nodes.system}
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="card-group">
        <h2 className="group-title">已經可以自動的部分</h2>
        <article className="card dept-card">
          <ul className="dept-list">
            <li>按一次執行，Agent 節點依流程定義依序完成，不需要逐欄操作。</li>
            <li>後一個 Agent 自動讀取定義指定的前置節點產出。</li>
            <li>沒有 API 金鑰時自動切換為示範內容，流程順序與停靠位置完全相同。</li>
            <li>人工核准後自動從下一節點續跑；退回後自動從指定節點重跑。</li>
          </ul>
        </article>
      </section>

      <section className="card-group">
        <h2 className="group-title">還不能自動的部分</h2>
        <p className="group-note">
          以下每一項都需要後端才能做到，本版是純前端，沒有伺服器可以在你關掉瀏覽器後繼續工作。
        </p>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">需要後端</h3>
            <ul className="dept-list">
              <li>排程執行（每天早上自動整理營運資訊）</li>
              <li>事件觸發（LINE 或 FB 來訊自動進流程）</li>
              <li>保存執行紀錄與歷史</li>
              <li>逾期自動提醒</li>
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">永遠不自動</h3>
            <ul className="dept-list">
              <li>對客戶送出訊息</li>
              <li>正式送件與申報</li>
              <li>核准付款與轉帳</li>
              <li>發布社群內容</li>
              <li>簽署合約與用印</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">下一步</h2>
        <p className="dept-step-text">
          要接真實模型，先到 AI 設定貼上金鑰；金鑰只存在這個瀏覽器分頁的工作階段。
          要做排程與事件觸發，必須先有後端，那會改變本版「不存資料」的前提，是獨立的一個階段。
        </p>
        <div className="field-actions">
          <button
            type="button"
            className="enter-button"
            onClick={() => onNavigate('ai-settings')}
          >
            前往 AI 設定
          </button>
        </div>
      </section>
    </>
  )
}
