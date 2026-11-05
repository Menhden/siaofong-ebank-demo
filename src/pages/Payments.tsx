import { useState } from 'react'
import { bills, autoTransfers, accounts, fmt, type Bill, type AutoTransfer } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Zap, Plus, CheckCircle2, AlertTriangle } from 'lucide-react'

const CATS = ['全部', '公共事業', '政府', '電訊']

export default function Payments() {
  const [tab, setTab] = useState<'bills' | 'auto'>('bills')
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['繳費支付']} />
      <div className="flex border-b border-slate-100 bg-white rounded-t-xl shadow-sm mt-4 px-5">
        {([['bills', '網上繳費'], ['auto', '自動轉賬']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <span className="self-center text-xs text-slate-400">繳費實時完成 · 與個人網銀繳費系統解耦，僅展示企業適用服務</span>
      </div>
      {tab === 'bills' ? <BillsPanel /> : <AutoPanel />}
    </div>
  )
}

function BillsPanel() {
  const [cat, setCat] = useState('全部')
  const [list, setList] = useState<Bill[]>(bills)
  const [paying, setPaying] = useState<Bill | null>(null)
  const [payer, setPayer] = useState(accounts[0].no)
  const [done, setDone] = useState(false)

  const shown = list.filter(b => cat === '全部' || b.category === cat)
  const pending = list.filter(b => b.status === '待繳')

  const pay = () => {
    setList(prev => prev.map(b => (b.id === paying!.id ? { ...b, status: '已繳' as const } : b)))
    setDone(true)
  }

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5">
      <div className="flex gap-2 mb-4">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm border ${cat === c ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#134b9e]'}`}>
            {c}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-xs text-slate-400 self-center">待繳 {pending.length} 筆</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {shown.map(b => (
          <div key={b.id + b.dueDate} className="border border-slate-200 rounded-xl p-4 hover:border-[#134b9e] transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#134b9e] flex items-center justify-center"><Zap className="w-4 h-4" /></span>
              <span className={`text-xs rounded px-2 py-0.5 ${b.status === '待繳' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{b.status}</span>
            </div>
            <div className="font-medium text-slate-800 mt-2 text-sm">{b.merchant}</div>
            <div className="text-xs text-slate-400 mt-0.5">商戶賬號 {b.acctNo} · 類別 {b.category}</div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-lg font-bold text-slate-800">{fmt(b.amount, 'MOP')}</div>
                <div className="text-xs text-slate-400">到期日 {b.dueDate}</div>
              </div>
              {b.status === '待繳'
                ? <button onClick={() => { setPaying(b); setDone(false) }}
                    className="bg-[#c8102e] hover:bg-[#a50d26] text-white text-sm rounded-lg px-4 py-2">立即繳費</button>
                : <span className="text-xs text-slate-300">已繳清</span>}
            </div>
          </div>
        ))}
      </div>

      {shown.length === 0 && <div className="py-12 text-center text-slate-400 text-sm">該類別暫無待繳賬單</div>}

      {/* 繳費確認 */}
      {paying && !done && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setPaying(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-4">確認繳費</h3>
            <dl className="text-sm space-y-2.5">
              <div className="flex"><dt className="w-24 text-slate-400">繳費商戶</dt><dd className="text-slate-800">{paying.merchant}</dd></div>
              <div className="flex"><dt className="w-24 text-slate-400">商戶賬號</dt><dd className="text-slate-800">{paying.acctNo}</dd></div>
              <div className="flex"><dt className="w-24 text-slate-400">應繳金額</dt><dd className="text-[#c8102e] font-bold">{fmt(paying.amount, 'MOP')}</dd></div>
            </dl>
            <div className="mt-4">
              <label className="block text-sm text-slate-600 mb-1.5"><span className="text-[#c8102e] mr-0.5">*</span>付款賬戶</label>
              <select value={payer} onChange={e => setPayer(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
                {accounts.filter(a => a.type === '往來').map(a => (
                  <option key={a.no} value={a.no}>{a.name}（可用 {fmt(a.available, a.ccy)}）</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-3">企業繳費實時完成，繳費結果將同步至消息中心並發送短訊提醒。</p>
            <div className="flex gap-3 mt-5">
              <button onClick={pay} className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">確認繳費</button>
              <button onClick={() => setPaying(null)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}
      {paying && done && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setPaying(null)}>
          <div className="bg-white rounded-xl shadow-xl p-8 w-[380px] text-center" onClick={e => e.stopPropagation()}>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 mt-3">繳費成功</h3>
            <p className="text-sm text-slate-500 mt-1.5">{paying.merchant}　{fmt(paying.amount, 'MOP')}</p>
            <p className="text-xs text-slate-400 mt-1">實時到賬 · 電子回單可在交易記錄中下載</p>
            <button onClick={() => setPaying(null)} className="mt-5 bg-[#0b2a5b] text-white rounded-lg px-8 py-2 text-sm hover:bg-[#134b9e]">完成</button>
          </div>
        </div>
      )}
    </div>
  )
}

function AutoPanel() {
  const [list, setList] = useState<AutoTransfer[]>(autoTransfers)
  const [adding, setAdding] = useState(false)
  const [amt, setAmt] = useState('')
  const [freq, setFreq] = useState<'每月' | '每週' | '每日'>('每月')

  const toggle = (id: string) =>
    setList(prev => prev.map(a => (a.id === id ? { ...a, status: a.status === '生效中' ? '已暫停' : '生效中' } : a)))

  const add = () => {
    const n = parseFloat(amt) || 0
    if (n <= 0) return
    setList(prev => [{ id: 'AT' + Date.now().toString().slice(-6), from: '澳門元往來賬戶', to: '新增收款賬戶', amount: n, freq, nextDate: '2026-11-01', status: '生效中' }, ...prev])
    setAdding(false); setAmt('')
  }

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">自動轉賬規則</h3>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]"><Plus className="w-4 h-4" />新增自動轉賬</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
            <th className="py-3 font-medium">付款賬戶 → 收款賬戶</th>
            <th className="font-medium">金額</th>
            <th className="font-medium">頻率</th>
            <th className="font-medium">下次執行日</th>
            <th className="font-medium">狀態</th>
            <th className="font-medium text-right pr-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
              <td className="py-3.5 text-slate-700">{a.from} <span className="text-slate-300">→</span> {a.to}</td>
              <td className="text-slate-800 font-medium">{fmt(a.amount, 'MOP')}</td>
              <td className="text-slate-600">{a.freq}</td>
              <td className="text-slate-500">{a.nextDate}</td>
              <td><span className={`text-xs rounded px-2 py-0.5 ${a.status === '生效中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{a.status}</span></td>
              <td className="text-right pr-2">
                <button onClick={() => toggle(a.id)} className="text-xs text-[#134b9e] hover:underline">
                  {a.status === '生效中' ? '暫停' : '恢復'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />自動轉賬於執行日扣賬，餘額不足時失敗並以短訊及消息中心通知。</p>

      {adding && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setAdding(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-4">新增自動轉賬</h3>
            <label className="block text-sm text-slate-600 mb-1.5">付款賬戶</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-3">
              {accounts.filter(a => a.type === '往來').map(a => <option key={a.no}>{a.name}</option>)}
            </select>
            <label className="block text-sm text-slate-600 mb-1.5">週期</label>
            <div className="flex gap-2 mb-3">
              {(['每日', '每週', '每月'] as const).map(f => (
                <button key={f} onClick={() => setFreq(f)}
                  className={`px-4 py-2 rounded-lg border text-sm ${freq === f ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{f}</button>
              ))}
            </div>
            <label className="block text-sm text-slate-600 mb-1.5">每次轉賬金額（MOP）</label>
            <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmt(e.target.value) }}
              inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4" />
            <div className="flex gap-3">
              <button onClick={add} className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">確認新增</button>
              <button onClick={() => setAdding(false)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
