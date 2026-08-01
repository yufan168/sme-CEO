import { departments } from './departments.js'
import { authority, authorityNote } from './authority.js'
import { businessLines, businessLinesNote } from './businessLines.js'
import { agentTeam } from './agents.js'
import { opsTeam } from './agentTeamOps.js'
import { marketingTeam } from './agentTeamMarketing.js'
import {
  blueprint,
  blueprintNote,
  blueprintOverview,
  blueprintPrinciple,
  rolloutNote,
} from './agentBlueprint.js'
import WorkflowDiagram from './WorkflowDiagram.jsx'
import { workflows } from './workflows.js'

export function HomePage() {
  return (
    <>
      <section className="card card-home">
        <h1 className="company-name">享洺有限公司</h1>
        <p className="tagline">運用 AI 協助企業提升管理效率</p>
        <button type="button" className="enter-button">
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
            <dd>2026 年</dd>
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
      <div className="org-chart">
        <div className="org-node org-root">享洺有限公司</div>
        <div className="org-stem"></div>
        <ul className="org-children">
          {departments.map((dept) => (
            <li className="org-child" key={dept.name}>
              <div className="org-node">{dept.name}</div>
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
            </article>
          </div>
        </section>
      ))}
    </>
  )
}

function AgentTeamSection({ team }) {
  return (
    <section className="card-group">
      <h2 className="group-title">深入規格：{team.department}</h2>
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
            {flow.name}（{flow.department}）
          </h2>
          <p className="group-note">{flow.shape}</p>

          <article className="card">
            <WorkflowDiagram flow={flow} />
          </article>

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

export function PendingPage() {
  return (
    <section className="card card-pending">
      <p className="pending-text">此分頁待建</p>
    </section>
  )
}
