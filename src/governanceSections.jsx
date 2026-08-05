import { useMemo, useState } from 'react'
import {
  GOVERNANCE_RULES,
  agentWriteForbidden,
  agentWriteRule,
  approvalTiers,
  approvedComboConditions,
  assignmentStrictRules,
  auditTrailFields,
  auditTrailNote,
  autoSendConditions,
  autoSendWhitelist,
  automationPrinciple,
  classifyRisk,
  decisionGates,
  delegationFields,
  delegationIsValid,
  delegationNote,
  delegations,
  externalQuoteConditions,
  fieldSeparationNote,
  governancePrinciple,
  governanceScopeNote,
  intentCheckNote,
  intentChecks,
  keywordBehaviour,
  keywordLimitNote,
  lowRiskConditionNote,
  lowRiskConditions,
  lowRiskTypes,
  mandatoryReview,
  mandatoryReviewNote,
  minimumSetup,
  mustReviewOutputs,
  neverAutomate,
  ownerCountRule,
  permissionLegend,
  permissionMatrix,
  practicalTiers,
  quotableConditions,
  redLines,
  riskKeywordGroups,
  riskLevels,
  roleAssignment,
  roles,
  selfApprovalRules,
  separationRules,
  socialTiers,
  stopBehaviour,
  stopConditions,
  viewerVisibilityRule,
  viewerWorkflowRule,
} from './governance.js'
import { knowledgeCards } from './knowledgeCards.js'

function MatrixCell({ value }) {
  const tone =
    value === 'yes' ? 'gov-yes' : value === 'no' ? 'gov-no' : 'gov-cond'
  return <td className={tone}>{permissionLegend[value]}</td>
}

