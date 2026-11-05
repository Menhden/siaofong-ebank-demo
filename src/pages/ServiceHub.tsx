import { useState } from 'react'
import { downloadCenter, faqs, branches, channelDiscounts, fxRates, fmt } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Download, HelpCircle, MapPin, Percent, Smartphone, ChevronDown, Tag } from 'lucide-react'

const TABS = [
  ['download', '下載中心', Download],
  ['faq', '幫助中心', HelpCircle],
  ['branch', '網點查詢', MapPin],
  ['calc', '匯率計算', Percent],
  ['discount', '渠道優惠', Tag],
] as const

export default function ServiceHub() {
  const [tab, setTab] = useState<'download' | 'faq' | 'branch' | 'calc' | 'discount'>('download')
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['服務中心']} />
      <div className="flex border-b border-slate-100 bg-white rounded-t-xl shadow-sm mt-4 px-5">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k as typeof tab)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
        <div className="flex-1" />
        <span className="self-center text-xs text-slate-400">部分輕量功能支持免登錄使用 · 演示版 V1.2.0</span>
      </div>
      <div className="bg-white rounded-b-xl shadow-sm p-5">
        {tab === 'download' && <DownloadPanel />}
        {tab === 'faq' && <FaqPanel />}
        {tab === 'branch' && <BranchPanel />}
        {tab === 'calc' && <CalcPanel />}
        {tab === 'discount' && <DiscountPanel />}
      </div>
    </div>
  )
}

const CATS = ['全部', '業務表單', '操作手冊', '軟件工具']

function DownloadPanel() {
  const [cat, setCat] = useState('全部')
  const [got, setGot] = useState('')
  const shown = downloadCenter.filter(d => cat === '全部' || d.cat === cat)
  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">推進網銀業務表單電子化：各類業務表單可從公眾網站及網銀下載，無需臨櫃領取。</p>
      <div className="flex gap-2 mb-4">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm border ${cat === c ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'border-slate-200 text-slate-600 hover:border-[#134b9e]'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {shown.map(d => (
          <div key={d.name} className="border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-blue-50 text-[#134b9e] flex items-center justify-center shrink-0">
              {d.format === 'APP' ? <Smartphone className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{d.cat} · {d.format} · {d.size}</div>
            </div>
            <button onClick={() => setGot(d.name)}
              className={`text-xs rounded-lg px-3 py-1.5 shrink-0 ${got === d.name ? 'bg-emerald-50 text-emerald-700' : 'border border-[#134b9e] text-[#134b9e] hover:bg-blue-50'}`}>
              {got === d.name ? '✓ 已下載' : '下載'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FaqPanel() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="max-w-3xl">
      <div className="divide-y divide-slate-100">
        {faqs.map((f, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
              <span className="text-sm text-slate-800 font-medium">Q{i + 1}：{f.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && <div className="pb-4 text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-4 mb-2">{f.a}</div>}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-4">更多問題可致電 24 小時服務熱線（853）8800 0000，或在線客服（演示版 AI 客服「豐小助」規劃中，第二期接入）。</p>
    </div>
  )
}

function BranchPanel() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {branches.map(b => (
        <div key={b.name} className="border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#c8102e]" />
            <span className="text-sm font-medium text-slate-800">{b.name}</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 leading-relaxed">{b.addr}</div>
          <div className="text-xs text-slate-500 mt-1">{b.tel} · {b.hours}</div>
        </div>
      ))}
      <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
        網點地圖組件（演示版以列表替代）· 部分查詢類功能支持免登錄使用
      </div>
    </div>
  )
}

function CalcPanel() {
  const [ccy, setCcy] = useState('USD')
  const [amt, setAmt] = useState('1000')
  const [dir, setDir] = useState<'buy' | 'sell'>('buy')
  const rate = fxRates.find(f => f.ccy === ccy)!
  const n = parseFloat(amt) || 0
  const mop = dir === 'buy' ? n * rate.sellSpot : n * rate.buySpot
  return (
    <div className="max-w-md">
      <div className="border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {([['buy', '外幣 → MOP（買入外幣）'], ['sell', 'MOP → 外幣（賣出外幣）']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setDir(k)}
              className={`py-2 rounded-lg border text-xs ${dir === k ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{label}</button>
          ))}
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">外幣幣種</label>
          <select value={ccy} onChange={e => setCcy(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
            {fxRates.map(f => <option key={f.ccy} value={f.ccy}>{f.ccy}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">金額（{ccy}）</label>
          <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmt(e.target.value) }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div className="bg-blue-50 rounded-lg px-4 py-3 flex justify-between text-sm">
          <span className="text-slate-600">折合澳門元（現匯價 {dir === 'buy' ? rate.sellSpot : rate.buySpot}）</span>
          <span className="font-bold text-[#134b9e]">{fmt(mop, 'MOP')}</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3">計算結果僅供參考，實際成交以交易時牌價為準。</p>
    </div>
  )
}

function DiscountPanel() {
  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-xs text-slate-500 leading-relaxed">以下為您適用的企網自身渠道優惠，按產品及費用項目分別計算。費用以核心／有權收費系統最終返回為準；VIP 標籤由核心提供，不由企網自行認定。</p>
        <span className="shrink-0 text-xs bg-blue-50 text-[#134b9e] rounded-lg px-3 py-1.5">企網 Web＋銀企直連</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">業務範圍</th>
            <th className="font-medium">項目</th>
            <th className="font-medium text-right">標準費用／利率</th>
            <th className="font-medium text-right">適用優惠</th>
            <th className="font-medium text-right">優惠後結果</th>
            <th className="font-medium text-right pr-2">渠道／有效期</th>
          </tr>
        </thead>
        <tbody>
          {channelDiscounts.map((d, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-500 text-xs">{d.scope}</td>
              <td className="text-slate-700 pr-3">{d.item}</td>
              <td className="text-right text-slate-500 text-xs">{d.standard}</td>
              <td className="text-right text-[#134b9e] text-xs font-medium">{d.discount}</td>
              <td className="text-right text-[#c8102e] font-medium">{d.preferential}</td>
              <td className="text-right pr-2 text-slate-500 text-xs">{d.channel}<div className="text-slate-400 mt-1">{d.validity}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
        <p className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600"><b>費用類：</b>多個方案適用時，按最終應付金額孰低；指定方案是否可疊加須由核心能力及業務規則確認。</p>
        <p className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600"><b>利率類：</b>按客戶實得利益比較最終利率孰高。未能確定的後續費用不會顯示為零。</p>
      </div>
    </div>
  )
}
