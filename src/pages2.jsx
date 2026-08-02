import { useEffect, useMemo, useState } from 'react'
import {
  blueprint,
  commonAllowed,
  commonForbidden,
  governanceChain,
} from './agentBlueprint.js'
import { authority, authorityNote } from './authority.js'
import { businessLines, caseLifecycle, channels } from './businessLines.js'
import {
  hubCategoryStats,
  hubNote,
  hubRules,
  riskLabel,
  statusLabel,
  summaryOf,
} from './knowledgeHub.js'
import {
  approvalBlockers,
  commitImport,
  exportJson,
  getEntries,
  importTemplate,
  localChangeCount,
  resetAll,
  resetEntry,
  subscribeHub,
  updateEntry,
  validateImport,
} from './hubStore.js'
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

function download(name, text, mime) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function HubEditor({ entry, onClose }) {
  const [form, setForm] = useState({
    title: entry.title,
    question: entry.question ?? '',
    answer: entry.answer ?? '',
    policyContent: entry.policyContent ?? '',
    status: entry.status,
    riskLevel: entry.riskLevel,
    canQuoteExternally: entry.canQuoteExternally,
    owner: entry.owner,
    effectiveDate: entry.effectiveDate,
    nextReviewDate: entry.nextReviewDate,
  })
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const draftEntry = { ...entry, ...form }
  const blockers = approvalBlockers(draftEntry)
  const blocked = form.status === 'approved' && blockers.length > 0

  return (
    <div className="hub-detail hub-editor">
      <div className="field">
        <label className="field-label" htmlFor={'t-' + entry.id}>
          標題
        </label>
        <input
          id={'t-' + entry.id}
          className="field-input"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      {entry.type === 'faq' ? (
        <>
          <div className="field">
            <label className="field-label" htmlFor={'q-' + entry.id}>
              問題
            </label>
            <input
              id={'q-' + entry.id}
              className="field-input"
              value={form.question}
              onChange={(e) => set('question', e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor={'a-' + entry.id}>
              標準答案
            </label>
            <textarea
              id={'a-' + entry.id}
              className="field-input hub-textarea"
              rows={5}
              value={form.answer}
              onChange={(e) => set('answer', e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="field">
          <label className="field-label" htmlFor={'p-' + entry.id}>
            政策內容
          </label>
          <textarea
            id={'p-' + entry.id}
            className="field-input hub-textarea"
            rows={5}
            value={form.policyContent}
            onChange={(e) => set('policyContent', e.target.value)}
          />
        </div>
      )}

      <div className="hub-form-row">
        <div className="field">
          <label className="field-label" htmlFor={'s-' + entry.id}>
            狀態
          </label>
          <select
            id={'s-' + entry.id}
            className="field-input"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
          >
            <option value="draft">草稿</option>
            <option value="pending">待審核</option>
            <option value="approved">已核准</option>
            <option value="disabled">已停用</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor={'r-' + entry.id}>
            風險等級
          </label>
          <select
            id={'r-' + entry.id}
            className="field-input"
            value={form.riskLevel}
            onChange={(e) => set('riskLevel', e.target.value)}
          >
            <option value="low">低風險</option>
            <option value="medium">中風險</option>
            <option value="high">高風險</option>
          </select>
        </div>
      </div>

      <div className="hub-form-row">
        <div className="field">
          <label className="field-label" htmlFor={'o-' + entry.id}>
            知識負責人
          </label>
          <input
            id={'o-' + entry.id}
            className="field-input"
            value={form.owner}
            onChange={(e) => set('owner', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor={'e-' + entry.id}>
            生效日
          </label>
          <input
            id={'e-' + entry.id}
            className="field-input"
            value={form.effectiveDate}
            onChange={(e) => set('effectiveDate', e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor={'n-' + entry.id}>
            下次檢視
          </label>
          <input
            id={'n-' + entry.id}
            className="field-input"
            value={form.nextReviewDate}
            onChange={(e) => set('nextReviewDate', e.target.value)}
          />
        </div>
      </div>

      <p className="hub-note">
        <label>
          <input
            type="checkbox"
            checked={form.canQuoteExternally}
            disabled={approvalBlockers(draftEntry).includes('內容仍有待填欄位')}
            onChange={(e) => set('canQuoteExternally', e.target.checked)}
          />
          　可對外引用
          {approvalBlockers(draftEntry).includes('內容仍有待填欄位') &&
            '（內容仍有待填欄位，規則不允許）'}
        </label>
      </p>

      {blocked && (
        <p className="hub-warning">
          無法核准：{blockers.join('、')}。請先補齊再改為已核准。
        </p>
      )}

      <div className="field-actions">
        <button
          type="button"
          className="enter-button"
          disabled={blocked}
          onClick={() => {
            updateEntry(entry.id, form)
            onClose()
          }}
        >
          儲存修正
        </button>
        <button type="button" className="ghost-button" onClick={onClose}>
          取消
        </button>
        {(entry.edited || entry.imported) && (
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              resetEntry(entry.id)
              onClose()
            }}
          >
            {entry.imported ? '刪除這筆匯入' : '還原這筆'}
          </button>
        )}
      </div>
    </div>
  )
}

function HubCard({ entry }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  return (
    <article
      className={entry.agentUsable ? 'card hub-card' : 'card hub-card is-unapproved'}
      id={'hub-' + entry.id}
    >
      <p className="hub-head">
        <span className="hub-id">{entry.id}</span>
        <span className="hub-cat">{entry.category}</span>
        {entry.edited && <span className="hub-mark">已修正</span>}
        {entry.imported && <span className="hub-mark">匯入</span>}
      </p>

      <h3 className="dept-name">{entry.title}</h3>
      <p className="dept-duty">{summaryOf(entry)}</p>

      <p className="hub-tags">
        {entry.tags.map((tag) => (
          <span className="hub-tag" key={tag}>
            #{tag}
          </span>
        ))}
      </p>

      <p className="hub-badges">
        <span className={'hub-risk hub-risk-' + entry.riskLevel}>
          風險：{riskLabel(entry.riskLevel).replace('風險', '')}
        </span>
        <span className={'hub-status hub-status-' + entry.status}>
          {statusLabel(entry.status)}
        </span>
        <span className="hub-meta">{entry.version}</span>
        <span className="hub-meta">更新 {entry.lastUpdated}</span>
      </p>

      <p className="hub-badges">
        <span className={entry.canQuoteExternally ? 'hub-flag is-yes' : 'hub-flag is-no'}>
          {entry.canQuoteExternally ? '可對外引用' : '不可對外引用'}
        </span>
        <span className={entry.requiresHumanReview ? 'hub-flag is-no' : 'hub-flag is-yes'}>
          {entry.requiresHumanReview ? '需人工審核' : '免人工審核'}
        </span>
      </p>

      {entry.hasPlaceholder && <p className="hub-warning">資料尚未完成，不可對外引用</p>}
      {!entry.agentUsable && (
        <p className="hub-note">尚未核准，Agent 不得當成正式答案使用</p>
      )}

      <div className="field-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setOpen(!open)
            setEditing(false)
          }}
        >
          {open ? '收合內容' : '查看內容'}
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setEditing(!editing)
            setOpen(false)
          }}
        >
          {editing ? '取消修正' : '修正'}
        </button>
      </div>

      {editing && <HubEditor entry={entry} onClose={() => setEditing(false)} />}

      {open && (
        <div className="hub-detail">
          {entry.type === 'faq' ? (
            <>
              <div className="dept-block">
                <h4 className="dept-label">問題</h4>
                <p className="dept-step-text">{entry.question}</p>
              </div>
              <div className="dept-block">
                <h4 className="dept-label">標準答案</h4>
                <p className="dept-step-text">{entry.answer}</p>
              </div>
            </>
          ) : (
            <div className="dept-block">
              <h4 className="dept-label">政策內容</h4>
              <p className="dept-step-text">{entry.policyContent}</p>
            </div>
          )}

          <div className="dept-block">
            <h4 className="dept-label">升級條件</h4>
            <ul className="dept-list">
              {entry.escalationConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="dept-block">
            <p className="dept-step-reason">
              來源：{entry.source}　負責人：{entry.owner}
            </p>
            <p className="dept-step-reason">
              生效日：{entry.effectiveDate}　下次檢視：{entry.nextReviewDate}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

function HubImport() {
  const [result, setResult] = useState(null)

  const onFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.json')) {
      setResult({ ok: false, errors: ['目前只接受 .json，請先下載範本再填。'] })
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setResult(validateImport(String(reader.result)))
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <section className="card">
      <h2 className="card-title">上傳知識</h2>
      <p className="group-note">
        上傳的知識一律進入草稿、風險預設為高、不可對外引用、需人工審核。
        檔案中若寫了已核准也不會生效，核准只能由人在畫面上按。
      </p>

      <div className="field">
        <label className="field-label" htmlFor="hub-file">
          選擇 JSON 檔
        </label>
        <input id="hub-file" className="field-input" type="file" accept=".json" onChange={onFile} />
      </div>

      <div className="field-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={() => download('knowledge-template.json', importTemplate, 'application/json')}
        >
          下載範本
        </button>
      </div>

      {result && !result.ok && (
        <div className="dept-block">
          <p className="hub-warning">檔案未通過檢查，整批未匯入。</p>
          <ul className="dept-list">
            {result.errors.slice(0, 10).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
          {result.errors.length > 10 && (
            <p className="dept-step-reason">另有 {result.errors.length - 10} 項問題未列出。</p>
          )}
        </div>
      )}

      {result && result.ok && (
        <div className="dept-block">
          <p className="dept-step-text">檢查通過，共 {result.count} 筆可匯入。</p>
          <div className="field-actions">
            <button
              type="button"
              className="enter-button"
              onClick={() => {
                commitImport(result.entries)
                setResult(null)
              }}
            >
              確認匯入 {result.count} 筆
            </button>
            <button type="button" className="ghost-button" onClick={() => setResult(null)}>
              取消
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function KnowledgeHubSection() {
  const [, tick] = useState(0)
  useEffect(() => subscribeHub(() => tick((n) => n + 1)), [])

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('全部')
  const keyword = query.trim().toLowerCase()
  const entries = getEntries()
  const changes = localChangeCount()

  const shown = entries.filter((entry) => {
    if (category !== '全部' && entry.category !== category) return false
    if (!keyword) return true
    return [
      entry.id,
      entry.title,
      entry.question,
      entry.answer,
      entry.policyContent,
      entry.category,
      statusLabel(entry.status),
      riskLabel(entry.riskLevel),
      ...entry.tags,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  const metrics = [
    { value: String(entries.length), label: '知識總數' },
    { value: String(entries.filter((e) => e.status === 'approved').length), label: '已核准' },
    { value: String(entries.filter((e) => e.riskLevel === 'high').length), label: '高風險' },
    { value: String(entries.filter((e) => e.hasPlaceholder).length), label: '待補資料' },
  ]

  const catCount = (name) => entries.filter((e) => e.category === name).length

  return (
    <>
      <section className="card">
        <h2 className="card-title">Knowledge Hub</h2>
        <p className="group-note">{hubNote}</p>
        {(changes.edited > 0 || changes.imported > 0) && (
          <p className="hub-warning">
            本機有未帶回專案的變更：修正 {changes.edited} 筆、匯入 {changes.imported} 筆。
            這些只存在這台瀏覽器，換裝置或清快取就會消失，請用下方「匯出 JSON」帶回專案。
          </p>
        )}
      </section>

      <HubImport />

      <section className="card">
        <div className="field">
          <label className="field-label" htmlFor="hub-search">
            搜尋知識
          </label>
          <input
            id="hub-search"
            className="field-input"
            type="search"
            placeholder="搜尋標題、內容、標籤或知識 ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="hub-chips">
          <button
            type="button"
            className={category === '全部' ? 'hub-chip is-on' : 'hub-chip'}
            onClick={() => setCategory('全部')}
          >
            全部　{entries.length}
          </button>
          {hubCategoryStats.map((row) => (
            <button
              type="button"
              key={row.name}
              className={
                (category === row.name ? 'hub-chip is-on' : 'hub-chip') +
                (catCount(row.name) === 0 ? ' is-empty' : '')
              }
              onClick={() => setCategory(row.name)}
            >
              {row.name}　{catCount(row.name)}
            </button>
          ))}
        </div>
        <div className="field-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() =>
              download('knowledge-hub.json', exportJson(), 'application/json')
            }
          >
            匯出 JSON
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              if (window.confirm('確定要清除本機的所有修正與匯入嗎？此動作無法復原。')) {
                resetAll()
              }
            }}
          >
            清除本機變更
          </button>
        </div>
      </section>

      <section className="card-group">
        <div className="metric-grid">
          {metrics.map((item) => (
            <article className="card metric-card" key={item.label}>
              <p className="metric-value">{item.value}</p>
              <p className="metric-label">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">
          {category === '全部' ? '全部知識' : category}（{shown.length}）
        </h2>
        <p className="group-note">
          標準答案只供 Agent 草擬回覆，不代表 Agent 可以自動送出。核准前不得作為對外說法。
        </p>
        {shown.length ? (
          <div className="dept-grid">
            {shown.map((entry) => (
              <HubCard entry={entry} key={entry.id} />
            ))}
          </div>
        ) : (
          <article className="card card-pending">
            <p className="pending-text">
              {category === '回覆範本' || category === '統一用語'
                ? '這一類尚未建立任何知識。'
                : '沒有符合的知識。'}
            </p>
          </article>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">系統控制規則</h2>
        <ul className="dept-list">
          {hubRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

    </>
  )
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
      <KnowledgeHubSection />

      <section className="card">
        <h2 className="card-title">系統設定條目</h2>
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
