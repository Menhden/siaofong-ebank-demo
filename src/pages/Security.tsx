import { useState } from 'react'
import { companyUsers, smsAlerts, fmt, type CompanyUser } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { UserCog, KeySquare, ShieldCheck, Lock, MessageSquareText, Gauge, Power, ClipboardList, CheckCircle2, Fingerprint, Wrench, AlertTriangle } from 'lucide-react'

const MENU = [
  { key: 'profile', label: '個人信息管理', icon: UserCog },
  { key: 'perm', label: '審批權限管理', icon: KeySquare },
  { key: 'users', label: '使用者管理', icon: ShieldCheck },
  { key: 'pwd', label: '網上通密碼修改', icon: Lock },
  { key: 'sms', label: '短訊提醒服務', icon: MessageSquareText },
  { key: 'auth', label: '認證管理', icon: Fingerprint },
  { key: 'limit', label: '交易限額設置', icon: Gauge },
  { key: 'self', label: '自助維護', icon: Wrench },
  { key: 'pause', label: '暫停網銀服務', icon: Power },
  { key: 'survey', label: '調查問卷', icon: ClipboardList },
] as const

type SecKey = typeof MENU[number]['key']

export default function Security() {
  const [sec, setSec] = useState<SecKey>('profile')
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['安全中心']} />
      <div className="flex gap-5 mt-4">
        <div className="w-56 shrink-0 bg-white rounded-xl shadow-sm p-2 space-y-1 h-fit">
          {MENU.map(m => {
            const Icon = m.icon
            return (
              <button key={m.key} onClick={() => setSec(m.key)}
                style={sec === m.key ? { backgroundColor: '#0b2a5b', color: '#ffffff' } : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${sec === m.key ? 'bg-[#0b2a5b] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className="w-4 h-4" />{m.label}
              </button>
            )
          })}
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[480px]">
          {sec === 'profile' && <Profile />}
          {sec === 'perm' && <Perm />}
          {sec === 'users' && <Users />}
          {sec === 'pwd' && <Pwd />}
          {sec === 'sms' && <Sms />}
          {sec === 'auth' && <Auth />}
          {sec === 'limit' && <Limit />}
          {sec === 'self' && <Self />}
          {sec === 'pause' && <Pause />}
          {sec === 'survey' && <Survey />}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-5">
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
    </div>
  )
}

function Profile() {
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <SectionTitle title="個人信息管理" desc="按「企業—產品服務—賬戶—角色—權限」模型管理；支持按部門分類管理使用者信息。" />
      <div className="grid grid-cols-2 gap-4 max-w-xl">
        <div>
          <label className="block text-xs text-slate-500 mb-1">使用者姓名</label>
          <input defaultValue="陳大文" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50" readOnly />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">使用者代碼</label>
          <input defaultValue="OP0001" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50" readOnly />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">手機號碼</label>
          <input defaultValue="66** **34" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">電郵地址</label>
          <input defaultValue="dchan@integrity.mo" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">所屬部門</label>
          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
            <option>財務部</option><option>營業部</option><option>人事部</option><option>資訊科技部</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">預留信息</label>
          <input defaultValue="安康" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <button onClick={() => setSaved(true)} className="mt-5 bg-[#0b2a5b] text-white rounded-lg px-6 py-2 text-sm hover:bg-[#134b9e]">保存修改</button>
      {saved && <span className="ml-3 text-xs text-emerald-600">已保存，部分信息變更需管理員覆核後生效。</span>}
    </div>
  )
}

