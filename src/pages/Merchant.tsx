import { useState } from 'react'
import { merchantTxns, ePaymentReports, reconcileFiles, subMerchants, fmt } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Search, RotateCcw, Download, KeyRound, FileSpreadsheet, Store, QrCode } from 'lucide-react'

export default function Merchant() {
  const [tab, setTab] = useState<'txn' | 'report' | 'key' | 'recon' | 'sub'>('txn')
  const TABS = [['txn', '商戶交易明細', QrCode], ['report', '電子支付報表', FileSpreadsheet], ['key', '商戶密鑰設置', KeyRound], ['recon', '下載對賬文件', Download], ['sub', '二級商戶信息', Store]] as const
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['電子支付']} />
      <div className="flex border-b border-slate-100 bg-white rounded-t-xl shadow-sm mt-4 px-5 overflow-x-auto">
        {TABS.map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 -mb-px whitespace-nowrap ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>
      {tab === 'txn' && <TxnPanel />}
      {tab === 'report' && <ReportPanel />}
      {tab === 'key' && <KeyPanel />}
      {tab === 'recon' && <ReconPanel />}
      {tab === 'sub' && <SubPanel />}
    </div>
  )
}

function TxnPanel() {
  const [kw, setKw] = useState('')
  const shown = merchantTxns.filter(t => !kw || t.subMerchant.includes(kw) || t.orderNo.includes(kw))
  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4 text-sm">
        <input value={kw} onChange={e => setKw(e.target.value)} placeholder="訂單號 / 二級商戶名稱"
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-64" />
        <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-1.5 text-sm hover:bg-[#134b9e]"><Search className="w-4 h-4" />查詢</button>
        <button onClick={() => setKw('')} className="flex items-center gap-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-600"><RotateCcw className="w-3.5 h-3.5" />重置</button>
        <div className="flex-1" />
        <button className="flex items-center gap-1 text-xs text-[#134b9e] hover:underline"><Download className="w-3.5 h-3.5" />導出明細</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">交易時間</th>
            <th className="font-medium">訂單號</th>
            <th className="font-medium">二級商戶</th>
            <th className="font-medium">渠道</th>
            <th className="font-medium text-right">金額</th>
            <th className="font-medium text-right">手續費</th>
            <th className="font-medium text-right pr-2">狀態</th>
          </tr>
        </thead>
        <tbody>
          {shown.map(t => (
            <tr key={t.orderNo} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-500">{t.date}</td>
              <td className="text-slate-600 font-mono text-xs">{t.orderNo}</td>
              <td className="text-slate-700">{t.subMerchant}</td>
              <td className="text-slate-600">{t.channel}</td>
              <td className="text-right text-slate-800">{fmt(t.amount, 'MOP')}</td>
              <td className="text-right text-slate-500">{fmt(t.fee)}</td>
              <td className="text-right pr-2">
                <span className={`text-xs rounded px-2 py-0.5 ${t.status === '成功' ? 'bg-emerald-50 text-emerald-700' : t.status === '退款' ? 'bg-red-50 text-[#c8102e]' : 'bg-amber-50 text-amber-700'}`}>{t.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReportPanel() {
  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">月份</th>
            <th className="font-medium text-right">交易筆數</th>
            <th className="font-medium text-right">交易總額</th>
            <th className="font-medium text-right">手續費合計</th>
            <th className="font-medium text-right pr-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {ePaymentReports.map(r => (
            <tr key={r.month} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-700">{r.month}</td>
              <td className="text-right text-slate-600">{r.count.toLocaleString()}</td>
              <td className="text-right text-slate-800 font-medium">{fmt(r.amount, 'MOP')}</td>
              <td className="text-right text-slate-600">{fmt(r.fee)}</td>
              <td className="text-right pr-2"><button className="flex items-center gap-1 text-xs text-[#134b9e] hover:underline ml-auto"><Download className="w-3.5 h-3.5" />下載報表</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-400 mt-3">電子支付報表按月生成，支持 PDF / Excel 格式下載。</p>
    </div>
  )
}

function KeyPanel() {
  const [keys, setKeys] = useState([
    { env: '生產環境', merchantId: 'MCH-88001', status: '生效中', updated: '2026-08-15' },
    { env: '測試環境', merchantId: 'MCH-T8001', status: '生效中', updated: '2026-09-02' },
  ])
  const regen = (env: string) =>
    setKeys(prev => prev.map(k => (k.env === env ? { ...k, updated: '2026-10-06', status: '生效中' } : k)))
  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-4">
      {keys.map(k => (
        <div key={k.env} className="border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <span className="w-9 h-9 rounded-lg bg-blue-50 text-[#134b9e] flex items-center justify-center"><KeyRound className="w-4 h-4" /></span>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-800">{k.env}　<span className="text-xs text-slate-400 font-mono">{k.merchantId}</span></div>
            <div className="text-xs text-slate-400 mt-0.5">API 密鑰：sk_live_••••••••••••8f2a　最近更新 {k.updated}</div>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">{k.status}</span>
          <button onClick={() => regen(k.env)} className="text-xs text-[#134b9e] hover:underline">重新生成</button>
        </div>
      ))}
      <p className="text-xs text-slate-400">重新生成密鑰後舊密鑰立即失效，請及時更新商戶系統配置；操作將記入網銀操作日誌。</p>
    </div>
  )
}

function ReconPanel() {
  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">對賬日期</th>
            <th className="font-medium">文件名稱</th>
            <th className="font-medium">大小</th>
            <th className="font-medium text-right pr-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {reconcileFiles.map(f => (
            <tr key={f.name} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-700">{f.date}</td>
              <td className="text-slate-600 font-mono text-xs">{f.name}</td>
              <td className="text-slate-500">{f.size}</td>
              <td className="text-right pr-2"><button className="flex items-center gap-1 text-xs text-[#134b9e] hover:underline ml-auto"><Download className="w-3.5 h-3.5" />下載</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-400 mt-3">對賬文件每日生成，保留最近 90 天；如需歷史文件請聯繫商戶服務熱線。</p>
    </div>
  )
}

function SubPanel() {
  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">二級商戶與總商戶（MCH-88001）綁定，共用結算賬戶</span>
        <button className="border border-[#134b9e] text-[#134b9e] rounded-lg px-4 py-2 text-sm hover:bg-blue-50">申請新增二級商戶</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">商戶編號</th>
            <th className="font-medium">名稱</th>
            <th className="font-medium">開通日期</th>
            <th className="font-medium text-right pr-2">狀態</th>
          </tr>
        </thead>
        <tbody>
          {subMerchants.map(s => (
            <tr key={s.code} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-600 font-mono text-xs">{s.code}</td>
              <td className="text-slate-700">{s.name}</td>
              <td className="text-slate-500">{s.openDate}</td>
              <td className="text-right pr-2"><span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">{s.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
