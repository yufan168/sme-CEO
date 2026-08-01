import { departments } from './departments.js'
import { authority, authorityNote } from './authority.js'
import {
  businessLines,
  businessLinesNote,
  caseLifecycle,
  caseLifecycleNote,
  channelNote,
  channels,
} from './businessLines.js'
import { agentTeam } from './agents.js'
import { opsTeam } from './agentTeamOps.js'
import { marketingTeam } from './agentTeamMarketing.js'
import { trainingTeam } from './agentTeamTraining.js'
import {
  blueprint,
  blueprintNote,
  blueprintOverview,
  blueprintPrinciple,
  commonAllowed,
  commonForbidden,
  commonPermissionNote,
  governanceChain,
  rolloutNote,
} from './agentBlueprint.js'
import WorkflowDiagram from './WorkflowDiagram.jsx'
import { workflows } from './workflows.js'
import { useState } from 'react'
import {
  clearSettings,
  getModel,
  getProvider,
  hasApiKey,
  maskedKeyInfo,
  providers,
  saveSettings,
} from './aiSettings.js'
import { createRun, runWorkflow } from './runner.js'

export function HomePage({ onNavigate }) {
  return (
    <>
      <section className="card card-home">
        <h1 className="company-name">享洺有限公司</h1>
        <p className="tagline">運用 AI 協助企業提升管理效率</p>
        <button
          type="button"
          className="enter-button"
          onClick={() => onNavigate('organization')}
        >
          進入公司
        </button>
      </section>

      <section className="card">
        <h2 className="card-title">公司資訊</h2>
        <dl className="info-list">
          <div className="info-row">
            <dt>產業</dt>
            <dd>企業管理顧問</dd>
          </div>
          <div className="info-row">
            <dt>成立年份</dt>
            <dd>2023 年</dd>
          </div>
          <div className="info-row">
            <dt>規模</dt>
            <dd>5 人以下</dd>
          </div>
          <div className="info-row">
            <dt>主要業務</dt>
            <dd>企業管理顧問、政府計畫輔導</dd>
          </div>
          <div className="info-row">
            <dt>負責人</dt>
            <dd>SUSU</dd>
          </div>
        </dl>
      </section>
    </>
  )
}

