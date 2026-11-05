import { useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardPaste, FileUp, Globe2, RotateCcw, ShieldCheck } from 'lucide-react'

type ExecMode = '即時' | '單次預約' | '周期匯款'

const initial = {
  account: '港元往來賬戶　101-22-654321-8', payee: 'Heng Seng Trading Co.',
  acct: '024-888-112233-4', country: '中國香港', bank: '恒生銀行（香港）',
  swift: 'HSBCHKHH', address: '香港中環示例道 88 號（虛構地址）', amount: '1800000.00',
  purpose: '第三季採購貨款', remitMemo: 'INV-2026-Q3-018', channelMemo: '採購三部／十月付款',
}

export default function Remit() {
  const [step, setStep] = useState<'edit' | 'confirm' | 'done'>('edit')
  const [form, setForm] = useState(initial)
  const [ccy, setCcy] = useState('HKD')
  const [mode, setMode] = useState<ExecMode>('即時')
  const [holiday, setHoliday] = useState('順延至下一可處理營業日')
  const [feeBear, setFeeBear] = useState('SHA')
  const [assisted, setAssisted] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [notice, setNotice] = useState('')
  const set = (key: keyof typeof initial, value: string) => setForm(f => ({ ...f, [key]: value }))
  const rates: Record<string, number> = { HKD: 1.03, USD: 8.02, EUR: 9.28, CNY: 1.13, GBP: 10.56, MOP: 1 }
  const amount = Number(form.amount) || 0
  const rate = rates[ccy] ?? 0
  const equivalent = Math.round(amount * rate * 100) / 100
  const singleLimit = 3000000
  const dailyLimit = 12000000
  const usedAndInflight = 2000000
  const remaining = dailyLimit - usedAndInflight - equivalent
  const limitExceeded = !rate || equivalent > singleLimit || equivalent > dailyLimit - usedAndInflight
  const largeApproval = equivalent > 1000000

  const recognise = () => {
    setForm(initial)
    setAssisted(true)
    setConfirmed(false)
  }

  if (step === 'done') return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center">
      <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
      <h3 className="text-lg font-bold text-slate-800 mt-4">匯款指令已受理，等待企業審批</h3>
      <p className="text-sm text-slate-500 mt-2">渠道業務編號 RM20261028001。受理不代表已扣賬、已發送或交易成功。</p>
      <div className="max-w-xl mx-auto text-left text-sm bg-slate-50 rounded-lg p-4 mt-5 space-y-2">
        <p>企業最終審批通過時占用渠道額度 → 適用的大額銀行審批 → 既有 AML／反欺詐檢查 → 執行前核驗 → SWIFT 發送</p>
        <p className="text-slate-500">{largeApproval ? '本筆嚴格超過等值 MOP 100 萬，須完成對應客戶關係部門大額審批。' : '本筆未超過等值 MOP 100 萬，不觸發本項大額審批。'}渠道限額與大額審批分別執行。</p>
        <p className="text-slate-500">已確認優惠快照：CH-HQ-RM-01／V1.0，標準匯費 MOP 220.00、減免 MOP 44.00、優惠後 MOP 176.00；最終由核心核驗，實際扣收後可在交易詳情查詢。</p>
      </div>
      <button onClick={() => { setStep('edit'); setConfirmed(false) }} className="mt-6 bg-[#0b2a5b] text-white rounded-lg px-6 py-2.5 text-sm">返回匯款頁</button>
    </div>
  )

  if (step === 'confirm') return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-5">
          <div><h3 className="font-bold text-slate-800">普通網上匯款（SWIFT）— 指令確認</h3><p className="text-xs text-slate-400 mt-1">請核對完整真實資料；本頁並非交易成功結果。</p></div>
          <Globe2 className="w-7 h-7 text-[#134b9e]" />
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <D k="支款賬戶" v={form.account} /><D k="匯出金額" v={`${ccy} ${Number(form.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} strong />
          <D k="收款人真實戶名" v={form.payee} /><D k="收款賬號" v={form.acct} />
          <D k="收款銀行" v={form.bank} /><D k="SWIFT／BIC" v={form.swift} />
          <D k="國家／地區" v={form.country} /><D k="費用承擔" v={feeBear} />
          <D k="匯款用途" v={form.purpose} /><D k="執行方式" v={mode} />
          <D k="清算附言（隨報文發送）" v={form.remitMemo} /><D k="渠道備註（僅企業內部）" v={form.channelMemo} />
          <D k="本行匯費（優惠後）" v="MOP 176.00" strong /><D k="背景材料" v="採購合同及發票（示例影像版本 V1）" />
        </dl>
        <div className="border border-emerald-200 bg-emerald-50/60 rounded-lg p-4 mt-5 text-xs text-slate-700">
          <div className="flex items-center justify-between mb-3"><p className="font-bold text-sm text-emerald-900">本筆已適用企網渠道優惠</p><span className="bg-emerald-100 text-emerald-800 rounded px-2 py-1">CH-HQ-RM-01｜V1.0</span></div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
            <D k="費用項目" v="SWIFT 匯費（FEE-SWIFT）" />
            <D k="標準匯費" v="MOP 220.00" />
            <D k="渠道優惠" v="8 折" />
            <D k="優惠減免" v="－MOP 44.00" />
            <D k="優惠後匯費" v="MOP 176.00" strong />
            <D k="優惠有效期" v="至 2026-12-31" />
          </div>
          <p className="mt-3 text-slate-500">核心／有權收費系統最終核驗規則版本及實收金額；郵電費、代理行費等按各自費用項目列示，不與本項匯費抵減。未能確定的後續費用不預設為零。</p>
          <p className="mt-1.5 text-slate-500">如提交時規則版本或金額已變化，本頁將重新展示試算結果，經再次確認後才提交。</p>
        </div>
        <div className={`border rounded-lg p-4 mt-5 text-xs ${limitExceeded ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-slate-700'}`}>
          <p className="font-bold text-sm mb-3">渠道限額核對（演示匯率及虛構額度）</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <D k="折算匯率（演示）" v={`1 ${ccy} = ${rate.toFixed(6)} MOP`} />
            <D k="MOP 等值金額" v={`MOP ${equivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} strong />
            <D k="實際生效單筆限額" v={`MOP ${singleLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
            <D k="單日已用＋在途" v={`MOP ${usedAndInflight.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
            <D k="本筆占用後單日餘額" v={`MOP ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} strong />
            <D k="共享範圍" v="網銀／手機銀行／銀企直連" />
          </div>
          <p className="mt-3">{limitExceeded ? '本筆超過單筆限額或單日可用額度，不得提交；請核對金額或限額。' : '本頁只作前置核對；企業最終審批通過時占用額度，執行前仍須重新核驗。'}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-xs text-amber-900 space-y-1.5">
          <p className="font-medium">大額審批及後續處理提示</p>
          <p>{largeApproval ? '本筆嚴格超過等值 MOP 100 萬，須經對應客戶關係部門大額審批；大額審批與渠道限額不相互抵扣。' : '本筆未超過等值 MOP 100 萬，不觸發本項大額審批；仍須完成其他適用檢查。'}</p>
          <p>企業審批後仍須完成既有 AML／反欺詐檢查。普通匯款不含兌換；後續代理行費用如未能於發起時確定，將按實際結果列示。</p>
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-700 mt-5"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />本人已逐項核對收款人、賬號、銀行、金額、幣種、附言、限額提示及材料，確認提交企業審批。</label>
        <div className="flex gap-3 mt-6"><button onClick={() => setStep('edit')} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">返回修改（原審批將失效）</button><button disabled={!confirmed || limitExceeded} onClick={() => { if (confirmed && !limitExceeded) setStep('done') }} className="flex-1 bg-[#c8102e] disabled:bg-slate-300 text-white rounded-lg py-2.5 text-sm">完成認證並提交審批</button></div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />新收款人、首次付款及最終確認按企網統一認證規則執行，認證不得繞過限額。</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><h3 className="font-bold text-slate-800">匯款／普通匯款（SWIFT）</h3><p className="text-xs text-slate-400 mt-1">客戶在「匯款」父入口自行選定產品；本頁不提供 SWIFT／FPS 智能改道。</p></div>
          <span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-1">目標方案原型</span>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-[#134b9e] mb-5">如需兌換，請先通過「外匯買賣（兌換）」備妥匯出幣種；普通匯款只從同幣種賬戶支款。人民幣及其他幣種可匯目的地按投產參數展示。</div>

        <div className="border border-slate-200 rounded-lg p-4 mb-5">
          <button onClick={recognise} className="flex items-center gap-2 text-sm text-[#134b9e] font-medium"><ClipboardPaste className="w-4 h-4" />粘貼付款資料並識別欄位</button>
          <p className="text-xs text-slate-400 mt-1">僅生成待核對草稿，不自動保存收款人、不自動提交交易。</p>
          {assisted && <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900"><b>識別結果待客戶核對：</b>已填入收款戶名、賬號、銀行、金額、幣種及用途；未能確認的內容不會猜填。請逐項核對下方欄位。</div>}
        </div>

        <Section title="支款及執行安排">
          <F label="支款賬戶" required><select value={form.account} onChange={e => set('account', e.target.value)} className={input}><option>港元往來賬戶　101-22-654321-8</option><option>美元往來賬戶　101-14-990011-2</option></select></F>
          <F label="匯出幣種" required><select value={ccy} onChange={e => setCcy(e.target.value)} className={input}>{['HKD', 'USD', 'EUR', 'CNY', 'GBP', 'MOP'].map(x => <option key={x}>{x}</option>)}</select></F>
          <F label={`匯款金額（${ccy}）`} required><In v={form.amount} set={v => set('amount', v)} /></F>
          <F label="費用承擔方式"><select value={feeBear} onChange={e => setFeeBear(e.target.value)} className={input}><option>SHA</option><option>OUR</option><option>BEN</option></select></F>
          <F label="執行方式"><select value={mode} onChange={e => setMode(e.target.value as ExecMode)} className={input}><option>即時</option><option>單次預約</option><option>周期匯款</option></select></F>
          <F label="首次／預約執行日"><input type="date" disabled={mode === '即時'} defaultValue="2026-11-02" className={`${input} disabled:bg-slate-100`} /></F>
          {mode !== '即時' && <><F label="頻率及截止條件"><select className={input} disabled={mode === '單次預約'}><option>每月，執行 3 期</option><option>每週，至 2027-01-31</option></select></F><F label="非營業日處理"><select value={holiday} onChange={e => setHoliday(e.target.value)} className={input}><option>順延至下一可處理營業日</option><option>取消該期</option></select></F></>}
        </Section>
        {mode !== '即時' && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />預約時間如處於銀行營業時間外，可能無法按原時間匯出；請選擇順延或取消該期。每期仍檢查賬戶、限額、材料及風控，失敗後不自動補扣或重發。</div>}

        <Section title="收款人及清算資料">
          <F label="收款人真實戶名" required><In v={form.payee} set={v => set('payee', v)} /></F>
          <F label="收款賬號／IBAN" required><In v={form.acct} set={v => set('acct', v)} /></F>
          <F label="收款國家／地區" required><In v={form.country} set={v => set('country', v)} /></F>
          <F label="收款銀行" required><In v={form.bank} set={v => set('bank', v)} /></F>
          <F label="SWIFT／BIC 或適用清算代碼"><In v={form.swift} set={v => set('swift', v)} /></F>
          <F label="收款人地址"><In v={form.address} set={v => set('address', v)} /></F>
          <F label="匯款用途" required><In v={form.purpose} set={v => set('purpose', v)} /></F>
          <F label="背景材料"><button className="w-full border border-dashed border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-500 text-left flex items-center gap-2"><FileUp className="w-4 h-4" />採購合同及發票（示例版本 V1）</button></F>
          <F label="清算附言（隨報文發送）"><In v={form.remitMemo} set={v => set('remitMemo', v)} /><span className="text-xs text-slate-400">可輸入長度及字元集按有權系統返回；加長須核心及報文配套。</span></F>
          <F label="渠道備註（不隨報文發送）"><In v={form.channelMemo} set={v => set('channelMemo', v)} /><span className="text-xs text-slate-400">供企業內部對賬，流水可直接查看交易時快照。</span></F>
        </Section>
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-4 mb-4 text-sm"><span className="text-slate-500">本行費用、其他費用及總扣款</span><span className="text-slate-700">確認時按有權系統結果展示，未確定費用不預設為零</span></div>
        <button onClick={() => { setStep('confirm'); setConfirmed(false) }} className="w-full bg-[#c8102e] text-white rounded-lg py-2.5 text-sm font-medium">核對匯款指令</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3">近期匯款及後續申請</h3>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[['RM20261002001', '已發送', '不等於收款人最終入賬'], ['RM20260920003', '退匯申請處理中', '受理不等於退款完成'], ['RM20260918006', '結果核實中', '先查原交易，不得重新發起']].map(([id, status, tip]) => <button key={id} onClick={() => setNotice(`${id}：可提交退匯／改匯申請；獨立申請編號關聯原業務，不直接改寫原報文。`)} className="border border-slate-200 rounded-lg p-3 text-left hover:border-[#134b9e]"><span className="font-mono text-slate-500">{id}</span><p className="font-medium text-slate-700 mt-1">{status}</p><p className="text-slate-400 mt-1">{tip}</p><span className="text-[#134b9e] mt-2 inline-flex items-center gap-1"><RotateCcw className="w-3 h-3" />退匯／改匯</span></button>)}
        </div>
        {notice && <p className="text-xs text-[#134b9e] bg-blue-50 rounded p-3 mt-3">{notice}</p>}
      </div>
    </div>
  )
}

const input = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white'
function In({ v, set }: { v: string; set: (v: string) => void }) { return <input value={v} onChange={e => set(e.target.value)} className={input} /> }
function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <label className="block mb-4"><span className="block text-sm text-slate-600 mb-1.5">{required && <span className="text-[#c8102e]">* </span>}{label}</span>{children}</label> }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mb-5"><h4 className="text-sm font-bold text-slate-700 border-l-4 border-[#134b9e] pl-2 mb-4">{title}</h4><div className="grid grid-cols-2 gap-x-5">{children}</div></section> }
function D({ k, v, strong }: { k: string; v: string; strong?: boolean }) { return <div><dt className="text-xs text-slate-400">{k}</dt><dd className={`mt-1 ${strong ? 'font-bold text-[#c8102e]' : 'text-slate-700'}`}>{v}</dd></div> }
