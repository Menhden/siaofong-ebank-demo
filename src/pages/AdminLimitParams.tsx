import { useState } from 'react'
import { AlertTriangle, ArrowLeft, CheckCircle2, FileCheck2, Gauge, Users } from 'lucide-react'
import { fmt } from '@/lib/mock'
import { Breadcrumb } from './Accounts'

type Template = {
  id: string
  name: string
  kind: string
  single: number
  daily: number
  clients: number
  version: string
  status: string
}

const initialTemplates: Template[] = [
  { id: 'LT-STD-01', name: '標準匯款模板', kind: '普通匯款', single: 5000000, daily: 20000000, clients: 86, version: 'V1.2', status: '已生效' },
  { id: 'LT-KEY-01', name: '重點客戶模板', kind: '普通匯款', single: 20000000, daily: 80000000, clients: 12, version: 'V1.0', status: '已生效' },
  { id: 'LT-MC-01', name: '澳中轉賬模板', kind: '澳中轉賬', single: 5000000, daily: 20000000, clients: 0, version: 'V0.9', status: '待覆核' },
]

export default function AdminLimitParams({ onBack }: { onBack: () => void }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [selected, setSelected] = useState('LT-STD-01')
  const current = templates.find(t => t.id === selected) ?? templates[0]
  const [globalCap, setGlobalCap] = useState('100000000')
  const [largeThreshold, setLargeThreshold] = useState('1000000')
  const [warning, setWarning] = useState('80')
  const [single, setSingle] = useState(String(current.single))
  const [daily, setDaily] = useState(String(current.daily))
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const choose = (template: Template) => {
    setSelected(template.id)
    setSingle(String(template.single))
    setDaily(String(template.daily))
    setNotice('')
    setError('')
  }

  const submit = () => {
    const cap = Number(globalCap)
    const s = Number(single)
    const d = Number(daily)
    const threshold = Number(largeThreshold)
    const warningValue = Number(warning)
    if (!cap || !s || !d || !threshold || !warningValue) {
      setError('請完整輸入有效的數值參數。')
      return
    }
    if (s > cap || d > cap) {
      setError('模板單筆及單日上限不得超過全行最高上限。')
      return
    }
    if (warningValue > 100) {
      setError('流動性預警閾值不得超過 100%。')
      return
    }
    setTemplates(prev => prev.map(t => t.id === selected ? { ...t, single: s, daily: d, status: '待覆核' } : t))
    setError('')
    setNotice(`${current.id} 變更已提交另一有權人員覆核；覆核前仍沿用原生效版本。`)
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb items={['銀行端後台', '限額參數設置']} />
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#134b9e] border border-[#134b9e] rounded-lg px-4 py-2 hover:bg-blue-50"><ArrowLeft className="w-4 h-4" />返回後台總覽</button>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
        本頁為銀行端內部後台演示，全部金額及客戶資料均為虛構示例，不作為投產參數。限額按「企業客戶號＋匯款類型」管理，只適用企網渠道匯款。
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Gauge className="w-5 h-5 text-[#134b9e]" />公共控制參數</h3>
        <p className="text-xs text-slate-400 mb-4">參數變更須經辦、覆核後生效；任何認證、企業審批或人工處理均不得繞過渠道限額。</p>
        <div className="grid grid-cols-4 gap-4">
          <label className="text-xs text-slate-500">全行最高上限（MOP）
            <input value={globalCap} onChange={e => { if (/^\d*$/.test(e.target.value)) setGlobalCap(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
          </label>
          <label className="text-xs text-slate-500">大額審批門檻（MOP 等值）
            <input value={largeThreshold} onChange={e => { if (/^\d*$/.test(e.target.value)) setLargeThreshold(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            <span className="block mt-1 text-[11px] text-slate-400">嚴格超過門檻才觸發</span>
          </label>
          <label className="text-xs text-slate-500">流動性預警閾值（%）
            <input value={warning} onChange={e => { if (/^\d*$/.test(e.target.value)) setWarning(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            <span className="block mt-1 text-[11px] text-slate-400">只預警，不硬熔斷</span>
          </label>
          <div className="text-xs text-slate-500">累計及折算口徑
            <div className="mt-1 border border-slate-200 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-700">本行自然日｜MOP 等值</div>
            <span className="block mt-1 text-[11px] text-slate-400">保存原幣、匯率及折算快照</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="font-bold text-slate-800">限額模板</h3><p className="text-xs text-slate-400 mt-1">模板金額自由設置，可批量指派多個客戶；不與現金管理產品版本綁定。</p></div>
            <FileCheck2 className="w-5 h-5 text-[#134b9e]" />
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">模板／匯款類型</th><th className="font-medium text-right">單筆</th><th className="font-medium text-right">單日</th><th className="font-medium text-center">客戶數</th><th className="font-medium text-center">版本</th><th className="font-medium text-right pr-2">操作</th></tr></thead>
            <tbody>
              {templates.map(t => (
                <tr key={t.id} className={`border-b border-slate-100 ${selected === t.id ? 'bg-blue-50/60' : ''}`}>
                  <td className="py-3"><div className="font-medium text-slate-700">{t.name}</div><div className="text-[11px] text-slate-400 mt-0.5">{t.id}｜{t.kind}</div></td>
                  <td className="text-right text-slate-600 text-xs">{fmt(t.single)}</td>
                  <td className="text-right text-slate-600 text-xs">{fmt(t.daily)}</td>
                  <td className="text-center text-slate-600">{t.clients}</td>
                  <td className="text-center"><span className={`text-[11px] rounded px-2 py-0.5 ${t.status === '已生效' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{t.version}｜{t.status}</span></td>
                  <td className="text-right pr-2"><button onClick={() => choose(t)} className="text-xs text-[#134b9e] hover:underline">維護</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-1">模板維護</h3>
          <p className="text-xs text-slate-400 mb-4">{current.id}｜{current.name}｜{current.kind}</p>
          <div className="space-y-4">
            <label className="block text-xs text-slate-500">單筆上限（MOP）
              <input value={single} onChange={e => { if (/^\d*$/.test(e.target.value)) setSingle(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            </label>
            <label className="block text-xs text-slate-500">單日累計上限（MOP）
              <input value={daily} onChange={e => { if (/^\d*$/.test(e.target.value)) setDaily(e.target.value); setNotice(''); setError('') }} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">本次預計影響仍關聯模板的 <b>{current.clients}</b> 個客戶；已獨立核定客戶不在批量變更範圍。</div>
            <button onClick={submit} className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">提交參數變更覆核</button>
            {error && <p className="text-xs text-[#c8102e] bg-red-50 rounded-lg p-3">{error}</p>}
            {notice && <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{notice}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-[#134b9e]" />客戶核定來源</h3>
        <p className="text-xs text-slate-400 mb-3">每個客戶在同一匯款類型下只有一個銀行核定來源；客戶自設限額與銀行核定孰低生效。</p>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">企業客戶</th><th className="font-medium">匯款類型</th><th className="font-medium">銀行核定來源</th><th className="font-medium text-right">單筆／單日</th><th className="font-medium">模板跟隨</th><th className="font-medium text-right pr-2">版本</th></tr></thead>
          <tbody>
            {[
              ['誠信貿易（澳門）一人有限公司', '普通匯款', '標準匯款模板', '5,000,000／20,000,000', '跟隨模板', 'V1.2'],
              ['誠信物流（澳門）有限公司', '普通匯款', '客戶獨立核定', '8,000,000／30,000,000', '不跟隨', 'IND-V2.0'],
              ['誠信餐飲管理有限公司', '澳中轉賬', '客戶獨立核定', '3,000,000／10,000,000', '不跟隨', 'IND-V1.0'],
            ].map(r => (
              <tr key={r[0]} className="border-b border-slate-100"><td className="py-3 text-slate-700">{r[0]}</td><td className="text-slate-600">{r[1]}</td><td className="text-slate-600">{r[2]}</td><td className="text-right text-slate-600 text-xs">{r[3]}</td><td><span className={`text-xs rounded px-2 py-0.5 ${r[4] === '跟隨模板' ? 'bg-blue-50 text-[#134b9e]' : 'bg-slate-100 text-slate-600'}`}>{r[4]}</span></td><td className="text-right pr-2 font-mono text-xs text-slate-500">{r[5]}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />模板批量變更不得覆蓋獨立核定客戶，也不得靜默覆蓋客戶已設的較低自設限額。</p>
      </div>
    </div>
  )
}
