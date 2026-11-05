import { useMemo, useState } from 'react'
import {
  groupCompanies, internalLedger, collectionRules, allocRules, cashTransfers,
  interestDetails, proxyPays, cashReports, watchRules, watchWhitelist, watchBlacklist,
  groupLimit, groupLimitDims, fmt,
  productPackages, acctGroups, initRecords, poolView, execReports, watchAlerts,
  reportSubs, reportTypes, limitUsage, limitScheme, interestScheme, interestRestores,
  interestAllocs, proxyPaySteps,
} from '@/lib/mock'
import type { CollectionRule, WatchRule, ReportSub } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import {
  Vault, Eye, ArrowUpDown, Percent, HandCoins, FileBarChart,
  BellRing, Gauge, Building2, ArrowDownToLine, ArrowUpFromLine, Plus, Upload, CheckCircle2,
  FileSignature, Download, ChevronDown, ChevronRight, AlertTriangle, Receipt, ArrowRight,
} from 'lucide-react'

const MENU = [
  { key: 'signup', label: '簽約與賬戶組', icon: FileSignature, tag: '銀行端辦理' },
  { key: 'view', label: '多企業資金視圖', icon: Eye, tag: '' },
  { key: 'watch', label: '賬戶看管', icon: BellRing, tag: '' },
  { key: 'limit', label: '限額管理', icon: Gauge, tag: '賬戶組' },
  { key: 'poolview', label: '實體資金池', icon: Vault, tag: '' },
  { key: 'pool', label: '歸集與下撥', icon: ArrowUpDown, tag: '' },
  { key: 'transfer', label: '主動調撥', icon: ArrowUpFromLine, tag: '' },
  { key: 'interest', label: '集團綜合計息', icon: Percent, tag: '' },
  { key: 'proxy', label: '統一支付', icon: HandCoins, tag: '' },
  { key: 'report', label: '信息加工', icon: FileBarChart, tag: '' },
] as const

type SecKey = typeof MENU[number]['key']

const FX: Record<string, number> = { MOP: 1, HKD: 1.03, CNY: 1.14, USD: 8.03 }

