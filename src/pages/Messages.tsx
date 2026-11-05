import { useState } from 'react'
import type { Message } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Megaphone, ReceiptText, Gift, ChevronRight } from 'lucide-react'

const KIND_ICON = { 公告: Megaphone, 交易通知: ReceiptText, 營銷活動: Gift } as const
const KIND_COLOR = {
  公告: 'bg-blue-50 text-[#134b9e]',
  交易通知: 'bg-emerald-50 text-emerald-700',
  營銷活動: 'bg-amber-50 text-amber-700',
} as const

export default function Messages({ messages, setMessages }: {
  messages: Message[]
  setMessages: (fn: (prev: Message[]) => Message[]) => void
}) {
  const [tab, setTab] = useState<'全部' | Message['kind']>('全部')
  const [openId, setOpenId] = useState<number | null>(null)

  const list = messages.filter(m => tab === '全部' || m.kind === tab)
  const unreadOf = (k: Message['kind']) => messages.filter(m => m.kind === k && !m.read).length

  const open = (id: number) => {
    setOpenId(openId === id ? null : id)
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: true } : m)))
  }

  return (
    <div className="relative z-10 max-w-4xl mx-auto">
      <Breadcrumb items={['消息中心']} />
      <div className="bg-white rounded-xl shadow-sm mt-4">
        <div className="flex items-center border-b border-slate-100 px-5">
          {(['全部', '公告', '交易通知', '營銷活動'] as const).map(k => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {k}{k !== '全部' && unreadOf(k) > 0 && <span className="ml-1.5 text-xs bg-red-500 text-white rounded-full px-1.5">{unreadOf(k)}</span>}
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setMessages(prev => prev.map(m => ({ ...m, read: true })))}
            className="text-xs text-[#134b9e] hover:underline">全部標為已讀</button>
        </div>

        <div className="divide-y divide-slate-50">
          {list.map(m => {
            const Icon = KIND_ICON[m.kind]
            return (
              <div key={m.id}>
                <button onClick={() => open(m.id)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${KIND_COLOR[m.kind]}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${m.read ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                      {!m.read && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 align-middle" />}
                      {m.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.kind} · {m.date}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-300 transition-transform ${openId === m.id ? 'rotate-90' : ''}`} />
                </button>
                {openId === m.id && (
                  <div className="px-16 pb-5 text-sm text-slate-600 leading-relaxed">{m.body}</div>
                )}
              </div>
            )
          })}
          {list.length === 0 && <div className="py-14 text-center text-slate-400 text-sm">暫無消息</div>}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3">消息推送分免登錄查詢和登錄查詢兩類；交易通知同時經短訊及企業手機銀行推送。</p>
    </div>
  )
}
