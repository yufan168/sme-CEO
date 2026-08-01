import { useEffect, useRef, useState } from 'react'
import {
  HomePage,
  OrgPage,
  DepartmentsPage,
  AiStaffPage,
  WorkflowPage,
  PendingPage,
} from './sections.jsx'

const pages = [
  { id: 'home', label: '公司首頁', ready: true, render: HomePage },
  { id: 'war-room', label: 'CEO 戰情室', ready: false },
  { id: 'organization', label: '組織圖', ready: true, render: OrgPage },
  { id: 'departments', label: '部門', ready: true, render: DepartmentsPage },
  { id: 'ai-staff', label: 'AI 員工', ready: true, render: AiStaffPage },
  { id: 'workflow', label: '工作流程', ready: true, render: WorkflowPage },
  { id: 'knowledge', label: '知識庫', ready: false },
  { id: 'review', label: '審核中心', ready: false },
  { id: 'permission', label: '權限', ready: false },
  { id: 'automation', label: '自動化', ready: false },
]

function App() {
  const [activeId, setActiveId] = useState('home')
  const contentRef = useRef(null)
  const active = pages.find((page) => page.id === activeId)
  const Content = active.render ?? PendingPage

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
    window.scrollTo(0, 0)
  }, [activeId])

  return (
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img className="sidebar-mark" src="/logo-mark.png" alt="享洺有限公司" width="32" height="32" />
          <span className="sidebar-brand-text">
            <span className="sidebar-brand-name">享洺有限公司</span>
            <span className="sidebar-brand-sub">XIANG MING Ltd.</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              className={
                'sidebar-item' +
                (page.id === activeId ? ' is-active' : '') +
                (page.ready ? '' : ' is-pending')
              }
              onClick={() => setActiveId(page.id)}
            >
              <span className="sidebar-label">{page.label}</span>
              {!page.ready && <span className="sidebar-tag">待建</span>}
            </button>
          ))}
        </nav>
        <p className="sidebar-motto">AI 起草 · 人審核 · 人發送</p>
      </aside>

      <div className="workspace-main">
        <header className="topbar">
          <h1 className="topbar-title">{active.label}</h1>
        </header>
        <main className="page-content" ref={contentRef}>
          <Content />
        </main>
      </div>
    </div>
  )
}

export default App
