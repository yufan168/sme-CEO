import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  flowchart: { useMaxWidth: true },
})

function WorkflowDiagram({ flow }) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const idRef = useRef('diagram-' + flow.id)

  useEffect(() => {
    let cancelled = false
    mermaid
      .render(idRef.current, flow.definition)
      .then((result) => {
        if (cancelled) return
        setSvg(result.svg)
        setError('')
      })
      .catch((err) => {
        // 圖畫不出來時要說出原因，不能留一塊空白讓人以為流程沒問題。
        if (cancelled) return
        setSvg('')
        setError(String(err?.message ?? err))
      })
    return () => {
      cancelled = true
    }
  }, [flow.definition])

  return (
    <>
      <div
        className="mermaid-figure"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {error && <p className="run-error">流程圖無法產生：{error}</p>}
      <ul className="legend">
        <li>
          <span className="legend-swatch legend-start"></span>系統節點
        </li>
        <li>
          <span className="legend-swatch legend-agent"></span>Agent 節點
        </li>
        <li>
          <span className="legend-swatch legend-human"></span>人工關卡
        </li>
        {flow.nodes.some((node) => node.kind === 'decision') && (
          <li>
            <span className="legend-swatch legend-decision"></span>判斷節點
          </li>
        )}
      </ul>

      <div className="dept-block">
        <h3 className="dept-label">流程角色總表</h3>
        {flow.nodes.map((node) => (
          <div className="dept-step" key={node.id + node.work}>
            <p className="dept-step-name">
              {node.id}　{node.work}
            </p>
            <p className={'dept-step-text node-kind-' + node.kind}>{node.owner}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default WorkflowDiagram
