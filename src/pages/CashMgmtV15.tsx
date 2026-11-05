import { useMemo, useState, type ReactNode } from 'react'
import {
  groupCompanies, internalLedger, acctGroups, poolView, execReports, watchAlerts,
  limitUsage, groupLimitDims, cashTransfers, interestAllocs, proxyPays, fmt,
} from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import {
  Vault, Eye, ArrowUpDown, Percent, HandCoins, FileBarChart, BellRing, Gauge,
  Building2, ArrowUpFromLine, Plus, CheckCircle2, FileSignature,
  Download, ChevronDown, ChevronRight, Receipt, ArrowRight, Coins,
  ShieldAlert, Search, FileCheck2,
} from 'lucide-react'

const MENU = [
  { key: 'view', label: '多企業資金視圖', icon: Eye },
  { key: 'signup', label: '簽約與賬戶組', icon: FileSignature },
  { key: 'watch', label: '賬戶看管', icon: BellRing },
  { key: 'limit', label: '限額管理', icon: Gauge },
  { key: 'poolview', label: '實體資金池', icon: Vault },
  { key: 'pool', label: '自動歸集下撥', icon: ArrowUpDown },
  { key: 'transfer', label: '主動調撥', icon: ArrowUpFromLine },
  { key: 'interest', label: '集團綜合計息', icon: Percent },
  { key: 'proxy', label: '統一支付', icon: HandCoins },
  { key: 'report', label: '信息加工與報告', icon: FileBarChart },
  { key: 'fees', label: '收費管理', icon: Coins },
  { key: 'exceptions', label: '異常與對賬', icon: ShieldAlert },
] as const

type SecKey = typeof MENU[number]['key']
type Tone = 'green' | 'amber' | 'red' | 'blue' | 'slate' | 'purple'

function Badge({ children, tone = 'slate' }: { children: ReactNode; tone?: Tone }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-[#c8102e]', blue: 'bg-blue-50 text-[#134b9e]',
    slate: 'bg-slate-100 text-slate-500', purple: 'bg-purple-50 text-purple-700',
  }
  return <span className={`inline-flex text-xs rounded px-2 py-0.5 whitespace-nowrap ${styles[tone]}`}>{children}</span>
}

function Card({ title, desc, action, children, className = '' }: { title?: string; desc?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`bg-white rounded-xl shadow-sm p-5 ${className}`}>
    {(title || action) && <div className="flex items-start justify-between gap-4 mb-4">
      <div>{title && <h3 className="font-bold text-slate-800">{title}</h3>}{desc && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>}</div>{action}
    </div>}{children}
  </section>
}

function Th({ children, right = false }: { children: ReactNode; right?: boolean }) {
  return <th className={`py-2.5 font-medium ${right ? 'text-right pr-2' : ''}`}>{children}</th>
}