export function OrgPage() {
  return (
    <section className="card">
      <h2 className="card-title">組織架構</h2>
      <p className="group-note">
        公司之下為六個部門，各部門之下為該部門的 AI Agent。人工控制點不列為節點，
        由部門與工作流程規格承接。
      </p>
      <div className="org-chart">
        <div className="org-node org-root">享洺有限公司</div>
        <div className="org-stem"></div>
        <ul className="org-children">
          {blueprint.map((dept) => (
            <li className="org-child" key={dept.department}>
              <div className="org-node org-dept">{dept.department}</div>
              <ul className="org-grandchildren">
                {dept.agents.map((agent) => (
                  <li className="org-grandchild" key={agent.id}>
                    <div className="org-node org-agent">
                      <span className="org-agent-id">{agent.id}</span>
                      {agent.name}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function DepartmentsPage() {
  return (
    <>
      <section className="card-group">
        <h2 className="group-title">部門藍圖</h2>
        <div className="dept-grid">
          {departments.map((dept) => (
            <article className="card dept-card" key={dept.name}>
              <h3 className="dept-name">{dept.name}</h3>
              <p className="dept-duty">{dept.duty}</p>

              <div className="dept-block">
                <h4 className="dept-label">工作流程</h4>
                <p className="dept-flow">
                  {dept.flow.map((step, index) => (
                    <span key={step}>
                      {index > 0 && <span className="dept-arrow"> → </span>}
                      {step}
                    </span>
                  ))}
                </p>
              </div>

              <div className="dept-block">
                <h4 className="dept-label">AI 與人的分工</h4>
                {dept.split.map((row) => (
                  <div className="dept-step" key={row.step}>
                    <p className="dept-step-name">{row.step}</p>
                    <p className="dept-role">
                      <span className="dept-role-tag">AI</span>
                      <span>{row.ai}</span>
                    </p>
                    <p className="dept-role">
                      <span className="dept-role-tag">人</span>
                      <span>{row.human}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="dept-block">
                <h4 className="dept-label">人必須保留的核心權責</h4>
                <ul className="dept-list">
                  {dept.core.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">人力配置與授權</h2>
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
        <h2 className="group-title">業務線與部門對應</h2>
        <p className="group-note">{businessLinesNote}</p>
        <div className="dept-grid">
          {businessLines.map((line) => (
            <article className="card dept-card" key={line.name}>
              <h3 className="dept-name">{line.name}</h3>
              {line.note && <p className="dept-step-reason">{line.note}</p>}
              <div className="dept-block">
                {line.rows.map((row) => (
                  <div className="dept-step" key={row.dept}>
                    <p className="dept-step-name">{row.dept}</p>
                    <p className="dept-step-text">{row.work}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">案件生命週期</h2>
        <p className="group-note">{caseLifecycleNote}</p>
        <article className="card dept-card">
          <div className="dept-block">
            {caseLifecycle.map((row) => (
              <div className="dept-step" key={row.stage}>
                <p className="dept-step-name">{row.stage}</p>
                <p className="dept-step-text">{row.dept}</p>
                <p className="dept-step-reason">留人：{row.human}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card-group">
        <h2 className="group-title">對外接觸管道</h2>
        <p className="group-note">{channelNote}</p>
        <article className="card dept-card">
          <div className="dept-block">
            {channels.map((row) => (
              <div className="dept-step" key={row.name}>
                <p className="dept-step-name">{row.name}</p>
                <p className="dept-step-text">{row.dept}</p>
                <p className="dept-step-reason">{row.use}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

function BlueprintSection() {
  return (
    <>
      <section className="card-group">
        <h2 className="group-title">Agent Team 藍圖</h2>
        <p className="group-note">{blueprintNote}</p>

        <article className="card dept-card">
          <h3 className="dept-name">整體配置總覽</h3>
          <div className="dept-block">
            {blueprintOverview.map((row) => (
              <div className="dept-step" key={row.dept}>
                <p className="dept-step-name">
                  {row.dept}　{row.count} 個
                </p>
                <p className="dept-step-text">{row.scope}</p>
              </div>
            ))}
            <div className="dept-step">
              <p className="dept-step-name">合計　19 個 Agent</p>
              <p className="dept-step-reason">不代表需要 19 個真人</p>
            </div>
          </div>
          <div className="dept-block">
            <h4 className="dept-label">系統設計共通原則</h4>
            <p className="dept-step-text">{blueprintPrinciple}</p>
          </div>
          <div className="dept-block">
            <p className="dept-step-reason">{rolloutNote}</p>
          </div>
        </article>
      </section>

      {blueprint.map((dept) => (
        <section className="card-group" key={dept.department}>
          <h2 className="group-title">{dept.department}</h2>
          {dept.note && <p className="group-note">{dept.note}</p>}

          <article className="card dept-card">
            <h3 className="dept-name">建議流程</h3>
            <p className="dept-flow">
              {dept.flow.map((step, index) => (
                <span key={step}>
                  {index > 0 && <span className="dept-arrow"> → </span>}
                  {step}
                </span>
              ))}
            </p>
          </article>

          <div className="dept-grid agent-grid">
            {dept.agents.map((agent) => (
              <article className="card dept-card" key={agent.id}>
                <h3 className="dept-name">
                  {agent.id}　{agent.name}
                </h3>
                <p className="agent-type">{agent.type}</p>
                <p className="dept-duty">{agent.duty}</p>
                <p className="dept-role">
                  <span className="dept-role-name">所屬部門</span>
                  <span>{dept.department}</span>
                </p>
                <p className="dept-role">
                  <span className="dept-role-name">負責人</span>
                  <span>待指派</span>
                </p>

                {agent.scope && (
                  <div className="dept-block">
                    <h4 className="dept-label">{agent.scopeLabel}</h4>
                    <ul className="dept-list">
                      {agent.scope.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {agent.output && (
                  <div className="dept-block">
                    <h4 className="dept-label">{agent.outputLabel}</h4>
                    <ul className="dept-list">
                      {agent.output.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="dept-block">
                  <h4 className="dept-label">工作邊界</h4>
                  <p className="dept-step-text">{agent.limit}</p>
                </div>
              </article>
            ))}

            <article className="card dept-card">
              <h3 className="dept-name">一定留給人</h3>
              <ul className="dept-list">
                {dept.humanGates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {dept.gateChain && (
                <div className="dept-block">
                  <h4 className="dept-label">人工閘門</h4>
                  <p className="dept-step-text">{dept.gateChain}</p>
                </div>
              )}
            </article>
          </div>
        </section>
      ))}

      <section className="card-group">
        <h2 className="group-title">共通 AI 權限原則</h2>
        <p className="group-note">{commonPermissionNote}</p>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">Agent 可以做</h3>
            <ul className="dept-list">
              {commonAllowed.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">Agent 不可以做</h3>
            <ul className="dept-list">
              {commonForbidden.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card dept-card">
          <h3 className="dept-name">治理原則</h3>
          <p className="dept-step-text">{governanceChain}</p>
          <p className="dept-step-reason">AI 起草 · 人審核 · 人發送</p>
        </article>
      </section>
    </>
  )
}

function AgentTeamSection({ team }) {
  return (
    <section className="card-group">
      <h2 className="group-title">
        深入規格：{team.department}
        {team.focus && `（${team.focus}）`}
      </h2>
      <p className="group-note">{team.note}</p>
      {team.scopeNote && <p className="group-note">{team.scopeNote}</p>}

      <article className="card dept-card">
        <h3 className="dept-name">流程與執行者</h3>
        <div className="dept-block">
          {team.flow.map((item) => (
            <div className="dept-step" key={item.step}>
              <p className="dept-step-name">{item.step}</p>
              <p className="dept-step-text">{item.owner}</p>
              {item.reason && <p className="dept-step-reason">{item.reason}</p>}
            </div>
          ))}
        </div>
      </article>

      <div className="dept-grid agent-grid">
        {team.agents.map((agent) => (
          <article className="card dept-card" key={agent.id}>
            <h3 className="dept-name">
              {agent.id}　{agent.name}
            </h3>
            <p className="agent-type">{agent.type}</p>
            <p className="dept-duty">{agent.duty}</p>
            <p className="dept-role">
              <span className="dept-role-name">所屬部門</span>
              <span>{team.department}</span>
            </p>
            {agent.step && (
              <p className="dept-role">
                <span className="dept-role-name">負責步驟</span>
                <span>{agent.step}</span>
              </p>
            )}
            <p className="dept-role">
              <span className="dept-role-name">負責人</span>
              <span>{agent.assignee}</span>
            </p>

            {agent.inputs && (
              <div className="dept-block">
                <h4 className="dept-label">{agent.inputLabel}</h4>
                <ul className="dept-list">
                  {agent.inputs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {agent.scope && (
              <div className="dept-block">
                <h4 className="dept-label">{agent.scopeLabel}</h4>
                <ul className="dept-list">
                  {agent.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {agent.output && (
              <div className="dept-block">
                <h4 className="dept-label">{agent.outputLabel}</h4>
                <ul className="dept-list">
                  {agent.output.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {agent.limits && (
              <div className="dept-block">
                <h4 className="dept-label">不能做</h4>
                <ul className="dept-list">
                  {agent.limits.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {agent.rule && (
              <div className="dept-block">
                <p className="dept-step-text">{agent.rule}</p>
              </div>
            )}
          </article>
        ))}

        {team.gates.map((gate) => (
          <article className="card dept-card" key={gate.name}>
            <h3 className="dept-name">
              {gate.id}　{gate.name}
            </h3>

            {gate.checks && (
              <div className="dept-block">
                <h4 className="dept-label">{gate.checkLabel}</h4>
                {gate.checks.map((row) => (
                  <div className="dept-step" key={row.item}>
                    <p className="dept-step-name">{row.item}</p>
                    <p className="dept-step-text">{row.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {gate.items && (
              <div className="dept-block">
                <ul className="dept-list">
                  {gate.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {gate.decisions && (
              <div className="dept-block">
                <h4 className="dept-label">{gate.decisionLabel}</h4>
                <ul className="dept-list">
                  {gate.decisions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="dept-block">
              <p className="dept-step-text">{gate.rule}</p>
            </div>
          </article>
        ))}

        {team.permissions && (
          <article className="card dept-card">
            <h3 className="dept-name">權限邊界</h3>
            <div className="dept-block">
              <p className="dept-step-text">{team.permissionChain}</p>
            </div>
            <div className="dept-block">
              {team.permissions.map((row) => (
                <p className="dept-role" key={row.action}>
                  <span className={row.allowed ? 'perm-yes' : 'perm-no'}>
                    {row.allowed ? '可' : '不可'}
                  </span>
                  <span>{row.action}</span>
                </p>
              ))}
            </div>
          </article>
        )}

        <article className="card dept-card">
          <h3 className="dept-name">本階段不配置</h3>
          <div className="dept-block">
            {team.notConfigured.map((item) => (
              <div className="dept-step" key={item.type}>
                <p className="dept-step-name">{item.type}</p>
                <p className="dept-step-text">{item.reason}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export function AiStaffPage() {
  return (
    <>
      <BlueprintSection />
      <AgentTeamSection team={trainingTeam} />
      <AgentTeamSection team={agentTeam} />
      <AgentTeamSection team={opsTeam} />
      <AgentTeamSection team={marketingTeam} />
    </>
  )
}

export function WorkflowPage() {
  return (
    <>
      {workflows.map((flow) => (
        <section className="card-group" key={flow.id}>
          <h2 className="group-title">
            {flow.name}（{flow.department}
            {flow.focus && `／${flow.focus}`}）
          </h2>
          <p className="group-note">{flow.shape}</p>

          <article className="card">
            <WorkflowDiagram flow={flow} />
          </article>

          <WorkflowRunner flow={flow} />

          {flow.keyRule && (
            <article className="card dept-card">
              <h3 className="dept-name">{flow.keyRule.title}</h3>
              <p className="dept-step-text">{flow.keyRule.text}</p>
            </article>
          )}

          {flow.humanGates && (
            <div className="dept-grid agent-grid">
              {flow.humanGates.map((gate) => (
                <article className="card dept-card" key={gate.id}>
                  <h3 className="dept-name">
                    {gate.id}　{gate.name}（留人）
                  </h3>
                  <ul className="dept-list">
                    {gate.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="dept-block">
                    <p className="dept-step-text">{gate.rule}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {flow.contracts && (
            <div className="dept-grid agent-grid">
              {flow.contracts.map((row) => (
                <article className="card dept-card" key={row.node}>
                  <h3 className="dept-name">{row.node}</h3>
                  <div className="dept-block">
                    <h4 className="dept-label">輸入</h4>
                    <ul className="dept-list">
                      {row.inputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="dept-block">
                    <h4 className="dept-label">輸出</h4>
                    <ul className="dept-list">
                      {row.outputs.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}

          {flow.permissions && (
            <article className="card dept-card">
              <h3 className="dept-name">Agent 權限邊界</h3>
              <div className="dept-block">
                <p className="dept-step-text">{flow.responsibilityLine}</p>
              </div>
              <div className="dept-block">
                {flow.permissions.map((row) => (
                  <p className="dept-role" key={row.action}>
                    <span className={row.allowed ? 'perm-yes' : 'perm-no'}>
                      {row.allowed ? '可' : '不可'}
                    </span>
                    <span>{row.action}</span>
                  </p>
                ))}
              </div>
            </article>
          )}
        </section>
      ))}
    </>
  )
}

export function AiSettingsPage({ onEngineChange }) {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState(getProvider())
  const [model, setModel] = useState(
    () => getModel() || providers.find((p) => p.id === getProvider())?.defaultModel || ''
  )
  const [message, setMessage] = useState('')
  const [connected, setConnected] = useState(hasApiKey())
  const current = providers.find((p) => p.id === provider)

  function handleSave(event) {
    event.preventDefault()
    const result = saveSettings({ apiKey, model, provider })
    setMessage(result.message)
    if (result.ok) {
      setApiKey('')
      setConnected(true)
      onEngineChange?.()
    }
  }

  function handleClear() {
    const result = clearSettings()
    setMessage(result.message)
    setApiKey('')
    setConnected(false)
    onEngineChange?.()
  }

  return (
    <>
      <section className="card">
        <h2 className="card-title">AI 設定</h2>
        <p className="group-note">
          金鑰只存在這個瀏覽器分頁的工作階段：重新整理仍在，關閉分頁即清除，不寫進原始碼或
          Git。呼叫模型時金鑰會送給你選擇的 AI 供應商，只是不經過本系統的伺服器（本版無後端）。
        </p>

        <form onSubmit={handleSave}>
          <div className="field">
            <label className="field-label" htmlFor="ai-provider">
              供應商
            </label>
            <select
              id="ai-provider"
              className="field-input"
              value={provider}
              onChange={(event) => {
                const next = event.target.value
                setProvider(next)
                const preset = providers.find((p) => p.id === next)
                if (preset) setModel(preset.defaultModel)
              }}
            >
              {providers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ai-key">
              API 金鑰
            </label>
            <input
              id="ai-key"
              className="field-input"
              type="password"
              autoComplete="off"
              spellCheck="false"
              placeholder={current?.keyHint}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="ai-model">
              模型名稱
            </label>
            <input
              id="ai-model"
              className="field-input"
              type="text"
              autoComplete="off"
              spellCheck="false"
              value={model}
              onChange={(event) => setModel(event.target.value)}
            />
          </div>

          <div className="field-actions">
            <button type="submit" className="enter-button">
              儲存並啟用
            </button>
            <button type="button" className="ghost-button" onClick={handleClear}>
              清除金鑰
            </button>
          </div>
        </form>

        {message && <p className="field-message">{message}</p>}

        <div className="dept-block">
          <h3 className="dept-label">AI 引擎狀態</h3>
          <p className={connected ? 'engine-on' : 'engine-off'}>
            {connected ? 'AI 引擎：已接' : 'AI 引擎：未接（示範模式）'}
          </p>
          {connected && <p className="dept-step-reason">{maskedKeyInfo()}</p>}
          <p className="dept-step-reason">
            狀態只表示這個工作階段中有沒有金鑰，不代表 API 一定能正常呼叫。
          </p>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">這種做法的限制</h2>
        <ul className="dept-list">
          <li>金鑰放在瀏覽器，頁面 JavaScript 讀得到，發生 XSS 時可能外洩。</li>
          <li>裝置上的惡意程式、開發者工具或高權限擴充功能都可能取得金鑰。</li>
          <li>呼叫模型時金鑰會送往 AI 供應商，不是完全不離開裝置。</li>
          <li>供應商不一定允許瀏覽器直接呼叫，可能被 CORS 擋下。</li>
          <li>正式產品應由後端保管金鑰並代理請求，不應把金鑰放在前端。</li>
        </ul>
      </section>
    </>
  )
}

const statusLabels = {
  pending: '尚未執行',
  running: '執行中',
  completed: '已完成',
  waiting_human: '等待人工',
  failed: '執行失敗',
}

const runStatusLabels = {
  idle: '尚未執行',
  running: '執行中',
  waiting_human: '等待人工',
  completed: '已完成',
  failed: '執行失敗',
}

function WorkflowRunner({ flow }) {
  const [run, setRun] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleRun() {
    setBusy(true)
    const fresh = createRun(flow)
    setRun(fresh)
    await runWorkflow(flow, fresh, (snapshot) => setRun(snapshot))
    setBusy(false)
  }

  return (
    <article className="card dept-card">
      <h3 className="dept-name">執行</h3>
      <div className="field-actions">
        <button type="button" className="enter-button" onClick={handleRun} disabled={busy}>
          {busy ? '執行中…' : '執行'}
        </button>
        {run && (
          <span className="run-status">
            流程狀態：{runStatusLabels[run.status]}
            {run.mode === 'demo' ? '（示範模式）' : '（真實 AI）'}
          </span>
        )}
      </div>

      {run &&
        flow.exec.map((node) => {
          const record = run.nodes[node.id] ?? { status: 'pending' }
          if (node.executor === 'system' && record.status === 'pending') return null
          return (
            <div className="run-node" key={node.id}>
              <p className="dept-step-name">
                {node.name}
                {node.agentName && `　${node.agentName}`}
              </p>
              <p className="dept-role">
                <span className="dept-role-name">狀態</span>
                <span>{statusLabels[record.status]}</span>
              </p>
              {record.mode && (
                <p className="dept-role">
                  <span className="dept-role-name">模式</span>
                  <span>{record.mode === 'demo' ? '示範模式' : '真實 AI'}</span>
                </p>
              )}
              {record.mode === 'demo' && (
                <p className="demo-flag">示範模式內容，非真實 AI 產出</p>
              )}
              {record.summary && (
                <p className="dept-role">
                  <span className="dept-role-name">做了什麼</span>
                  <span>{record.summary}</span>
                </p>
              )}
              {record.basis && (
                <p className="dept-role">
                  <span className="dept-role-name">根據什麼</span>
                  <span>{record.basis.join('、')}</span>
                </p>
              )}
              {record.output && <pre className="run-output">{record.output}</pre>}
              {record.error && <p className="run-error">失敗原因：{record.error}</p>}
              {record.status === 'waiting_human' && (
                <p className="run-waiting">
                  {record.waitingMessage}。前面 Agent 已完成，本流程已暫停，後續節點不會執行。
                </p>
              )}
            </div>
          )
        })}
    </article>
  )
}

export function PendingPage() {
  return (
    <section className="card card-pending">
      <p className="pending-text">此分頁待建</p>
    </section>
  )
}
