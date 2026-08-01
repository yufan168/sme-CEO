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
  const idRef = useRef('diagram-' + flow.id)

  useEffect(() => {
    let cancelled = false
    mermaid
      .render(idRef.current, flow.definition)
      .then((result) => {
        if (!cancelled) setSvg(result.svg)
      })
      .catch(() => {
        if (!cancelled) setSvg('')
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