function Perm() {
  const matrix = [
    { role: '錄入員', init: true, approve: false, query: true, limit: 'MOP 500,000 / 筆' },
    { role: '一級審批員', init: false, approve: true, query: true, limit: 'MOP 2,000,000 / 筆' },
    { role: '二級審批員', init: false, approve: true, query: true, limit: 'MOP 5,000,000 / 筆' },
    { role: '查詢員', init: false, approve: false, query: true, limit: '僅查詢' },
  ]
  return (
    <div>
      <SectionTitle title="審批權限管理" desc="按 3.3.2 權限控制模型重構；所有審批崗須按鑒權管理設置完成鑒權工具授權後方可操作。" />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">崗位角色</th>
            <th className="font-medium text-center">發起交易</th>
            <th className="font-medium text-center">審批交易</th>
            <th className="font-medium text-center">查詢</th>
            <th className="font-medium text-right pr-2">單筆額度</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map(r => (
            <tr key={r.role} className="border-b border-slate-100">
              <td className="py-3 text-slate-700 font-medium">{r.role}</td>
              {[{ v: r.init }, { v: r.approve }, { v: r.query }].map((c, i) => (
                <td key={i} className="text-center">
                  {c.v ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <span className="text-slate-300">—</span>}
                </td>
              ))}
              <td className="text-right pr-2 text-slate-600">{r.limit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-slate-400 mt-3">審批模式支持：單人模式、雙人模式、多級多人模式；當前企業啟用「雙人模式（一級審批 → 二級審批）」。</p>
    </div>
  )
}

function Users() {
  const [list, setList] = useState<CompanyUser[]>(companyUsers)
  const toggle = (name: string) =>
    setList(prev => prev.map(u => (u.name === name ? { ...u, status: u.status === '正常' ? '停用' : '正常' } : u)))
  return (
    <div>
      <SectionTitle title="使用者管理" desc="管理企業網銀使用者；新增使用者需管理員設定角色並完成鑒權工具綁定。" />
      <div className="flex justify-end mb-3">
        <button className="bg-[#0b2a5b] text-white rounded-lg px-4 py-2 text-sm hover:bg-[#134b9e]">新增使用者</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2.5 font-medium">姓名</th>
            <th className="font-medium">角色</th>
            <th className="font-medium">部門</th>
            <th className="font-medium">鑒權工具</th>
            <th className="font-medium">最近登錄</th>
            <th className="font-medium">狀態</th>
            <th className="font-medium text-right pr-2">操作</th>
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.name} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 text-slate-700 font-medium">{u.name}</td>
              <td className="text-slate-600">{u.role}</td>
              <td className="text-slate-600">{u.dept}</td>
              <td className="text-slate-500 text-xs">{u.auth}</td>
              <td className="text-slate-500 text-xs">{u.lastLogin}</td>
              <td><span className={`text-xs rounded px-2 py-0.5 ${u.status === '正常' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{u.status}</span></td>
              <td className="text-right pr-2 space-x-2">
                <button className="text-xs text-[#134b9e] hover:underline">編輯</button>
                <button onClick={() => toggle(u.name)} className="text-xs text-[#134b9e] hover:underline">{u.status === '正常' ? '停用' : '啟用'}</button>
                <button className="text-xs text-[#134b9e] hover:underline">重置密碼</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Pwd() {
  const [oldP, setOldP] = useState('')
  const [newP, setNewP] = useState('')
  const [ok, setOk] = useState(false)
  const valid = newP.length >= 8 && /[A-Za-z]/.test(newP) && /\d/.test(newP)
  return (
    <div>
      <SectionTitle title="網上通密碼修改" desc="密碼需 8 位以上且同時包含字母及數字；修改後所有已登錄設備將被強制下線。" />
      <div className="max-w-sm space-y-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">原密碼</label>
          <input type="password" value={oldP} onChange={e => setOldP(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">新密碼</label>
          <input type="password" value={newP} onChange={e => { setNewP(e.target.value); setOk(false) }} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
          {newP && <p className={`text-xs mt-1 ${valid ? 'text-emerald-600' : 'text-amber-600'}`}>{valid ? '✓ 符合密碼強度要求' : '需 8 位以上且包含字母及數字'}</p>}
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">確認新密碼</label>
          <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        </div>
        <button onClick={() => valid && oldP && setOk(true)} disabled={!(valid && oldP)}
          className="bg-[#c8102e] hover:bg-[#a50d26] disabled:bg-slate-300 text-white rounded-lg px-8 py-2.5 text-sm font-medium">確認修改</button>
        {ok && <p className="text-xs text-emerald-600">密碼修改成功，下次登錄請使用新密碼。</p>}
      </div>
    </div>
  )
}

function Sms() {
  const [alerts, setAlerts] = useState(smsAlerts)
  const toggle = (i: number) => setAlerts(prev => prev.map((a, j) => (j === i ? { ...a, on: !a.on } : a)))
  return (
    <div>
      <SectionTitle title="短訊提醒服務" desc="設定各類交易及賬戶事件的短訊通知；短訊發送至預留手機號碼（66** **34）。" />
      <div className="divide-y divide-slate-100">
        {alerts.map((a, i) => (
          <div key={a.event} className="flex items-center gap-4 py-3.5">
            <div className="flex-1">
              <div className="text-sm text-slate-800 font-medium">{a.event}</div>
              <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
            </div>
            <button onClick={() => toggle(i)}
              className={`w-11 h-6 rounded-full transition-colors relative ${a.on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${a.on ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-[#0b2a5b] text-white rounded-lg px-6 py-2 text-sm hover:bg-[#134b9e]">保存設定</button>
    </div>
  )
}

function Limit() {
  const bank = { single: 5000000, daily: 20000000 }
  const [customer, setCustomer] = useState({ single: 3000000, daily: 12000000 })
  const [vals, setVals] = useState({ single: '3000000', daily: '12000000' })
  const [kind, setKind] = useState('普通匯款')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const effective = { single: Math.min(bank.single, customer.single), daily: Math.min(bank.daily, customer.daily) }
  const used = 1200000
  const inflight = 800000
  const update = (key: 'single' | 'daily', value: string) => {
    if (/^\d*$/.test(value)) {
      setVals(v => ({ ...v, [key]: value }))
      setNotice('')
      setError('')
    }
  }
  const save = () => {
    const single = Number(vals.single)
    const daily = Number(vals.daily)
    if (!single || !daily) {
      setError('請輸入有效的單筆及單日限額。')
      return
    }
    if (single > customer.single || daily > customer.daily) {
      setError('本頁僅支持自助調低；如需調高，請線下申請並經銀行審批。')
      return
    }
    setCustomer({ single, daily })
    setError('')
    setNotice('調低已完成公共認證及企業內部必要確認並生效；已占用額度的在途交易不因本次調低自動撤銷。')
  }
  return (
    <div>
      <SectionTitle title="交易限額設置" desc="按「企業客戶號＋匯款類型」管理企網渠道匯款限額；行內轉賬、同名劃轉及現金管理產品交易不占用本額度。" />
      <div className="flex items-end justify-between gap-4 mb-4">
        <label className="block text-xs text-slate-500">匯款類型
          <select value={kind} onChange={e => { setKind(e.target.value); setNotice(''); setError('') }} className="mt-1 block border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white min-w-56">
            <option>普通匯款</option><option>澳中轉賬</option>
          </select>
        </label>
        <div className="text-right text-xs text-slate-500">本行自然日｜MOP 等值<br /><span className="text-[#134b9e]">網銀、手機銀行及銀企直連共享單日額度</span></div>
      </div>
      {kind === '澳中轉賬' && <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">澳中轉賬的實際交易分類、清算及占用時點仍待業務、運營及科技覆核；本頁先演示統一限額信息結構。</p>}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { t: '銀行核定上限', s: bank.single, d: bank.daily, note: '來源：標準匯款模板 V1.2' },
          { t: '客戶自設上限', s: customer.single, d: customer.daily, note: '企業管理員自助維護' },
          { t: '實際生效限額', s: effective.single, d: effective.daily, note: '銀行核定與客戶自設孰低', active: true },
        ].map(x => (
          <div key={x.t} className={`rounded-xl border p-4 ${x.active ? 'border-[#134b9e] bg-blue-50/60' : 'border-slate-200 bg-slate-50'}`}>
            <div className="text-xs text-slate-500">{x.t}</div>
            <div className="text-base font-bold text-slate-800 mt-2">單筆 {fmt(x.s, 'MOP')}</div>
            <div className="text-sm text-slate-700 mt-1">單日 {fmt(x.d, 'MOP')}</div>
            <div className="text-[11px] text-slate-400 mt-2">{x.note}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 border-y border-slate-200 py-4 mb-5 text-center">
        {[['當日已用', used], ['在途占用', inflight], ['已用＋在途', used + inflight], ['單日可用餘額', Math.max(0, effective.daily - used - inflight)]].map(([label, value]) => (
          <div key={String(label)}><div className="text-xs text-slate-400">{label}</div><div className="text-sm font-bold text-slate-800 mt-1">{fmt(Number(value), 'MOP')}</div></div>
        ))}
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-3">自助調低</h4>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <label className="block text-xs text-slate-500">客戶自設單筆限額（MOP）
          <input value={vals.single} onChange={e => update('single', e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        </label>
        <label className="block text-xs text-slate-500">客戶自設單日限額（MOP）
          <input value={vals.daily} onChange={e => update('daily', e.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        </label>
      </div>
      <button onClick={save} className="mt-4 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-6 py-2.5 text-sm font-medium">完成認證並確認調低</button>
      {error && <p className="text-xs text-[#c8102e] bg-red-50 rounded-lg p-3 mt-3">{error}</p>}
      {notice && <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{notice}</p>}
      <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4 space-y-1.5">
        <p><b>調高：</b>請線下提交申請，銀行審批後由企網後台維護；本頁不提供線上直接調高。</p>
        <p><b>在途交易：</b>調低立即限制超額新交易；已用加在途高於新限額時只限制新增，不自動撤銷原交易。</p>
      </div>
      <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        單筆嚴格超過等值 MOP 1,000,000 時，須另經對應客戶關係部門大額審批；大額審批與渠道限額不相互抵扣。
      </p>
    </div>
  )
}

function Auth() {
  const tiers = [
    { name: '查詢級', desc: '賬戶查詢、月結單下載等不涉及資金變動的操作', tools: '密碼 / 短訊驗證碼', color: 'bg-blue-50 text-[#134b9e] border-blue-200' },
    { name: '動賬級', desc: '轉賬匯款、繳費、代發等資金變動交易', tools: 'Soft Token / UKEY', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: '授權級', desc: '交易審批、使用者管理、限額調整等高風險授權操作', tools: 'UKEY（強制）', color: 'bg-red-50 text-[#c8102e] border-red-200' },
  ]
  const scenes = [
    { scene: '賬戶查詢 / 電子回單', level: '查詢級', method: '密碼 + 短訊驗證碼' },
    { scene: '行內轉賬 ≤ 5 萬', level: '動賬級', method: 'Soft Token 動態口令' },
    { scene: '行內轉賬 > 5 萬', level: '動賬級', method: 'UKEY 數字簽名' },
    { scene: '跨境匯款 / 批量代付', level: '動賬級', method: 'UKEY 數字簽名' },
    { scene: '交易審批', level: '授權級', method: 'UKEY + 人臉核身（預留）' },
    { scene: '新增使用者 / 調整限額', level: '授權級', method: 'UKEY 數字簽名' },
  ]
  const [whitelist, setWhitelist] = useState([
    { name: '澳門電力股份有限公司（電費代扣）', limit: 5000, on: true },
    { name: '澳門自來水（水費代扣）', limit: 3000, on: true },
  ])
  return (
    <div>
      <SectionTitle title="認證管理" desc="按場景風險分層鑒權：查詢級 / 動賬級 / 授權級三層認證體系，不同場景組合不同認證工具。" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {tiers.map(t => (
          <div key={t.name} className={`border rounded-xl p-4 ${t.color}`}>
            <div className="font-bold">{t.name}</div>
            <div className="text-xs mt-1.5 opacity-80 leading-relaxed">{t.desc}</div>
            <div className="text-xs mt-3 pt-2 border-t border-black/10">認證工具：<b>{t.tools}</b></div>
          </div>
        ))}
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-2">場景與認證組合</h4>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
            <th className="py-2 font-medium">業務場景</th>
            <th className="font-medium">認證層級</th>
            <th className="font-medium">認證方式</th>
          </tr>
        </thead>
        <tbody>
          {scenes.map(s => (
            <tr key={s.scene} className="border-b border-slate-100">
              <td className="py-2.5 text-slate-700">{s.scene}</td>
              <td><span className={`text-xs rounded px-2 py-0.5 ${s.level === '查詢級' ? 'bg-blue-50 text-[#134b9e]' : s.level === '動賬級' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-[#c8102e]'}`}>{s.level}</span></td>
              <td className="text-slate-600 text-xs">{s.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 className="text-sm font-bold text-slate-800 mb-2">小額免 KEY 白名單</h4>
      <p className="text-xs text-slate-400 mb-3">白名單內交易對手的小額付款可免 UKEY，僅需 Soft Token；單筆上限可自定義。</p>
      <div className="space-y-2.5 max-w-xl">
        {whitelist.map((w, i) => (
          <div key={w.name} className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
            <div className="flex-1">
              <div className="text-sm text-slate-800">{w.name}</div>
              <div className="text-xs text-slate-400">單筆免 KEY 上限 {fmt(w.limit)} / 筆</div>
            </div>
            <button onClick={() => setWhitelist(p => p.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
              className={`w-11 h-6 rounded-full transition-colors relative ${w.on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${w.on ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
            <button onClick={() => setWhitelist(p => p.filter((_, j) => j !== i))} className="text-xs text-slate-400 hover:text-red-500">移除</button>
          </div>
        ))}
        <button className="border border-dashed border-slate-300 rounded-lg px-4 py-2.5 text-sm text-[#134b9e] hover:border-[#134b9e] w-full">+ 新增白名單交易對手</button>
      </div>
      <div className="mt-6 border border-amber-200 bg-amber-50 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-amber-800 max-w-xl">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>反詐騙預警服務已默認開啟：系統實時監測異常交易特徵（新對手、高頻小額試探、深夜大額等），觸發時將凍結交易並通知預留手機。受限客戶名單及預警規則由銀行端管理（見「銀行後台」演示預覽）。</span>
      </div>
    </div>
  )
}

function Self() {
  const [svcs, setSvcs] = useState([
    { name: '電郵服務', desc: '月結單、電子回單及交易通知同步發送至預留電郵', on: true },
    { name: '短訊服務', desc: '動賬類交易實時短訊提醒（與「短訊提醒服務」聯動）', on: true },
    { name: '企業微信 / 推送服務', desc: '審批待辦、公告推送至企業微信或 App 消息中心', on: false },
    { name: '對賬文件自動推送', desc: '每日營業終了後自動生成並推送對賬文件至銀企直連', on: true },
    { name: '語音客服回呼', desc: '客服熱線忙線時留下問題，專人於 1 小時內回電', on: false },
  ])
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <SectionTitle title="自助維護" desc="電郵服務等通知類服務的自助開關；變更即時生效，並記入網銀操作日誌。" />
      <div className="divide-y divide-slate-100 max-w-2xl">
        {svcs.map((s, i) => (
          <div key={s.name} className="flex items-center gap-4 py-3.5">
            <div className="flex-1">
              <div className="text-sm text-slate-800 font-medium">{s.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.desc}</div>
            </div>
            <button onClick={() => { setSvcs(p => p.map((x, j) => j === i ? { ...x, on: !x.on } : x)); setSaved(false) }}
              className={`w-11 h-6 rounded-full transition-colors relative ${s.on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${s.on ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => setSaved(true)} className="mt-4 bg-[#0b2a5b] text-white rounded-lg px-6 py-2 text-sm hover:bg-[#134b9e]">保存設定</button>
      {saved && <span className="ml-3 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />已保存並即時生效。</span>}
    </div>
  )
}

function Pause() {
  const [paused, setPaused] = useState(false)
  const [confirm, setConfirm] = useState(false)
  return (
    <div>
      <SectionTitle title="暫停網銀服務" desc="暫停期間所有使用者將無法登錄及發起交易；可隨時恢復，恢復後即時生效。" />
      <div className={`border rounded-xl p-5 max-w-xl ${paused ? 'border-amber-300 bg-amber-50' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${paused ? 'bg-amber-100 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
            <Power className="w-5 h-5" />
          </span>
          <div>
            <div className="text-sm font-medium text-slate-800">當前狀態：{paused ? '網銀服務已暫停' : '網銀服務正常運行'}</div>
            <div className="text-xs text-slate-400 mt-0.5">{paused ? '自 2026-10-06 起暫停，需管理員恢復' : '全部渠道功能正常可用'}</div>
          </div>
        </div>
        {!paused ? (
          <div className="mt-4">
            <button onClick={() => setConfirm(true)} className="border border-[#c8102e] text-[#c8102e] rounded-lg px-5 py-2 text-sm hover:bg-red-50">申請暫停網銀服務</button>
          </div>
        ) : (
          <button onClick={() => setPaused(false)} className="mt-4 bg-[#0b2a5b] text-white rounded-lg px-5 py-2 text-sm hover:bg-[#134b9e]">恢復網銀服務</button>
        )}
      </div>
      {confirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800">確認暫停網銀服務？</h3>
            <p className="text-sm text-slate-500 mt-2">暫停後所有使用者立即無法登錄企業網銀，審批中的交易將暫停流轉。該操作記入網銀操作日誌。</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setPaused(true); setConfirm(false) }} className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg py-2.5 text-sm font-medium">確認暫停</button>
              <button onClick={() => setConfirm(false)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Survey() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const questions = [
    { q: '您對新一代企業網銀整體體驗的評價？', opts: ['非常滿意', '滿意', '一般', '有待改進'] },
    { q: '您最常使用的功能模塊是？', opts: ['轉賬匯款', '賬戶查詢', '交易審批', '繳費支付'] },
    { q: '您是否願意推薦其他企業使用本行企業網銀？', opts: ['願意', '可能', '不會'] },
  ]
  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <div className="font-bold text-slate-800 mt-3">感謝您的參與！</div>
        <p className="text-sm text-slate-500 mt-1">問卷已提交，您的意見將幫助我們持續優化企業網銀服務。</p>
      </div>
    )
  }
  return (
    <div>
      <SectionTitle title="調查問卷" desc="《新一代企業網銀使用體驗問卷（2026 年第四季度）》· 僅需 1 分鐘" />
      <div className="space-y-6 max-w-xl">
        {questions.map((item, i) => (
          <div key={i}>
            <div className="text-sm text-slate-800 font-medium mb-2">{i + 1}. {item.q}</div>
            <div className="flex gap-2 flex-wrap">
              {item.opts.map(o => (
                <button key={o} onClick={() => setAnswers(a => ({ ...a, [i]: o }))}
                  className={`px-4 py-2 rounded-lg border text-sm ${answers[i] === o ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={() => Object.keys(answers).length === questions.length && setSubmitted(true)}
          disabled={Object.keys(answers).length !== questions.length}
          className="bg-[#c8102e] hover:bg-[#a50d26] disabled:bg-slate-300 text-white rounded-lg px-8 py-2.5 text-sm font-medium">提交問卷</button>
      </div>
    </div>
  )
}
