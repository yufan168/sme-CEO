import { useMemo, useState } from 'react'
import {
  EXPORT_VERSION,
  buildBrandExport,
  buildPublicExport,
  designTokenGroups,
  downloadJson,
  exportFilename,
  exportNotice,
  readDesignTokens,
} from './brandExport.js'

const KINDS = [
  {
    id: 'full',
    label: '完整版',
    note: '公司資料、定位、設計代幣、業務線、9 部門 35 位 Agent、11 條流程、治理規則、36 張知識卡片全文。',
    build: buildBrandExport,
  },
  {
    id: 'public',
    label: '對外精簡版',
    note: '只留公司基本資料、定位、設計代幣、業務線，以及標示可原文對外的知識。',
    build: buildPublicExport,
  },
]

export function BrandExportPanel() {
  const [kind, setKind] = useState('full')
  const [result, setResult] = useState(null)
  const tokens = useMemo(() => readDesignTokens(), [])

  const current = KINDS.find((item) => item.id === kind) ?? KINDS[0]
  const data = useMemo(() => current.build(), [current])
  const size = useMemo(() => JSON.stringify(data).length, [data])

  const onDownload = () => setResult(downloadJson(exportFilename(kind), data))

  const onCopy = () => {
    const text = JSON.stringify(data, null, 2)
    navigator.clipboard
      .writeText(text)
      .then(() => setResult({ ok: true, reason: `已複製 ${text.length} 字元到剪貼簿。` }))
      .catch((error) =>
        setResult({ ok: false, reason: `複製失敗：${String(error?.message ?? error)}` })
      )
  }

  return (
    <section className="card">
      <h2 className="card-title">品牌資料與設計匯出</h2>
      <p className="group-note">
        把公司資料、品牌設計與治理規則匯出成 JSON，給外部工具使用。內容直接讀自系統本身，
        不另外維護一份，因此不會與畫面不一致。
      </p>
      <p className="gov-stamp">schema xiangming-brand-export　v{EXPORT_VERSION}</p>

      <div className="gov-controls">
        {KINDS.map((item) => (
          <label className="gov-check" key={item.id}>
            <input
              type="radio"
              name="brand-export-kind"
              value={item.id}
              checked={kind === item.id}
              onChange={() => {
                setKind(item.id)
                setResult(null)
              }}
            />
            <span>
              <strong>{item.label}</strong>
              <span className="gov-sub">{item.note}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="dept-block">
        <p className="dept-role">
          <span className="dept-role-name">檔案大小</span>
          <span>約 {(size / 1024).toFixed(1)} KB</span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">知識卡片</span>
          <span>
            {kind === 'full'
              ? `${data.knowledge.cards.length} 張（含 Internal）`
              : `${data.knowledge.cards.length} 張（僅可原文對外）`}
          </span>
        </p>
        <p className="dept-role">
          <span className="dept-role-name">是否含 API 金鑰</span>
          <span className="gov-yes">否</span>
        </p>
      </div>

      <p className={kind === 'full' ? 'run-error' : 'gov-allow'}>
        {kind === 'full' ? exportNotice : '本檔已移除 Internal 知識與治理細節，可提供給外部工具。'}
      </p>

      <div className="field-actions">
        <button type="button" className="ghost-button" onClick={onDownload}>
          下載 JSON
        </button>
        <button type="button" className="ghost-button" onClick={onCopy}>
          複製到剪貼簿
        </button>
      </div>
      {result && <p className={result.ok ? 'gov-allow' : 'run-error'}>{result.reason}</p>}

      <h3 className="dept-name">設計代幣</h3>
      <p className="group-note">以下色票讀自實際生效的 CSS 變數，改了樣式這裡就會跟著變。</p>
      {designTokenGroups.map((group) => (
        <div key={group.id}>
          <p className="dept-step-name">{group.label}</p>
          <div className="bind-grid">
            {group.vars.map((name) => {
              const value = tokens[group.id]?.tokens?.[name] ?? '（未定義）'
              return (
                <span className="swatch" key={name}>
                  <span className="swatch-dot" style={{ background: value }} />
                  <span className="bind-name">
                    {name}
                    <span className="bind-id">{value}</span>
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      ))}

      <h3 className="dept-name">內容預覽</h3>
      <pre className="run-output brand-preview">
        {JSON.stringify(data, null, 2).slice(0, 2000)}
        {size > 2000 ? '\n…（其餘內容請下載或複製取得）' : ''}
      </pre>
    </section>
  )
}
