import { departments } from './departments.js'
import { authority, authorityNote } from './authority.js'

function App() {
  return (
    <main className="page">
      <section className="section home">
        <h1 className="company-name">享洺有限公司</h1>
        <p className="tagline">運用 AI 協助企業提升管理效率</p>
        <button type="button" className="enter-button">
          進入公司
        </button>
      </section>

      <section className="section">
        <h2 className="section-title">公司資訊</h2>
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

      <section className="section">
        <h2 className="section-title">組織架構</h2>
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

      <section className="section">
        <h2 className="section-title">部門藍圖</h2>
        <div className="dept-grid">
          {departments.map((dept) => (
            <article className="dept-card" key={dept.name}>
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

      <section className="section">
        <h2 className="section-title">人力配置與授權</h2>
        <p className="section-note">{authorityNote}</p>
        <div className="dept-grid">
          {authority.map((row) => (
            <article className="dept-card" key={row.name}>
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
    </main>
  )
}

export default App
