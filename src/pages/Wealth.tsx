import { useMemo, useState } from 'react'
import { accounts, deposits, fxRates, fmt, type Deposit } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { PieChart as PieIcon, Landmark, Globe2, Newspaper, Sparkles, TrendingUp, TrendingDown, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function Wealth() {
  const [tab, setTab] = useState<'overview' | 'deposit' | 'agreement' | 'fx' | 'info'>('overview')
  const TABS = [['overview', '財富總覽', PieIcon], ['deposit', '定期存款', Landmark], ['agreement', '協定存款', CheckCircle2], ['fx', '外匯買賣', Globe2], ['info', '金融資訊及工具', Newspaper]] as const
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['投資理財']} />
      <div className="flex border-b border-slate-100 bg-white rounded-t-xl shadow-sm mt-4 px-5">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <OverviewPanel />}
      {tab === 'deposit' && <DepositPanel />}
      {tab === 'agreement' && <AgreementPanel />}
      {tab === 'fx' && <FxPanel />}
      {tab === 'info' && <InfoPanel />}
    </div>
  )
}

const CCY_COLOR: Record<string, string> = { MOP: 'bg-[#134b9e]', HKD: 'bg-emerald-500', CNY: 'bg-[#c8102e]', USD: 'bg-amber-500' }