function Notice({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' }) {
  const styles = { blue: 'bg-blue-50 text-[#134b9e] border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', amber: 'bg-amber-50 text-amber-800 border-amber-100' }
  return <div className={`border rounded-lg px-3 py-2.5 text-xs leading-relaxed ${styles[tone]}`}>{children}</div>
}

const products = [
  ['多企業資金視圖', '集團關係生效；各成員查詢授權完整', '生效中'],
  ['賬戶看管', '產品及賬戶看管授權生效，可獨立簽約', '生效中'],
  ['現金管理限額', '集團及賬戶組生效；各類限額從嚴疊加', '生效中'],
  ['實體資金池', '兩層、單主、同幣種；主子賬戶授權完整', '生效中'],
  ['自動歸集下撥', '資金池生效；自動規則通過初始化校驗', '生效中'],
  ['主動調撥', '資金池及調撥授權生效；審批、限額及風控可用', '生效中'],
  ['集團綜合計息', '指定同幣種資金池；計息及本金歸集還原授權完整', '生效中'],
  ['統一支付', '資金池及代理關係生效；支付、影像及風控可用', '生效中'],
  ['信息加工與報告', '依附已生效數據來源產品；訂閱範圍不超授權', '待生效'],
]

const lifecycle = [
  ['草稿／待複核', 'CM20261027001', '新增成員及查詢授權', '總行經辦陳大文', 'amber'],
  ['待生效', 'CM20261026003', '信息加工與報告', '2026-10-28 初始化', 'blue'],
  ['變更待生效', 'CM20261025002', '歸集執行時點變更', '舊版本有效至 2026-10-29', 'purple'],
  ['已暫停', 'CM20261024004', '誠信（珠海）子賬戶歸集', '核心賬戶狀態異常', 'red'],
]

export default function CashMgmtV15() {
  const [sec, setSec] = useState<SecKey>('view')
  return <div className="relative z-10 max-w-[1440px] mx-auto">
    <Breadcrumb items={['現金管理']} />
    <div className="mt-4 mb-4">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Vault className="w-5 h-5 text-[#134b9e]" />現金管理 <span className="text-xs font-normal text-slate-400">需求書 V1.5 功能演示</span></h2>
      <p className="text-xs text-slate-400 mt-1">嵌入企業網銀 · 逐項產品簽約 · 統一身份、權限、審批、限額及風控 · 賬務結果以 BANCS 為準</p>
    </div>
    <div className="flex gap-5 items-start">
      <nav className="w-56 shrink-0 bg-white rounded-xl shadow-sm p-2 space-y-1 sticky top-4">
        {MENU.map(m => { const Icon = m.icon; return <button key={m.key} onClick={() => setSec(m.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${sec === m.key ? 'bg-[#0b2a5b] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="w-4 h-4" />{m.label}</button> })}
        <div className="border-t border-slate-100 mt-2 pt-3 px-3 pb-2 text-[10px] text-slate-400 leading-relaxed">查詢、調撥、支付及代理權限分別授權，不由集團關係自動推導。</div>
      </nav>
      <div className="flex-1 min-w-0">
        {sec === 'view' && <FundView />}
        {sec === 'signup' && <Signup />}
        {sec === 'watch' && <Watch />}
        {sec === 'limit' && <Limit />}
        {sec === 'poolview' && <PoolView />}
        {sec === 'pool' && <Pool />}
        {sec === 'transfer' && <ActiveTransfer />}
        {sec === 'interest' && <Interest />}
        {sec === 'proxy' && <ProxyPaySec />}
        {sec === 'report' && <Reports />}
        {sec === 'fees' && <Fees />}
        {sec === 'exceptions' && <Exceptions />}
      </div>
    </div>
  </div>
}

function FundView() {
  const [company, setCompany] = useState('全部企業')
  const [ccy, setCcy] = useState('全部幣種')
  const [keyword, setKeyword] = useState('')
  const [drill, setDrill] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState('')
  const visible = groupCompanies.filter(g => (company === '全部企業' || g.id === company) && (!keyword || g.name.includes(keyword)))
  const totals = useMemo(() => {
    const result: Record<string, number> = {}
    visible.forEach(g => g.accts.forEach(a => { if (ccy === '全部幣種' || ccy === a.ccy) result[a.ccy] = (result[a.ccy] || 0) + a.balance }))
    return Object.entries(result)
  }, [visible, ccy])
  const selected = groupCompanies.find(g => g.id === drill)
  return <div className="space-y-4">
    <div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-5 text-white flex items-end justify-between gap-6">
      <div><div className="text-xs text-blue-200">獲授權企業可用資金 · 按幣種分列</div><div className="flex gap-6 mt-2">{totals.map(([c, n]) => <div key={c}><div className="text-2xl font-bold">{fmt(n, c)}</div><div className="text-[10px] text-blue-200 mt-0.5">不作默認跨幣種折算</div></div>)}</div></div>
      <div className="text-right text-xs text-blue-200"><div>數據時間：2026-10-27 11:30</div><div className="mt-1">來源：BANCS 可用餘額 · <span className="text-emerald-300">連線正常</span></div></div>
    </div>
    <Card>
      <div className="grid grid-cols-4 gap-3">
        <label className="text-xs text-slate-500">集團<select className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700"><option>誠信企業集團</option></select></label>
        <label className="text-xs text-slate-500">成員企業<select value={company} onChange={e => setCompany(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700"><option>全部企業</option>{groupCompanies.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
        <label className="text-xs text-slate-500">幣種<select value={ccy} onChange={e => setCcy(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700"><option>全部幣種</option><option>MOP</option><option>HKD</option><option>CNY</option></select></label>
        <label className="text-xs text-slate-500">關鍵字<div className="mt-1 relative"><Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" /><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="企業名稱" className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm" /></div></label>
      </div>
    </Card>
    <div className="grid grid-cols-2 gap-4">
      {visible.map(g => <button key={g.id} onClick={() => setDrill(g.id)} className="text-left bg-white rounded-xl shadow-sm p-4 border-2 border-transparent hover:border-[#134b9e] transition-colors">
        <div className="flex justify-between"><Badge tone={g.relation === '牽頭公司' ? 'blue' : 'slate'}>{g.relation}</Badge><Badge tone={g.agreement === '已簽署授權協議' ? 'green' : 'amber'}>{g.agreement}</Badge></div>
        <div className="text-sm font-medium text-slate-800 mt-2 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" />{g.name}</div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">{Object.entries(g.accts.reduce<Record<string, number>>((m, a) => { if (ccy === '全部幣種' || ccy === a.ccy) m[a.ccy] = (m[a.ccy] || 0) + a.balance; return m }, {})).map(([c, n]) => <span key={c} className="text-lg font-bold text-slate-800">{fmt(n, c)}</span>)}</div>
        <div className="flex gap-4 mt-2 text-xs text-slate-500"><span>近 7 日收 <b className="text-emerald-600">{fmt(g.income7d)}</b></span><span>支 <b className="text-[#c8102e]">{fmt(g.expense7d)}</b></span></div>
      </button>)}
    </div>
    {selected && <Card title={`賬戶穿透查詢 — ${selected.name}`} desc="可查交易明細、資金池批次、調撥、計息及統一支付原始記錄；顯示範圍受操作員賬戶權限控制。" action={<button onClick={() => setDrill(null)} className="text-xs text-slate-400">收起</button>}>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>賬戶</Th><Th>賬號</Th><Th>狀態</Th><Th right>可用餘額</Th><Th right>操作</Th></tr></thead><tbody>
        {selected.accts.filter(a => ccy === '全部幣種' || a.ccy === ccy).map(a => <tr key={a.no} className="border-b border-slate-100"><td className="py-3 text-slate-700">{a.name}</td><td className="font-mono text-xs text-slate-400">{a.no}</td><td><Badge tone="green">正常</Badge></td><td className="text-right font-medium">{fmt(a.balance, a.ccy)}</td><td className="text-right pr-2 space-x-2"><button className="text-xs text-[#134b9e]">交易明細</button><button className="text-xs text-[#134b9e]">執行記錄</button><button className="text-xs text-[#134b9e]">回單</button></td></tr>)}
      </tbody></table>
    </Card>}
    <Card title="現金管理執行與內部往來" desc="由匯總記錄穿透至批次及原始交易，金額均標明幣種。" action={<div className="flex gap-2">{['Excel', 'PDF'].map(x => <button key={x} onClick={() => setDownloaded(x)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-500"><Download className="w-3 h-3 inline mr-1" />{downloaded === x ? `已生成 ${x}` : `導出 ${x}`}</button>)}</div>}>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>業務編號</Th><Th>付款方 → 收款方</Th><Th>類型</Th><Th right>實際金額</Th><Th>時間</Th><Th right>核心流水</Th></tr></thead><tbody>{internalLedger.map(r => <tr key={r.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs text-slate-500">{r.id}</td><td>{r.from} → {r.to}</td><td><Badge tone="blue">{r.type}</Badge></td><td className="text-right font-medium">{fmt(r.amount, r.ccy)}</td><td className="text-xs text-slate-500">{r.time}</td><td className="text-right pr-2 font-mono text-xs text-slate-400">{r.ref}</td></tr>)}</tbody></table>
    </Card>
  </div>
}

function Signup() {
  const [tab, setTab] = useState<'products' | 'groups' | 'lifecycle'>('products')
  const [selected, setSelected] = useState<string | null>(null)
  return <div className="space-y-4">
    <Card title="逐項產品簽約與生命周期" desc="客戶線下逐項勾選產品並提交法人授權；分行受理，總行經辦複核分離。線上頁面只作配置反顯及結果查詢，不替代線下法律文件。">
      <div className="flex items-center gap-1.5 flex-wrap">{['線下申請及授權', '分行受理', '總行經辦錄入', '複核鎖定版本', '下一銀行工作日起待生效', '初始化再校驗', '結果通知'].map((f, i, a) => <span key={f} className="flex items-center gap-1.5"><span className="text-xs bg-blue-50 text-[#134b9e] rounded-lg px-2.5 py-1.5">{f}</span>{i < a.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}</span>)}</div>
    </Card>
    <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1.5 w-fit">{([['products', '產品目錄與依賴'], ['groups', '集團及賬戶組'], ['lifecycle', '狀態與版本']] as const).map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg text-sm ${tab === k ? 'bg-[#0b2a5b] text-white' : 'text-slate-500'}`}>{l}</button>)}</div>
    {tab === 'products' && <Card title="九項產品獨立簽約" desc="不要求購買固定產品包。依賴關係於錄入、複核、生效初始化及每次交易執行前重複校驗。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>產品</Th><Th>生效前提及依賴</Th><Th>狀態</Th><Th right>配置</Th></tr></thead><tbody>{products.map(([p, dep, st]) => <tr key={p} className="border-b border-slate-100"><td className="py-3 font-medium text-slate-700">{p}</td><td className="text-xs text-slate-500">{dep}</td><td><Badge tone={st === '生效中' ? 'green' : 'amber'}>{st}</Badge></td><td className="text-right pr-2"><button onClick={() => setSelected(selected === p ? null : p)} className="text-xs text-[#134b9e]">查看授權與版本</button></td></tr>)}</tbody></table>{selected && <div className="mt-4"><Notice>當前查看：{selected} · 版本 V3 · 授權文件索引 AUTH-2026-0188 · 經辦：梁梓鋒 · 複核：黃麗珍 · 生效區間：2026-08-01 起。未明確列示的功能或賬戶不得預設勾選。</Notice></div>}</Card>}
    {tab === 'groups' && <>{acctGroups.map(g => <Card key={g.id} title={`${g.name} · ${g.id}`} desc="兩層、單主賬戶、同幣種；主賬戶屬牽頭公司。新增、退出或主賬戶更換均保存新版本及生效區間。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>賬戶</Th><Th>成員企業</Th><Th>角色</Th><Th>逐項簽約產品</Th><Th>版本／生效日</Th><Th right>狀態</Th></tr></thead><tbody>{g.members.map(m => <tr key={m.no} className="border-b border-slate-100"><td className="py-3">{m.acct}<div className="font-mono text-[10px] text-slate-400">{m.no}</div></td><td className="text-xs">{m.company}</td><td><Badge tone="blue">{m.role}</Badge></td><td><div className="flex flex-wrap gap-1">{m.products.map(p => <Badge key={p}>{p}</Badge>)}</div></td><td className="text-xs">V3 · {m.effDate}</td><td className="text-right pr-2"><Badge tone={m.status === '已生效' ? 'green' : 'amber'}>{m.status}</Badge></td></tr>)}</tbody></table></Card>)}<Notice tone="amber">同一賬戶在同一動賬產品中只能屬於一個生效賬戶組；綜合計息池不得疊加普通自動歸集下撥規則。</Notice></>}
    {tab === 'lifecycle' && <><Card title="狀態與版本台賬"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>狀態</Th><Th>申請編號</Th><Th>事項</Th><Th>當前處理</Th><Th right>操作</Th></tr></thead><tbody>{lifecycle.map(([st, id, item, note, tone]) => <tr key={id} className="border-b border-slate-100"><td className="py-3"><Badge tone={tone as Tone}>{st}</Badge></td><td className="font-mono text-xs">{id}</td><td>{item}</td><td className="text-xs text-slate-500">{note}</td><td className="text-right pr-2"><button className="text-xs text-[#134b9e]">影響清單</button></td></tr>)}</tbody></table></Card><div className="grid grid-cols-3 gap-4">{[['一般變更', '通知接收人、報告訂閱、展示偏好', '留存版本及日誌'], ['重要變更', '規則、限額、執行時點、收費、計息分配', '總行複核後按約定日期生效'], ['重大變更', '主賬戶、成員退出、代理關係、牽頭公司', '重新取得法人授權並檢查在途交易']].map(([t, d, r]) => <Card key={t} title={t}><p className="text-xs text-slate-500 leading-relaxed">{d}</p><p className="text-xs text-[#134b9e] mt-3">{r}</p></Card>)}</div><Notice tone="amber">初始化失敗保持待生效並生成異常，不自動順延生效日；恢復須重新校驗並由總行人工確認。解約前須列明在途交易、待還原本金、未分配利息及未結費用。</Notice></>}
  </div>
}

function Watch() {
  const [show, setShow] = useState(false)
  const [kind, setKind] = useState('餘額看管')
  const [threshold, setThreshold] = useState('')
  const [rules, setRules] = useState([
    { id: 'WR01', acct: '集團主賬戶', type: '餘額看管', condition: '低於 MOP 1,000,000', notify: '網銀、短訊', status: '生效中' },
    { id: 'WR02', acct: '全部已授權賬戶', type: '單筆金額看管', condition: '單筆支出達 MOP 500,000', notify: '電郵、短訊', status: '生效中' },
    { id: 'WR03', acct: '集團主賬戶', type: '交易對象看管', condition: '命中指定對手名單', notify: '網銀', status: '生效中' },
    { id: 'WR04', acct: '賬戶組 AG2026001', type: '交易頻率看管', condition: '自然日超過 20 筆或累計 MOP 2,000,000', notify: '網銀、電郵', status: '生效中' },
  ])
  const add = () => {
    if (!threshold.trim()) return
    setRules(p => [{ id: `WR${String(p.length + 1).padStart(2, '0')}`, acct: '集團主賬戶', type: kind, condition: threshold, notify: '網銀', status: '企業審批中' }, ...p])
    setThreshold(''); setShow(false)
  }
  return <div className="space-y-4">
    <Card title="賬戶看管規則" desc="監測餘額、單筆金額、交易對象及交易頻率。預警只作通知，不改變交易結果；交易限制由限額、企網審批及事中風控處理。" action={<button onClick={() => setShow(!show)} className="bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm"><Plus className="w-4 h-4 inline mr-1" />新增規則</button>}>
      {show && <div className="mb-4 grid grid-cols-4 gap-3 bg-blue-50/50 border border-blue-100 rounded-xl p-4"><label className="text-xs text-slate-500">看管對象<select className="mt-1 w-full border rounded-lg px-2 py-2 bg-white"><option>集團主賬戶</option><option>全部已授權賬戶</option></select></label><label className="text-xs text-slate-500">看管類型<select value={kind} onChange={e => setKind(e.target.value)} className="mt-1 w-full border rounded-lg px-2 py-2 bg-white">{['餘額看管', '單筆金額看管', '交易對象看管', '交易頻率看管'].map(x => <option key={x}>{x}</option>)}</select></label><label className="text-xs text-slate-500">觸發條件<input value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="輸入幣種、臨界值及方向" className="mt-1 w-full border rounded-lg px-2 py-2 bg-white" /></label><div className="flex items-end"><button onClick={add} disabled={!threshold.trim()} className="w-full bg-[#134b9e] disabled:bg-slate-300 text-white rounded-lg py-2 text-xs">提交企業內部審批</button></div></div>}
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>規則</Th><Th>賬戶範圍</Th><Th>看管類型</Th><Th>條件</Th><Th>通知</Th><Th right>狀態</Th></tr></thead><tbody>{rules.map(r => <tr key={r.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs">{r.id}</td><td>{r.acct}</td><td><Badge tone="blue">{r.type}</Badge></td><td className="text-xs text-slate-500">{r.condition}</td><td className="text-xs">{r.notify}</td><td className="text-right pr-2"><Badge tone={r.status === '生效中' ? 'green' : 'amber'}>{r.status}</Badge></td></tr>)}</tbody></table>
    </Card>
    <Card title="預警通知查詢" desc="唯一預警編號關聯規則版本、實際值、觸發時間、接收人及發送結果；失敗通知進入統一異常台賬並防重發送。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>預警編號／時間</Th><Th>賬戶</Th><Th>類型</Th><Th>實際值</Th><Th>渠道</Th><Th right>結果</Th></tr></thead><tbody>{watchAlerts.map(a => <tr key={a.id} className="border-b border-slate-100"><td className="py-3 text-xs"><div className="font-mono">{a.id}</div><div className="text-slate-400">{a.time}</div></td><td className="text-xs">{a.acct}</td><td><Badge tone="blue">{a.type}</Badge></td><td className="text-xs">{a.actual}</td><td className="text-xs">{a.channel}</td><td className="text-right pr-2"><Badge tone={a.status === '已送達' ? 'green' : 'amber'}>{a.status}</Badge></td></tr>)}</tbody></table></Card>
  </div>
}

function Limit() {
  return <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">{limitUsage.map((u, i) => { const pct = u.used / u.limit * 100; return <div key={u.dim} className={`rounded-xl p-4 ${i === 0 ? 'bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] text-white' : 'bg-white shadow-sm'}`}><div className={`text-xs ${i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>{u.dim}</div><div className="text-xl font-bold mt-1.5">{fmt(u.limit, 'MOP')}</div>{u.used > 0 && <><div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${pct >= 80 ? 'bg-amber-500' : 'bg-[#134b9e]'}`} style={{ width: `${pct}%` }} /></div><div className="text-[10px] text-slate-400 mt-2">已用 {fmt(u.used)} · 剩餘 {fmt(u.limit - u.used)}</div></>}</div> })}</div>
    <Card title="維度化限額與版本" desc="以賬戶組為對象，補充企網操作員、賬戶、渠道及交易類型限額；逐項校驗並從嚴執行，任何一項不足或不可用均不得放行。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>限額維度</Th><Th>設定值</Th><Th>版本／生效區間</Th><Th right>審批記錄</Th></tr></thead><tbody>{groupLimitDims.map((d, i) => <tr key={d.dim} className="border-b border-slate-100"><td className="py-3.5 font-medium w-44">{d.dim}</td><td className="text-xs text-slate-600">{d.detail}</td><td className="text-xs">V{4 - i} · 2026-10-01 起</td><td className="text-right pr-2"><button className="text-xs text-[#134b9e]">查看</button></td></tr>)}</tbody></table></Card>
    <Notice>主動調撥及統一支付同時校驗權限、企網審批、賬戶限額、現金管理限額及風控。同一東主或同一集團不自動免除審批或提高限額；已簽約自動歸集下撥不佔用操作員限額。</Notice>
  </div>
}

function PoolView() {
  const total = poolView.master.balance + poolView.subs.reduce((s, x) => s + x.balance, 0)
  return <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4"><div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white"><div className="text-xs text-blue-200">同幣種資金池彙總可用餘額</div><div className="text-2xl font-bold mt-1.5">{fmt(total, 'MOP')}</div><div className="text-xs text-blue-200 mt-1">BANCS · 2026-10-27 11:30</div></div><Card title="結構與版本"><div className="text-sm">AG2026001 · V3 · 生效中</div><div className="text-xs text-slate-500 mt-2">兩層 · 單主 · MOP · 不允許跨幣種</div></Card><Card title="當日資金流向"><div className="text-sm text-emerald-600">歸集流入 {fmt(532451.1, 'MOP')}</div><div className="text-sm text-[#134b9e] mt-1">下撥流出 {fmt(230000, 'MOP')}</div></Card></div>
    <Card title="主、子賬戶結構" desc="實體資金池不是獨立會計賬戶，不改變各成員資金所有權及賬務責任。主賬戶異常時受影響產品整批停止；子賬戶異常按已簽約策略處理。">
      <div className="flex items-stretch gap-4"><div className="w-72 bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white"><div className="text-xs text-blue-200">唯一主賬戶 · 牽頭公司</div><div className="text-sm mt-1">{poolView.master.acct}</div><div className="text-xl font-bold mt-3">{fmt(poolView.master.balance, 'MOP')}</div><Badge tone="green">正常</Badge></div><div className="flex-1 grid grid-cols-3 gap-3">{poolView.subs.map((s, i) => <div key={s.acct} className="border border-slate-200 rounded-xl p-4"><div className="text-xs text-slate-400">直接子賬戶</div><div className="text-sm font-medium mt-1">{s.acct}</div><div className="text-lg font-bold mt-3">{fmt(s.balance, 'MOP')}</div><div className="mt-2"><Badge tone={i === 2 ? 'amber' : 'green'}>{i === 2 ? '待生效' : '正常'}</Badge></div></div>)}</div></div>
    </Card>
    <Notice>一個集團可建立多個資金池，但不得形成多層級或跨幣種池。主賬戶或牽頭公司變更屬重大變更，未完成新結構生效前不得接收新動賬指令。</Notice>
  </div>
}

const autoRules = [
  { id: 'CR01', acct: '誠信物流（澳門）', dir: '歸集', mode: '差額', param: '保留 MOP 50,000，超出且可動用部分上劃', time: '每日 21:00', status: '生效中' },
  { id: 'CR02', acct: '誠信餐飲管理（澳門）', dir: '歸集', mode: '全額', param: '執行時核心可用餘額全額上劃', time: '每日 21:00', status: '生效中' },
  { id: 'CR03', acct: '誠信（珠海）貿易', dir: '歸集', mode: '取整', param: '按 MOP 10,000 為單位，不足一單位不執行', time: '每週一至週五 15:00', status: '已暫停' },
  { id: 'AR01', acct: '誠信物流（澳門）', dir: '下撥', mode: '定額', param: '固定下撥 MOP 150,000', time: '每週一 08:00', status: '生效中' },
  { id: 'AR02', acct: '誠信餐飲管理（澳門）', dir: '下撥', mode: '差額補至目標', param: '補至目標可用餘額 MOP 200,000', time: '每日 08:00', status: '生效中' },
  { id: 'AR03', acct: '誠信（珠海）貿易', dir: '下撥', mode: '零餘額組合', param: '先全額歸集，再按目標下撥；同一批次關聯', time: '每日 08:30', status: '生效中' },
]

function Pool() {
  const [open, setOpen] = useState<string | null>(execReports[0].id)
  const [receipt, setReceipt] = useState('')
  const [applied, setApplied] = useState('')
  return <div className="space-y-4">
    <Card title="自動歸集下撥規則" desc="每個賬戶每個方向僅一組生效規則；按參數化時點、日曆及窗口執行，不提供實時聯動下撥或以收定支。21:00／08:00 僅為配置示例。" action={<button onClick={() => setApplied('新增規則草稿已建立，須核對授權並由總行複核後按約定日期生效。')} className="bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm"><Plus className="w-4 h-4 inline mr-1" />新增規則</button>}>
      {applied && <div className="mb-3"><Notice tone="green">{applied}</Notice></div>}
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>賬戶</Th><Th>方向／模式</Th><Th>計算參數</Th><Th>執行日曆</Th><Th>狀態</Th><Th right>操作</Th></tr></thead><tbody>{autoRules.map(r => <tr key={r.id} className="border-b border-slate-100"><td className="py-3">{r.acct}</td><td><Badge tone={r.dir === '歸集' ? 'blue' : 'green'}>{r.dir} · {r.mode}</Badge></td><td className="text-xs text-slate-500">{r.param}</td><td className="text-xs">{r.time}</td><td><Badge tone={r.status === '生效中' ? 'green' : 'slate'}>{r.status}</Badge></td><td className="text-right pr-2"><button onClick={() => setApplied(`${r.id} 變更申請已建立，舊版本在新版本生效前繼續有效。`)} className="text-xs text-[#134b9e]">申請變更</button></td></tr>)}</tbody></table>
    </Card>
    <Card title="批次執行報告" desc="逐戶保存規則版本、應執行及實際金額、核心流水與結果；已成功明細不自動沖回，結果未明先按原業務編號查證。">
      <div className="space-y-2">{execReports.map(r => <div key={r.id} className="border border-slate-200 rounded-xl overflow-hidden"><button onClick={() => setOpen(open === r.id ? null : r.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left">{open === r.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}<span className="font-mono text-xs">{r.id}</span><Badge tone={r.type === '歸集' ? 'blue' : 'green'}>{r.type}</Badge><span className="text-xs text-slate-500">{r.runTime}</span><span className="ml-auto"><Badge tone={r.result === '成功' ? 'green' : 'amber'}>{r.result}</Badge></span></button>{open === r.id && <div className="border-t bg-slate-50/50 px-4 py-3"><table className="w-full text-sm"><thead><tr className="text-xs text-slate-400 text-left"><Th>賬戶</Th><Th right>應執行</Th><Th right>實際成功</Th><Th>結果</Th><Th>核心流水／原因</Th></tr></thead><tbody>{r.details.map(x => <tr key={x.acct} className="border-b border-slate-100"><td className="py-2.5">{x.acct}</td><td className="text-right">{fmt(x.amount, x.ccy)}</td><td className="text-right font-medium">{x.result === '成功' ? fmt(x.amount, x.ccy) : '—'}</td><td><Badge tone={x.result === '成功' ? 'green' : 'amber'}>{x.result}</Badge></td><td className="text-xs text-slate-400">{x.result === '成功' ? `BANCS-${r.id}-${x.acct.slice(-2)}` : x.note}</td></tr>)}</tbody></table><button onClick={() => setReceipt(r.id)} className="mt-3 text-xs border border-[#134b9e] text-[#134b9e] rounded-lg px-3 py-1.5"><Receipt className="w-3.5 h-3.5 inline mr-1" />{receipt === r.id ? '回單已加入下載' : '下載成功交易電子回單'}</button></div>}</div>)}</div>
    </Card>
    <Notice tone="amber">主賬戶異常或下撥可用資金不足時整批不執行。子賬戶異常按簽約策略「跳過該戶」或「整批暫停」；核心超時不得盲目重發，續跑不重做已成功明細。</Notice>
  </div>
}

type TransferRow = typeof cashTransfers[number] & { purpose?: string }
function ActiveTransfer() {
  const [list, setList] = useState<TransferRow[]>(cashTransfers.map(x => ({ ...x, purpose: '集團流動性調配' })))
  const [dir, setDir] = useState<'下撥' | '上劃'>('下撥')
  const [target, setTarget] = useState('誠信物流（澳門）')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [message, setMessage] = useState('')
  const members = groupCompanies.filter(g => g.relation === '成員單位').map(g => g.name)
  const n = Number(amount) || 0
  const remaining = limitUsage[1].limit - limitUsage[1].used
  const invalid = n <= 0 || n > remaining || n > 2863450.55 || !purpose.trim()
  const submit = () => {
    if (invalid) return
    const id = `CT20261027${String(list.length + 1).padStart(3, '0')}`
    setList(p => [{ id, dir, from: dir === '下撥' ? '集團主賬戶' : target, to: dir === '下撥' ? target : '集團主賬戶', amount: n, ccy: 'MOP', time: '2026-10-27 14:30', status: '付款企業審批中', operator: '陳大文（錄入員）', purpose }, ...p])
    setMessage(`${id} 已提交付款企業既有審批鏈；審批後將再次校驗餘額、限額、AML 及事中風控。`)
    setAmount(''); setPurpose('')
  }
  return <div className="space-y-4">
    <div className="grid grid-cols-5 gap-4"><Card title="發起主動調撥" desc="僅限生效資金池內主賬戶與直接子賬戶之間的同幣種單筆調撥，不得用於集團外付款。" className="col-span-2">
      <label className="text-xs text-slate-500">資金池<select className="mt-1 mb-3 w-full border rounded-lg px-3 py-2 text-sm"><option>AG2026001 澳門元流動性賬戶組</option></select></label>
      <div className="grid grid-cols-2 gap-2 mb-3">{(['下撥', '上劃'] as const).map(x => <button key={x} onClick={() => setDir(x)} className={`py-2 rounded-lg border text-sm ${dir === x ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : ''}`}>{x === '下撥' ? '主賬戶 → 直接子賬戶' : '直接子賬戶 → 主賬戶'}</button>)}</div>
      <label className="text-xs text-slate-500">成員賬戶<select value={target} onChange={e => setTarget(e.target.value)} className="mt-1 mb-3 w-full border rounded-lg px-3 py-2 text-sm">{members.map(x => <option key={x}>{x}</option>)}</select></label>
      <div className="text-xs text-slate-400 mb-3">幣種 MOP · 可用餘額 {fmt(2863450.55, 'MOP')} · BANCS 11:30</div>
      <label className="text-xs text-slate-500">金額<input value={amount} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmount(e.target.value) }} inputMode="decimal" placeholder="0.00" className="mt-1 mb-2 w-full border rounded-lg px-3 py-2 text-sm" /></label>
      {n > remaining && <p className="text-xs text-[#c8102e] mb-2">超出當日剩餘限額，不得提交。</p>}{n > 2863450.55 && <p className="text-xs text-[#c8102e] mb-2">超出付款賬戶可用餘額，不得提交。</p>}
      <label className="text-xs text-slate-500">用途（必填）<textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="供審批、審計及對賬使用" className="mt-1 mb-3 w-full border rounded-lg px-3 py-2 text-sm h-20" /></label>
      <button onClick={submit} disabled={invalid} className="w-full bg-[#c8102e] disabled:bg-slate-300 text-white rounded-lg py-2.5 text-sm">提交付款企業審批</button>
      {message && <div className="mt-3"><Notice tone="green">{message}</Notice></div>}
    </Card><div className="col-span-3 space-y-4"><Card title="執行控制"><div className="space-y-3">{['操作員權限、資金池及主子關係校驗', '提交付款企業既有審批鏈，收款企業不重複審批', '審批後再次校驗餘額、各類限額、AML 及事中風控', '以唯一申請編號發送 BANCS，返回核心流水及電子回單'].map((x, i) => <div key={x} className="flex items-center gap-3 text-xs"><span className="w-6 h-6 rounded-full bg-blue-50 text-[#134b9e] flex items-center justify-center font-bold">{i + 1}</span>{x}</div>)}</div></Card><Notice tone="amber">審批後修改賬戶、金額、幣種或用途，原審批失效並須重新提交。結果未明時保持處理中並查證原指令，不得重複扣賬。</Notice></div></div>
    <Card title="調撥記錄"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>申請編號</Th><Th>方向</Th><Th>付款方 → 收款方</Th><Th>用途</Th><Th right>金額</Th><Th>狀態</Th><Th right>回單</Th></tr></thead><tbody>{list.map(t => <tr key={t.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs">{t.id}</td><td><Badge tone="blue">{t.dir}</Badge></td><td className="text-xs">{t.from} → {t.to}</td><td className="text-xs">{t.purpose}</td><td className="text-right font-medium">{fmt(t.amount, t.ccy)}</td><td><Badge tone={t.status === '已完成' ? 'green' : 'amber'}>{t.status}</Badge></td><td className="text-right pr-2">{t.status === '已完成' && <button className="text-xs text-[#134b9e]">電子回單</button>}</td></tr>)}</tbody></table></Card>
  </div>
}

const interestPrincipal = [
  { member: '誠信物流（澳門）', collected: 436200.3, restored: 436200.3, days: 1, status: '已還原' },
  { member: '誠信餐飲管理（澳門）', collected: 96250.8, restored: 96250.8, days: 1, status: '已還原' },
  { member: '誠信（珠海）貿易', collected: 152300, restored: 0, days: 1, status: '還原異常' },
]

function Interest() {
  const [detail, setDetail] = useState(false)
  const actual = interestAllocs[0]
  return <div className="space-y-4">
    <div className="grid grid-cols-3 gap-4"><div className="bg-gradient-to-br from-[#0b2a5b] to-[#134b9e] rounded-xl p-4 text-white"><div className="text-xs text-blue-200">主賬戶實收可分配利息 · 2026-09</div><div className="text-2xl font-bold mt-1.5">{fmt(actual.total, 'MOP')}</div><div className="text-xs text-blue-200 mt-1">核心利息流水 BANCS-INT-20260921</div></div><Card title="資金閉環"><div className="text-sm font-medium">自然日全額歸集 → 次日全額還原</div><div className="text-xs text-slate-500 mt-2">週末及節假日照常執行 · 逐戶保存本金軌跡</div></Card><Card title="適用條件"><div className="text-sm font-medium">同幣種 · 兩層 · 單主</div><div className="text-xs text-slate-500 mt-2">AG2026003 MOP 綜合計息池 · 不疊加普通自動規則</div></Card></div>
    <Card title="計息方案（簽約版本 V2）" desc="主賬戶日終匯總餘額全額靠檔適用協議利率；平台不虛構收益，不提供部分留存、保底收益或跨幣種計息。"><div className="grid grid-cols-3 gap-4 text-xs">{[['計息主賬戶', '誠信貿易（澳門）· MOP 主賬戶'], ['協議利率', '1.85% · 利率版本 IR20260901'], ['運行日曆', '每個自然日 21:00 歸集／次日 08:00 還原'], ['計息周期', '按月 · 依核心結息安排'], ['分配方式', '按實際歸集本金及留存天數之貢獻積數比例'], ['異常策略', '單戶失敗跳過；主賬戶異常整批停止']].map(([k, v]) => <div key={k} className="border border-slate-100 rounded-lg p-3"><div className="text-slate-400">{k}</div><div className="text-slate-700 mt-1 leading-relaxed">{v}</div></div>)}</div></Card>
    <Card title="2026-10-26 歸集／2026-10-27 還原" desc="還原本金以各成員上一歸集日實際成功金額為準，未成功部分不得計入貢獻；本金歸集與還原均為獨立 BANCS 行內賬務。" action={<button onClick={() => setDetail(!detail)} className="text-xs text-[#134b9e]">{detail ? '收起核心流水' : '查看核心流水'}</button>}>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>成員</Th><Th right>實際成功歸集本金</Th><Th right>次日已還原</Th><Th right>待處理</Th><Th>狀態</Th></tr></thead><tbody>{interestPrincipal.map(r => <tr key={r.member} className="border-b border-slate-100"><td className="py-3">{r.member}{detail && <div className="text-[10px] font-mono text-slate-400 mt-1">COL-20261026 → RST-20261027</div>}</td><td className="text-right">{fmt(r.collected, 'MOP')}</td><td className="text-right">{fmt(r.restored, 'MOP')}</td><td className="text-right">{fmt(r.collected - r.restored, 'MOP')}</td><td><Badge tone={r.status === '已還原' ? 'green' : 'red'}>{r.status}</Badge></td></tr>)}</tbody></table>
    </Card>
    <Card title="結息及利息分配" desc="先核對主賬戶實收利息，再按貢獻積數比例分配；分配總額不得超過實收可分配利息，尾差歸計息主賬戶。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>收款賬戶</Th><Th>貢獻積數比例</Th><Th right>分配利息</Th><Th right>核心流水</Th></tr></thead><tbody>{actual.lines.map(l => <tr key={l.acct} className="border-b border-slate-100"><td className="py-3">{l.acct}</td><td>{l.ratio}</td><td className="text-right text-emerald-600 font-medium">{fmt(l.interest, 'MOP')}</td><td className="text-right pr-2 font-mono text-xs">INT-ALLOC-{l.acct.length}8</td></tr>)}<tr className="bg-slate-50 font-bold"><td className="py-3" colSpan={2}>實收利息合計 · 尾差 MOP 0.00</td><td className="text-right">{fmt(actual.total, 'MOP')}</td><td /></tr></tbody></table></Card>
    <Notice tone="amber">成員賬戶無法入賬時，該戶本金保留在主賬戶待處理明細並進入異常台賬，不得改分給其他成員或標記完成。利率或分配規則變更自下一計息周期生效。</Notice>
  </div>
}

type ProxyRow = typeof proxyPays[number] & { channel?: string; purpose?: string }
function ProxyPaySec() {
  const [list, setList] = useState<ProxyRow[]>(proxyPays.map(x => ({ ...x, channel: x.id.endsWith('003') ? '跨境支付' : '行內支付', purpose: '採購貨款' })))
  const [mode, setMode] = useState<'直接代理支付' | '間接代理支付'>('直接代理支付')
  const [member, setMember] = useState('誠信物流（澳門）')
  const [payee, setPayee] = useState('')
  const [payeeAcct, setPayeeAcct] = useState('')
  const [channel, setChannel] = useState('行內支付')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [background, setBackground] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const invalid = !payee.trim() || !payeeAcct.trim() || !purpose.trim() || Number(amount) <= 0 || (channel === '跨境支付' && !background.trim())
  const submit = () => {
    if (invalid) return
    const id = `PP20261027${String(list.length + 1).padStart(3, '0')}`
    setList(p => [{ id, payer: member, agent: '集團主賬戶', payee, amount: Number(amount), ccy: 'MOP', mode, date: '2026-10-27', status: '成員企業審批中', channel, purpose }, ...p])
    setMessage(`${id} 已提交成員企業內部審批；完成後才生成總部待辦。`)
    setPayee(''); setPayeeAcct(''); setAmount(''); setPurpose(''); setBackground('')
  }
  return <div className="space-y-4">
    <Card title="發起統一支付" desc="已生效資金池內成員按約定代理關係辦理單筆對外支付，支持行內、本地跨行及跨境，不支持批量。">
      <div className="grid grid-cols-3 gap-4"><div className="col-span-1"><label className="text-xs text-slate-500">代理模式</label><div className="grid grid-cols-1 gap-2 mt-1">{(['直接代理支付', '間接代理支付'] as const).map(x => <button key={x} onClick={() => setMode(x)} className={`border rounded-lg px-3 py-2 text-left text-xs ${mode === x ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : ''}`}>{x}<div className="text-[10px] text-slate-400 mt-1">{x === '直接代理支付' ? '實際出資主賬戶 → 收款人' : '主賬戶 → 成員賬戶 → 收款人'}</div></button>)}</div></div><div className="col-span-2 grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-500">被代理成員<select value={member} onChange={e => setMember(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">{groupCompanies.filter(g => g.relation === '成員單位').map(g => <option key={g.id}>{g.name}</option>)}</select></label>
        <label className="text-xs text-slate-500">支付渠道<select value={channel} onChange={e => setChannel(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"><option>行內支付</option><option>本地跨行</option><option>跨境支付</option></select></label>
        <label className="text-xs text-slate-500">收款人<input value={payee} onChange={e => setPayee(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>
        <label className="text-xs text-slate-500">收款賬戶<input value={payeeAcct} onChange={e => setPayeeAcct(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>
        <label className="text-xs text-slate-500">金額（MOP）<input value={amount} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmount(e.target.value) }} placeholder="0.00" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>
        <label className="text-xs text-slate-500">期望執行日<input type="date" defaultValue="2026-10-28" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>
        <label className="text-xs text-slate-500 col-span-2">用途（必填）<input value={purpose} onChange={e => setPurpose(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>
        {channel === '跨境支付' && <label className="text-xs text-slate-500 col-span-2">跨境背景資料／影像索引（必填）<input value={background} onChange={e => setBackground(e.target.value)} placeholder="合同、發票及申報資料索引" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label>}
      </div></div>
      <div className="flex justify-end mt-4"><button onClick={submit} disabled={invalid} className="bg-[#c8102e] disabled:bg-slate-300 text-white rounded-lg px-6 py-2.5 text-sm">提交成員企業審批</button></div>{message && <div className="mt-3"><Notice tone="green">{message}</Notice></div>}
    </Card>
    <Notice>雙段審批：成員錄入及內部審批 → 生成總部待辦 → 主賬戶企業審批 → 執行前再次校驗。總部僅查看該申請必要信息，不因此取得成員無關賬戶交易查詢權。</Notice>
    <Card title="統一支付記錄" desc="點擊記錄查看雙段審批、資金路徑、核心及清算狀態。關鍵要素修改後原雙段審批失效。"><div className="space-y-2">{list.map(p => <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden"><button onClick={() => setOpen(open === p.id ? null : p.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50">{open === p.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}<span className="font-mono text-xs">{p.id}</span><span className="text-sm">{p.payer} → {p.payee}</span><Badge tone="purple">{p.mode}</Badge><span className="text-sm font-medium">{fmt(p.amount, p.ccy)}</span><span className="ml-auto"><Badge tone={p.status === '已完成' ? 'green' : p.status.includes('處理中') ? 'blue' : 'amber'}>{p.status}</Badge></span></button>{open === p.id && <div className="border-t bg-slate-50/50 p-4"><div className="grid grid-cols-4 gap-3">{[['成員企業審批', p.status === '成員企業審批中' ? '待處理' : '已通過'], ['總部待辦／主賬戶企業審批', p.status === '成員企業審批中' ? '未開始' : '已通過'], ['代理、餘額、限額、AML／影像校驗', p.status.includes('審批') ? '未開始' : '已通過'], ['核心及支付清算執行', p.status]].map(([s, st], i) => <div key={s} className="bg-white border rounded-lg p-3"><div className="text-[10px] text-slate-400">步驟 {i + 1}</div><div className="text-xs mt-1">{s}</div><div className="mt-2"><Badge tone={st === '已通過' || st === '已完成' ? 'green' : 'amber'}>{st}</Badge></div></div>)}</div><div className="text-xs text-slate-600 mt-4">資金路徑：{p.mode === '直接代理支付' ? `實際出資主賬戶 → ${p.payee}` : `實際出資主賬戶 → ${p.payer} → ${p.payee}`}</div><div className="text-xs text-slate-400 mt-2">用途：{p.purpose} · 渠道：{p.channel} · 申請編號貫穿審批、核心、清算、回單及報告。</div><div className="flex gap-2 mt-3"><button className="text-xs border border-[#134b9e] text-[#134b9e] rounded-lg px-3 py-1.5">電子回單</button><button className="text-xs border border-slate-300 rounded-lg px-3 py-1.5">三方／兩方信息報告</button></div></div>}</div>)}</div></Card>
    <Notice tone="amber">間接支付第二步在未送出清算前失敗，按約定退回實際出資主賬戶；已送出後按渠道撤銷、退匯及人工查詢處理，不統稱「原子回滾」。超時或結果未明不得重新發起付款。</Notice>
  </div>
}

const reportCatalog = [
  ['集團賬戶及資金視圖報告', '按日／週／月或即時', '賬戶、可用餘額、收支、交易及數據時間'],
  ['資金池及歸集下撥報告', '每批完成後', '規則版本、批次、應執行／實際金額、核心流水'],
  ['主動調撥報告', '按交易', '申請、用途、審批及核心結果'],
  ['綜合計息報告', '每日及結息後', '本金閉環、貢獻積數、實收利息、分配及尾差'],
  ['統一支付三方／兩方報告', '按交易', '代理關係、資金路徑、核心及清算結果'],
  ['簽約及收費報告', '按訂閱周期', '產品版本、生效區間、收費標準及扣費結果'],
  ['異常及對賬報告', '按日及按需', '差異、責任崗位、處理時限及最終結果'],
]

function Reports() {
  const [subs, setSubs] = useState([{ id: 'SUB01', report: '集團賬戶及資金視圖報告', cycle: '按日', receiver: '集團財務部', status: '生效中' }])
  const [report, setReport] = useState(reportCatalog[0][0])
  const [receiver, setReceiver] = useState('')
  const [got, setGot] = useState('')
  const add = () => { if (!receiver.trim()) return; setSubs(p => [{ id: `SUB${String(p.length + 1).padStart(2, '0')}`, report, cycle: '按日', receiver, status: '待生效' }, ...p]); setReceiver('') }
  return <div className="space-y-4">
    <Card title="報告訂閱" desc="以已生效產品及實際業務數據為來源；範圍不得超出查詢授權。短訊只發送報告已生成或異常通知，不承載完整報告。"><div className="grid grid-cols-4 gap-3"><label className="text-xs text-slate-500 col-span-2">報告類型<select value={report} onChange={e => setReport(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm">{reportCatalog.map(r => <option key={r[0]}>{r[0]}</option>)}</select></label><label className="text-xs text-slate-500">範圍<select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"><option>全集團</option><option>AG2026001</option><option>單賬戶</option></select></label><label className="text-xs text-slate-500">接收人<input value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="操作員／電郵" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" /></label></div><div className="flex justify-between items-center mt-3"><span className="text-xs text-slate-400">生成周期：按日 · 推送：網銀消息及電郵 · 生效前校驗權限</span><button onClick={add} disabled={!receiver.trim()} className="bg-[#0b2a5b] disabled:bg-slate-300 text-white rounded-lg px-4 py-2 text-xs">新增訂閱</button></div></Card>
    <Card title="已訂閱報告"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>訂閱編號</Th><Th>報告</Th><Th>周期</Th><Th>接收人</Th><Th right>狀態</Th></tr></thead><tbody>{subs.map(s => <tr key={s.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs">{s.id}</td><td>{s.report}</td><td>{s.cycle}</td><td>{s.receiver}</td><td className="text-right pr-2"><Badge tone={s.status === '生效中' ? 'green' : 'amber'}>{s.status}</Badge></td></tr>)}</tbody></table></Card>
    <Card title="報告生成、查詢與下載" desc="在線查詢及下載最長 12 個月；PDF／Excel 文件記錄模板版本、數據截止時間及生成批次。生成失敗不得發送空白或部分文件。"><div className="space-y-2">{reportCatalog.map(r => <div key={r[0]} className="border border-slate-200 rounded-xl p-3 flex items-center gap-3"><FileCheck2 className="w-5 h-5 text-[#134b9e]" /><div className="flex-1"><div className="text-sm font-medium">{r[0]}</div><div className="text-xs text-slate-400 mt-0.5">{r[1]} · {r[2]}</div></div><button onClick={() => setGot(r[0])} className="text-xs border border-[#134b9e] text-[#134b9e] rounded-lg px-3 py-1.5">{got === r[0] ? '✓ 已生成（RPT-20261027）' : '生成並下載'}</button></div>)}</div></Card>
    <Notice>「應執行」「已執行」「成功」「失敗」「結果未明」分開列示；報告可由匯總穿透至批次、申請、核心流水及清算標識。</Notice>
  </div>
}

function Fees() {
  const [records, setRecords] = useState([
    { id: 'FEE20261001001', item: '流動性管理月費', object: 'AG2026001', amount: 1000, date: '2026-10-01', core: 'BANCS-FEE-88102', status: '成功', retry: '0 / 3' },
    { id: 'FEE20261001002', item: '統一支付月費', object: 'AG2026002', amount: 800, date: '2026-10-01', core: '—', status: '失敗', retry: '3 / 3' },
    { id: 'FEE20260901003', item: '集團查詢服務季費', object: '誠信企業集團', amount: 600, date: '2026-09-01', core: 'BANCS-FEE-79018', status: '成功', retry: '0 / 3' },
  ])
  const verify = (id: string) => setRecords(p => p.map(r => r.id === id ? { ...r, status: '查證中' } : r))
  return <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4"><Card title="收費方案 · AG2026001" desc="總行後台統一維護，經辦複核後按指定日期生效。"><div className="space-y-3 text-xs">{[['計費對象', '賬戶組 AG2026001'], ['收費方式', '協議收費（與標準收費二選一）'], ['扣費賬戶', '101-88-123456-7 · MOP'], ['收費周期', '按月 · 每月 1 日'], ['協議版本', 'FEE-SCHEME-V2 · 2026-10-01 至 2027-09-30'], ['協議審批', '總行審批 AP20260918003']].map(([k, v]) => <div key={k} className="flex border-b border-slate-50 pb-2"><span className="w-24 text-slate-400">{k}</span><span>{v}</span></div>)}</div></Card><Card title="扣費控制"><div className="space-y-3">{['扣費前校驗對象、版本、賬戶、幣種及可用餘額', '生成全局唯一扣費編號，成功返回核心流水及回單', '失敗不得部分扣款，不自動從其他賬戶補扣', '有限重試達上限轉人工；結果未明先查原扣費編號'].map(x => <div key={x} className="flex gap-2 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{x}</div>)}</div></Card></div>
    <Card title="扣費記錄" desc="扣費失敗不立即暫停現金管理服務，後續服務處置須另行審批。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>扣費編號</Th><Th>項目／對象</Th><Th right>金額</Th><Th>日期</Th><Th>核心流水</Th><Th>重試</Th><Th>狀態</Th><Th right>操作</Th></tr></thead><tbody>{records.map(r => <tr key={r.id} className="border-b border-slate-100"><td className="py-3 font-mono text-xs">{r.id}</td><td className="text-xs">{r.item}<div className="text-slate-400">{r.object}</div></td><td className="text-right">{fmt(r.amount, 'MOP')}</td><td className="text-xs">{r.date}</td><td className="font-mono text-xs">{r.core}</td><td className="text-xs">{r.retry}</td><td><Badge tone={r.status === '成功' ? 'green' : r.status === '失敗' ? 'red' : 'blue'}>{r.status}</Badge></td><td className="text-right pr-2">{r.status === '成功' ? <button className="text-xs text-[#134b9e]">回單</button> : <button onClick={() => verify(r.id)} className="text-xs text-[#134b9e]">查證原扣費</button>}</td></tr>)}</tbody></table></Card>
  </div>
}

function Exceptions() {
  const [tab, setTab] = useState<'ledger' | 'recon'>('ledger')
  const [items, setItems] = useState([
    { id: 'EXC20261027001', product: '集團綜合計息', ref: 'RST-20261027-03', type: '成員賬戶無法入賬', amount: 'MOP 152,300.00', owner: '總行維護部／梁梓鋒', due: '2026-10-27 18:00', status: '處理中' },
    { id: 'EXC20261026002', product: '自動歸集下撥', ref: 'EX2026100521', type: '核心賬戶狀態異常', amount: '—', owner: '總行維護部／黃麗珍', due: '2026-10-27 16:00', status: '待複核' },
    { id: 'EXC20261025003', product: '統一支付', ref: 'PP20261025003', type: '清算超時／結果未明', amount: 'MOP 68,000.00', owner: '支付結算部／王志明', due: '2026-10-27 12:00', status: '查證中' },
    { id: 'EXC20261024004', product: '信息加工與報告', ref: 'RPT-20261024', type: '報告生成失敗', amount: '—', owner: '信息科技部／陳大文', due: '2026-10-26 12:00', status: '已關閉' },
  ])
  const register = (id: string) => setItems(p => p.map(x => x.id === id ? { ...x, status: '待複核' } : x))
  const reconciliations = [
    ['現金管理執行 vs BANCS', '歸集下撥、主動調撥、計息本金及收費', '申請／批次、賬戶、金額、核心流水、狀態', '1 項差異'],
    ['統一支付 vs 支付清算', '直接／間接各步、對外支付、撤銷及退匯', '申請、核心、清算標識、金額及狀態', '1 項查證中'],
    ['綜合計息全鏈條', '歸集、還原、實收利息、分配及尾差', '本金及利息逐層核對', '1 項待處理'],
  ]
  return <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">{[['未關閉異常', '3', 'amber'], ['結果未明', '1', 'blue'], ['今日對賬差異', '1', 'red'], ['本月已關閉', '26', 'green']].map(([k, v, t]) => <Card key={k}><div className="text-xs text-slate-400">{k}</div><div className={`text-2xl font-bold mt-1 ${t === 'red' ? 'text-[#c8102e]' : t === 'green' ? 'text-emerald-600' : 'text-slate-800'}`}>{v}</div></Card>)}</div>
    <div className="flex gap-1 bg-white rounded-xl shadow-sm p-1.5 w-fit"><button onClick={() => setTab('ledger')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'ledger' ? 'bg-[#0b2a5b] text-white' : ''}`}>統一異常台賬</button><button onClick={() => setTab('recon')} className={`px-4 py-2 rounded-lg text-sm ${tab === 'recon' ? 'bg-[#0b2a5b] text-white' : ''}`}>三層對賬</button></div>
    {tab === 'ledger' ? <Card title="統一異常台賬" desc="所有產品共用，關聯來源系統、集團、賬戶組、批次／申請、核心／清算標識及處理責任。關閉前須證明資金、賬務及信息狀態一致。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>異常編號／產品</Th><Th>關聯單號</Th><Th>類型</Th><Th right>金額</Th><Th>責任崗位／處理人</Th><Th>處理時限</Th><Th>狀態</Th><Th right>操作</Th></tr></thead><tbody>{items.map(x => <tr key={x.id} className="border-b border-slate-100"><td className="py-3 text-xs"><div className="font-mono">{x.id}</div><div className="text-slate-400">{x.product}</div></td><td className="font-mono text-xs">{x.ref}</td><td className="text-xs">{x.type}</td><td className="text-right text-xs">{x.amount}</td><td className="text-xs">{x.owner}</td><td className="text-xs">{x.due}</td><td><Badge tone={x.status === '已關閉' ? 'green' : x.status === '待複核' ? 'purple' : 'amber'}>{x.status}</Badge></td><td className="text-right pr-2">{x.status !== '已關閉' && <button onClick={() => register(x.id)} className="text-xs text-[#134b9e]">登記處理結果</button>}</td></tr>)}</tbody></table></Card> : <><Card title="三層對賬" desc="自動對賬只識別差異及歸集證據，不得未經複核自動補賬、沖賬或改寫核心結果。"><table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><Th>對賬層次</Th><Th>核對範圍</Th><Th>證據鏈</Th><Th>本期結果</Th><Th right>操作</Th></tr></thead><tbody>{reconciliations.map(r => <tr key={r[0]} className="border-b border-slate-100"><td className="py-3 font-medium">{r[0]}</td><td className="text-xs">{r[1]}</td><td className="text-xs">{r[2]}</td><td><Badge tone="amber">{r[3]}</Badge></td><td className="text-right pr-2"><button className="text-xs text-[#134b9e]">查看差異證據</button></td></tr>)}</tbody></table></Card><div className="grid grid-cols-2 gap-4"><Card title="批量恢復控制"><p className="text-xs text-slate-500 leading-relaxed">恢復時以已成功明細為界，不重複執行。暫停或系統恢復後先核對核心、清算及平台狀態，再由總行人工確認。</p></Card><Card title="審計追溯"><p className="text-xs text-slate-500 leading-relaxed">登錄、敏感查詢、後台維護、審批、動賬、批量、異常及對賬操作均留存日誌，可按客戶、申請、批次及操作員追溯。</p></Card></div></>}
    <Notice tone="amber">外圍超時或結果未明：保持處理中、鎖定防重鍵並查詢原交易。對賬差異凍結相關自動修復動作，以核心及清算證據核查並經複核後調整業務狀態。</Notice>
  </div>
}
