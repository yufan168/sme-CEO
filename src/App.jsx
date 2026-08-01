import { departments } from './departments.js'

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
            <dd>AI 公司管理系統開發</dd>
          </div>
          <div className="info-row">
            <dt>負責人</dt>
            <dd>SUSU</dd>
          </div>
        </dl>
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
                <h4 className="dept-label">AI 負責</h4>
                <ul className="dept-list">
                  {dept.ai.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="dept-block">
                <h4 className="dept-label">人負責</h4>
                <ul className="dept-list">
                  {dept.human.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
