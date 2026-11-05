import { Fragment, useState } from 'react'
import { fmt } from '@/lib/mock'
import type { Approval } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Check, X, ChevronRight, CircleCheck, CircleDashed, CircleX } from 'lucide-react'

export default function Approvals({ approvals, setApprovals }: {
  approvals: Approval[]
  setApprovals: (fn: (prev: Approval[]) => Approval[]) => void
}) {
  const [tab, setTab] = useState<'todo' | 'mine' | 'all'>('todo')
  const [openId, setOpenId] = useState<string | null>(null)

  const list = approvals.filter(a =>
    tab === 'todo' ? a.status === 'pending' : tab === 'mine' ? true : true)

  const act = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(a => {
      if (a.id !== id) return a
      const steps = a.steps.map(s =>
        s.result === '待處理'
          ? { ...s, time: new Date().toISOString().slice(0, 16).replace('T', ' '), result: action === 'approved' ? '通過' : '拒絕' }
          : s)
      return { ...a, status: action, steps }
    }))
  }

  const statusBadge = (s: Approval['status']) =>
    s === 'pending' ? <span className="text-xs bg-amber-50 text-amber-700 rounded px-2 py-0.5">待審批</span>
      : s === 'approved' ? <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">已通過</span>
      : <span className="text-xs bg-red-50 text-[#c8102e] rounded px-2 py-0.5">已拒絕</span>

  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['交易審批', '審批中心']} />
      <div className="bg-white rounded-xl shadow-sm mt-4">
        <div className="flex border-b border-slate-100 px-5">
          {([['todo', '我需審批的業務'], ['mine', '我發起的業務'], ['all', '審核狀態查詢']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {label}
              {k === 'todo' && <span className="ml-1.5 text-xs bg-red-500 text-white rounded-full px-1.5">{approvals.filter(a => a.status === 'pending').length}</span>}
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
              <th className="px-5 py-3 font-medium">業務類型</th>
              <th className="font-medium">金額</th>
              <th className="font-medium">發起人</th>
              <th className="font-medium">發起時間</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium text-right pr-5">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <Fragment key={a.id}>
                <tr onClick={() => setOpenId(openId === a.id ? null : a.id)}
                  className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                  <td className="px-5 py-3.5 text-slate-800">{a.type}<span className="text-xs text-slate-400 ml-2 font-mono">{a.id}</span></td>
                  <td className="text-slate-700">{a.amount ? fmt(a.amount, a.ccy) : '—'}</td>
                  <td className="text-slate-600">{a.initiator}</td>
                  <td className="text-slate-500">{a.time}</td>
                  <td>{statusBadge(a.status)}</td>
                  <td className="text-right pr-5">
                    <ChevronRight className={`w-4 h-4 inline text-slate-400 transition-transform ${openId === a.id ? 'rotate-90' : ''}`} />
                  </td>
                </tr>
                {openId === a.id && (
                  <tr key={a.id + '-d'} className="bg-slate-50/60">
                    <td colSpan={6} className="px-8 py-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-sm space-y-2">
                          <div className="font-medium text-slate-800 mb-2">交易詳情</div>
                          {a.payee && <Row k="收款人" v={`${a.payee}（${a.payeeAcct ?? ''}）`} />}
                          {a.amount && <Row k="金額" v={fmt(a.amount, a.ccy)} />}
                          {a.memo && <Row k="摘要/附言" v={a.memo} />}
                          <Row k="發起人" v={a.initiator} />
                          <Row k="發起時間" v={a.time} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 mb-3 text-sm">審批流程（訂單化展示）</div>
                          <div className="space-y-0">
                            {a.steps.map((s, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  {s.result === '通過' ? <CircleCheck className="w-5 h-5 text-emerald-500" />
                                    : s.result === '拒絕' ? <CircleX className="w-5 h-5 text-[#c8102e]" />
                                    : s.result === '待處理' ? <CircleDashed className="w-5 h-5 text-amber-500" />
                                    : <CircleDashed className="w-5 h-5 text-slate-300" />}
                                  {i < a.steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
                                </div>
                                <div className="pb-5 text-sm">
                                  <div className="text-slate-800">{s.node}　<span className="text-xs text-slate-400">{s.operator}</span></div>
                                  <div className="text-xs text-slate-400 mt-0.5">{s.time}　{s.result}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {a.status === 'pending' && (
                        <div className="flex gap-3 mt-2 pt-4 border-t border-slate-200">
                          <button onClick={() => act(a.id, 'approved')}
                            className="flex items-center gap-1.5 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-5 py-2 text-sm"><Check className="w-4 h-4" />審批通過</button>
                          <button onClick={() => act(a.id, 'rejected')}
                            className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-5 py-2 text-sm text-slate-600 hover:border-slate-400"><X className="w-4 h-4" />拒絕</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="py-12 text-center text-slate-400">暫無相關業務</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3">支持單人、雙人、多級多人及個性化審批模式（逐級審批、無序審批、上級代下級審批），審批指令訂單化展示節點、人員、時間、狀態。</p>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex"><span className="w-20 text-slate-400 shrink-0">{k}</span><span className="text-slate-700">{v}</span></div>
}
