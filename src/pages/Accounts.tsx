import { useState } from 'react'
import { accounts, txns, fmt, maskAcct, statements, chequeBooks, assetCerts, incomings, counterparties, type Statement, type ChequeBook, type AssetCert } from '@/lib/mock'
import { Search, RotateCcw, Download, ChevronDown, FileText, BookCheck, BadgeCheck, CheckCircle2, Inbox, UserSearch, PencilLine } from 'lucide-react'

const CCYS = ['全部', 'MOP', 'HKD', 'CNY', 'USD']

export default function Accounts() {
  const [tab, setTab] = useState<'overview' | 'statement' | 'cheque' | 'cert' | 'incoming' | 'counterparty' | 'profile'>('overview')
  const TABS = [['overview', '賬戶一覽'], ['incoming', '來賬信息查詢'], ['counterparty', '交易對手查詢'], ['statement', '月結單'], ['cheque', '支票簿'], ['cert', '資產證明書'], ['profile', '線上資料更新']] as const
  return (
    <div className="relative z-10 max-w-6xl mx-auto">
      <Breadcrumb items={['賬戶服務', TABS.find(t => t[0] === tab)![1]]} />
      <div className="flex gap-2 mt-4 bg-white rounded-t-xl shadow-sm px-5 border-b border-slate-100 overflow-x-auto">
        {TABS.map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3.5 text-sm border-b-2 -mb-px whitespace-nowrap ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b-xl shadow-sm">
        {tab === 'overview' && <Overview />}
        {tab === 'incoming' && <IncomingPanel />}
        {tab === 'counterparty' && <CounterpartyPanel />}
        {tab === 'statement' && <StatementPanel />}
        {tab === 'cheque' && <ChequePanel />}
        {tab === 'cert' && <CertPanel />}
        {tab === 'profile' && <ProfilePanel />}
      </div>
    </div>
  )
}

function Overview() {
  const [ccy, setCcy] = useState('全部')
  const [selected, setSelected] = useState(accounts[0].no)
  const [dateFrom, setDateFrom] = useState('2026-09-20')
  const [dateTo, setDateTo] = useState('2026-10-06')
  const [keyword, setKeyword] = useState('')
  const [showMask, setShowMask] = useState(true)

  const filtered = accounts.filter(a => ccy === '全部' || a.ccy === ccy)
  const shownTxns = txns.filter(t =>
    (!keyword || t.counterparty.includes(keyword) || t.summary.includes(keyword)) &&
    t.date >= dateFrom && t.date <= dateTo)

  return (
    <div className="p-5 space-y-5">
      <div className="flex gap-2">
        {CCYS.map(c => (
          <button key={c} onClick={() => setCcy(c)}
            className={`px-4 py-1.5 rounded-full text-sm border ${ccy === c ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#134b9e]'}`}>
            {c === '全部' ? '全部幣種' : c}
          </button>
        ))}
        <div className="flex-1" />
        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input type="checkbox" checked={showMask} onChange={e => setShowMask(e.target.checked)} className="accent-[#134b9e]" />
          賬號脫敏顯示
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(a => (
          <button key={a.no} onClick={() => setSelected(a.no)}
            className={`text-left bg-white rounded-xl p-4 border-2 transition-colors ${selected === a.no ? 'border-[#134b9e] shadow-md' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-blue-50 text-[#134b9e] rounded px-1.5 py-0.5">{a.type}</span>
              <span className="text-xs text-slate-400">{a.branch}</span>
            </div>
            <div className="font-medium text-slate-800 mt-2 text-sm">{a.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{showMask ? maskAcct(a.no) : a.no}</div>
            <div className="text-lg font-bold text-slate-800 mt-2">{fmt(a.balance, a.ccy)}</div>
            <div className="text-xs text-slate-400 mt-0.5">可用餘額 {fmt(a.available, a.ccy)}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">交易記錄查詢</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-emerald-600 bg-emerald-50 rounded px-2 py-1">已平移：賬戶交易明細 / 網銀操作明細 / 網銀登錄明細</span>
            <button className="flex items-center gap-1 text-xs text-[#134b9e] hover:underline"><Download className="w-3.5 h-3.5" />下載查詢結果</button>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
          <span className="text-slate-500">交易日期</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm" />
          <span className="text-slate-400">至</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm" />
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="對手名稱 / 摘要關鍵字"
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1 max-w-[220px]" />
          <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-1.5 text-sm hover:bg-[#134b9e]"><Search className="w-4 h-4" />查詢</button>
          <button onClick={() => { setKeyword(''); setDateFrom('2026-09-20'); setDateTo('2026-10-06') }}
            className="flex items-center gap-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400"><RotateCcw className="w-3.5 h-3.5" />重置</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y-2 border-slate-800 text-left text-slate-700">
              <th className="py-2.5 font-medium">交易日期</th>
              <th className="font-medium">摘要</th>
              <th className="font-medium">對手名稱</th>
              <th className="font-medium text-right">支出（MOP）</th>
              <th className="font-medium text-right">存入（MOP）</th>
              <th className="font-medium text-right">餘額（MOP）</th>
              <th className="font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {shownTxns.map(t => (
              <tr key={t.ref} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 text-slate-600">{t.date}</td>
                <td className="text-slate-700">{t.summary}</td>
                <td className="text-slate-600">{t.counterparty}</td>
                <td className="text-right text-[#c8102e]">{t.out ? fmt(t.out) : '—'}</td>
                <td className="text-right text-emerald-600">{t.in ? fmt(t.in) : '—'}</td>
                <td className="text-right text-slate-700">{fmt(t.balance)}</td>
                <td className="text-right"><button className="text-xs text-[#134b9e] hover:underline">電子回單</button></td>
              </tr>
            ))}
            {shownTxns.length === 0 && (
              <tr><td colSpan={7} className="py-10 text-center text-slate-400">查無符合條件的交易記錄</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <span>共 {shownTxns.length} 條記錄　查詢時間範圍最長 12 個月　查詢結果欄位支持自定義</span>
          <button className="flex items-center gap-1 hover:text-slate-600">每頁 10 條 <ChevronDown className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  )
}

function StatementPanel() {
  const [svcOn, setSvcOn] = useState(true)
  const [list] = useState<Statement[]>(statements)
  return (
    <div className="p-5 space-y-5">
      <div className={`border rounded-xl p-5 ${svcOn ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${svcOn ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <FileText className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-800">電子月結單服務：{svcOn ? '已開通' : '未開通'}</div>
            <div className="text-xs text-slate-500 mt-1">
              已統一線下櫃檯與網銀月結單模板；查詢期由 3 個月延長至 12 個月（含貸款月結單）。
              電子結單開通後聯動取消紙質結單，結單郵寄等配套改造由後台另行推進。
            </div>
          </div>
          <button onClick={() => setSvcOn(!svcOn)}
            className={`rounded-lg px-5 py-2 text-sm font-medium ${svcOn ? 'border border-slate-300 text-slate-600 hover:border-slate-400' : 'bg-[#c8102e] text-white hover:bg-[#a50d26]'}`}>
            {svcOn ? '關閉服務' : '自助開通'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-3">歷史月結單（最長 12 個月）</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">結單月份</th>
              <th className="font-medium">賬戶</th>
              <th className="font-medium">渠道</th>
              <th className="font-medium">文件大小</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700">{s.month}</td>
                <td className="text-slate-600">{s.acct}</td>
                <td><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-0.5">{s.channel}</span></td>
                <td className="text-slate-500">{s.size}</td>
                <td className="text-right pr-2"><button className="flex items-center gap-1 text-xs text-[#134b9e] hover:underline ml-auto"><Download className="w-3.5 h-3.5" />下載 PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {svcOn && <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />新結單生成後將以短訊及消息中心通知，紙質結單已取消。</p>}
      </div>
    </div>
  )
}

function ChequePanel() {
  const [list, setList] = useState<ChequeBook[]>(chequeBooks)
  const [leaves, setLeaves] = useState(25)
  const [acct, setAcct] = useState('澳門元往來賬戶')
  const price = leaves === 25 ? 60 : 100
  const discount = Math.round(price * 0.75)
  const apply = () => {
    setList(prev => [{ id: 'CB20261006' + String(prev.length + 1).padStart(2, '0'), acct, leaves, applyDate: '2026-10-06', status: '處理中' }, ...prev])
  }
  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><BookCheck className="w-4 h-4 text-[#134b9e]" />支票簿線上申請</h3>
          <label className="block text-xs text-slate-500 mb-1">申請賬戶</label>
          <select value={acct} onChange={e => setAcct(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-3">
            {accounts.filter(a => a.type === '往來').map(a => <option key={a.no}>{a.name}</option>)}
          </select>
          <label className="block text-xs text-slate-500 mb-1">支票本頁數</label>
          <div className="flex gap-2 mb-4">
            {[25, 50].map(n => (
              <button key={n} onClick={() => setLeaves(n)}
                className={`px-5 py-2.5 rounded-lg border text-sm ${leaves === n ? 'border-[#134b9e] bg-blue-50 text-[#134b9e] font-medium' : 'border-slate-200 text-slate-600'}`}>
                {n} 頁 / 本
              </button>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3.5 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-slate-500">標準收費</span><span className="text-slate-400 line-through">{fmt(price, 'MOP')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">網銀申請 75 折優惠</span><span className="text-[#c8102e] font-bold">{fmt(discount, 'MOP')}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">送達方式</span><span className="text-slate-700">掛號郵寄至預留地址</span></div>
          </div>
          <button onClick={apply} className="mt-4 w-full bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">提交申請</button>
        </div>
        <div className="col-span-2">
          <h3 className="font-bold text-slate-800 mb-3">申請記錄</h3>
          <div className="space-y-3">
            {list.map(c => (
              <div key={c.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{c.acct}</span>
                  <span className={`text-xs rounded px-2 py-0.5 ${c.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : c.status === '已寄出' ? 'bg-blue-50 text-[#134b9e]' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{c.id} · {c.leaves} 頁 · 申請日 {c.applyDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CertPanel() {
  const [list, setList] = useState<AssetCert[]>(assetCerts)
  const [purpose, setPurpose] = useState('投標資格證明')
  const [lang, setLang] = useState<'中文' | '英文' | '中／英文'>('中／英文')
  const [copies, setCopies] = useState(1)
  const fee = (lang === '中／英文' ? 200 : 150) * copies
  const apply = () => {
    setList(prev => [{ id: 'AC20261006' + String(prev.length + 1).padStart(2, '0'), purpose, lang, copies, fee, date: '2026-10-06', status: '處理中' }, ...prev])
  }
  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-[#134b9e]" />資產證明書線上申請</h3>
          <label className="block text-xs text-slate-500 mb-1">證明用途</label>
          <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-3">
            {['投標資格證明', '審計用途', '簽證用途', '銀行信貸審查'].map(p => <option key={p}>{p}</option>)}
          </select>
          <label className="block text-xs text-slate-500 mb-1">證明語言</label>
          <div className="flex gap-2 mb-3">
            {(['中文', '英文', '中／英文'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-lg border text-sm ${lang === l ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{l}</button>
            ))}
          </div>
          <label className="block text-xs text-slate-500 mb-1">份數</label>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(n => (
              <button key={n} onClick={() => setCopies(n)}
                className={`w-11 py-2 rounded-lg border text-sm ${copies === n ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{n}</button>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3.5 text-sm flex justify-between">
            <span className="text-slate-500">工本費（每份 {lang === '中／英文' ? 'MOP 200.00' : 'MOP 150.00'}）</span>
            <span className="text-[#c8102e] font-bold">{fmt(fee, 'MOP')}</span>
          </div>
          <button onClick={apply} className="mt-4 w-full bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">提交申請</button>
          <p className="text-xs text-slate-400 mt-2">證明書可選櫃檯領取或掛號郵寄，製作需 2 個工作天。</p>
        </div>
        <div className="col-span-2">
          <h3 className="font-bold text-slate-800 mb-3">申請記錄</h3>
          <div className="space-y-3">
            {list.map(c => (
              <div key={c.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{c.purpose}</span>
                  <span className={`text-xs rounded px-2 py-0.5 ${c.status === '已完成' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{c.id} · {c.lang} × {c.copies} · {fmt(c.fee, 'MOP')} · {c.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function IncomingPanel() {
  const [ccy, setCcy] = useState('全部')
  const [keyword, setKeyword] = useState('')
  const list = incomings.filter(i =>
    (ccy === '全部' || i.ccy === ccy) &&
    (!keyword || i.payerName.includes(keyword) || i.postscript.toLowerCase().includes(keyword.toLowerCase())))
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <Inbox className="w-4 h-4 text-[#134b9e]" />
        <span className="text-slate-500">幣種</span>
        {CCYS.map(c => (
          <button key={c} onClick={() => setCcy(c)}
            className={`px-3 py-1 rounded-full text-xs border ${ccy === c ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#134b9e]'}`}>{c === '全部' ? '全部' : c}</button>
        ))}
        <div className="flex-1" />
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="付款人名稱 / 附言關鍵字"
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-56" />
        <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-1.5 text-sm hover:bg-[#134b9e]"><Search className="w-4 h-4" />查詢</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-y-2 border-slate-800 text-left text-slate-700">
            <th className="py-2.5 font-medium">到賬日期</th>
            <th className="font-medium">付款人</th>
            <th className="font-medium">付款賬號</th>
            <th className="font-medium">付款銀行</th>
            <th className="font-medium">附言</th>
            <th className="font-medium text-right">金額</th>
            <th className="font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map(i => (
            <tr key={i.ref} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2.5 text-slate-600">{i.date}</td>
              <td className="text-slate-700 font-medium">{i.payerName}</td>
              <td className="text-slate-500 font-mono text-xs">{i.payerAcct}</td>
              <td className="text-slate-500">{i.payerBank}</td>
              <td className="text-slate-500">{i.postscript}</td>
              <td className="text-right text-emerald-600 font-medium">{fmt(i.amount, i.ccy)}</td>
              <td className="text-right"><button className="text-xs text-[#134b9e] hover:underline">電子回單</button></td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-slate-400">查無符合條件的來賬記錄</td></tr>}
        </tbody>
      </table>
      <p className="text-xs text-slate-400">支持按幣種、日期區間、金額區間及付款人關鍵字組合查詢，結果可導出 Excel。</p>
    </div>
  )
}

function CounterpartyPanel() {
  const [keyword, setKeyword] = useState('')
  const [dir, setDir] = useState<'全部' | '收款' | '付款'>('全部')
  const list = counterparties.filter(c =>
    (dir === '全部' || c.direction === dir) && (!keyword || c.name.includes(keyword)))
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <UserSearch className="w-4 h-4 text-[#134b9e]" />
        <span className="text-slate-500">交易方向</span>
        {(['全部', '收款', '付款'] as const).map(d => (
          <button key={d} onClick={() => setDir(d)}
            className={`px-3 py-1 rounded-full text-xs border ${dir === d ? 'bg-[#0b2a5b] text-white border-[#0b2a5b]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#134b9e]'}`}>{d}</button>
        ))}
        <div className="flex-1" />
        <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="交易對手名稱"
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-56" />
        <button className="flex items-center gap-1 bg-[#0b2a5b] text-white rounded-lg px-4 py-1.5 text-sm hover:bg-[#134b9e]"><Search className="w-4 h-4" />查詢</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {list.map(c => (
          <div key={c.name} className="border border-slate-200 rounded-xl p-4 hover:border-[#134b9e] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">{c.name}</span>
              <span className={`text-xs rounded px-2 py-0.5 ${c.direction === '收款' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#134b9e]'}`}>{c.direction}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">{c.acct} · {c.bank}</div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
              <span>近半年交易 <b className="text-slate-700">{c.txnCount}</b> 筆</span>
              <span>最近一筆 {c.lastTxn}</span>
              <span className="font-medium text-slate-700">{fmt(c.lastAmount)}</span>
            </div>
          </div>
        ))}
        {list.length === 0 && <div className="col-span-2 py-10 text-center text-slate-400">查無符合條件的交易對手</div>}
      </div>
      <p className="text-xs text-slate-400">支持按名稱、賬號、交易方向及活躍度篩選，點擊卡片可一鍵發起同名轉賬。</p>
    </div>
  )
}

function ProfilePanel() {
  const [form, setForm] = useState({ contact: '陳曉峰', phone: '+853 6688 1234', email: 'finance@wynn-supply.mo', address: '澳門南灣大馬路 429 號南灣商業中心 18 樓' })
  const [saved, setSaved] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value })
    setSaved(false)
  }
  const FIELDS: Array<[keyof typeof form, string, string]> = [
    ['contact', '聯絡人姓名', '請輸入聯絡人姓名'],
    ['phone', '聯絡電話', '請輸入聯絡電話'],
    ['email', '聯絡電郵', '請輸入電郵地址'],
    ['address', '通訊地址', '請輸入通訊地址'],
  ]
  return (
    <div className="p-5 space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><PencilLine className="w-4 h-4 text-[#134b9e]" />企業基本資料線上更新</h3>
          <p className="text-xs text-slate-400 mb-4">以下資料修改後將同步至銀行核心系統，涉及證明文件變更需櫃檯覆核。</p>
          {FIELDS.map(([k, label, ph]) => (
            <div key={k} className="mb-3">
              <label className="block text-xs text-slate-500 mb-1">{label}</label>
              <input value={form[k]} onChange={set(k)} placeholder={ph} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
            </div>
          ))}
          <button onClick={() => setSaved(true)}
            className="mt-2 w-full bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">提交更新</button>
          {saved && <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />已提交，預計 1 個工作日內完成覆核。</p>}
        </div>
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-3">待更新事項</h3>
            <div className="space-y-2.5 text-sm">
              {[
                ['商業登記證明', '將於 2026-11-30 到期', true],
                ['董事名單', '本年度尚未確認', true],
                ['受益所有人聲明', '已更新至 2026-09', false],
              ].map(([doc, note, warn]) => (
                <div key={doc as string} className="flex items-center justify-between border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-slate-700">{doc}</span>
                  <span className={`text-xs ${warn ? 'text-amber-600' : 'text-emerald-600'}`}>{note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 mb-2">更新記錄</h3>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between"><span>2026-08-12 通訊地址變更</span><span className="text-emerald-600">已完成</span></div>
              <div className="flex justify-between"><span>2026-06-03 聯絡電話變更</span><span className="text-emerald-600">已完成</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="text-sm text-slate-400">
      當前位置：{items.map((it, i) => (
        <span key={it}>{i > 0 && <span className="mx-1.5">&gt;</span>}<span className={i === items.length - 1 ? 'text-slate-700 font-medium' : ''}>{it}</span></span>
      ))}
    </div>
  )
}
