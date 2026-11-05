import { useState } from 'react'
import { fpsTxns, fmt, type FpsTxn } from '@/lib/mock'
import { Zap, CheckCircle2, ListChecks, UserPlus } from 'lucide-react'

export default function FpsEasy() {
  const [tab, setTab] = useState<'pay' | 'query' | 'reg'>('pay')
  const [list] = useState<FpsTxn[]>(fpsTxns)
  const [ok, setOk] = useState(false)
  const [proxyType, setProxyType] = useState<'手機號' | '電郵' | 'FPS ID'>('手機號')
  const [proxy, setProxy] = useState('')
  const [amt, setAmt] = useState('')

  const TABS = [['pay', '過數易轉賬', Zap], ['query', '明細查詢', ListChecks], ['reg', '過數易登記', UserPlus]] as const

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex gap-2">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border ${tab === k ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#134b9e]'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'pay' && (
        <div className="bg-white rounded-xl shadow-sm p-7">
          {ok ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 mt-4">過數易轉賬已提交</h3>
              <p className="text-sm text-slate-500 mt-2">待一級審批後經 FPS 實時匯出。</p>
              <button onClick={() => { setOk(false); setProxy(''); setAmt('') }} className="mt-6 bg-[#0b2a5b] text-white rounded-lg px-6 py-2.5 text-sm hover:bg-[#134b9e]">繼續轉賬</button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-slate-800 mb-1">過數易轉賬（FPS）</h3>
              <p className="text-xs text-slate-400 mb-5">免記賬號，憑手機號碼 / 電郵 / FPS ID 即可轉賬，7×24 實時到賬。</p>
              <label className="block text-sm text-slate-600 mb-1.5"><span className="text-[#c8102e] mr-0.5">*</span>收款識別方式</label>
              <div className="flex gap-2 mb-4">
                {(['手機號', '電郵', 'FPS ID'] as const).map(t => (
                  <button key={t} onClick={() => setProxyType(t)}
                    className={`flex-1 py-2.5 rounded-lg border text-sm ${proxyType === t ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{t}</button>
                ))}
              </div>
              <label className="block text-sm text-slate-600 mb-1.5"><span className="text-[#c8102e] mr-0.5">*</span>收款人識別碼</label>
              <input value={proxy} onChange={e => setProxy(e.target.value)}
                placeholder={proxyType === '手機號' ? '如：66XX XXXX' : proxyType === '電郵' ? '如：name@example.com' : '如：fps@88xx'}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4" />
              <label className="block text-sm text-slate-600 mb-1.5"><span className="text-[#c8102e] mr-0.5">*</span>轉賬金額（MOP）</label>
              <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmt(e.target.value) }}
                inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-5" />
              <button onClick={() => proxy.trim() && (parseFloat(amt) || 0) > 0 && setOk(true)}
                className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white font-medium rounded-lg py-2.5">確認轉賬</button>
            </>
          )}
        </div>
      )}

      {tab === 'query' && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">過數易明細查詢</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
                <th className="py-2.5 font-medium">交易時間</th>
                <th className="font-medium">識別碼（{list[0]?.proxyType ? '類型' : ''}）</th>
                <th className="font-medium">收款人</th>
                <th className="font-medium text-right">金額</th>
                <th className="font-medium">狀態</th>
                <th className="font-medium text-right pr-2">參考編號</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t.ref} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-slate-500">{t.date}</td>
                  <td className="text-slate-600">{t.proxy}<span className="text-xs text-slate-400 ml-1">（{t.proxyType}）</span></td>
                  <td className="text-slate-700">{t.name}</td>
                  <td className="text-right text-slate-800 font-medium">{fmt(t.amount, 'MOP')}</td>
                  <td><span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">{t.status}</span></td>
                  <td className="text-right pr-2 text-slate-400 font-mono text-xs">{t.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reg' && (
        <div className="bg-white rounded-xl shadow-sm p-7 max-w-lg">
          <h3 className="font-bold text-slate-800 mb-1">過數易登記</h3>
          <p className="text-xs text-slate-400 mb-5">為本企業賬戶綁定 FPS 識別碼，收款人即可憑識別碼向您付款。</p>
          <label className="block text-sm text-slate-600 mb-1.5">綁定賬戶</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4">
            <option>澳門元往來賬戶</option>
            <option>港元往來賬戶</option>
          </select>
          <label className="block text-sm text-slate-600 mb-1.5">識別碼類型</label>
          <div className="flex gap-2 mb-4">
            {(['手機號', '電郵', 'FPS ID'] as const).map(t => (
              <button key={t} className={`flex-1 py-2.5 rounded-lg border text-sm ${t === 'FPS ID' ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{t}</button>
            ))}
          </div>
          <label className="block text-sm text-slate-600 mb-1.5">識別碼</label>
          <input placeholder="自定義 FPS ID（4–20 位字母數字）" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-5" />
          <button onClick={() => setOk(true)} className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white font-medium rounded-lg py-2.5">提交登記</button>
        </div>
      )}
    </div>
  )
}
