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
            <dd>企業管理顧問公司</dd>
          </div>
          <div className="info-row">
            <dt>成立年份</dt>
            <dd>2026 年</dd>
          </div>
          <div className="info-row">
            <dt>規模</dt>
            <dd>1–10 人</dd>
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
        <h2 className="section-title">組織架構</h2>
        <div className="org-chart-frame">
          <p className="org-chart-placeholder">部門待建</p>
        </div>
      </section>
    </main>
  )
}

export default App
