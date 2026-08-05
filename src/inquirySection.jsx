import { useMemo, useState } from 'react'
import {
  autoSendRule,
  canAutoSend,
  caseStates,
  channels,
  classifyInquiry,
  criticalRule,
  exceptionStates,
  firstVersionCannot,
  firstVersionCan,
  humanChecks,
  humanDecisions,
  humanGateNote,
  humanGateTitle,
  inquiryConditions,
  inquiryEvents,
  inquiryKeywords,
  inquiryOverview,
  inquiryPrinciple,
  inquiryRule,
  inquiryTypes,
  keywordNote,
  neverAutomate,
  riskLevels,
  savedWork,
  savingNote,
  stateFlow,
  stillYours,
  triggerEvent,
} from './inquiryFlow.js'

export function InquiryAutomationSection({ onNavigate }) {
  const [text, setText] = useState('')
  const [state, setState] = useState('WaitingHuman')
  const result = useMemo(() => (text.trim() ? classifyInquiry(text) : null), [text])
  const guard = useMemo(() => canAutoSend({ status: state }), [state])

  return (
    <>
      <section className="card">
        <h2 className="card-title">第一條自動化：詢價與一般訊息處理</h2>
        <p className="gov-stamp">
          {inquiryRule.ruleId}　v{inquiryRule.ruleVersion}　生效 {inquiryRule.effectiveFrom}
        </p>
        <p className="gov-principle">{inquiryPrinciple}</p>
        <div className="dept-block">
          {inquiryOverview.map((item, index) => (
            <p className="dept-step-text" key={item}>
              {index + 1}. {item}
            </p>
          ))}
        </div>
        <div className="field-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => onNavigate('workflow', 'flow-wf-q01')}
          >
            前往 WF-Q01 流程圖
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">觸發條件</h2>
        <p className="dept-role">
          <span className="dept-role-name">Event</span>
          <span>{triggerEvent}</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">適用管道</span>
          <span>{channels.join('、')}</span>
        </p>
        <p className="dept-step-name">符合任一條件即建立案件</p>
        <ul className="dept-list">
          {inquiryConditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="dept-step-name">第一版提示詞</p>
        <p className="gov-words">{inquiryKeywords.join('、')}</p>
        <p className="dept-step-reason">{keywordNote}</p>
      </section>

      <section className="card">
        <h2 className="card-title">風險標記試算</h2>
        <p className="group-note">
          貼上一則客戶訊息，看系統怎麼標風險與審核等級。報價與折扣屬 Level 4，
          金額只有負責人能決定，AI 連建議金額都不能寫。
        </p>
        <textarea
          className="gov-input"
          rows={3}
          value={text}
          placeholder="例如：想請問三十人的 ISO 內訓費用大概多少？"
          onChange={(event) => setText(event.target.value)}
        />
        {result && (
          <div className="dept-block">
            <p className="dept-role">
              <span className="dept-role-name">風險等級</span>
              <span>
                <span className={`gov-conf gov-conf-${result.risk === 'Critical' ? 'Low' : result.risk === 'High' ? 'Medium' : 'High'}`}>
                  {result.risk}
                </span>
                {result.reason}
              </span>
            </p>
            <p className="dept-role">
              <span className="dept-role-name">審核等級</span>
              <span>
                <span className={`gov-level gov-level-L${result.approvalLevel}`}>
                  Level {result.approvalLevel}
                </span>
              </span>
            </p>
            <p className="dept-role">
              <span className="dept-role-name">AI 可以做到哪裡</span>
              <span>{result.aiAllowed}</span>
            </p>
          </div>
        )}
        <p className="dept-step-reason">{criticalRule}</p>
      </section>

      <section className="card">
        <h2 className="card-title">案件狀態</h2>
        <p className="dept-step-text">
          {stateFlow.join('　→　')}　　例外：{exceptionStates.join('、')}
        </p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>狀態</th>
                <th>中文</th>
                <th>可否自動對外發送</th>
                <th>說明</th>
              </tr>
            </thead>
            <tbody>
              {caseStates.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.label}</td>
                  <td className="gov-no">不可</td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="gov-principle">{autoSendRule}</p>
        <p className="group-note">
          這條是寫成程式的硬規則，不是說明文字。選一個狀態看 canAutoSend() 的實際回覆：
        </p>
        <div className="gov-controls">
          <label className="gov-field">
            <span>案件狀態</span>
            <select value={state} onChange={(event) => setState(event.target.value)}>
              {caseStates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}　{item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="run-error">擋下：{guard.reason}</p>
      </section>

      <section className="card">
        <h2 className="card-title">分類與承辦</h2>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>案件類型</th>
                <th>建議承辦部門</th>
                <th>主要 Agent</th>
              </tr>
            </thead>
            <tbody>
              {inquiryTypes.map((item) => (
                <tr key={item.id}>
                  <td>{item.label}</td>
                  <td>{item.department}</td>
                  <td>{item.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>風險等級</th>
                <th>判斷標準</th>
              </tr>
            </thead>
            <tbody>
              {riskLevels.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card-group">
        <h2 className="group-title">十個 Event → Action</h2>
        <p className="group-note">
          第 1 至 6 步由機器完成，第 6 步之後停住。第 7 步的觸發條件是「人已核准並由人完成正式送出」，
          不是「草稿完成」，也不是「主管看過」。
        </p>
        <div className="dept-block">
          {inquiryEvents.map((item) => (
            <div className="dept-step" key={item.no}>
              <p className="dept-step-name">
                {item.no}. {item.event}
              </p>
              <p className="dept-role">
                <span className="dept-role-name">執行者</span>
                <span>{item.actor}</span>
              </p>
              <p className="dept-role">
                <span className="dept-role-name">Action</span>
                <span>{item.actions.join('；')}</span>
              </p>
              {item.forbidden && (
                <p className="dept-role">
                  <span className="dept-role-name">限制</span>
                  <span className="gov-deny-text">{item.forbidden.join('；')}</span>
                </p>
              )}
              <p className="dept-step-reason">輸出：{item.outputs.join('、')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">【{humanGateTitle}】</h2>
        <p className="gov-principle">{humanGateNote}</p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>審核項目</th>
                <th>人的責任</th>
              </tr>
            </thead>
            <tbody>
              {humanChecks.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.duty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dept-step-name">人工決策結果</p>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>決定</th>
                <th>接著發生什麼</th>
              </tr>
            </thead>
            <tbody>
              {humanDecisions.map((row) => (
                <tr key={row.decision}>
                  <td>{row.decision}</td>
                  <td>{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dept-step-name">絕對不可自動化</p>
        <ul className="dept-list gov-deny">
          {neverAutomate.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card-group">
        <h2 className="group-title">自動化後每天省下什麼</h2>
        <article className="card dept-card">
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>原本人工工作</th>
                  <th>自動化後</th>
                </tr>
              </thead>
              <tbody>
                {savedWork.map((row) => (
                  <tr key={row.before}>
                    <td>{row.before}</td>
                    <td className="gov-yes">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="dept-step-reason">{savingNote}</p>
        </article>
        <div className="dept-grid agent-grid">
          <article className="card dept-card">
            <h3 className="dept-name">第一版可以做</h3>
            <ul className="dept-list">
              {firstVersionCan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card dept-card">
            <h3 className="dept-name">第一版不要做</h3>
            <ul className="dept-list gov-deny">
              {firstVersionCannot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <article className="card dept-card">
          <h3 className="dept-name">你仍然要親自做</h3>
          <ul className="dept-list">
            {stillYours.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  )
}
