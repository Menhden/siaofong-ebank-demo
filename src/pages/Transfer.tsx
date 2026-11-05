import { useState } from 'react'
import { Breadcrumb } from './Accounts'
import Wizard from './transfer/Wizard'
import Remit from './transfer/Remit'
import MacauChina from './transfer/MacauChina'
import ScheduledPanel from './transfer/ScheduledPanel'
import PayeeBook from './transfer/PayeeBook'
import FpsEasy from './transfer/FpsEasy'
import Receipts from './transfer/Receipts'
import GpiTrack from './transfer/GpiTrack'
import type { PageKey } from '@/components/Layout'

const TABS = [
  { key: 'transfer', label: '轉賬（行內／跨行）' },
  { key: 'macau', label: '澳中轉賬' },
  { key: 'remit', label: '匯款（普通 SWIFT）' },
  { key: 'receipts', label: '電子回單' },
  { key: 'gpi', label: 'SWIFT GPI 追蹤' },
  { key: 'scheduled', label: '預約／周期管理' },
  { key: 'payee', label: '收款人與模板' },
  { key: 'fps', label: '過數易（FPS）' },
] as const

type TabKey = typeof TABS[number]['key']

export default function Transfer({ setPage, onSubmitted }: { setPage: (p: PageKey) => void; onSubmitted: (info?: { amount: number; payeeName: string; payee: string }) => void }) {
  const [tab, setTab] = useState<TabKey>('macau')
  const crumb = ['轉賬匯款', TABS.find(t => t.key === tab)!.label]
  return (
    <div className="relative z-10 max-w-6xl mx-auto">
      <Breadcrumb items={crumb} />
      <div className="flex gap-2 mt-4 bg-white rounded-t-xl shadow-sm px-5 border-b border-slate-100 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-3.5 text-sm border-b-2 -mb-px whitespace-nowrap ${tab === t.key ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-5">
        {tab === 'transfer' && <Wizard setPage={setPage} onSubmitted={onSubmitted} />}
        {tab === 'macau' && <MacauChina />}
        {tab === 'remit' && <Remit />}
        {tab === 'receipts' && <Receipts />}
        {tab === 'gpi' && <GpiTrack />}
        {tab === 'scheduled' && <ScheduledPanel />}
        {tab === 'payee' && <PayeeBook />}
        {tab === 'fps' && <FpsEasy />}
      </div>
    </div>
  )
}