function OverviewPanel() {
  // 以 MOP 折算的簡易資產分佈
  const rates: Record<string, number> = { MOP: 1, HKD: 1.03, CNY: 1.14, USD: 8.03 }
  const byCcy = accounts.reduce<Record<string, number>>((acc, a) => {
    acc[a.ccy] = (acc[a.ccy] ?? 0) + a.balance
    return acc
  }, {})
  const total = Object.entries(byCcy).reduce((s, [c, v]) => s + v * rates[c], 0)
  const totalMop = accounts.filter(a => a.ccy === 'MOP').reduce((s, a) => s + a.balance, 0)
  const totalDep = deposits.filter(d => d.status === '持有中').reduce((s, d) => s + d.principal * rates[d.ccy], 0)

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-5 text-white">
          <div className="text-xs text-blue-200">企業總資產（折合 MOP）</div>
          <div className="text-3xl font-bold mt-2">{fmt(total, 'MOP')}</div>
          <div className="text-xs text-blue-200 mt-3 space-y-1">
            <div className="flex justify-between"><span>活期及往來</span><span>{fmt(totalMop)}</span></div>
            <div className="flex justify-between"><span>定期存款</span><span>{fmt(totalDep)}</span></div>
          </div>
        </div>
        <div className="col-span-2 border border-slate-200 rounded-xl p-5">
          <div className="font-bold text-slate-800 mb-3">資產幣種分佈</div>
          {Object.entries(byCcy).map(([c, v]) => {
            const pct = (v * rates[c] / total) * 100
            return (
              <div key={c} className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{c}　{fmt(v, c)}</span><span>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${CCY_COLOR[c] ?? 'bg-slate-400'} rounded-full`} style={{ width: pct + '%' }} />
                </div>
              </div>
            )
          })}
          <p className="text-xs text-slate-400">匯率按本行即期牌價折算，僅供參考。</p>
        </div>
      </div>

      <div>
        <div className="font-bold text-slate-800 mb-3">產品持倉</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">產品</th>
              <th className="font-medium">幣種</th>
              <th className="font-medium text-right">本金</th>
              <th className="font-medium text-right">年利率</th>
              <th className="font-medium text-right">預期利息</th>
              <th className="font-medium">到期日</th>
              <th className="font-medium">狀態</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => (
              <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700">定期存款（{d.term}）</td>
                <td className="text-slate-600">{d.ccy}</td>
                <td className="text-right text-slate-800">{fmt(d.principal)}</td>
                <td className="text-right text-[#134b9e] font-medium">{d.rate.toFixed(2)}%</td>
                <td className="text-right text-slate-600">{fmt(d.interest)}</td>
                <td className="text-slate-500">{d.maturityDate}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${d.status === '持有中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TERMS = [
  { term: '一個月', standard: 1.60, spread: 0.20 },
  { term: '三個月', standard: 1.85, spread: 0.20 },
  { term: '六個月', standard: 2.10, spread: 0.20 },
  { term: '十二個月', standard: 2.45, spread: 0.20 },
]

function DepositPanel() {
  const [opening, setOpening] = useState(false)
  const [amt, setAmt] = useState('')
  const [term, setTerm] = useState('三個月')
  const [renewal, setRenewal] = useState('本息續存')
  const [ok, setOk] = useState(false)
  const [detail, setDetail] = useState<Deposit | null>(null)
  const [message, setMessage] = useState('')
  const selected = TERMS.find(t => t.term === term)!
  const finalRate = selected.standard + selected.spread
  const interest = Math.round((parseFloat(amt) || 0) * finalRate / 100 / 4)

  const open = () => {
    if ((parseFloat(amt) || 0) < 10000) {
      setMessage('請輸入不少於演示起存金額 MOP 10,000.00 的存款金額。')
      return
    }
    setOpening(false)
    setAmt('')
    setMessage('')
    setOk(true)
  }

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-slate-600">標準利率依據資負文件維護，合資格客戶可疊加網銀渠道優惠。</div>
          <div className="text-xs text-slate-400 mt-1">本頁金額及利率均為演示參數，實際成交以核心登記結果為準。</div>
        </div>
        <button onClick={() => { setOpening(true); setOk(false); setMessage('') }} className="bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-5 py-2.5 text-sm font-medium shrink-0">線上開立定期</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-400">定期存款賬戶</div>
          <div className="font-mono text-sm text-slate-700 mt-1">201-88-334455-6</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-400">賬戶可用餘額</div>
          <div className="font-bold text-slate-800 mt-1">{fmt(80000, 'MOP')}</div>
        </div>
        <div className="border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-400">項下定期存款總額</div>
          <div className="font-bold text-[#134b9e] mt-1">{fmt(2000000, 'MOP')}</div>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">存期</th>
            <th className="font-medium text-right">標準年利率</th>
            <th className="font-medium text-right">渠道優惠加點</th>
            <th className="font-medium text-right pr-2">最終執行年利率</th>
          </tr>
        </thead>
        <tbody>
          {TERMS.map(t => (
            <tr key={t.term} className="border-b border-slate-100">
              <td className="py-3 text-slate-700">{t.term}</td>
              <td className="text-right text-slate-500">{t.standard.toFixed(2)}%</td>
              <td className="text-right text-amber-700">+{t.spread.toFixed(2)}%</td>
              <td className="text-right pr-2"><span className="text-[#c8102e] font-bold">{(t.standard + t.spread).toFixed(2)}%</span>
                <span className="ml-2 text-[10px] bg-amber-50 text-amber-700 rounded px-1.5 py-0.5"><Sparkles className="w-3 h-3 inline -mt-0.5" /> 已應用渠道優惠</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <div className="font-bold text-slate-800 mb-3">我的定期存款</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
              <th className="py-2.5 font-medium">存款編號</th>
              <th className="font-medium">存期</th>
              <th className="font-medium text-right">本金</th>
              <th className="font-medium text-right">成交年利率</th>
              <th className="font-medium">到期日</th>
              <th className="font-medium">續期指示</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map(d => (
              <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-3 text-slate-700 font-mono text-xs">{d.id}</td>
                <td className="text-slate-600">{d.term}</td>
                <td className="text-right text-slate-800">{fmt(d.principal, d.ccy)}</td>
                <td className="text-right text-[#134b9e]">{d.rate.toFixed(2)}%</td>
                <td className="text-slate-500">{d.maturityDate}</td>
                <td className="text-slate-600">{d.status === '已到期' ? '到期不續存' : d.autoRenew ? '本息續存' : '到期不續存'}</td>
                <td className="text-right pr-2">
                  <button onClick={() => setDetail(d)} className="text-xs text-[#134b9e] hover:underline">明細及指示</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ok && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />開立申請已受理，待企業審批及核心成交；目前並非存款開立成功。
        </div>
      )}

      {opening && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setOpening(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-4">線上開立定期存款</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">資金來源</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
                  <option>澳門元往來賬戶（可用 {fmt(2863450.55)}）</option>
                  <option>定期賬戶可用餘額（{fmt(80000)}）</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1.5">定期存款賬戶</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm">
                  <option>沿用 201-88-334455-6</option>
                  <option>申請新開核心定期賬戶</option>
                </select>
              </div>
            </div>
            <label className="block text-sm text-slate-600 mb-1.5 mt-3">存期</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {TERMS.map(t => (
                <button key={t.term} onClick={() => setTerm(t.term)}
                  className={`px-3 py-2 rounded-lg border text-sm ${term === t.term ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{t.term}</button>
              ))}
            </div>
            <label className="block text-sm text-slate-600 mb-1.5">存入金額（MOP，演示起存 10,000）</label>
            <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmt(e.target.value) }}
              inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            <div className="bg-slate-50 rounded-lg px-4 py-3 mt-3 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-slate-500">標準年利率</span><span>{selected.standard.toFixed(2)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">渠道優惠加點</span><span className="text-amber-700">+{selected.spread.toFixed(2)}%</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><span className="text-slate-600">最終執行年利率</span><span className="text-[#c8102e] font-bold">{finalRate.toFixed(2)}%</span></div>
              <div className="flex justify-between"><span className="text-slate-500">預計利息（僅供參考）</span><span>{fmt(interest, 'MOP')}</span></div>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-slate-600">到期續期指示</span>
              <select value={renewal} onChange={e => setRenewal(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>到期不續存</option><option>本金續存</option><option>本息續存</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-3">提交即確認當前條款、利率及參數版本；實際成交結果以核心返回為準。</p>
            {message && <div className="mt-3 text-sm text-[#c8102e]">{message}</div>}
            <div className="flex gap-3 mt-5">
              <button onClick={open} className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">確認並提交審批</button>
              <button onClick={() => setOpening(false)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800">存款明細及續期指示</h3>
            <div className="text-xs font-mono text-slate-500 mt-1">{detail.id}</div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-900">
              自動續存按到期實際執行時的適用利率辦理；當前利率及試算僅供參考。
            </div>
            <label className="block text-sm text-slate-600 mt-4 mb-1.5">續期指示</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" defaultValue={detail.status === '已到期' ? '到期不續存' : detail.autoRenew ? '本息續存' : '到期不續存'}>
              <option>到期不續存</option><option>本金續存</option><option>本息續存</option>
            </select>
            <button onClick={() => { setDetail(null); setMessage('續期指示變更申請已受理，須在核心允許的截止時間前完成。'); setOk(false) }} className="w-full mt-4 bg-[#134b9e] hover:bg-[#0b2a5b] text-white rounded-lg py-2.5 text-sm">提交指示變更</button>
            <button onClick={() => setDetail(null)} className="w-full mt-2 border border-slate-300 rounded-lg py-2 text-sm text-slate-600">關閉</button>
          </div>
        </div>
      )}
      {message && !opening && <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">{message}</div>}
    </div>
  )
}

function AgreementPanel() {
  const [buying, setBuying] = useState(false)
  const [amount, setAmount] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const n = parseFloat(amount) || 0
  const remaining = 600000

  const submit = () => {
    if (n <= 0 || n > remaining) {
      setError(`購買金額須大於零，且不得超過本客戶可購額度 ${fmt(remaining, 'MOP')}。`)
      return
    }
    if (!accepted) {
      setError('請先確認已閱讀並接受當前方案版本。')
      return
    }
    setError('')
    setBuying(false)
    setSubmitted(true)
  }

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-800">協定存款方案</h2>
          <p className="text-sm text-slate-500 mt-1">僅展示本企業已列入白名單且仍在有效期內的方案。</p>
        </div>
        <span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2.5 py-1">白名單可見</span>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-800">澳門元協定存款方案</div>
            <div className="text-xs text-slate-500 mt-1">方案編號 AD-2026-003　方案版本 V1.0</div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2.5 py-1">可認購</span>
        </div>
        <div className="grid grid-cols-4 gap-4 p-5">
          <div><div className="text-xs text-slate-400">方案年利率</div><div className="text-2xl font-bold text-[#c8102e] mt-1">3.05%</div></div>
          <div><div className="text-xs text-slate-400">存款期限</div><div className="font-bold text-slate-800 mt-2">六個月</div></div>
          <div><div className="text-xs text-slate-400">方案有效期至</div><div className="font-bold text-slate-800 mt-2">2026-11-30</div></div>
          <div><div className="text-xs text-slate-400">到期安排</div><div className="font-bold text-slate-800 mt-2">本息返回原支款賬戶</div></div>
        </div>
        <div className="grid grid-cols-3 gap-4 px-5 pb-5">
          <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-400">本客戶額度</div><div className="font-bold text-slate-800 mt-1">{fmt(800000, 'MOP')}</div></div>
          <div className="bg-slate-50 rounded-lg p-3"><div className="text-xs text-slate-400">已購及在途金額</div><div className="font-bold text-slate-800 mt-1">{fmt(200000, 'MOP')}</div></div>
          <div className="bg-blue-50 rounded-lg p-3"><div className="text-xs text-slate-500">本客戶可購額度</div><div className="font-bold text-[#134b9e] mt-1">{fmt(remaining, 'MOP')}</div></div>
        </div>
        <div className="px-5 pb-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">不展示方案總額度或其他客戶使用情況；最終額度由核心於成交時校驗。</p>
          <button onClick={() => { setBuying(true); setSubmitted(false); setError('') }} className="bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-5 py-2.5 text-sm font-medium shrink-0">確認方案並購買</button>
        </div>
      </div>

      {submitted && <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />購買申請已受理，方案版本 V1.0 已留痕；待企業審批及核心成交，請勿重複提交。</div>}

      {buying && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setBuying(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800">購買協定存款</h3>
            <div className="text-xs text-slate-500 mt-1">方案 AD-2026-003　版本 V1.0　年利率 3.05%</div>
            <label className="block text-sm text-slate-600 mt-4 mb-1.5">支款賬戶</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"><option>澳門元往來賬戶 101-88-123456-7</option></select>
            <label className="block text-sm text-slate-600 mt-3 mb-1.5">購買金額（MOP）</label>
            <input value={amount} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmount(e.target.value) }} inputMode="decimal" placeholder={`可購額度 ${fmt(remaining)}`} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            <div className="flex justify-between bg-slate-50 rounded-lg px-4 py-3 mt-3 text-sm"><span className="text-slate-500">預計利息（僅供參考）</span><span className="font-bold text-[#134b9e]">{fmt(Math.round(n * 0.0305 / 2), 'MOP')}</span></div>
            <label className="flex items-start gap-2 text-sm text-slate-600 mt-4"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="accent-[#134b9e] mt-1" /><span>本人已閱讀並接受方案 AD-2026-003（V1.0）的條款、利率、期限及到期安排。</span></label>
            {error && <div className="mt-3 text-sm text-[#c8102e] flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
            <div className="flex gap-3 mt-5">
              <button onClick={submit} className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">確認並提交審批</button>
              <button onClick={() => setBuying(false)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FxPanel() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [kind, setKind] = useState<'現匯' | '現鈔'>('現匯')
  const [ccy, setCcy] = useState('USD')
  const [amt, setAmt] = useState('')
  const [ok, setOk] = useState(false)

  const rate = fxRates.find(f => f.ccy === ccy)!
  const price = side === 'buy' ? (kind === '現匯' ? rate.sellSpot : rate.sellCash) : (kind === '現匯' ? rate.buySpot : rate.buyCash)
  const n = parseFloat(amt) || 0
  const total = n * price

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <div className="font-bold text-slate-800 mb-3">實時外匯牌價（兌 MOP）</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">幣種</th>
              <th className="font-medium text-right">現鈔買入</th>
              <th className="font-medium text-right">現鈔賣出</th>
              <th className="font-medium text-right">現匯買入</th>
              <th className="font-medium text-right pr-2">現匯賣出</th>
            </tr>
          </thead>
          <tbody>
            {fxRates.map(f => (
              <tr key={f.ccy} onClick={() => setCcy(f.ccy)}
                className={`border-b border-slate-100 cursor-pointer ${ccy === f.ccy ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}>
                <td className="py-3">
                  <span className="font-medium text-slate-800">{f.ccy}</span>
                  {f.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-[#c8102e] inline ml-1.5" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-600 inline ml-1.5" />}
                </td>
                <td className="text-right text-slate-600">{f.buyCash.toFixed(4)}</td>
                <td className="text-right text-slate-600">{f.sellCash.toFixed(4)}</td>
                <td className="text-right text-slate-600">{f.buySpot.toFixed(4)}</td>
                <td className="text-right pr-2 text-slate-600">{f.sellSpot.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs leading-relaxed text-amber-900 flex gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>風險提醒：現鈔與現匯價格不同，買賣方向相反。請確認用途後選擇正確選項——用於境外匯款請選「現匯」，誤選「現鈔」可能產生兌換損失。外匯買賣受匯率波動影響，交易需承擔相應風險。</span>
        </div>
      </div>

      <div className="col-span-2 border border-slate-200 rounded-xl p-5 h-fit">
        <div className="font-bold text-slate-800 mb-4">外匯交易</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(['buy', 'sell'] as const).map(s => (
            <button key={s} onClick={() => { setSide(s); setOk(false) }}
              className={`py-2.5 rounded-lg border text-sm font-medium ${side === s ? (s === 'buy' ? 'border-[#c8102e] bg-red-50 text-[#c8102e]' : 'border-emerald-600 bg-emerald-50 text-emerald-700') : 'border-slate-200 text-slate-600'}`}>
              {s === 'buy' ? '買入外幣' : '賣出外幣'}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(['現匯', '現鈔'] as const).map(k => (
            <button key={k} onClick={() => { setKind(k); setOk(false) }}
              className={`py-2.5 rounded-lg border text-sm ${kind === k ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>
              {k} {side === 'buy' ? '賣出' : '買入'}
            </button>
          ))}
        </div>
        <label className="block text-xs text-slate-500 mb-1">交易幣種</label>
        <select value={ccy} onChange={e => setCcy(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-3">
          {fxRates.map(f => <option key={f.ccy} value={f.ccy}>{f.ccy}</option>)}
        </select>
        <label className="block text-xs text-slate-500 mb-1">金額（{ccy}）</label>
        <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) { setAmt(e.target.value); setOk(false) } }}
          inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2.5 mt-3 text-sm">
          <span className="text-slate-500">{kind}價</span><span className="font-medium text-slate-800">{price.toFixed(4)}</span>
        </div>
        <div className="flex justify-between bg-slate-50 rounded-lg px-3 py-2.5 mt-2 text-sm">
          <span className="text-slate-500">折合 MOP</span><span className="font-bold text-[#c8102e]">{n > 0 ? fmt(total) : '—'}</span>
        </div>
        <button onClick={() => n > 0 && setOk(true)}
          disabled={n <= 0}
          className="w-full mt-4 bg-[#c8102e] hover:bg-[#a50d26] disabled:bg-slate-300 text-white rounded-lg py-2.5 text-sm font-medium">
          確認{side === 'buy' ? '買入' : '賣出'}
        </button>
        {ok && <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">交易申請已提交，按企業審批模式流轉後成交。</div>}
      </div>
    </div>
  )
}

function InfoPanel() {
  const [principal, setPrincipal] = useState('1000000')
  const [ratePct, setRatePct] = useState('2.30')
  const [months, setMonths] = useState('6')
  const interest = useMemo(() => {
    const p = parseFloat(principal) || 0, r = parseFloat(ratePct) || 0, m = parseFloat(months) || 0
    return Math.round(p * r / 100 * m / 12)
  }, [principal, ratePct, months])

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="font-bold text-slate-800 mb-3 flex items-center gap-1.5"><Calculator className="w-4 h-4 text-[#134b9e]" />存款利息計算器</div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">本金（MOP）</label>
              <input value={principal} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setPrincipal(e.target.value) }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">年利率（%）</label>
                <input value={ratePct} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setRatePct(e.target.value) }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">存期（月）</label>
                <input value={months} onChange={e => { if (/^\d*$/.test(e.target.value)) setMonths(e.target.value) }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-3 flex justify-between text-sm">
              <span className="text-slate-600">到期利息（單利）</span>
              <span className="font-bold text-[#134b9e]">{fmt(interest, 'MOP')}</span>
            </div>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-5">
          <div className="font-bold text-slate-800 mb-3">市場資訊</div>
          <div className="space-y-2.5 text-sm">
            {[
              { t: '金管指引：澳門銀行同業拆息（HIBOR）走勢平穩', d: '2026-10-06' },
              { t: '人民幣兌澳門元中間價 1.1385', d: '2026-10-06' },
              { t: '美聯儲維持利率不變，美元存款產品利率企穩', d: '2026-10-04' },
              { t: '本行上調三個月以上定期存款利率 10 點子', d: '2026-10-01' },
            ].map(n => (
              <div key={n.t} className="flex justify-between gap-3 border-b border-slate-50 pb-2.5">
                <span className="text-slate-700">{n.t}</span>
                <span className="text-xs text-slate-400 shrink-0">{n.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400">金融資訊及工具包括：存貸利率查詢、外匯牌價、利息計算器、匯率換算等，數據每個營業日更新。</p>
    </div>
  )
}
