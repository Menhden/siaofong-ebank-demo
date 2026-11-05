import { useState } from 'react'
import { AlertTriangle, BookUser, LayoutTemplate, PencilLine, Plus, ShieldCheck } from 'lucide-react'

type Product = '普通匯款' | '澳中轉賬'
const payees: Record<Product, { name: string; acct: string; bank: string; version: string; group: string; status: string }[]> = {
  普通匯款: [
    { name: 'Heng Seng Trading Co.', acct: '024-***-***233-4', bank: '恒生銀行（香港）', version: 'V4', group: '跨境供應商', status: '有效' },
    { name: 'Global Textile GmbH', acct: 'DE89 **** **** **32 1000', bank: '示例銀行（德國）', version: 'V2', group: '跨境供應商', status: '有效' },
    { name: 'Shenzhen Tech Imports Ltd.', acct: '6217 **** **** 9902', bank: '招商銀行深圳分行', version: 'V1', group: '內地供應商', status: '已停用' },
  ],
  澳中轉賬: [
    { name: '中山五金批發有限公司', acct: '6222 **** **** 8888', bank: '中國銀行中山分行', version: 'V3', group: '澳中供應商', status: '有效' },
    { name: '珠海示例商貿有限公司', acct: '6217 **** **** 6688', bank: '示例銀行珠海分行', version: 'V1', group: '澳中供應商', status: '有效' },
  ],
}
const templates = [
  { name: '香港供應商季度貨款', product: '普通匯款', payee: 'Heng Seng Trading Co.', ccy: 'HKD', updated: true },
  { name: '德國供應商材料款', product: '普通匯款', payee: 'Global Textile GmbH', ccy: 'EUR', updated: false },
  { name: '澳中月度原材料款', product: '澳中轉賬', payee: '中山五金批發有限公司', ccy: 'HKD → MOP', updated: false },
]
export default function PayeeBook() {
  const [product, setProduct] = useState<Product>('普通匯款')
  const [tab, setTab] = useState<'payees' | 'templates'>('payees')
  const [notice, setNotice] = useState('')
  const [used, setUsed] = useState('')
  return <div className="max-w-6xl mx-auto space-y-4">
    <div className="flex gap-2">{(['普通匯款', '澳中轉賬'] as Product[]).map(x => <button key={x} onClick={() => { setProduct(x); setNotice(''); setUsed('') }} className={`px-4 py-2 rounded-lg text-sm border ${product === x ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200'}`}>{x}專用資料</button>)}</div>
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-[#134b9e]">普通匯款與澳中轉賬收款人分產品維護，不得跨產品直接調用；資料僅在同一企業內按權限共享，不跨企業。</div>
    <div className="flex gap-2">{([['payees', '收款人名冊', BookUser], ['templates', '匯款模板', LayoutTemplate]] as const).map(([k, label, Icon]) => <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border ${tab === k ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200'}`}><Icon className="w-4 h-4" />{label}</button>)}</div>
    {tab === 'payees' && <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-slate-800">{product}常用收款人</h3><button onClick={() => setNotice('新增收款人須完成增強認證及企業非財務交易審批；保存收款人與提交付款分別記錄。')} className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm"><Plus className="w-4 h-4" />新增收款人</button></div>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">真實戶名／分組</th><th className="font-medium">收款賬號（列表脫敏）</th><th className="font-medium">收款銀行</th><th className="font-medium">版本</th><th className="font-medium">狀態</th><th className="font-medium text-right pr-2">操作</th></tr></thead><tbody>{payees[product].map(p => <tr key={p.name} className="border-b border-slate-100"><td className="py-3 text-slate-700">{p.name}<br /><span className="text-xs text-slate-400">{p.group}</span></td><td className="text-slate-500 font-mono text-xs">{p.acct}</td><td className="text-slate-600">{p.bank}</td><td className="text-slate-600">{p.version}</td><td className={p.status === '有效' ? 'text-emerald-600 text-xs' : 'text-slate-400 text-xs'}>{p.status}</td><td className="text-right pr-2 space-x-3"><button onClick={() => setNotice(`${p.name}：查看完整資料或修改支付關鍵欄位，須按規則完成 2FA／增強認證及審批；修改後另存新版本。`)} className="text-xs text-[#134b9e]"><PencilLine className="w-3 h-3 inline" /> 查看／修改</button><button onClick={() => setNotice(`${p.name}：如已被交易、模板或有效計劃引用，只能停用，不能物理刪除；歷史交易快照不受影響。`)} className="text-xs text-[#c8102e]">停用</button></td></tr>)}</tbody></table>
      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />確認及審批頁完整展示真實戶名與賬號；交易保存使用當時的收款人版本快照。</p>
    </div>}
    {tab === 'templates' && <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="font-bold text-slate-800 mb-1">{product}匯款模板</h3><p className="text-xs text-slate-400 mb-4">模板只簡化草稿錄入，不豁免當次校驗、認證及審批。</p>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">模板名稱</th><th className="font-medium">關聯收款人</th><th className="font-medium">幣種</th><th className="font-medium">預設金額</th><th className="font-medium text-right pr-2">操作</th></tr></thead><tbody>{templates.filter(x => x.product === product).map(t => <tr key={t.name} className="border-b border-slate-100"><td className="py-3 text-slate-700">{t.name}</td><td className="text-slate-600">{t.payee}</td><td className="text-slate-600">{t.ccy}</td><td className="text-slate-500">調用後輸入</td><td className="text-right pr-2"><button onClick={() => { setUsed(t.name); setNotice(t.updated ? '收款人資料已更新，請核對。模板已帶入最新有效版本 V4；原模板關聯版本為 V3。請核對後方可提交。' : '模板已帶入收款人當前有效版本；請核對金額、附言及當次材料後再提交。') }} className="text-xs text-[#134b9e]">調用模板</button></td></tr>)}</tbody></table>
      {used && <div className={`rounded-lg p-3 mt-4 text-xs flex gap-2 ${notice.startsWith('收款人資料已更新') ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-blue-50 text-[#134b9e]'}`}><AlertTriangle className="w-4 h-4 shrink-0" /><span><b>{used}</b><br />{notice}</span></div>}
    </div>}
    {tab === 'payees' && notice && <p className="text-xs text-[#134b9e] bg-blue-50 rounded-lg p-3">{notice}</p>}
  </div>
}