export function GovernanceRolesSection() {
  return (
    <>
      <section className="card">
        <h2 className="card-title">治理原則</h2>
        <p className="gov-principle">{governancePrinciple}</p>
        <p className="group-note">{governanceScopeNote}</p>
      </section>

      <section className="card-group">
        <h2 className="group-title">三級角色</h2>
        <p className="group-note">{ownerCountRule}</p>
        <div className="dept-grid agent-grid">
          {roles.map((role) => (
            <article className="card dept-card" key={role.id}>
              <h3 className="dept-name">
                {role.name}
                <span className="gov-role-title">{role.title}</span>
              </h3>
              <p className="dept-step-reason">適合人員：{role.who}</p>
              <div className="dept-block">
                <p className="dept-step-name">可以</p>
                <ul className="dept-list">
                  {role.can.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {role.cannot && (
                  <>
                    <p className="dept-step-name">不可以</p>
                    <ul className="dept-list gov-deny">
                      {role.cannot.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                {role.cannotDelegateToAi && (
                  <>
                    <p className="dept-step-name">不應直接交給 AI</p>
                    <ul className="dept-list gov-deny">
                      {role.cannotDelegateToAi.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">權限矩陣</h2>
        <p className="group-note">
          共 {permissionMatrix.length} 項操作。「經授權可」不是預設值，必須有寫齊五欄的具體授權才成立。
        </p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>系統操作</th>
                <th>owner</th>
                <th>editor</th>
                <th>viewer</th>
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((row) => (
                <tr key={row.action}>
                  <td>{row.action}</td>
                  <MatrixCell value={row.owner} />
                  <MatrixCell value={row.editor} />
                  <MatrixCell value={row.viewer} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">授權必須具體</h2>
        <p className="group-note">{delegationNote}</p>
        <div className="dept-block">
          {delegations.map((item) => {
            const check = delegationIsValid(item)
            return (
              <div className="dept-step" key={item.id}>
                <p className="dept-step-name">
                  {item.id}　{item.title}
                </p>
                {delegationFields.map((field) => (
                  <p className="dept-role" key={field.key}>
                    <span className="dept-role-name">{field.label}</span>
                    <span>
                      {Array.isArray(item[field.key])
                        ? item[field.key].join('、')
                        : item[field.key]}
                    </span>
                  </p>
                ))}
                <p className="dept-role">
                  <span className="dept-role-name">受權人</span>
                  <span>{item.grantee}</span>
                </p>
                <p className="dept-role">
                  <span className="dept-role-name">可否轉授權</span>
                  <span>{item.canSubDelegate ? '可' : '不可'}</span>
                </p>
                <p className={check.valid ? 'dept-step-reason' : 'run-error'}>
                  {check.valid
                    ? '授權完整，可依範圍執行。'
                    : `尚未生效，缺少：${check.missing.join('、')}。在補齊前，這些動作仍停在 owner。`}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">享洺實際角色配置</h2>
        <div className="dept-grid">
          <article className="card dept-card">
            <h3 className="dept-name">最小配置</h3>
            <div className="dept-block">
              {minimumSetup.map((row) => (
                <p className="dept-role" key={row.role}>
                  <span className="dept-role-name">{row.count}</span>
                  <span>
                    {row.role}　{row.who}
                  </span>
                </p>
              ))}
            </div>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">嚴格原則</h3>
            <ul className="dept-list gov-deny">
              {assignmentStrictRules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card dept-card">
          <h3 className="dept-name">建議配置</h3>
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>人員類型</th>
                  <th>建議角色</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {roleAssignment.map((row) => (
                  <tr key={row.people}>
                    <td>{row.people}</td>
                    <td>{row.role}</td>
                    <td>{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="card">
        <h2 className="card-title">Viewer 的兩條修正</h2>
        <ul className="dept-list">
          <li>{viewerVisibilityRule}</li>
          <li>{viewerWorkflowRule}</li>
        </ul>
      </section>

      <section className="card">
        <h2 className="card-title">Agent 不得直接寫入正式資料</h2>
        <p className="gov-principle">{agentWriteRule}</p>
        <ul className="dept-list gov-deny">
          {agentWriteForbidden.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2 className="card-title">三條紅線</h2>
        <ol className="dept-list gov-redline">
          {redLines.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </>
  )
}

function KnowledgeGateSection() {
  const stats = useMemo(() => {
    const usable = knowledgeCards.filter((card) => card.allowAIUse)
    const external = knowledgeCards.filter((card) => card.canQuoteExternally)
    const review = knowledgeCards.filter((card) => card.requiresHumanReview)
    return { usable: usable.length, external: external.length, review: review.length }
  }, [])

  return (
    <section className="card">
      <h2 className="card-title">知識可引用條件</h2>
      <p className="group-note">{fieldSeparationNote}</p>
      <div className="dept-grid agent-grid">
        <article className="card dept-card">
          <h3 className="dept-name">Agent 可引用（需全數成立）</h3>
          <ul className="dept-list">
            {quotableConditions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card dept-card">
          <h3 className="dept-name">可原文對外（再加這三項）</h3>
          <ul className="dept-list">
            {externalQuoteConditions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="dept-block">
        <p className="dept-role">
          <span className="dept-role-name">目前可被 AI 引用</span>
          <span>
            {stats.usable} / {knowledgeCards.length} 張
          </span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">目前可原文對外</span>
          <span>
            {stats.external} / {knowledgeCards.length} 張
            {stats.external === 0 && '（36 張皆為 Internal，沒有一張可直接貼給客戶）'}
          </span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">標為需人工審核</span>
          <span>
            {stats.review} / {knowledgeCards.length} 張
          </span>
        </p>
      </div>
    </section>
  )
}

function RiskChecker() {
  const [text, setText] = useState('')
  const [combo, setCombo] = useState(false)
  const result = useMemo(
    () => (text.trim() ? classifyRisk(text, { approvedCombo: combo }) : null),
    [text, combo]
  )

  return (
    <section className="card">
      <h2 className="card-title">風險檢測</h2>
      <p className="group-note">
        貼上要送出的內容，系統依關鍵字與隱性承諾判定等級。這是程式實際執行的判斷，
        不是說明文字。判定結果不會送出任何資料，只在這個頁面計算。
      </p>
      <textarea
        className="gov-input"
        rows={4}
        value={text}
        placeholder="例如：我們會在下週完成，費用可以再調整。"
        onChange={(event) => setText(event.target.value)}
      />
      <label className="gov-check">
        <input
          type="checkbox"
          checked={combo}
          onChange={(event) => setCombo(event.target.checked)}
        />
        <span>已確認為「已核准組合回覆」（{approvedComboConditions.join('、')}）</span>
      </label>
      {result && (
        <div className="dept-block">
          <p className={`gov-level gov-level-${result.level}`}>{result.level}</p>
          <p className="dept-role">
            <span className="dept-role-name">最低核准角色</span>
            <span>{result.approver}</span>
          </p>
          <p className="dept-role">
            <span className="dept-role-name">判定理由</span>
            <span>{result.reason}</span>
          </p>
          {result.matched.length > 0 && (
            <p className="dept-role">
              <span className="dept-role-name">命中風險詞</span>
              <span>
                {result.matched
                  .map((item) => `${item.group}：${item.words.join('、')}`)
                  .join('　')}
              </span>
            </p>
          )}
          {result.intents.length > 0 && (
            <p className="dept-role">
              <span className="dept-role-name">隱性承諾</span>
              <span>{result.intents.join('、')}</span>
            </p>
          )}
        </div>
      )}
    </section>
  )
}

export function ReviewRulesSection() {
  return (
    <>
      <RiskChecker />

      <section className="card">
        <h2 className="card-title">強制人工核准的高風險內容</h2>
        <p className="group-note">{mandatoryReviewNote}</p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>風險類型</th>
                <th>具體觸發條件</th>
                <th>最低核准角色</th>
              </tr>
            </thead>
            <tbody>
              {mandatoryReview.map((row) => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>{row.trigger}</td>
                  <td>{row.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">第一層：關鍵字攔截</h2>
        <p className="group-note">{keywordLimitNote}</p>
        <div className="dept-grid agent-grid">
          {riskKeywordGroups.map((group) => (
            <article className="card dept-card" key={group.id}>
              <h3 className="dept-name">{group.name}</h3>
              <p className="gov-words">{group.words.join('、')}</p>
            </article>
          ))}
        </div>
        <article className="card dept-card">
          <h3 className="dept-name">觸發後的系統行為</h3>
          <div className="dept-block">
            {keywordBehaviour.map((item, index) => (
              <p className="dept-step-text" key={item}>
                {index + 1}. {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section className="card">
        <h2 className="card-title">第二層：隱性承諾</h2>
        <p className="group-note">{intentCheckNote}</p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>語意類型</th>
                <th>例子</th>
              </tr>
            </thead>
            <tbody>
              {intentChecks.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <KnowledgeGateSection />

      <section className="card">
        <h2 className="card-title">審核決策表</h2>
        <div className="dept-block">
          {decisionGates.map((gate) => (
            <div className="dept-step" key={gate.step}>
              <p className="dept-step-name">
                {gate.step}　{gate.question}
              </p>
              <p className="dept-step-text">是 → {gate.yes}</p>
              <p className="dept-step-text">否 → {gate.no}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">風險分級</h2>
        <div className="dept-grid agent-grid">
          {riskLevels.map((level) => (
            <article className="card dept-card" key={level.id}>
              <h3 className="dept-name">
                <span className={`gov-level gov-level-${level.id}`}>{level.id}</span>
                {level.name.split('：')[1]}
              </h3>
              <p className="dept-step-reason">{level.handling}</p>
              <ul className="dept-list">
                {level.examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {level.checkPoints && (
                <>
                  <p className="dept-step-name">檢查重點</p>
                  <ul className="dept-list">
                    {level.checkPoints.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">一定要人審的產出類型</h2>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Agent 產出</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              {mustReviewOutputs.map((row) => (
                <tr key={row.output}>
                  <td>{row.output}</td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">放寬：不必逐則審核的部分</h2>
        <p className="group-note">
          刻意放寬，避免每一句「已收到」都塞到人身上。白名單情境仍須六項條件同時成立。
        </p>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">可自動或由授權 editor 直接送出</h3>
            <ul className="dept-list">
              {autoSendWhitelist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">六項條件（缺一即轉人工）</h3>
            <ul className="dept-list">
              {autoSendConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card dept-card">
          <h3 className="dept-name">低風險類型與成立條件</h3>
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>低風險類型</th>
                  <th>可免逐則審核的條件</th>
                </tr>
              </thead>
              <tbody>
                {lowRiskTypes.map((row) => (
                  <tr key={row.type}>
                    <td>{row.type}</td>
                    <td>{row.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="dept-step-reason">
            另須同時符合：{lowRiskConditions.join('、')}。{lowRiskConditionNote}
          </p>
        </article>
      </section>

      <section className="card-group">
        <h2 className="group-title">分層核准：不是所有東西都由 owner 審</h2>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">知識卡片</h3>
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>知識類型</th>
                    <th>建議核准人</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalTiers.map((row) => (
                    <tr key={row.kind}>
                      <td>{row.kind}</td>
                      <td>{row.approver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">社群內容</h3>
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>內容類型</th>
                    <th>建議核准人</th>
                  </tr>
                </thead>
                <tbody>
                  {socialTiers.map((row) => (
                    <tr key={row.kind}>
                      <td>{row.kind}</td>
                      <td>{row.approver}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">實務版三層</h2>
        <p className="group-note">{automationPrinciple}</p>
        <div className="dept-grid agent-grid">
          {practicalTiers.map((tier) => (
            <article className="card dept-card" key={tier.tier}>
              <h3 className="dept-name">{tier.tier}</h3>
              <p className="dept-step-reason">{tier.handler}</p>
              <ul className="dept-list">
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">不可自動化紅線</h2>
        <p className="group-note">
          以下八類即使流程其他部分全部自動化，人工審核也不得拿掉。
        </p>
        <div className="dept-block">
          {neverAutomate.map((row) => (
            <div className="dept-step" key={row.area}>
              <p className="dept-step-name">{row.area}</p>
              <p className="dept-step-text">{row.items.join('、')}</p>
              <p className="dept-step-reason">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">停止條件</h2>
        <p className="group-note">
          AI 失敗或資料矛盾時，不得自動降級成一個看起來合理的答案。
        </p>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">遇到這些情況要停</h3>
            <ul className="dept-list gov-deny">
              {stopConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">停下來之後怎麼做</h3>
            <div className="dept-block">
              {stopBehaviour.map((item, index) => (
                <p className="dept-step-text" key={item}>
                  {index + 1}. {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">不得自己建立、自己核准</h2>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">必須擋住</h3>
            <ul className="dept-list gov-deny">
              {separationRules.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">至少要留下的紀錄</h3>
            <ul className="dept-list">
              {auditTrailFields.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="dept-step-reason">{auditTrailNote}</p>
          </article>
        </div>
        <article className="card dept-card">
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>情況</th>
                  <th>規則</th>
                </tr>
              </thead>
              <tbody>
                {selfApprovalRules.map((row) => (
                  <tr key={row.situation}>
                    <td>{row.situation}</td>
                    <td>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="card">
        <h2 className="card-title">寫進系統的規則物件</h2>
        <p className="group-note">
          頁面與程式讀的是同一份 GOVERNANCE_RULES，不各自維護一套。
        </p>
        <pre className="run-output">{JSON.stringify(GOVERNANCE_RULES, null, 2)}</pre>
      </section>
    </>
  )
}
