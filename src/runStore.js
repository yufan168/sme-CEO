// 本版沒有後端，執行紀錄只存在目前頁面記憶體，重新整理後不保留。
const runs = new Map()
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function setRun(workflowId, run) {
  runs.set(workflowId, run)
  notify()
}

export function getRun(workflowId) {
  return runs.get(workflowId) ?? null
}

export function listWaiting() {
  const out = []
  runs.forEach((run, workflowId) => {
    if (run.status === 'waiting_human' && run.currentNodeId) {
      out.push({ workflowId, nodeId: run.currentNodeId, run })
    }
  })
  return out
}