export default function CashMgmt() {
  const [sec, setSec] = useState<SecKey>('view')
  return (
    <div className="relative z-10 max-w-6xl mx-auto">
      <Breadcrumb items={['現金管理']} />
      <div className="flex items-center justify-between mt-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Vault className="w-5 h-5 text-[#134b9e]" />現金管理產品</h2>
          <p className="text-xs text-slate-400 mt-1">東主視角 · 集團賬戶在法律和資金層面保持獨立，不涉及實體資金混同；歸集、下撥及主動調撥為行內賬戶間資金往來，按行內賬務處理</p>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-56 shrink-0 bg-white rounded-xl shadow-sm p-2 space-y-1 h-fit">
          {MENU.map(m => {
            const Icon = m.icon
            return (
              <button key={m.key} onClick={() => setSec(m.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${sec === m.key ? 'bg-[#0b2a5b] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className="w-4 h-4" />{m.label}
                {m.tag && <span className={`ml-auto text-[10px] rounded px-1.5 py-0.5 ${sec === m.key ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{m.tag}</span>}
              </button>
            )
          })}
        </div>
        <div className="flex-1 min-w-0">
          {sec === 'signup' && <Signup />}
          {sec === 'view' && <FundView />}
          {sec === 'watch' && <Watch />}
          {sec === 'limit' && <Limit />}
          {sec === 'poolview' && <PoolView />}
          {sec === 'pool' && <Pool />}
          {sec === 'transfer' && <ActiveTransfer />}
          {sec === 'interest' && <Interest />}
          {sec === 'proxy' && <ProxyPaySec />}
          {sec === 'report' && <Reports />}
        </div>
      </div>
    </div>
  )
}

/* ============ 簽約與賬戶組（業務准入，銀行端辦理 · 用戶端返顯） ============ */
function Signup() {
  const [added, setAdded] = useState(false)
  const FLOW = ['客戶臨櫃申請', '分行受理初審', '總行維護行錄入', '複核通過', '生效初始化', '短訊通知 · 網銀返顯']
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1">業務準入流程（簽約與建檔）</h3>
        <p className="text-xs text-slate-400 mb-4">現金管理服務採銀行端辦理路徑：集團關係建立 → 賬戶組建立 → 產品簽約及參數設置 → 生效初始化 → 服務提供；變更、解約及司法凍結按專項流程處理。</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FLOW.map((f, i) => (
            <span key={f} className="flex items-center gap-1.5">
              <span className="text-xs bg-blue-50 text-[#134b9e] rounded-lg px-2.5 py-1.5 font-medium">{f}</span>
              {i < FLOW.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800">集團關係（牽頭公司：誠信貿易（澳門）一人有限公司）</h3>
            <p className="text-xs text-slate-400 mt-1">將既有企網客戶關聯為集團與成員單位，為九項產品之業務基礎；一個成員單位僅能加入一個集團；建立、成員加入／退出及牽頭公司變更均須維護行複核，生效日預設下一自然日；支持銀企直連批量導入</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setAdded(true)} className="flex items-center gap-1 border border-[#134b9e] text-[#134b9e] rounded-lg px-4 py-2 text-sm hover:bg-blue-50"><Upload className="w-4 h-4" />批量導入成員</button>
            <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]"><Plus className="w-4 h-4" />新增成員單位</button>
          </div>
        </div>
        {added && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />已解析導入文件：新增 1 家成員單位（待對方簽署授權協議及維護行複核後生效）。
          </div>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">企業名稱</th>
              <th className="font-medium">角色</th>
              <th className="font-medium text-right">賬戶數</th>
              <th className="font-medium">授權協議</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {groupCompanies.map(g => (
              <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700 font-medium">{g.name}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${g.relation === '牽頭公司' ? 'bg-[#0b2a5b] text-white' : 'bg-blue-50 text-[#134b9e]'}`}>{g.relation}</span></td>
                <td className="text-right text-slate-600">{g.accts.length}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${g.agreement === '已簽署授權協議' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{g.agreement}</span></td>
                <td className="text-right pr-2 space-x-2">
                  <button className="text-xs text-[#134b9e] hover:underline">維護賬戶</button>
                  {g.agreement !== '已簽署授權協議' && <button className="text-xs text-[#134b9e] hover:underline">發起簽約</button>}
                  {g.relation === '成員單位' && <button className="text-xs text-[#c8102e] hover:underline">移除</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1">總行預設產品組合</h3>
        <p className="text-xs text-slate-400 mb-3">簽約時整體選取，可按客戶需求增設或調整；組合調整不影響已生效之簽約。</p>
        <div className="grid grid-cols-3 gap-3">
          {productPackages.map(p => (
            <div key={p.name} className="border border-slate-200 rounded-xl p-4">
              <div className="text-sm font-bold text-slate-800">{p.name}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.products.map(x => <span key={x} className="text-[10px] bg-blue-50 text-[#134b9e] rounded px-1.5 py-0.5">{x}</span>)}
              </div>
              <div className="text-xs text-slate-400 mt-2">{p.scene}</div>
            </div>
          ))}
        </div>
      </div>

      {acctGroups.map(g => (
        <div key={g.id} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-800">{g.name} <span className="text-xs text-slate-400 font-normal font-mono ml-1">{g.id}</span></h3>
              <p className="text-xs text-slate-400 mt-0.5">產品組合：{g.pkg} · 組合生效日：{g.pkgEffDate} · 「主-子」兩層結構</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">已生效</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
                <th className="py-2.5 font-medium">賬戶</th>
                <th className="font-medium">所屬成員單位</th>
                <th className="font-medium">角色</th>
                <th className="font-medium">已簽約產品</th>
                <th className="font-medium">生效日</th>
                <th className="font-medium text-right pr-2">狀態</th>
              </tr>
            </thead>
            <tbody>
              {g.members.map(m => (
                <tr key={m.no} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-slate-700">{m.acct}<div className="text-[10px] text-slate-400 font-mono">{m.no}</div></td>
                  <td className="text-slate-600 text-xs">{m.company}</td>
                  <td><span className={`text-xs rounded px-2 py-0.5 ${m.role === '主賬戶' ? 'bg-[#0b2a5b] text-white' : 'bg-blue-50 text-[#134b9e]'}`}>{m.role}</span></td>
                  <td><div className="flex flex-wrap gap-1">{m.products.map(p => <span key={p} className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{p}</span>)}</div></td>
                  <td className="text-slate-500 text-xs">{m.effDate}</td>
                  <td className="text-right pr-2"><span className={`text-xs rounded px-2 py-0.5 ${m.status === '已生效' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">生效初始化記錄</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">約定生效日</th>
              <th className="font-medium">初始化對象</th>
              <th className="font-medium">產品</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium pr-2">說明</th>
            </tr>
          </thead>
          <tbody>
            {initRecords.map(r => (
              <tr key={r.date + r.target} className="border-b border-slate-100">
                <td className="py-3 text-slate-500 text-xs">{r.date}</td>
                <td className="text-slate-700 text-xs">{r.target}</td>
                <td className="text-slate-600 text-xs">{r.pkg}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${r.status === '初始化成功' ? 'bg-emerald-50 text-emerald-700' : r.status === '待初始化' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-[#134b9e]'}`}>{r.status}</span></td>
                <td className="text-slate-400 text-xs pr-2">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">初始化失敗之賬戶生成異常記錄，排除後可重新發起；已過生效日仍未生效的，系統每日日終自動將生效日順延至下一自然日。司法凍結賬戶之產品服務狀態顯示為「已暫停」，退出歸集下撥及統一支付執行範圍，資金池份額保持不變。</p>
      </div>
    </div>
  )
}

/* ============ 多企業資金視圖 ============ */
function FundView() {
  const [drill, setDrill] = useState<string | null>(null)
  const [period, setPeriod] = useState<'日' | '周' | '月'>('月')
  const [ccyMode, setCcyMode] = useState<'fold' | 'split'>('fold')
  const [exported, setExported] = useState('')
  const total = groupCompanies.reduce((s, g) => s + g.accts.reduce((a, x) => a + x.balance * FX[x.ccy], 0), 0)
  const totalIn = groupCompanies.reduce((s, g) => s + g.income7d, 0)
  const totalOut = groupCompanies.reduce((s, g) => s + g.expense7d, 0)
  const d = groupCompanies.find(g => g.id === drill)

  const byCcy = (g: typeof groupCompanies[number]) => {
    const m: Record<string, number> = {}
    g.accts.forEach(a => { m[a.ccy] = (m[a.ccy] || 0) + a.balance })
    return Object.entries(m)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-5 text-white flex items-end justify-between">
        <div>
          <div className="text-xs text-blue-200">名下關聯企業資金總覽（折合 MOP · 東主視角）</div>
          <div className="text-3xl font-bold mt-1.5">{fmt(total, 'MOP')}</div>
          <div className="text-xs text-blue-200 mt-2">共 {groupCompanies.length} 家關聯企業 · {groupCompanies.reduce((s, g) => s + g.accts.length, 0)} 個賬戶</div>
        </div>
        <div className="text-right text-xs text-blue-200 space-y-1">
          <div>近 7 日收入合計 <span className="text-white font-medium">{fmt(totalIn)}</span></div>
          <div>近 7 日支出合計 <span className="text-white font-medium">{fmt(totalOut)}</span></div>
          <div>淨頭寸 <span className="text-emerald-300 font-bold">{fmt(totalIn - totalOut)}</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button onClick={() => setCcyMode('fold')} className={`px-3 py-1 rounded-full text-xs border ${ccyMode === 'fold' ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'border-slate-200 text-slate-500'}`}>折合 MOP 匯總</button>
          <button onClick={() => setCcyMode('split')} className={`px-3 py-1 rounded-full text-xs border ${ccyMode === 'split' ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'border-slate-200 text-slate-500'}`}>按幣種分列</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">數據時點：2026-10-06 17:20（實時調用核心）· 歷史最長追溯 12 個月</span>
          {['Excel', 'PDF'].map(x => (
            <button key={x} onClick={() => setExported(x)}
              className={`flex items-center gap-1 text-xs rounded-lg px-2.5 py-1.5 ${exported === x ? 'bg-emerald-50 text-emerald-700' : 'border border-slate-200 text-slate-500 hover:border-[#134b9e] hover:text-[#134b9e]'}`}>
              <Download className="w-3 h-3" />{exported === x ? `已加入下載（${x}）` : `導出 ${x}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {groupCompanies.map(g => (
          <button key={g.id} onClick={() => setDrill(g.id)}
            className="text-left bg-white rounded-xl shadow-sm p-4 border-2 border-transparent hover:border-[#134b9e] transition-colors">
            <div className="flex items-center justify-between">
              <span className={`text-xs rounded px-2 py-0.5 ${g.relation === '牽頭公司' ? 'bg-[#0b2a5b] text-white' : 'bg-blue-50 text-[#134b9e]'}`}>{g.relation}</span>
              <span className={`text-xs rounded px-2 py-0.5 ${g.agreement === '已簽署授權協議' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{g.agreement}</span>
            </div>
            <div className="text-sm font-medium text-slate-800 mt-2 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" />{g.name}</div>
            {ccyMode === 'fold' ? (
              <div className="text-xl font-bold text-slate-800 mt-2">
                {fmt(g.accts.reduce((a, x) => a + x.balance * FX[x.ccy], 0), 'MOP')}
                <span className="text-xs text-slate-400 font-normal ml-2">折合 · {g.accts.length} 個賬戶</span>
              </div>
            ) : (
              <div className="mt-2 space-y-0.5">
                {byCcy(g).map(([c, v]) => (
                  <div key={c} className="text-sm font-bold text-slate-800">{fmt(v, c)}<span className="text-xs text-slate-400 font-normal ml-2">{c}</span></div>
                ))}
                <div className="text-[10px] text-slate-400">{g.accts.length} 個賬戶</div>
              </div>
            )}
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span>近 7 日收 <span className="text-emerald-600 font-medium">{fmt(g.income7d)}</span></span>
              <span>支 <span className="text-[#c8102e] font-medium">{fmt(g.expense7d)}</span></span>
            </div>
          </button>
        ))}
      </div>

      {/* 穿透視圖 */}
      {d && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">穿透查詢 — {d.name}</h3>
            <button onClick={() => setDrill(null)} className="text-xs text-slate-400 hover:text-slate-600">收起</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
                <th className="py-2.5 font-medium">賬戶</th>
                <th className="font-medium">賬號</th>
                <th className="font-medium text-right">幣種</th>
                <th className="font-medium text-right">餘額</th>
                <th className="font-medium">產品簽約</th>
                <th className="font-medium text-right pr-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {d.accts.map(a => {
                const mem = acctGroups.flatMap(g => g.members).find(m => m.no === a.no)
                return (
                  <tr key={a.no} className="border-b border-slate-100">
                    <td className="py-3 text-slate-700">{a.name}</td>
                    <td className="text-slate-400 font-mono text-xs">{a.no}</td>
                    <td className="text-right text-slate-600">{a.ccy}</td>
                    <td className="text-right text-slate-800 font-medium">{fmt(a.balance)}</td>
                    <td>{mem ? <div className="flex flex-wrap gap-1">{mem.products.slice(0, 2).map(p => <span key={p} className="text-[10px] bg-blue-50 text-[#134b9e] rounded px-1.5 py-0.5">{p}</span>)}{mem.products.length > 2 && <span className="text-[10px] text-slate-400">+{mem.products.length - 2}</span>}</div> : <span className="text-[10px] text-slate-300">未簽約</span>}</td>
                    <td className="text-right pr-2 space-x-2">
                      <button className="text-xs text-[#134b9e] hover:underline">賬戶明細</button>
                      <button className="text-xs text-[#134b9e] hover:underline">發起轉賬</button>
                      <button className="text-xs text-[#134b9e] hover:underline">月結單</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="mt-3 flex gap-3">
            <button className="bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]">關聯企業間快速轉賬</button>
            <span className="text-xs text-slate-400 self-center">行內實時到賬，系統自動生成內部往來記錄（見下方）</span>
          </div>
        </div>
      )}

      {/* 收支匯總報告 + 內部往來 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">關聯企業收支匯總報告 · 內部往來記錄</h3>
          <div className="flex gap-1">
            {(['日', '周', '月'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-full text-xs border ${period === p ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'border-slate-200 text-slate-500'}`}>按{p}</button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
              <th className="py-2.5 font-medium">往來編號</th>
              <th className="font-medium">付款方 → 收款方</th>
              <th className="font-medium">類型</th>
              <th className="font-medium text-right">金額</th>
              <th className="font-medium">時間</th>
              <th className="font-medium text-right pr-2">內部參考號</th>
            </tr>
          </thead>
          <tbody>
            {internalLedger.map(r => (
              <tr key={r.id} className="border-b border-slate-50">
                <td className="py-2.5 text-slate-500 font-mono text-xs">{r.id}</td>
                <td className="text-slate-700">{r.from} <span className="text-slate-300">→</span> {r.to}</td>
                <td><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-1.5 py-0.5">{r.type}</span></td>
                <td className="text-right text-slate-800 font-medium">{fmt(r.amount, r.ccy)}</td>
                <td className="text-slate-500 text-xs">{r.time}</td>
                <td className="text-right pr-2 text-slate-400 font-mono text-xs">{r.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">報告按{period}生成，涵蓋所有關聯企業收支合計及內部往來明細，支持導出（與信息加工聯動）。</p>
      </div>
    </div>
  )
}

/* ============ 實體資金池 ============ */
function PoolView() {
  const subTotal = poolView.subs.reduce((s, x) => s + x.balance, 0)
  const poolTotal = poolView.master.balance + subTotal
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white">
          <div className="text-xs text-blue-200">資金池彙總餘額（{poolView.ccy}）</div>
          <div className="text-2xl font-bold mt-1.5">{fmt(poolTotal, 'MOP')}</div>
          <div className="text-xs text-blue-200 mt-1">{poolView.name} · {poolView.group}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">池參數</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5">池幣種 {poolView.ccy} · 不允許透支</div>
          <div className="text-xs text-slate-500 mt-1">異常處理策略：{poolView.exPolicy}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">運行監控</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5">本期歸集成功率 66.7%（部分成功）</div>
          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />1 戶異常賬戶已生成異常記錄</div>
        </div>
      </div>

      {/* 池結構圖 + 貢獻度 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-4">主子賬戶結構 · 子賬戶對資金池貢獻度</h3>
        <div className="flex items-stretch gap-4">
          <div className="w-64 bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white">
            <div className="text-xs text-blue-200">現金池主賬戶（唯一）</div>
            <div className="text-sm font-medium mt-1">{poolView.master.acct}</div>
            <div className="text-xl font-bold mt-2">{fmt(poolView.master.balance, 'MOP')}</div>
            <div className="text-[10px] text-blue-200 mt-1">佔池比例 {(poolView.master.balance / poolTotal * 100).toFixed(1)}%</div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-3">
            {poolView.subs.map(s => {
              const pct = s.balance / poolTotal * 100
              return (
                <div key={s.acct} className="border border-slate-200 rounded-xl p-3.5">
                  <div className="text-xs text-slate-400">子賬戶</div>
                  <div className="text-sm font-medium text-slate-700 mt-0.5">{s.acct}</div>
                  <div className="text-xs text-slate-800 font-bold mt-1.5">{fmt(s.balance, 'MOP')}</div>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#134b9e] rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">貢獻度 {pct.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4">資金池以賬戶組為唯一載體，一個賬戶組對應一個資金池；池內賬戶狀態異常（凍結、結清）時自動退出當期歸集下撥執行範圍並生成異常記錄；主賬戶變更須重新複核，生效前原歸集下撥規則暫停執行。</p>
      </div>
    </div>
  )
}

/* ============ 歸集與下撥 ============ */
function Pool() {
  const [rules, setRules] = useState<CollectionRule[]>(collectionRules)
  const [open, setOpen] = useState<string | null>(execReports[0].id)
  const [receipt, setReceipt] = useState('')
  const toggle = (id: string) => setRules(prev => prev.map(r => (r.id === id ? { ...r, status: r.status === '生效中' ? '已暫停' : '生效中' } : r)))
  return (
    <div className="space-y-4">
      {/* 歸集規則 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">歸集規則（子賬戶 → 主賬戶）</h3>
          <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]"><Plus className="w-4 h-4" />新增歸集規則</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">歸集賬戶</th>
              <th className="font-medium">歸集模式</th>
              <th className="font-medium">參數</th>
              <th className="font-medium">執行</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700">{r.from}</td>
                <td><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-0.5">{r.mode}</span></td>
                <td className="text-slate-500 text-xs">{r.param}</td>
                <td className="text-slate-600">{r.freq} · {r.time}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${r.status === '生效中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span></td>
                <td className="text-right pr-2">
                  <button onClick={() => toggle(r.id)} className="text-xs text-[#134b9e] hover:underline">{r.status === '生效中' ? '暫停' : '恢復'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><ArrowUpFromLine className="w-3.5 h-3.5" />支持全額歸集、限額歸集、差額歸集、取整歸集、比例歸集；執行頻率支持定時、日終。規則調整或暫停由客戶臨櫃申請，於約定生效日生效；生效前批量任務暫停執行。</p>
      </div>

      {/* 下撥規則 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">下撥規則（主賬戶 → 子賬戶）</h3>
        <div className="grid grid-cols-2 gap-3">
          {allocRules.map(r => (
            <div key={r.id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5"><ArrowDownToLine className="w-4 h-4 text-emerald-600" />{r.mode}</span>
                <span className={`text-xs rounded px-2 py-0.5 ${r.status === '生效中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span>
              </div>
              <div className="text-sm text-slate-600 mt-1.5">{r.to}</div>
              <div className="text-xs text-slate-400 mt-1">{r.param}</div>
              <div className="text-xs text-slate-500 mt-1.5">執行：{r.freq}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">執行時點錯開營業高峰：定時歸集安排於晚上 9 時、定時下撥安排於早上 8 時。</p>
      </div>

      {/* 每期執行報告 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">每期執行報告</h3>
        <div className="space-y-2">
          {execReports.map(r => (
            <div key={r.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === r.id ? null : r.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left">
                {open === r.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <span className="font-mono text-xs text-slate-400">{r.id}</span>
                <span className={`text-xs rounded px-2 py-0.5 ${r.type === '歸集' ? 'bg-blue-50 text-[#134b9e]' : 'bg-emerald-50 text-emerald-700'}`}>{r.type}</span>
                <span className="text-xs text-slate-500">{r.runTime}</span>
                <span className={`ml-auto text-xs rounded px-2 py-0.5 ${r.result === '成功' ? 'bg-emerald-50 text-emerald-700' : r.result === '部分成功' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-[#c8102e]'}`}>{r.result}</span>
                <span className="text-xs text-slate-400">{r.details.filter(x => x.result === '成功').length}/{r.details.length} 戶成功</span>
              </button>
              {open === r.id && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
                  <table className="w-full text-sm">
                    <tbody>
                      {r.details.map(x => (
                        <tr key={x.acct} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 text-slate-700">{x.acct}</td>
                          <td className="text-right text-slate-800 font-medium">{x.amount > 0 ? fmt(x.amount, x.ccy) : '—'}</td>
                          <td className="w-20 text-center"><span className={`text-xs rounded px-2 py-0.5 ${x.result === '成功' ? 'bg-emerald-50 text-emerald-700' : x.result === '跳過' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-[#c8102e]'}`}>{x.result}</span></td>
                          <td className="text-slate-400 text-xs pl-4">{x.note || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => setReceipt(r.id)}
                      className={`flex items-center gap-1 text-xs rounded-lg px-3 py-1.5 ${receipt === r.id ? 'bg-emerald-50 text-emerald-700' : 'border border-[#134b9e] text-[#134b9e] hover:bg-blue-50'}`}>
                      <Receipt className="w-3.5 h-3.5" />{receipt === r.id ? '✓ 電子回單已生成' : '下載電子回單'}
                    </button>
                    <span className="text-[10px] text-slate-400">執行結果短訊已發送；失敗或部分失敗明細進入異常處理隊列（跳過／補劃／人工干預）</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============ 主動調撥 ============ */
function ActiveTransfer() {
  const [list, setList] = useState(cashTransfers)
  const [dir, setDir] = useState<'下撥' | '上劃'>('下撥')
  const [target, setTarget] = useState('誠信物流（澳門）')
  const [amt, setAmt] = useState('')
  const [ok, setOk] = useState('')
  const [receipt, setReceipt] = useState('')
  const members = groupCompanies.filter(g => g.relation === '成員單位').map(g => g.name)

  const dayLimit = limitUsage[1]
  const dayRemain = dayLimit.limit - dayLimit.used
  const FREE_AUTH = 300000

  const submit = () => {
    const n = parseFloat(amt) || 0
    if (n <= 0) return
    const needAuth = n > FREE_AUTH
    setList(prev => [{
      id: 'CT20261006' + String(prev.length + 1).padStart(3, '0'),
      dir,
      from: dir === '下撥' ? '集團主賬戶' : target,
      to: dir === '下撥' ? target : '集團主賬戶',
      amount: n, ccy: 'MOP', time: '2026-10-06 16:30',
      status: needAuth ? '待審批' : '已完成', operator: '陳大文（管理員）',
    }, ...prev])
    setOk(needAuth ? 'authed' : 'done'); setAmt('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
        <h3 className="font-bold text-slate-800 mb-1">主動調撥</h3>
        <p className="text-xs text-slate-400 mb-4">總部或財務中心直接發起主賬戶與成員企業賬戶間的臨時性資金調撥；僅限同一集團內賬戶。同東主關聯企業行內調撥按參數簡化授權：免授權額度 MOP 300,000 內管理員單人確認即時到賬。</p>
        <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 text-xs text-slate-500 flex items-center justify-between">
          <span>實時校驗：集團內賬戶 · 賬戶狀態 · 現金管理限額 · 企網操作員限額（從嚴執行）</span>
          <span>當日剩餘額度 <span className="text-[#134b9e] font-bold">{fmt(dayRemain, 'MOP')}</span></span>
        </div>
        <label className="block text-sm text-slate-600 mb-1.5">調撥方向</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['下撥', '上劃'] as const).map(x => (
            <button key={x} onClick={() => setDir(x)}
              className={`py-2.5 rounded-lg border text-sm font-medium ${dir === x ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>
              {x === '下撥' ? '主賬戶 → 成員單位' : '成員單位 → 主賬戶'}
            </button>
          ))}
        </div>
        <label className="block text-sm text-slate-600 mb-1.5">成員單位</label>
        <select value={target} onChange={e => setTarget(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4">
          {members.map(m => <option key={m}>{m}</option>)}
        </select>
        <label className="block text-sm text-slate-600 mb-1.5">調撥金額（MOP）</label>
        <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) { setAmt(e.target.value); setOk('') } }}
          inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-1" />
        {(parseFloat(amt) || 0) > dayRemain && <p className="text-xs text-[#c8102e] mb-3">超出當日剩餘額度，按限額方案處理：{limitScheme.overRule}</p>}
        {(parseFloat(amt) || 0) > FREE_AUTH && (parseFloat(amt) || 0) <= dayRemain && <p className="text-xs text-amber-600 mb-3">超過免授權額度 {fmt(FREE_AUTH)}，提交後須授權人審批</p>}
        <div className="h-1" />
        <button onClick={submit} disabled={(parseFloat(amt) || 0) <= 0}
          className="w-full bg-[#c8102e] hover:bg-[#a50d26] disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 mt-3">確認調撥</button>
        {ok === 'done' && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />免授權額度內，調撥即時完成，已生成電子回單及內部往來記錄，動賬通知已發送。</p>}
        {ok === 'authed' && <p className="text-xs text-amber-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />已提交審批（企網統一授權模型），授權完成後即時到賬並生成電子回單。</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">調撥記錄</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">編號</th>
              <th className="font-medium">方向</th>
              <th className="font-medium">付款方 → 收款方</th>
              <th className="font-medium text-right">金額</th>
              <th className="font-medium">時間</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-500 font-mono text-xs">{t.id}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${t.dir === '下撥' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#134b9e]'}`}>{t.dir}</span></td>
                <td className="text-slate-700">{t.from} <span className="text-slate-300">→</span> {t.to}</td>
                <td className="text-right text-slate-800 font-medium">{fmt(t.amount, t.ccy)}</td>
                <td className="text-slate-500 text-xs">{t.time}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${t.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{t.status}</span></td>
                <td className="text-right pr-2 space-x-2">
                  {t.status === '已完成' && (
                    <button onClick={() => setReceipt(t.id)} className={`text-xs ${receipt === t.id ? 'text-emerald-600' : 'text-[#134b9e] hover:underline'}`}>{receipt === t.id ? '✓ 回單已下載' : '電子回單'}</button>
                  )}
                  <span className="text-slate-400 text-xs">{t.operator}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ============ 集團綜合計息 ============ */
function Interest() {
  const totalInterest = useMemo(() => interestDetails.reduce((s, r) => s + r.interest, 0), [])
  const SCHEME: [string, string][] = [
    ['適用賬戶組', interestScheme.group],
    ['計息主賬戶', interestScheme.master],
    ['計息利率', interestScheme.rate],
    ['計息周期', interestScheme.cycle],
    ['計息方式', interestScheme.method],
    ['折算匯率來源', interestScheme.fxSource],
    ['利息分配規則', interestScheme.alloc],
  ]
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white">
          <div className="text-xs text-blue-200">本月集團綜合計息（已入賬）</div>
          <div className="text-2xl font-bold mt-1.5">{fmt(5328.4, 'MOP')}</div>
          <div className="text-xs text-blue-200 mt-1">按賬戶組匯總餘額計息，較單戶計息多得 <span className="text-amber-300 font-medium">+18.6%</span></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">計息模式</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5">日終歸集 · 次日還原</div>
          <div className="text-xs text-slate-500 mt-1">日終將各賬戶餘額歸集至可計息主賬戶，按匯總餘額計息；次日將子賬戶餘額劃撥還原</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="text-xs text-slate-400">幣種規則</div>
          <div className="text-sm font-medium text-slate-800 mt-1.5">分幣種 + 多幣種折算</div>
          <div className="text-xs text-slate-500 mt-1">MOP 池按 1.85% 計息；CNY 池按 1.35% 計息；支持多幣種折算後綜合計息</div>
        </div>
      </div>

      {/* 計息方案 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">計息方案（簽約約定）</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
          {SCHEME.map(([k, v]) => (
            <div key={k} className="flex text-sm border-b border-slate-50 pb-2">
              <span className="w-28 shrink-0 text-xs text-slate-400 self-center">{k}</span>
              <span className="text-slate-700 text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">2026-10-05 計息明細（示例交易日）</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">賬戶</th>
              <th className="font-medium">所屬企業</th>
              <th className="font-medium text-right">日終餘額</th>
              <th className="font-medium text-right">池匯總餘額</th>
              <th className="font-medium text-right">年利率</th>
              <th className="font-medium text-right pr-2">當日利息</th>
            </tr>
          </thead>
          <tbody>
            {interestDetails.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700">{r.acct}</td>
                <td className="text-slate-500 text-xs">{r.company}</td>
                <td className="text-right text-slate-800">{fmt(r.eodBalance, r.ccy)}</td>
                <td className="text-right text-slate-500">{fmt(r.poolBalance, r.ccy)}</td>
                <td className="text-right text-[#134b9e]">{r.rate.toFixed(2)}%</td>
                <td className="text-right pr-2 text-emerald-600 font-medium">{fmt(r.interest, r.ccy)}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold">
              <td className="py-3 text-slate-800" colSpan={5}>當日合計（示例）</td>
              <td className="text-right pr-2 text-emerald-600">{fmt(totalInterest)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">利息按日計提、按月入賬；子賬戶異常（凍結等）時退出當期歸集，其餘額不計入匯總計息本金。</p>
      </div>

      {/* 次日還原 + 利息分配報告 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-3">次日還原記錄（2026-10-06）</h4>
          <table className="w-full text-sm">
            <tbody>
              {interestRestores.map(r => (
                <tr key={r.acct} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 text-slate-700 text-xs">{r.acct}</td>
                  <td className="text-right text-slate-800 font-medium text-xs">{fmt(r.amount, r.ccy)}</td>
                  <td className="text-right w-16"><span className="text-[10px] bg-emerald-50 text-emerald-700 rounded px-1.5 py-0.5">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-3">利息分配報告（{interestAllocs[0].period} · {interestAllocs[0].rule}）</h4>
          <table className="w-full text-sm">
            <tbody>
              {interestAllocs[0].lines.map(l => (
                <tr key={l.acct} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 text-slate-700 text-xs">{l.acct}</td>
                  <td className="text-slate-400 text-xs">{l.ratio}</td>
                  <td className="text-right text-emerald-600 font-medium text-xs">{fmt(l.interest, 'MOP')}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="py-2.5 text-slate-800 text-xs" colSpan={2}>合計 · 結息日 {interestAllocs[0].settleDate} 已入賬</td>
                <td className="text-right text-emerald-600 text-xs">{fmt(interestAllocs[0].total, 'MOP')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ============ 統一支付 ============ */
function ProxyPaySec() {
  const [mode, setMode] = useState<'直接代理支付' | '間接代理支付'>('直接代理支付')
  const [list, setList] = useState(proxyPays)
  const [payer, setPayer] = useState('誠信物流（澳門）')
  const [payee, setPayee] = useState('')
  const [amt, setAmt] = useState('')
  const [ok, setOk] = useState(false)
  const [open, setOpen] = useState<string | null>('PP20261006003')
  const members = groupCompanies.filter(g => g.relation === '成員單位').map(g => g.name)

  const submit = () => {
    const n = parseFloat(amt) || 0
    if (!payee.trim() || n <= 0) return
    setList(prev => [{
      id: 'PP20261006' + String(prev.length + 1).padStart(3, '0'),
      payer, agent: '集團主賬戶', payee, amount: n, ccy: 'MOP', mode, date: '2026-10-06', status: '待審批',
    }, ...prev])
    setOk(true); setPayee(''); setAmt('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
        <h3 className="font-bold text-slate-800 mb-1">統一支付（主賬戶代理成員單位對外支付）</h3>
        <p className="text-xs text-slate-400 mb-4">收款人收到之付款人信息為被代理成員單位；扣款賬戶為集團主賬戶。支付範圍沿用企網轉賬匯款能力（行內、本地跨行及跨境），到賬時效、費用及退匯沿用現行規則。</p>
        <label className="block text-sm text-slate-600 mb-1.5">代理方式</label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['直接代理支付', '間接代理支付'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`py-2.5 rounded-lg border text-sm ${mode === m ? 'border-[#134b9e] bg-blue-50 text-[#134b9e] font-medium' : 'border-slate-200 text-slate-600'}`}>
              {m}
              <div className="text-[10px] font-normal mt-0.5 text-slate-400">{m === '直接代理支付' ? '主賬戶直接向收款單位付款' : '主賬戶經子賬戶再向收款單位付款'}</div>
            </button>
          ))}
        </div>
        <label className="block text-sm text-slate-600 mb-1.5">被代理企業（付款人顯示）</label>
        <select value={payer} onChange={e => setPayer(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4">
          {members.map(m => <option key={m}>{m}</option>)}
        </select>
        <label className="block text-sm text-slate-600 mb-1.5">收款單位</label>
        <input value={payee} onChange={e => setPayee(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4" />
        <label className="block text-sm text-slate-600 mb-1.5">金額（MOP）</label>
        <input value={amt} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) { setAmt(e.target.value); setOk(false) } }}
          inputMode="decimal" placeholder="0.00" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4" />
        <button onClick={submit} className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white font-medium rounded-lg py-2.5">提交代理支付</button>
        {ok && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />已校驗代理關係及限額並提交審批，審批通過後由集團主賬戶代理支付。</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">代理支付記錄（點擊查看資金路徑）</h3>
        <div className="space-y-2">
          {list.map(p => (
            <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpen(open === p.id ? null : p.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left">
                {open === p.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                <span className="font-mono text-xs text-slate-400">{p.id}</span>
                <span className="text-slate-700 text-sm font-medium">{p.payer}</span>
                <span className="text-slate-300 text-xs">→</span>
                <span className="text-slate-600 text-sm">{p.payee}</span>
                <span className="text-slate-800 text-sm font-medium">{fmt(p.amount, p.ccy)}</span>
                <span className="text-xs bg-purple-50 text-purple-700 rounded px-1.5 py-0.5">{p.mode}</span>
                <span className={`ml-auto text-xs rounded px-2 py-0.5 ${p.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : p.status === '跨行清算處理中' ? 'bg-blue-50 text-[#134b9e]' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span>
              </button>
              {open === p.id && (
                <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
                  {proxyPaySteps[p.id] ? (
                    <div className="space-y-2">
                      {proxyPaySteps[p.id].map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {s.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : s.status === 'doing' ? <span className="w-4 h-4 rounded-full border-2 border-[#134b9e] border-t-transparent animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />}
                          <span className="text-slate-700">{s.step}</span>
                          <span className="text-slate-400 ml-auto">{s.time}</span>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 pt-1">間接代理支付兩步劃轉設原子性控制：第二步失敗時自動將資金退回主賬戶並生成異常記錄。代理關係及資金路徑全程留痕，滿足反洗錢可追溯要求。</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">直接代理支付：主賬戶（{p.agent}）→ 收款單位，一步完成；付款人信息顯示為「{p.payer}」。</p>
                  )}
                  <div className="flex gap-3 mt-3">
                    <button className="flex items-center gap-1 text-xs border border-[#134b9e] text-[#134b9e] rounded-lg px-3 py-1.5 hover:bg-blue-50"><Receipt className="w-3.5 h-3.5" />電子回單</button>
                    <button className="flex items-center gap-1 text-xs border border-slate-200 text-slate-500 rounded-lg px-3 py-1.5 hover:border-[#134b9e] hover:text-[#134b9e]"><FileBarChart className="w-3.5 h-3.5" />三方／兩方信息報告</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ============ 信息加工 ============ */
function Reports() {
  const [got, setGot] = useState('')
  const [subs, setSubs] = useState<ReportSub[]>(reportSubs)
  const [rpt, setRpt] = useState(reportTypes[0])
  const [scope, setScope] = useState('全集團')
  const [cycle, setCycle] = useState('按日')
  const [push, setPush] = useState<string[]>(['網銀消息'])
  const [receiver, setReceiver] = useState('')
  const [added, setAdded] = useState(false)

  const togglePush = (x: string) => setPush(prev => prev.includes(x) ? prev.filter(p => p !== x) : [...prev, x])
  const addSub = () => {
    if (!receiver.trim() || push.length === 0) return
    setSubs(prev => [{ id: 'SUB' + String(prev.length + 1).padStart(2, '0'), report: rpt, scope, cycle, push, receiver, effDate: '2026-10-07', status: '生效中' }, ...prev])
    setAdded(true); setReceiver('')
  }

  return (
    <div className="space-y-4">
      {/* 訂閱設置 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1">報告訂閱設置</h3>
        <p className="text-xs text-slate-400 mb-4">系統按訂閱周期於日終批量生成報告並推送；報告文件保存期不少於 12 個月。三方報告供集團總部使用，兩方報告供成員單位記賬對賬使用，可按角色分別訂閱。</p>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">報告類型</label>
            <select value={rpt} onChange={e => setRpt(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs">
              {reportTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">報告範圍</label>
            <select value={scope} onChange={e => setScope(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs">
              {['單賬戶', '賬戶組 AG2026001', '全集團'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">生成週期</label>
            <select value={cycle} onChange={e => setCycle(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs">
              {['按日', '按周', '按月'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">接收人</label>
            <input value={receiver} onChange={e => { setReceiver(e.target.value); setAdded(false) }} placeholder="操作員／手機號／電郵" className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            推送方式：
            {['網銀消息', '電郵', '短訊'].map(x => (
              <label key={x} className="flex items-center gap-1"><input type="checkbox" checked={push.includes(x)} onChange={() => togglePush(x)} className="accent-[#134b9e]" />{x}</label>
            ))}
            <span className="text-slate-400">生效日期：下一自然日（2026-10-07）</span>
          </div>
          <button onClick={addSub} disabled={!receiver.trim() || push.length === 0}
            className="bg-[#0b2a5b] disabled:bg-slate-300 text-white rounded-lg px-4 py-2 text-xs hover:bg-[#134b9e]">新增訂閱</button>
        </div>
        {added && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />訂閱已建立，將於 2026-10-07 生效。</p>}
      </div>

      {/* 已訂閱 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">已訂閱報告</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">報告</th>
              <th className="font-medium">範圍</th>
              <th className="font-medium">週期</th>
              <th className="font-medium">推送</th>
              <th className="font-medium">接收人</th>
              <th className="font-medium">生效日</th>
              <th className="font-medium text-right pr-2">狀態</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 text-slate-700 text-xs font-medium">{s.report}</td>
                <td className="text-slate-500 text-xs">{s.scope}</td>
                <td className="text-slate-500 text-xs">{s.cycle}</td>
                <td><div className="flex gap-1">{s.push.map(p => <span key={p} className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{p}</span>)}</div></td>
                <td className="text-slate-500 text-xs">{s.receiver}</td>
                <td className="text-slate-400 text-xs">{s.effDate}</td>
                <td className="text-right pr-2"><span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 報告生成與下載 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1">報告查詢與下載</h3>
        <p className="text-xs text-slate-400 mb-4">資金流與信息流分離管理：統一支付提供三方／兩方信息報告，便於主賬戶與子賬戶分別記賬對賬；配套簿記賬戶交易報告單、內部計價報表及資金池信息實時查詢。</p>
        <div className="grid grid-cols-2 gap-3">
          {cashReports.map(r => (
            <div key={r.id} className="border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg bg-blue-50 text-[#134b9e] flex items-center justify-center shrink-0"><FileBarChart className="w-4 h-4" /></span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 truncate">{r.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{r.type} · 生成週期：{r.cycle}</div>
              </div>
              <button onClick={() => setGot(r.id)}
                className={`text-xs rounded-lg px-3 py-1.5 shrink-0 ${got === r.id ? 'bg-emerald-50 text-emerald-700' : 'border border-[#134b9e] text-[#134b9e] hover:bg-blue-50'}`}>
                {got === r.id ? '✓ 已加入下載' : '生成並下載'}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">報告支持 PDF / Excel 導出；三方信息報告包含主賬戶、收款單位、被代理企業三方完整信息，滿足雙邊記賬需求；歷史報告最長可查詢 12 個月。</p>
      </div>
    </div>
  )
}

/* ============ 賬戶看管 ============ */
function Watch() {
  const [rules, setRules] = useState<WatchRule[]>(watchRules)
  const [showForm, setShowForm] = useState(false)
  const [obj, setObj] = useState('集團主賬戶')
  const [wtype, setWtype] = useState('餘額臨界值')
  const [threshold, setThreshold] = useState('')
  const [notify, setNotify] = useState<string[]>(['網銀'])
  const [receivers, setReceivers] = useState('')
  const [added, setAdded] = useState(false)
  const toggle = (id: string) => setRules(prev => prev.map(r => (r.id === id ? { ...r, status: r.status === '生效中' ? '已暫停' : '生效中' } : r)))
  const toggleNotify = (x: string) => setNotify(prev => prev.includes(x) ? prev.filter(n => n !== x) : [...prev, x])

  const addRule = () => {
    if (!threshold.trim() || !receivers.trim() || notify.length === 0) return
    setRules(prev => [{
      id: 'WR' + String(prev.length + 1).padStart(2, '0'),
      acct: obj, type: wtype as WatchRule['type'], condition: threshold, notify: notify as WatchRule['notify'], status: '生效中',
    }, ...prev])
    setAdded(true); setThreshold(''); setReceivers('')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-800">看管規則</h3>
            <p className="text-xs text-slate-400 mt-1">賬面餘額、交易金額或交易對象觸發預設臨界值時，通過電郵、網銀消息或短訊通知；預警僅作通知用途，不攔截交易（攔截場景由限額管理實現）</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]"><Plus className="w-4 h-4" />新增規則</button>
        </div>

        {showForm && (
          <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-4 mb-4">
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">看管對象</label>
                <select value={obj} onChange={e => setObj(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white">
                  {['集團主賬戶', '全部賬戶', '賬戶組 AG2026001', '誠信物流（澳門）'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">看管類型</label>
                <select value={wtype} onChange={e => setWtype(e.target.value)} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white">
                  {['餘額上限', '餘額下限', '單筆交易金額', '交易對象', '交易頻率', '餘額臨界值', '大額交易', '交易對象預警'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">臨界值</label>
                <input value={threshold} onChange={e => { setThreshold(e.target.value); setAdded(false) }} placeholder="如：低於 MOP 500,000" className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">接收人（可多人）</label>
                <input value={receivers} onChange={e => { setReceivers(e.target.value); setAdded(false) }} placeholder="操作員／手機號／電郵" className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                通知方式：
                {['短訊', '電郵', '網銀'].map(x => (
                  <label key={x} className="flex items-center gap-1"><input type="checkbox" checked={notify.includes(x)} onChange={() => toggleNotify(x)} className="accent-[#134b9e]" />{x}</label>
                ))}
                <span className="text-slate-400">規則於下一自然日生效；當日已觸發之預警不受影響</span>
              </div>
              <button onClick={addRule} disabled={!threshold.trim() || !receivers.trim() || notify.length === 0}
                className="bg-[#0b2a5b] disabled:bg-slate-300 text-white rounded-lg px-4 py-2 text-xs hover:bg-[#134b9e]">提交（企業內部授權後生效）</button>
            </div>
            {added && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />規則已建立，將於下一自然日生效。</p>}
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">監控賬戶</th>
              <th className="font-medium">模型</th>
              <th className="font-medium">觸發條件</th>
              <th className="font-medium">通知方式</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700">{r.acct}</td>
                <td><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-0.5">{r.type}</span></td>
                <td className="text-slate-500 text-xs">{r.condition}</td>
                <td className="space-x-1">
                  {r.notify.map(n => <span key={n} className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{n}</span>)}
                </td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${r.status === '生效中' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{r.status}</span></td>
                <td className="text-right pr-2"><button onClick={() => toggle(r.id)} className="text-xs text-[#134b9e] hover:underline">{r.status === '生效中' ? '暫停' : '恢復'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">監測方式：交易類及對象類規則實時監測；餘額類及頻率類規則實時監測並於日終批量補充校驗。交易對象預警按黑白名單匹配：命中黑名單或超出白名單範圍之交易觸發預警。</p>
      </div>

      {/* 預警通知查詢 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">預警通知查詢</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">觸發時間</th>
              <th className="font-medium">賬戶</th>
              <th className="font-medium">看管類型</th>
              <th className="font-medium">臨界值</th>
              <th className="font-medium">實際值</th>
              <th className="font-medium">渠道</th>
              <th className="font-medium text-right pr-2">發送狀態</th>
            </tr>
          </thead>
          <tbody>
            {watchAlerts.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 text-slate-500 text-xs">{a.time}</td>
                <td className="text-slate-700 text-xs">{a.acct}</td>
                <td><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-1.5 py-0.5">{a.type}</span></td>
                <td className="text-slate-500 text-xs">{a.threshold}</td>
                <td className="text-slate-700 text-xs">{a.actual}</td>
                <td className="text-slate-500 text-xs">{a.channel}</td>
                <td className="text-right pr-2"><span className={`text-xs rounded px-2 py-0.5 ${a.status === '已送達' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">發送失敗之記錄進入異常監控，系統按渠道自動重試；重試仍失敗的生成工單由分行聯繫客戶更新接收人信息。</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-3">白名單（交易對象）</h4>
          <div className="space-y-2">
            {watchWhitelist.map(w => (
              <div key={w} className="flex items-center justify-between border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-700">
                {w}<button className="text-xs text-slate-400 hover:text-[#c8102e]">移除</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-[#134b9e] hover:underline">+ 添加白名單（支持批量導入）</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h4 className="text-sm font-bold text-slate-800 mb-3">黑名單（交易對象預警）</h4>
          <div className="space-y-2">
            {watchBlacklist.map(w => (
              <div key={w} className="flex items-center justify-between border border-red-100 bg-red-50/40 rounded-lg px-3 py-2 text-sm text-slate-700">
                {w}<button className="text-xs text-slate-400 hover:text-[#c8102e]">移除</button>
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs text-[#134b9e] hover:underline">+ 添加黑名單（支持批量導入）</button>
        </div>
      </div>
    </div>
  )
}

/* ============ 限額管理（賬戶組共享限額） ============ */
function Limit() {
  return (
    <div className="space-y-4">
      {/* 額度佔用 */}
      <div className="grid grid-cols-3 gap-4">
        {limitUsage.map(u => {
          const pct = u.limit > 0 ? u.used / u.limit * 100 : 0
          const warn = pct >= limitScheme.warnLine
          return (
            <div key={u.dim} className={`rounded-xl p-4 ${u.dim.startsWith('單筆') ? 'bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] text-white' : 'bg-white shadow-sm'}`}>
              <div className={`text-xs ${u.dim.startsWith('單筆') ? 'text-blue-200' : 'text-slate-400'}`}>{u.dim}</div>
              <div className={`text-xl font-bold mt-1.5 ${u.dim.startsWith('單筆') ? '' : 'text-slate-800'}`}>{fmt(u.limit, 'MOP')}</div>
              {u.used > 0 ? (
                <>
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${warn ? 'bg-amber-500' : 'bg-[#134b9e]'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${warn ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                    {warn && <AlertTriangle className="w-3 h-3" />}
                    已用 {fmt(u.used)}（{pct.toFixed(1)}%）· 剩餘 {fmt(u.limit - u.used)}
                    {warn && ` · 達預警線 ${limitScheme.warnLine}%`}
                  </div>
                </>
              ) : (
                <div className="text-[10px] mt-1.5 text-blue-200">{u.note}</div>
              )}
              {u.used > 0 && <div className="text-[10px] text-slate-400 mt-0.5">{u.note}</div>}
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800">維度化支付限額</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">超限處理方式：<span className="text-[#134b9e] font-medium">{limitScheme.overRule}</span></span>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" defaultChecked={groupLimit.shared} className="accent-[#134b9e]" />
              賬戶組共享限額（多賬戶共用一個支付限額）
            </label>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">限額維度</th>
              <th className="font-medium">設定值</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {groupLimitDims.map(d => (
              <tr key={d.dim} className="border-b border-slate-100">
                <td className="py-3.5 text-slate-700 font-medium w-44">{d.dim}</td>
                <td className="text-slate-600 text-xs">{d.detail}</td>
                <td className="text-right pr-2"><button className="text-xs text-[#134b9e] hover:underline">調整</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">限額方案由客戶與我行協商確定，臨櫃申請設定或調整，複核後於約定生效日生效。{limitScheme.scope}；同一交易涉及多維度限額時逐項校驗，全部通過方可執行；額度佔用達預警線（{limitScheme.warnLine}%）時後台生成提示供客戶經理跟進；調高超標準限額需經銀行審批。</p>
      </div>
    </div>
  )
}
