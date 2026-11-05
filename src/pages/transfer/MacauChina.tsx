import { useState } from 'react'
import { AlertTriangle, ArrowLeftRight, CheckCircle2, ShieldCheck } from 'lucide-react'

type Mode = '即時' | '單次預約' | '周期轉賬'
export default function MacauChina() {
  const [step, setStep] = useState<'edit' | 'confirm' | 'done'>('edit')
  const [fromCcy, setFromCcy] = useState('HKD')
  const [toCcy, setToCcy] = useState('MOP')
  const [amount, setAmount] = useState('100000.00')
  const [mode, setMode] = useState<Mode>('即時')
  const [holiday, setHoliday] = useState('順延至下一可處理營業日')
  const [confirmed, setConfirmed] = useState(false)
  const cross = fromCcy !== toCcy
  const receive = cross ? (Number(amount) * 1.032).toLocaleString('en-US', { minimumFractionDigits: 2 }) : Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })

  if (step === 'done') return <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center"><CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" /><h3 className="text-lg font-bold text-slate-800 mt-4">澳中轉賬指令已受理</h3><p className="text-sm text-slate-500 mt-2">渠道業務編號 MC20261028001。實際成功與否以核心或有權賬務系統整體賬務結果為準。</p><button onClick={() => { setStep('edit'); setConfirmed(false) }} className="mt-6 bg-[#0b2a5b] text-white rounded-lg px-6 py-2.5 text-sm">返回澳中轉賬</button></div>

  if (step === 'confirm') return <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
    <h3 className="font-bold text-slate-800 border-b pb-4">澳中轉賬 — 最終審批確認</h3>
    <p className="text-xs text-slate-400 mt-2">最終審批人須核對完整收付款資料{cross && mode === '即時' ? '及本次有效報價' : ''}。</p>
    <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm mt-5">
      <D k="支款賬戶" v={`${fromCcy} 往來賬戶　101-22-654321-8`} /><D k="支款金額" v={`${fromCcy} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
      <D k="澳中專用收款人" v="中山五金批發有限公司" /><D k="收款賬號" v="6222 0210 0100 8888（虛構）" />
      <D k="交易／收款幣種" v={toCcy} /><D k="執行方式" v={mode} />
      <D k="清算附言" v="十月原材料貨款" /><D k="渠道備註" v="採購部內部對賬" />
      {cross && mode === '即時' && <><D k="本次有效匯率（原型示例）" v={`1 ${fromCcy} = 1.0320 ${toCcy}`} /><D k="兌換後交易金額" v={`${toCcy} ${receive}`} /><D k="報價有效期" v="本次確認頁所示時效；逾期須重新取得報價" /><D k="費用及總扣款" v="以有權賬務／收費系統返回為準" /></>}
      {cross && mode !== '即時' && <D k="匯率安排" v="建立計劃時尚未確定；各期按實際執行時有效匯率處理" />}
    </dl>
    {cross && <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-5 text-xs text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{mode === '即時' ? '報價失效、金額或幣種改變時須重新取得報價並確認，原審批按關鍵要素變更規則失效。' : '預約或周期轉賬涉及匯兌，執行時可能因匯率、賬戶或其他條件而無法順利匯出；失敗期次不自動補扣。'}</div>}
    <label className="flex items-start gap-2 text-sm text-slate-700 mt-5"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />本人已核對收付款資料{cross && mode === '即時' ? '、有效匯率及兌換金額' : ''}，確認完成本次最終審批。</label>
    <div className="flex gap-3 mt-6"><button onClick={() => setStep('edit')} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm">返回修改</button><button disabled={!confirmed} onClick={() => setStep('done')} className="flex-1 bg-[#c8102e] disabled:bg-slate-300 text-white rounded-lg py-2.5 text-sm">完成認證並確認審批</button></div>
    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />認證強度不低於普通匯款；已完成合格認證者按公共規則複用。</p>
  </div>

  return <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-start justify-between mb-5"><div><h3 className="font-bold text-slate-800 flex items-center gap-2"><ArrowLeftRight className="w-5 h-5 text-[#134b9e]" />澳中轉賬</h3><p className="text-xs text-slate-400 mt-1">HKD／MOP 同幣種轉賬及交叉兌換；使用澳中轉賬專用收款人。</p></div><span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-1">目標方案原型</span></div>
    <Section title="支款及兌換安排">
      <F label="支款賬戶"><select className={input}><option>{fromCcy} 往來賬戶　101-22-654321-8</option></select></F>
      <F label="支款幣種"><select value={fromCcy} onChange={e => setFromCcy(e.target.value)} className={input}><option>HKD</option><option>MOP</option></select></F>
      <F label="交易／收款幣種"><select value={toCcy} onChange={e => setToCcy(e.target.value)} className={input}><option>MOP</option><option>HKD</option></select></F>
      <F label={`支款金額（${fromCcy}）`}><In v={amount} set={setAmount} /></F>
    </Section>
    <div className={`rounded-lg p-3 mb-5 text-xs border ${cross ? 'bg-blue-50 border-blue-100 text-[#134b9e]' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{cross ? mode === '即時' ? '本筆涉及交叉兌換。此頁不鎖定成交匯率，最終審批時須取得並確認有效報價。' : '本計劃涉及交叉兌換。各期按實際執行時有效匯率處理，建立計劃時不承諾成交匯率。' : '同幣種轉賬不進行兌換。實際結果以核心賬務記錄為準。'}</div>
    <Section title="澳中專用收款人">
      <F label="收款人"><select className={input}><option>中山五金批發有限公司｜版本 V3</option><option>珠海示例商貿有限公司｜版本 V1</option></select></F>
      <F label="收款賬號"><input value="6222 0210 0100 8888（虛構）" readOnly className={`${input} bg-slate-50`} /></F>
      <F label="收款銀行"><input value="中國銀行中山分行（原型示例）" readOnly className={`${input} bg-slate-50`} /></F>
      <F label="收款人維護"><button className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-[#134b9e] text-left">前往澳中專用收款人管理</button></F>
      <F label="清算附言"><input defaultValue="十月原材料貨款" className={input} /></F>
      <F label="渠道備註（僅企業內部）"><input defaultValue="採購部內部對賬" className={input} /></F>
    </Section>
    <Section title="執行方式">
      <F label="執行方式"><select value={mode} onChange={e => setMode(e.target.value as Mode)} className={input}><option>即時</option><option>單次預約</option><option>周期轉賬</option></select></F>
      <F label="首次／預約執行日"><input type="date" defaultValue="2026-11-02" disabled={mode === '即時'} className={`${input} disabled:bg-slate-100`} /></F>
      {mode !== '即時' && <><F label="頻率及截止條件"><select className={input} disabled={mode === '單次預約'}><option>每月，執行 3 期</option><option>每週，至 2027-01-31</option></select></F><F label="非營業日處理"><select value={holiday} onChange={e => setHoliday(e.target.value)} className={input}><option>順延至下一可處理營業日</option><option>取消該期</option></select></F></>}
    </Section>
    {mode !== '即時' && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-xs text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />請留意銀行營業時間及匯兌風險。首次審批後後續期次自動執行，但每期仍檢查賬戶、限額、材料及風控；非營業日按你的選擇順延或取消，不會靜默改期。</div>}
    <button onClick={() => { setStep('confirm'); setConfirmed(false) }} className="w-full bg-[#c8102e] text-white rounded-lg py-2.5 text-sm font-medium">進入最終審批確認</button>
  </div>
}

const input = 'w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm bg-white'
function In({ v, set }: { v: string; set: (v: string) => void }) { return <input value={v} onChange={e => set(e.target.value)} className={input} /> }
function F({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block mb-4"><span className="block text-sm text-slate-600 mb-1.5">{label}</span>{children}</label> }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mb-5"><h4 className="text-sm font-bold text-slate-700 border-l-4 border-[#134b9e] pl-2 mb-4">{title}</h4><div className="grid grid-cols-2 gap-x-5">{children}</div></section> }
function D({ k, v }: { k: string; v: string }) { return <div><dt className="text-xs text-slate-400">{k}</dt><dd className="mt-1 text-slate-700">{v}</dd></div> }
