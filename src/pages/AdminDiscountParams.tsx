import { useState } from 'react'
import { ArrowLeft, BadgePercent, Building2, CheckCircle2, GitCompareArrows, ShieldCheck, Tag } from 'lucide-react'
import { Breadcrumb } from './Accounts'

type Rule = {
  id: string
  name: string
  product: string
  feeCode: string
  channel: string
  method: '折扣' | '固定金額減免' | '全額減免' | '利率加點'
  value: number
  customer: string
  owner: '總行' | '皇朝分行'
  validity: string
  version: string
  status: string
}

const initialRules: Rule[] = [
  { id: 'CH-HQ-RM-01', name: '企網 SWIFT 匯費優惠', product: '匯出匯款', feeCode: 'FEE-SWIFT', channel: 'Web＋銀企直連', method: '折扣', value: 80, customer: '全體企業客戶', owner: '總行', validity: '2026-11-01 至 2026-12-31', version: 'V1.0', status: '已生效' },
  { id: 'CH-BR-RM-01', name: '皇朝分行專屬匯費優惠', product: '匯出匯款', feeCode: 'FEE-SWIFT', channel: 'Web＋銀企直連', method: '折扣', value: 75, customer: '指定企業客戶號', owner: '皇朝分行', validity: '2026-11-01 至 2026-11-30', version: 'V1.1', status: '已生效' },
  { id: 'CH-HQ-TD-01', name: '企網定期存款利率優惠', product: '定期存款', feeCode: 'RATE-TD-3M', channel: '企網 Web', method: '利率加點', value: 0.2, customer: '全體企業客戶', owner: '總行', validity: '2026-11-02 至 2026-11-08', version: 'V1.0', status: '已生效' },
  { id: 'CH-HQ-CHQ-01', name: '支票簿申請渠道優惠', product: '支票購買', feeCode: 'FEE-CHQ-25', channel: '企網 Web', method: '折扣', value: 75, customer: '全體企業客戶', owner: '總行', validity: '2026-11-01 至 2026-12-31', version: 'V1.0', status: '已生效' },
  { id: 'CH-HQ-ST-01', name: '過往電子結單費用減免', product: '過往電子結單', feeCode: 'FEE-ESTMT-HIST', channel: 'Web＋銀企直連', method: '全額減免', value: 100, customer: '指定企業客戶號', owner: '總行', validity: '2026-11-01 至 2026-12-31', version: 'V1.0', status: '待覆核' },
]

