import { useMemo, useState } from 'react'
import { accounts, payees, fmt, maskAcct } from '@/lib/mock'
import { toChineseCapital } from '@/lib/numcn'
import { Breadcrumb } from '../Accounts'
import { CheckCircle2, ShieldCheck, Download, RotateCcw, ChevronDown } from 'lucide-react'
import type { PageKey } from '@/components/Layout'

const LIMIT_SINGLE = 5000000
const LIMIT_DAILY_REMAIN = 4260000

export default function Wizard({ setPage, onSubmitted }: { setPage: (p: PageKey) => void; onSubmitted: (info?: { amount: number; payeeName: string; payee: string }) => void }) {
  const [step, setStep] = useState(1)
  const [payer, setPayer] = useState(accounts[0].no)
  const [payee, setPayee] = useState('')
  const [payeeName, setPayeeName] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [postscript, setPostscript] = useState('')
  const [savePayee, setSavePayee] = useState(false)
  const [timing, setTiming] = useState('realtime')
  const [auth, setAuth] = useState<'sms' | 'softtoken'>('sms')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPayees, setShowPayees] = useState(false)

  const amt = parseFloat(amount) || 0
  const capital = useMemo(() => (amt > 0 ? toChineseCapital(amt) : ''), [amt])
  const payerAcct = accounts.find(a => a.no === payer)!
  const refNo = 'TF' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.floor(Math.random() * 900) + 100)

  const validate1 = () => {
    const e: Record<string, string> = {}
    if (!payee.trim()) e.payee = '請輸入收款賬號'
    if (!payeeName.trim()) e.payeeName = '請輸入收款戶名'
    if (!amount || amt <= 0) e.amount = '請輸入轉賬金額'
    else if (amt > payerAcct.available) e.amount = `轉賬金額超出付款賬戶可用餘額（${fmt(payerAcct.available, payerAcct.ccy)}）`
    else if (amt > LIMIT_SINGLE) e.amount = `超出單筆限額 ${fmt(LIMIT_SINGLE, 'MOP')}，您可申請調整限額或聯繫客戶經理`
    else if (amt > LIMIT_DAILY_REMAIN) e.amount = `超出今日剩餘限額 ${fmt(LIMIT_DAILY_REMAIN, 'MOP')}（單日累計限額管理）`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const StepBar = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {['填寫轉賬信息', '確認轉賬信息', '轉賬結果'].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-[#0b2a5b] text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </span>
            <span className={`text-sm ${step === i + 1 ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>{s}</span>
          </div>
          {i < 2 && <div className={`w-24 h-px mx-3 ${step > i + 1 ? 'bg-emerald-500' : 'bg-slate-300'}`} />}
        </div>
      ))}
    </div>
  )

  const Tips = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 text-xs leading-relaxed text-amber-900">
      <div className="font-bold mb-1.5">溫馨提示</div>
      <p>1. 行內轉賬提供 7×24 小時服務，實時到賬；預約轉賬在系統轉出前可在「轉賬匯款 → 預約管理」撤銷。</p>
      <p>2. 選擇實時轉賬的，請充分確認收款人賬戶的安全性及準確性。</p>
      <p>3. 您的單筆限額為 {fmt(LIMIT_SINGLE, 'MOP')}，今日剩餘限額 {fmt(LIMIT_DAILY_REMAIN, 'MOP')}，可在「安全中心 → 交易限額設置」自助查詢。</p>
      <p>4. 防範電信網絡新型違法犯罪，請謹記「四不原則」：不匯款、不輕信、不泄密、不鏈接。</p>
    </div>
  )

  return (
    <div className="relative z-10 max-w-3xl mx-auto">
      <Breadcrumb items={['轉賬匯款', '轉賬', '行內轉賬']} />
      <div className="mt-4"><StepBar /></div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-7">
          <Field label="付款賬戶" required>
            <div className="relative">
              <select value={payer} onChange={e => setPayer(e.target.value)}
                className="w-full appearance-none border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]">
                {accounts.filter(a => a.type === '往來').map(a => (
                  <option key={a.no} value={a.no}>{maskAcct(a.no)}（{a.name}）</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 mt-1">可用餘額 {fmt(payerAcct.available, payerAcct.ccy)}</p>
          </Field>

          <Field label="收款賬號" required error={errors.payee}>
            <div className="flex gap-2">
              <input value={payee} onChange={e => { setPayee(e.target.value); setErrors(p => ({ ...p, payee: '' })) }}
                placeholder="請輸入收款人賬號"
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
              <div className="relative">
                <button onClick={() => setShowPayees(v => !v)}
                  className="h-full border border-[#134b9e] text-[#134b9e] rounded-lg px-3 text-sm hover:bg-blue-50">查詢收款名冊</button>
                {showPayees && (
                  <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-lg shadow-lg w-72 z-20">
                    {payees.map(p => (
                      <button key={p.acct} onClick={() => { setPayee(p.acct); setPayeeName(p.name); setShowPayees(false); setErrors({}) }}
                        className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0">
                        <div className="text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.acct}　{p.bank}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Field>

          <Field label="收款戶名" required error={errors.payeeName}>
            <input value={payeeName} onChange={e => { setPayeeName(e.target.value); setErrors(p => ({ ...p, payeeName: '' })) }}
              placeholder="請輸入收款人戶名"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
          </Field>

          <Field label="轉賬金額（MOP）" required error={errors.amount}>
            <input value={amount} onChange={e => { if (/^\d*\.?\d{0,2}$/.test(e.target.value)) setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }}
              inputMode="decimal" placeholder="0.00"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-500">{capital && <>大寫金額：<span className="text-[#c8102e] font-medium">{capital}</span></>}</span>
              <button type="button" className="text-xs text-[#134b9e] hover:underline">手續費標準</button>
            </div>
          </Field>

          <Field label="摘要">
            <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="行內轉賬"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
          </Field>

          <Field label="附言">
            <input value={postscript} onChange={e => setPostscript(e.target.value)} maxLength={60} placeholder="最多 60 字（備注附言欄位已擴展）"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
          </Field>

          <Field label="轉賬時間" required>
            <div className="grid grid-cols-2 gap-2">
              {[['realtime', '實時轉賬'], ['2h', '預約兩小時後轉賬'], ['nextday', '預約次日轉賬'], ['other', '預約其他轉賬時間']].map(([k, label]) => (
                <label key={k} className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm cursor-pointer ${timing === k ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>
                  <input type="radio" checked={timing === k} onChange={() => setTiming(k)} className="accent-[#134b9e]" />{label}
                </label>
              ))}
            </div>
            {timing !== 'realtime' && (
              <p className="text-xs text-amber-600 mt-1.5">提醒：若預約時間處於銀行營業時間外，涉及匯兌場景可能無法順利匯出。</p>
            )}
          </Field>

          <label className="flex items-center gap-2 text-sm text-slate-600 mb-5">
            <input type="checkbox" checked={savePayee} onChange={e => setSavePayee(e.target.checked)} className="accent-[#134b9e]" />
            加入收款名冊，下次可直接調用
          </label>

          <div className="flex gap-3">
            <button onClick={() => validate1() && setStep(2)}
              className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] text-white font-medium rounded-lg py-2.5 transition-colors">下一步</button>
            <button className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600 hover:border-slate-400">保存模板</button>
            <button className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600 hover:border-slate-400">調用模板</button>
            <button onClick={() => { setPayee(''); setPayeeName(''); setAmount(''); setMemo(''); setPostscript(''); setErrors({}) }}
              className="flex items-center gap-1 border border-slate-300 rounded-lg px-4 text-sm text-slate-600 hover:border-slate-400"><RotateCcw className="w-3.5 h-3.5" />重置</button>
          </div>
          <Tips />
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-7">
          <h3 className="font-bold text-slate-800 mb-4">請確認轉賬信息</h3>
          <dl className="text-sm divide-y divide-slate-100">
            {[
              ['付款賬戶', `${maskAcct(payer)}（${payerAcct.name}）`],
              ['收款賬號', payee],
              ['收款戶名', payeeName],
              ['轉賬金額', fmt(amt, 'MOP')],
              ['大寫金額', capital],
              ['手續費', 'MOP 0.00（網銀渠道優惠）'],
              ['摘要', memo || '行內轉賬'],
              ['附言', postscript || '—'],
              ['轉賬時間', { realtime: '實時轉賬', '2h': '預約兩小時後轉賬', nextday: '預約次日轉賬', other: '預約其他轉賬時間' }[timing]],
            ].map(([k, v]) => (
              <div key={k as string} className="flex py-2.5">
                <dt className="w-28 text-slate-400 shrink-0">{k}</dt>
                <dd className="text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" />安全認證（按風險分級匹配認證工具）</div>
            <div className="flex gap-2 mb-4">
              {([['sms', '短訊驗證碼'], ['softtoken', 'Soft Token']] as const).map(([k, label]) => (
                <button key={k} onClick={() => setAuth(k)}
                  className={`px-4 py-2 rounded-lg border text-sm ${auth === k ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>{label}</button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                placeholder={auth === 'sms' ? '請輸入 6 位短訊驗證碼（演示版任意 6 位數字）' : '請輸入 Soft Token 動態密碼（演示版任意 6 位數字）'}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
              {auth === 'sms' && <button className="border border-[#134b9e] text-[#134b9e] rounded-lg px-4 py-2.5 text-sm hover:bg-blue-50">獲取驗證碼</button>}
            </div>
          </div>

          <div className="flex gap-3 mt-7">
            <button onClick={() => { if (otp.length === 6) { onSubmitted({ amount: amt, payeeName, payee }); setStep(3) } }}
              disabled={otp.length !== 6}
              className="flex-1 bg-[#c8102e] hover:bg-[#a50d26] disabled:bg-slate-300 text-white font-medium rounded-lg py-2.5 transition-colors">確認提交</button>
            <button onClick={() => setStep(1)} className="border border-slate-300 rounded-lg px-6 text-sm text-slate-600 hover:border-slate-400">返回修改</button>
          </div>
          <p className="text-xs text-slate-400 mt-3">提交後交易將按企業審批模式流轉：本交易需一級審批（審批員）→ 二級審批（財務總監）。</p>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 mt-4">轉賬指令已提交，待審批</h3>
          <p className="text-sm text-slate-500 mt-2">網銀流水號 <span className="font-mono text-slate-700">{refNo}</span></p>
          <p className="text-sm text-slate-500 mt-1">金額 {fmt(amt, 'MOP')}（{capital}）→ {payeeName}</p>
          <p className="text-xs text-slate-400 mt-3">交易已進入審批流程：一級審批（審批員）→ 二級審批（財務總監），審批結果將以短訊及消息中心通知您。</p>
          <div className="flex gap-3 justify-center mt-8">
            <button onClick={() => setPage('approvals')} className="bg-[#0b2a5b] text-white rounded-lg px-6 py-2.5 text-sm hover:bg-[#134b9e]">前往交易審批</button>
            <button className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-5 py-2.5 text-sm text-slate-600 hover:border-slate-400"><Download className="w-4 h-4" />下載電子回單</button>
            <button onClick={() => { setStep(1); setPayee(''); setPayeeName(''); setAmount(''); setOtp('') }}
              className="border border-slate-300 rounded-lg px-5 py-2.5 text-sm text-slate-600 hover:border-slate-400">繼續轉賬</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-sm text-slate-600 mb-1.5">{required && <span className="text-[#c8102e] mr-0.5">*</span>}{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
