import { useState } from 'react'
import { directServices, directCalls } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Cable, Server, Cloud, CheckCircle2, Plus, ShieldCheck, KeyRound } from 'lucide-react'

export default function BankDirect() {
  const [applied, setApplied] = useState(false)
  const [cashSent, setCashSent] = useState(false)
  const [quoteRefreshed, setQuoteRefreshed] = useState(false)
  const openCount = directServices.filter(s => s.status === '已開通').length

  return (
    <div className="relative z-10 max-w-5xl mx-auto space-y-5">
      <Breadcrumb items={['銀企直連']} />

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white">
          <div className="text-xs text-blue-200">接口服務</div>
          <div className="text-2xl font-bold mt-1.5">{openCount} / {directServices.length} 項已開通</div>
          <div className="text-xs text-blue-200 mt-1">由「查詢連接」升級為「動賬連接」</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">接入方式</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5">雲直連（推薦）</div>
          <div className="text-xs text-slate-500 mt-1">免前置機，TLS 1.3 + 雙向證書 · 亦支持傳統前置機模式</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">安全認證</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" />數字證書 + IP 白名單</div>
          <div className="text-xs text-slate-500 mt-1">已升級強化 · 與網頁端、移動端共享統一認證、授權、限額與風控體系，一次簽約多渠道協同</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><h3 className="font-bold text-slate-800">匯款費用優惠試算回應</h3><p className="text-xs text-slate-400 mt-1">銀企直連以接口欄位回傳優惠，不依賴企網頁面；核心最終核驗規則版本及實收金額。</p></div>
          <span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-1 font-mono">POST /remittance/fee-quote</span>
        </div>
        <div className="grid grid-cols-5 gap-3 text-xs">
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-slate-400">standardAmount</div><div className="text-slate-700 font-medium mt-1">MOP 220.00</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-slate-400">discountAmount</div><div className="text-emerald-700 font-medium mt-1">－MOP 44.00</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-slate-400">actualAmount</div><div className="text-[#c8102e] font-bold mt-1">MOP 176.00</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-slate-400">ruleId</div><div className="text-slate-700 font-mono mt-1">CH-HQ-RM-01</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-slate-400">ruleVersion</div><div className="text-slate-700 font-mono mt-1">V1.0</div></div>
        </div>
        <div className="flex items-center justify-between mt-4 bg-slate-50 rounded-lg p-3">
          <span className="text-xs text-slate-500">提交時如版本或金額已變化，返回明確異常並要求重新試算；不得靜默改價成交。</span>
          <button onClick={() => setQuoteRefreshed(true)} className="shrink-0 ml-3 text-xs bg-[#0b2a5b] text-white rounded-lg px-3 py-2">重新試算優惠</button>
        </div>
        {quoteRefreshed && <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">已重新取得同一規則版本 V1.0：標準匯費 MOP 220.00、減免 MOP 44.00、實收 MOP 176.00。</div>}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800">現金管理直連服務</h3>
            <p className="text-xs text-slate-400 mt-1">授權範圍內的集團／賬戶及執行結果查詢、主動調撥指令與結果回傳；統一支付雙段流程以網上銀行為主。</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-1">已開通</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs font-mono text-[#134b9e]">GET /cash/group/accounts</div><div className="text-xs text-slate-500 mt-2">集團、賬戶、可用餘額及數據時間</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs font-mono text-[#134b9e]">POST /cash/transfer</div><div className="text-xs text-slate-500 mt-2">同池主子賬戶同幣種主動調撥</div></div>
          <div className="border border-slate-200 rounded-lg p-3"><div className="text-xs font-mono text-[#134b9e]">GET /cash/transfer/{'{'}id{'}'}</div><div className="text-xs text-slate-500 mt-2">原指令結果查證、防重及核心流水回傳</div></div>
        </div>
        <div className="flex items-center justify-between mt-4 bg-slate-50 rounded-lg p-3">
          <span className="text-xs text-slate-500">沿用既有報文唯一標識、安全鑒權、企網審批、限額及風控，不因接口渠道放寬要求。</span>
          <button onClick={() => setCashSent(true)} className="shrink-0 ml-3 text-xs bg-[#0b2a5b] text-white rounded-lg px-3 py-2">發送調撥指令示例</button>
        </div>
        {cashSent && <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-700">CT-DIRECT-20261027001 已受理，狀態：付款企業審批中。可通過原指令編號查詢結果，不得重新發起相同指令。</div>}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Cable className="w-4 h-4 text-[#134b9e]" />接口服務清單</h3>
          <button onClick={() => setApplied(true)} className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]">
            <Plus className="w-4 h-4" />申請開通新服務
          </button>
        </div>
        {applied && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />申請已提交（服務編號 DC-2026-10086），進入「一站式簽約受理」流程，約 3 個工作日完成開通。
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">服務</th>
              <th className="font-medium">服務範圍</th>
              <th className="font-medium text-right">近 30 日調用</th>
              <th className="font-medium text-right pr-2">狀態</th>
            </tr>
          </thead>
          <tbody>
            {directServices.map(s => (
              <tr key={s.name} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3.5 text-slate-700 font-medium whitespace-nowrap">{s.name}</td>
                <td className="text-slate-500 text-xs pr-4">{s.scope}</td>
                <td className="text-right text-slate-600">{s.calls30d.toLocaleString()}</td>
                <td className="text-right pr-2">
                  <span className={`text-xs rounded px-2 py-0.5 ${s.status === '已開通' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Server className="w-4 h-4 text-[#134b9e]" />接入方式對比</h3>
          {[
            { name: '雲直連', desc: '免硬件投入，互聯網 TLS 加密通道，適配中小企業快速接入', ok: true },
            { name: '前置機模式', desc: '企業本地部署前置機，適配大型集團 ERP 深度集成及複雜網絡環境', ok: false },
          ].map(m => (
            <div key={m.name} className={`border rounded-xl p-4 mb-3 ${m.ok ? 'border-[#134b9e] bg-blue-50/40' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                  {m.ok ? <Cloud className="w-4 h-4 text-[#134b9e]" /> : <Server className="w-4 h-4 text-slate-400" />}{m.name}
                </span>
                {m.ok && <span className="text-xs bg-[#0b2a5b] text-white rounded px-2 py-0.5">當前使用</span>}
              </div>
              <div className="text-xs text-slate-500 mt-1.5">{m.desc}</div>
            </div>
          ))}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><KeyRound className="w-3.5 h-3.5" />證書有效期至 2027-09-30 · IP 白名單 2 組已配置</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3">最近接口調用</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 font-medium">時間</th>
                <th className="font-medium">接口</th>
                <th className="font-medium text-right">結果</th>
                <th className="font-medium text-right pr-1">耗時</th>
              </tr>
            </thead>
            <tbody>
              {directCalls.map((c, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="py-2.5 text-slate-500 whitespace-nowrap">{c.time.slice(5)}</td>
                  <td className="text-slate-700 font-mono">{c.api}</td>
                  <td className={`text-right ${c.result === '成功' ? 'text-emerald-600' : 'text-amber-600'}`}>{c.result}</td>
                  <td className="text-right pr-1 text-slate-400">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">接口級交易安全可控、全程可溯，全部調用記入後台日誌。</p>
        </div>
      </div>
    </div>
  )
}
