import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  flowchart: { useMaxWidth: true },
})

const definition = `flowchart LR
  intake["接收顧客來訊"]
  tidy["整理來訊"]
  classify["判斷問題類型"]
  lookup["查詢相關資料"]
  draft["草擬客服回覆"]
  approve["主管審核"]
  send["送出回覆"]
  done["流程完成"]
  intake --> tidy --> classify --> lookup --> draft --> approve --> send --> done
  classDef systemNode fill:#F2EEEA,stroke:#A99B92,color:#5A4940;
  classDef agentNode fill:#FFF4C2,stroke:#F7B729,color:#5C4219;
  classDef humanNode fill:#372C27,stroke:#372C27,color:#FFFFFF;
  class intake,done systemNode;
  class tidy,classify,lookup,draft agentNode;
  class approve,send humanNode;`

const nodes = [
  { id: 'A', work: '接收顧客來訊', owner: '系統起點', kind: 'system' },
  { id: 'B', work: '整理來訊', owner: 'Agent：訊息整理員', kind: 'agent' },
  { id: 'C', work: '判斷問題類型', owner: 'Agent：問題分派員', kind: 'agent' },
  { id: 'D', work: '查詢相關資料', owner: 'Agent：訂單資料查詢員', kind: 'agent' },
  { id: 'E', work: '草擬客服回覆', owner: 'Agent：客服回覆撰寫員', kind: 'agent' },
  { id: 'F', work: '主管審核', owner: '人', kind: 'human' },
  { id: 'G', work: '送出回覆', owner: '人', kind: 'human' },
  { id: 'H', work: '流程完成', owner: '系統終點', kind: 'system' },
]

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
        {nodes.map((node) => (
          <div className="dept-step" key={node.id}>
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
