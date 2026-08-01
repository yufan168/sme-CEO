import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  flowchart: { useMaxWidth: true },
})

const definition = `flowchart LR
  incoming["來訊"]
  classify["分類"]
  lookup["查資料"]
  draft["草擬"]
  approve["主管審核"]
  send["送出"]
  incoming --> classify --> lookup --> draft --> approve --> send
  classDef startNode fill:#f3f4f6,stroke:#9ca3af,color:#374151;
  classDef agentNode fill:#e8f1ff,stroke:#4f7fc7,color:#173b68;
  classDef humanNode fill:#fff0e5,stroke:#c56a2d,color:#6b3415;
  class incoming startNode;
  class classify,lookup,draft agentNode;
  class approve,send humanNode;`

function WorkflowDiagram() {
  const [svg, setSvg] = useState('')
  const idRef = useRef('workflow-diagram')

  useEffect(() => {
    let cancelled = false
    mermaid
      .render(idRef.current, definition)
      .then((result) => {
        if (!cancelled) setSvg(result.svg)
      })
      .catch(() => {
        if (!cancelled) setSvg('')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <div
        className="mermaid-figure"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <ul className="legend">
        <li>
          <span className="legend-swatch legend-start"></span>起點
        </li>
        <li>
          <span className="legend-swatch legend-agent"></span>Agent 節點
        </li>
        <li>
          <span className="legend-swatch legend-human"></span>人工關卡
        </li>
      </ul>
    </>
  )
}

export default WorkflowDiagram