export default function AdminDiscountParams({ onBack }: { onBack: () => void }) {
  const [perspective, setPerspective] = useState<'總行' | '皇朝分行'>('總行')
  const [rules, setRules] = useState(initialRules)
  const [selected, setSelected] = useState('CH-HQ-RM-01')
  const current = rules.find(r => r.id === selected) ?? rules[0]
  const [discountFloor, setDiscountFloor] = useState('70')
  const [discountCeiling, setDiscountCeiling] = useState('100')
  const [fixedCap, setFixedCap] = useState('50')
  const [rateCap, setRateCap] = useState('0.20')
  const [value, setValue] = useState(String(current.value))
  const [customer, setCustomer] = useState(current.customer)
  const [start, setStart] = useState('2026-11-06')
  const [end, setEnd] = useState('2026-12-31')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const choose = (rule: Rule) => {
    setSelected(rule.id)
    setValue(String(rule.value))
    setCustomer(rule.customer)
    setNotice('')
    setError('')
  }

  const switchPerspective = (next: '總行' | '皇朝分行') => {
    setPerspective(next)
    const nextRule = next === '皇朝分行' ? rules.find(r => r.owner === '皇朝分行')! : rules[0]
    choose(nextRule)
  }

  const addRule = () => {
    const owner = perspective
    const id = `CH-${owner === '總行' ? 'HQ' : 'BR'}-NEW-${rules.length + 1}`
    const rule: Rule = { id, name: `${owner}新增匯款優惠`, product: '匯出匯款', feeCode: 'FEE-SWIFT', channel: 'Web＋銀企直連', method: '折扣', value: 90, customer: '指定企業客戶號', owner, validity: '待生效', version: 'V0.1', status: '草稿' }
    setRules(prev => [...prev, rule])
    choose(rule)
    setNotice(`${id} 草稿已建立，請核對數值、客戶範圍及有效期後提交覆核。`)
  }

  const submit = () => {
    const numeric = Number(value)
    if (!value || Number.isNaN(numeric) || numeric < 0 || !start || !end || end < start) {
      setError('請輸入有效優惠數值及完整有效期，失效日不得早於生效日。')
      return
    }
    if (current.owner !== '總行' && current.method === '折扣' && (numeric < Number(discountFloor) || numeric > Number(discountCeiling))) {
      setError(`分行折扣率須在 ${discountFloor}%—${discountCeiling}% 內；例如 80% 即八折。`)
      return
    }
    if (current.owner !== '總行' && current.method === '固定金額減免' && numeric > Number(fixedCap)) {
      setError(`固定金額減免不得超過總行設定的 MOP ${fixedCap} 上限。`)
      return
    }
    if (current.owner !== '總行' && current.method === '利率加點' && numeric > Number(rateCap)) {
      setError(`利率加點不得超過總行設定的 ${rateCap} 個百分點上限。`)
      return
    }
    setRules(prev => prev.map(r => r.id === selected ? { ...r, value: numeric, customer, status: '待覆核', validity: `${start} 至 ${end}` } : r))
    setError('')
    setNotice(`${current.id} 已提交${perspective}另一有權人員覆核；原生效版本繼續沿用，成交交易保留原優惠快照。`)
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb items={['銀行端後台', '渠道優惠參數']} />
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#134b9e] border border-[#134b9e] rounded-lg px-4 py-2 hover:bg-blue-50"><ArrowLeft className="w-4 h-4" />返回後台總覽</button>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
        本頁為銀行端內部後台演示，全部規則及費用均為虛構示例。企網維護自身渠道優惠；核心／有權收費系統最終計算及扣收，VIP 標籤不由企網生成。
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          {(['總行', '皇朝分行'] as const).map(x => <button key={x} onClick={() => switchPerspective(x)} className={`px-4 py-2 rounded-lg text-sm border ${perspective === x ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'border-slate-200 text-slate-600 hover:border-[#134b9e]'}`}>{x}視角</button>)}
        </div>
        <button onClick={addRule} className="flex items-center gap-1.5 bg-[#c8102e] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#a50d26]"><Tag className="w-4 h-4" />新增優惠規則</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#134b9e]" />總行授權邊界</h3>
        <p className="text-xs text-slate-400 mb-4">只有總行有權人員可調整上下限；分行僅可在邊界內維護，超出範圍不得提交。</p>
        <div className="grid grid-cols-4 gap-4">
          <label className="text-xs text-slate-500">分行折扣率下限（%）<input disabled={perspective !== '總行'} value={discountFloor} onChange={e => { if (/^\d*$/.test(e.target.value)) setDiscountFloor(e.target.value) }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm disabled:bg-slate-100" /></label>
          <label className="text-xs text-slate-500">分行折扣率上限（%）<input disabled={perspective !== '總行'} value={discountCeiling} onChange={e => { if (/^\d*$/.test(e.target.value)) setDiscountCeiling(e.target.value) }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm disabled:bg-slate-100" /></label>
          <label className="text-xs text-slate-500">固定減免上限（MOP）<input disabled={perspective !== '總行'} value={fixedCap} onChange={e => { if (/^\d*$/.test(e.target.value)) setFixedCap(e.target.value) }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm disabled:bg-slate-100" /></label>
          <label className="text-xs text-slate-500">定期加點上限（百分點）<input disabled={perspective !== '總行'} value={rateCap} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setRateCap(e.target.value) }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm disabled:bg-slate-100" /></label>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="font-bold text-slate-800">渠道優惠規則</h3><p className="text-xs text-slate-400 mt-1">按渠道、產品、費用代碼、客戶及機構範圍配置；不同費用項目不互相抵減。</p></div>
            <BadgePercent className="w-5 h-5 text-[#134b9e]" />
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">規則／產品</th><th className="font-medium">優惠</th><th className="font-medium">適用對象</th><th className="font-medium text-center">版本</th><th className="font-medium text-right pr-2">操作</th></tr></thead>
            <tbody>
              {rules.filter(r => perspective === '總行' || r.owner === '皇朝分行').map(r => (
                <tr key={r.id} className={`border-b border-slate-100 ${selected === r.id ? 'bg-blue-50/60' : ''}`}>
                  <td className="py-3"><div className="font-medium text-slate-700">{r.name}</div><div className="text-[11px] text-slate-400 mt-0.5">{r.id}｜{r.product}｜{r.feeCode}</div><div className="text-[11px] text-slate-400 mt-0.5">{r.channel}｜{r.owner}</div></td>
                  <td className="text-slate-600 text-xs">{r.method}<div className="font-medium text-[#c8102e] mt-1">{r.method === '折扣' ? `${r.value}%` : r.method === '利率加點' ? `＋${r.value}%` : r.method === '全額減免' ? '全額' : `MOP ${r.value}`}</div></td>
                  <td className="text-slate-600 text-xs">{r.customer}<div className="text-[11px] text-slate-400 mt-1">{r.validity}</div></td>
                  <td className="text-center"><span className={`text-[11px] rounded px-2 py-0.5 ${r.status === '已生效' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.version}｜{r.status}</span></td>
                  <td className="text-right pr-2"><button onClick={() => choose(r)} className="text-xs text-[#134b9e] hover:underline">維護</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-1">規則維護</h3>
          <p className="text-xs text-slate-400 mb-4">{current.id}｜{current.owner}｜{current.method}</p>
          <div className="space-y-4">
            <label className="block text-xs text-slate-500">優惠數值{current.method === '折扣' ? '（80%＝八折）' : current.method === '利率加點' ? '（百分點）' : current.method === '固定金額減免' ? '（MOP）' : '（全額減免）'}
              <input value={value} disabled={current.method === '全額減免'} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setValue(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm disabled:bg-slate-100" />
            </label>
            <label className="block text-xs text-slate-500">客戶適用範圍
              <select value={customer} onChange={e => setCustomer(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"><option>全體企業客戶</option><option>指定企業客戶號</option></select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-500">生效日<input type="date" value={start} onChange={e => setStart(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" /></label>
              <label className="text-xs text-slate-500">失效日<input type="date" value={end} onChange={e => setEnd(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" /></label>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">適用機構按實際扣費賬戶開戶機構認定；規則變更須經辦、覆核，已成交交易不追溯重算。</div>
            <button onClick={submit} className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">提交優惠變更覆核</button>
            {error && <p className="text-xs text-[#c8102e] bg-red-50 rounded-lg p-3">{error}</p>}
            {notice && <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{notice}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><GitCompareArrows className="w-5 h-5 text-[#134b9e]" />多層優惠組合（待覆核）</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <p className="border border-slate-200 rounded-lg p-3"><b>費用類：</b>比較各適用方案最終應付金額，按客戶實付孰低；核心明確支持後才可開放指定方案疊加。</p>
            <p className="border border-slate-200 rounded-lg p-3"><b>利率類：</b>比較客戶實得利益，按最終利率孰高；定期以標準渠道利率加一項適用渠道加點。</p>
            <p className="border border-slate-200 rounded-lg p-3"><b>來源隔離：</b>企網渠道優惠、核心 VIP 標籤優惠及產品優惠分別識別，不由企網自建 VIP 等級。</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Building2 className="w-5 h-5 text-[#134b9e]" />執行及審計快照</h3>
          <table className="w-full text-xs"><tbody className="divide-y divide-slate-100">
            <tr><td className="py-2.5 text-slate-400">最終執行</td><td className="text-right text-slate-700">核心／有權收費系統</td></tr>
            <tr><td className="py-2.5 text-slate-400">傳遞要素</td><td className="text-right text-slate-700">客戶號、渠道、費用代碼、規則及版本</td></tr>
            <tr><td className="py-2.5 text-slate-400">版本失效或改價</td><td className="text-right text-slate-700">Web 重新確認／直連重新試算</td></tr>
            <tr><td className="py-2.5 text-slate-400">查詢超時</td><td className="text-right text-slate-700">不顯示虛假零優惠，不靜默成交</td></tr>
          </tbody></table>
        </div>
      </div>
    </div>
  )
}
