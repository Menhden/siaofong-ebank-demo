import { useEffect, useMemo, useState } from 'react'
import { Breadcrumb } from './Accounts'
import { COMPANY, fmt, maskAcct } from '@/lib/mock'
import {
  Banknote, Building2, CalendarDays, CheckCircle2, ChevronRight, CircleAlert,
  Download, FileSpreadsheet, Home, Info, Printer, RotateCcw, Search, ShieldCheck, X,
} from 'lucide-react'

type Section = 'detail' | 'balance' | 'schedule' | 'collateral'
type LoanStatus = '正常' | '逾期' | '已結清'
type RepaymentType = '正常還款' | '逾期還款'

type Repayment = {
  actualDate: string
  period: number
  dueDate: string
  amount: number
  principal: number
  interest: number
  principalPenalty: number
  interestPenalty: number
  type: RepaymentType
}

type Collateral = {
  buildingCode: string
  unitCode: string
  parkingCode: string
  buildingName: string
  deedDate: string
  deedPlace: string
}

type LoanRecord = {
  id: string
  alias: string
  type: string
  ccy: 'MOP' | 'HKD'
  status: LoanStatus
  rate: number
  principal: number
  outstanding: number
  branch: string
  totalPeriods: number
  remainingPeriods: number
  startDate: string
  maturityDate: string
  nextPaymentDate: string | null
  repaymentAccount: string
  currentSchedule: { period: number; date: string; amount: number; principal: number; interest: number } | null
  lastRepayment: Repayment | null
  arrears: { principal: number; interest: number; penalty: number; stamp: number; insurance: number; other: number; total: number }
  insurance: { reference: string; expiry: string; autoDebitAccount: string } | null
  repayments: Repayment[]
  collateral: Collateral[]
}

const DATA_TIME = '2026-11-03 10:30:18'
const DEFAULT_FROM = '2025-11-03'
const DEFAULT_TO = '2026-11-03'

const repayment = (
  actualDate: string, period: number, dueDate: string, amount: number, principal: number,
  interest: number, principalPenalty = 0, interestPenalty = 0, type: RepaymentType = '正常還款',
): Repayment => ({ actualDate, period, dueDate, amount, principal, interest, principalPenalty, interestPenalty, type })

const loanRecords: LoanRecord[] = [
  {
    id: '301-88-123456-7', alias: '營運資金貸款', type: '中小企業循環貸款', ccy: 'MOP', status: '正常',
    rate: 3.85, principal: 5000000, outstanding: 3250000, branch: '小鋒銀行總行營業部',
    totalPeriods: 60, remainingPeriods: 19, startDate: '2023-06-15', maturityDate: '2028-06-15',
    nextPaymentDate: '2026-11-15', repaymentAccount: '101-88-123456-7',
    currentSchedule: { period: 42, date: '2026-11-15', amount: 64589, principal: 54167, interest: 10422 },
    lastRepayment: repayment('2026-10-15', 41, '2026-10-15', 64589, 54167, 10422),
    arrears: { principal: 0, interest: 0, penalty: 0, stamp: 0, insurance: 0, other: 0, total: 0 },
    insurance: { reference: 'INS-2026-0888', expiry: '2027-06-14', autoDebitAccount: '101-88-123456-7' },
    repayments: [
      repayment('2026-10-15', 41, '2026-10-15', 64589, 54167, 10422),
      repayment('2026-09-15', 40, '2026-09-15', 64723, 54167, 10556),
      repayment('2026-08-17', 39, '2026-08-15', 66345.5, 54167, 10689, 892.5, 597, '逾期還款'),
      repayment('2026-07-15', 38, '2026-07-15', 64990, 54167, 10823),
      repayment('2026-06-15', 37, '2026-06-15', 65123, 54167, 10956),
      repayment('2026-05-15', 36, '2026-05-15', 65256, 54167, 11089),
    ],
    collateral: [
      { buildingCode: 'B-0255', unitCode: 'U-12A', parkingCode: '—', buildingName: '中土大廈十二樓 A 座（虛構）', deedDate: '2023-06-08', deedPlace: '澳門特別行政區' },
    ],
  },
  {
    id: '302-22-654321-8', alias: '氹仔物業按揭', type: '商用物業按揭貸款', ccy: 'HKD', status: '逾期',
    rate: 3.35, principal: 12000000, outstanding: 10850000, branch: '小鋒銀行氹仔分行',
    totalPeriods: 180, remainingPeriods: 149, startDate: '2024-03-20', maturityDate: '2039-03-20',
    nextPaymentDate: '2026-11-20', repaymentAccount: '101-22-654321-8',
    currentSchedule: { period: 32, date: '2026-11-20', amount: 96973, principal: 66667, interest: 30306 },
    lastRepayment: repayment('2026-10-23', 31, '2026-10-20', 98391.2, 66667, 30306, 912.2, 506, '逾期還款'),
    arrears: { principal: 66667, interest: 30306, penalty: 1418.2, stamp: 0, insurance: 12800, other: 0, total: 111191.2 },
    insurance: { reference: 'INS-2026-0120', expiry: '2027-03-19', autoDebitAccount: '101-22-654321-8' },
    repayments: [
      repayment('2026-10-23', 31, '2026-10-20', 98391.2, 66667, 30306, 912.2, 506, '逾期還款'),
      repayment('2026-09-20', 30, '2026-09-20', 97159, 66667, 30492),
      repayment('2026-08-20', 29, '2026-08-20', 97345, 66667, 30678),
      repayment('2026-07-20', 28, '2026-07-20', 97531, 66667, 30864),
    ],
    collateral: [
      { buildingCode: 'B-0326', unitCode: 'U-B08', parkingCode: 'P-208', buildingName: '工業中心 B 座八樓（虛構）', deedDate: '2024-03-12', deedPlace: '澳門特別行政區' },
      { buildingCode: 'B-0326', unitCode: '—', parkingCode: 'P-209', buildingName: '工業中心停車位（虛構）', deedDate: '2024-03-12', deedPlace: '澳門特別行政區' },
    ],
  },
  {
    id: '303-88-778899-0', alias: '短期周轉貸款', type: '企業短期貸款', ccy: 'MOP', status: '已結清',
    rate: 4.1, principal: 800000, outstanding: 0, branch: '小鋒銀行皇朝分行',
    totalPeriods: 12, remainingPeriods: 0, startDate: '2025-09-30', maturityDate: '2026-09-30',
    nextPaymentDate: null, repaymentAccount: '101-88-123456-7', currentSchedule: null,
    lastRepayment: repayment('2026-09-30', 12, '2026-09-30', 68940, 66667, 2273),
    arrears: { principal: 0, interest: 0, penalty: 0, stamp: 0, insurance: 0, other: 0, total: 0 },
    insurance: null,
    repayments: [
      repayment('2026-09-30', 12, '2026-09-30', 68940, 66667, 2273),
      repayment('2026-08-31', 11, '2026-08-30', 69167, 66667, 2500),
      repayment('2026-07-30', 10, '2026-07-30', 69394, 66667, 2727),
    ],
    collateral: [],
  },
]

const NAV: { key: Section; label: string; icon: typeof Banknote }[] = [
  { key: 'detail', label: '貸款詳情查詢', icon: Banknote },
  { key: 'balance', label: '貸款結欠查詢', icon: FileSpreadsheet },
  { key: 'schedule', label: '還款明細查詢', icon: CalendarDays },
  { key: 'collateral', label: '抵押物業資料查詢', icon: Home },
]

function money(value: number, ccy: 'MOP' | 'HKD') {
  return fmt(value, ccy)
}

function nullable(value: string | number | null | undefined) {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-2.5 text-sm last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className={`break-all ${strong ? 'font-semibold text-[#b4232f]' : 'text-slate-800'}`}>{value}</span>
    </div>
  )
}

function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-2 mt-5 flex items-end justify-between first:mt-0">
      <h3 className="text-sm font-semibold text-[#0b2a5b]">{title}</h3>
      {note && <span className="text-xs text-slate-400">{note}</span>}
    </div>
  )
}

function DataTime() {
  return <span className="inline-flex items-center gap-1 text-xs text-slate-400"><Info className="h-3.5 w-3.5" />資料時間：{DATA_TIME}（以有權系統返回為準）</span>
}

function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <Home className="mb-3 h-8 w-8 text-slate-400" />
      <div className="text-sm font-medium text-slate-700">{title}</div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  )
}

export default function Loans() {
  const [selected, setSelected] = useState(loanRecords[0].id)
  const [sec, setSec] = useState<Section>('detail')
  const [status, setStatus] = useState<'全部' | LoanStatus>('全部')
  const [ccy, setCcy] = useState<'全部' | 'MOP' | 'HKD'>('全部')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [type, setType] = useState<'全部' | RepaymentType>('全部')
  const [query, setQuery] = useState({ from: DEFAULT_FROM, to: DEFAULT_TO, type: '全部' as '全部' | RepaymentType })
  const [queryError, setQueryError] = useState('')
  const [exportOpen, setExportOpen] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [authError, setAuthError] = useState('')
  const [toast, setToast] = useState('')

  const filteredLoans = useMemo(() => loanRecords.filter(l =>
    (status === '全部' || l.status === status) && (ccy === '全部' || l.ccy === ccy),
  ), [status, ccy])
  const loan = loanRecords.find(l => l.id === selected) ?? loanRecords[0]

  useEffect(() => {
    if (filteredLoans.length && !filteredLoans.some(l => l.id === selected)) setSelected(filteredLoans[0].id)
  }, [filteredLoans, selected])

  useEffect(() => {
    if (!exportOpen) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setExportOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [exportOpen])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredRepayments = useMemo(() => loan.repayments.filter(r =>
    r.actualDate >= query.from && r.actualDate <= query.to && (query.type === '全部' || r.type === query.type),
  ).sort((a, b) => b.actualDate.localeCompare(a.actualDate) || b.period - a.period), [loan, query])

  const runQuery = () => {
    if (!from || !to) {
      setQueryError('請選擇實際還款日期的開始及結束日期。')
      return
    }
    if (from > to) {
      setQueryError('開始日期不得晚於結束日期。')
      return
    }
    const days = (new Date(to).getTime() - new Date(from).getTime()) / 86400000
    if (days > 366) {
      setQueryError('單次查詢區間最長 12 個月，請縮短日期範圍後重新查詢。')
      return
    }
    setQueryError('')
    setQuery({ from, to, type })
  }

  const resetQuery = () => {
    setFrom(DEFAULT_FROM)
    setTo(DEFAULT_TO)
    setType('全部')
    setQuery({ from: DEFAULT_FROM, to: DEFAULT_TO, type: '全部' })
    setQueryError('')
  }

  const exportRows = () => {
    if (sec === 'detail') {
      return [
        ['企業名稱', COMPANY], ['貸款賬號', loan.id], ['戶名', COMPANY], ['貸款種類', loan.type],
        ['幣種', loan.ccy], ['賬戶狀態', loan.status], ['執行利率', `${loan.rate.toFixed(2)}%`],
        ['貸款金額', money(loan.principal, loan.ccy)], ['貸款餘額', money(loan.outstanding, loan.ccy)],
        ['貸款行', loan.branch], ['還款總期數', `${loan.totalPeriods} 期`], ['剩餘期數', `${loan.remainingPeriods} 期`],
        ['起息日', loan.startDate], ['到期日', loan.maturityDate], ['下次還款日', nullable(loan.nextPaymentDate)],
        ['還款賬號', loan.repaymentAccount], ['資料時間', DATA_TIME], ['用途說明', '僅供查詢，不作為正式證明'],
      ]
    }
    if (sec === 'balance') {
      return [
        ['貸款賬號', loan.id], ['幣種', loan.ccy], ['賬戶狀態', loan.status],
        ['本金餘欠', money(loan.outstanding, loan.ccy)], ['現行利率', `${loan.rate.toFixed(2)}%`],
        ['下期供款日期', nullable(loan.nextPaymentDate)],
        ['下期供款金額', loan.currentSchedule ? money(loan.currentSchedule.amount, loan.ccy) : '—'],
        ['借款起期日', loan.startDate], ['借款到期日', loan.maturityDate], ['還款賬號', loan.repaymentAccount],
        ['逾期本金', money(loan.arrears.principal, loan.ccy)], ['積欠利息', money(loan.arrears.interest, loan.ccy)],
        ['逾期違約金', money(loan.arrears.penalty, loan.ccy)], ['印花稅', money(loan.arrears.stamp, loan.ccy)],
        ['保險費', money(loan.arrears.insurance, loan.ccy)], ['其他應付款項', money(loan.arrears.other, loan.ccy)],
        ['合計', money(loan.arrears.total, loan.ccy)], ['保險參考編號', loan.insurance?.reference ?? '—'],
        ['保險到期日', loan.insurance?.expiry ?? '—'], ['保費自動轉賬賬號', loan.insurance?.autoDebitAccount ?? '—'],
        ['資料時間', DATA_TIME], ['用途說明', '僅供查詢，不作為正式證明'],
      ]
    }
    if (sec === 'schedule') {
      return [
        ['實際還款日期', '還款期次', '應還款日期', '實際還款金額', '本金', '利息', '逾期本金罰息', '逾期利息罰息', '還款類型'],
        ...filteredRepayments.map(r => [r.actualDate, r.period, r.dueDate, money(r.amount, loan.ccy), money(r.principal, loan.ccy), money(r.interest, loan.ccy), money(r.principalPenalty, loan.ccy), money(r.interestPenalty, loan.ccy), r.type]),
      ]
    }
    return [
      ['樓宇代號', '單位代號', '車位代號', '樓宇名稱', '簽契日期', '簽契地點'],
      ...loan.collateral.map(c => [c.buildingCode, c.unitCode, c.parkingCode, c.buildingName, c.deedDate, c.deedPlace]),
    ]
  }

  const downloadExcel = () => {
    const rows = exportRows()
    const escape = (value: string | number) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const table = rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')
    const html = `<!doctype html><html><head><meta charset="UTF-8"></head><body><table>${table}</table></body></html>`
    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `企業貸款_${NAV.find(n => n.key === sec)?.label}_${loan.id}_${DATA_TIME.slice(0, 10)}.xls`
    link.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
    setAuthCode('')
    setToast(`已導出當前查詢條件下全部結果，並記錄安全審計日誌（演示）。`)
  }

  const confirmExport = () => {
    if (!/^\d{6}$/.test(authCode)) {
      setAuthError('請輸入 6 位認證碼（演示環境可輸入任意 6 位數字）。')
      return
    }
    setAuthError('')
    downloadExcel()
  }

  const switchSection = (next: Section) => {
    setSec(next)
    setQueryError('')
  }

  return (
    <div className="relative z-10 mx-auto max-w-[1600px] pb-8">
      <Breadcrumb items={['企業貸款']} />
      <div className="mb-4 mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">企業貸款</h1>
          <p className="mt-1 text-sm text-slate-500">查詢同一企業客戶號下的貸款資料；所有金額、狀態及日期均以有權系統返回為準。</p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-[#174b86]">
          目標方案原型示意圖（虛構資料） · 僅供查詢，不涉及貸款申請或還款交易
        </div>
      </div>

      <div className="flex items-start gap-5">
        <aside className="w-72 shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">貸款賬戶</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{filteredLoans.length} / {loanRecords.length} 筆</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-500">狀態
                <select aria-label="貸款狀態篩選" value={status} onChange={e => setStatus(e.target.value as '全部' | LoanStatus)} className="mt-1 min-h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#134b9e] focus:ring-2 focus:ring-blue-100">
                  <option>全部</option><option>正常</option><option>逾期</option><option>已結清</option>
                </select>
              </label>
              <label className="text-xs text-slate-500">幣種
                <select aria-label="貸款幣種篩選" value={ccy} onChange={e => setCcy(e.target.value as '全部' | 'MOP' | 'HKD')} className="mt-1 min-h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#134b9e] focus:ring-2 focus:ring-blue-100">
                  <option>全部</option><option>MOP</option><option>HKD</option>
                </select>
              </label>
            </div>
          </div>
          <div className="max-h-[610px] space-y-2 overflow-auto p-3">
            {filteredLoans.map(l => (
              <button key={l.id} onClick={() => setSelected(l.id)} className={`w-full cursor-pointer rounded-lg border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus:ring-[#134b9e] ${selected === l.id ? 'border-[#134b9e] bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-800">{l.alias}</span>
                  <span className={`rounded px-2 py-0.5 text-xs ${l.status === '正常' ? 'bg-emerald-50 text-emerald-700' : l.status === '逾期' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
                </div>
                <div className="mt-1 font-mono text-xs text-slate-500">{maskAcct(l.id)}</div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <span className="text-xs text-slate-400">{l.type}</span>
                  <span className="text-sm font-semibold text-slate-800">{money(l.outstanding, l.ccy)}</span>
                </div>
              </button>
            ))}
            {!filteredLoans.length && (
              <div className="px-3 py-8 text-center">
                <p className="text-sm text-slate-500">沒有符合篩選條件的貸款</p>
                <button onClick={() => { setStatus('全部'); setCcy('全部') }} className="mt-3 min-h-10 cursor-pointer rounded-md border border-slate-300 px-3 text-sm text-[#134b9e] hover:bg-slate-50">重設篩選</button>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 px-4 py-3 text-xs leading-5 text-slate-400">列表賬號適度脫敏；進入詳情後可按權限查看完整賬號。</div>
        </aside>

        <section className="min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-800">{loan.alias}</h2>
                <span className={`rounded px-2 py-0.5 text-xs ${loan.status === '正常' ? 'bg-emerald-50 text-emerald-700' : loan.status === '逾期' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{loan.status}</span>
              </div>
              <div className="mt-1 font-mono text-xs text-slate-500">{loan.id} · {loan.ccy} · {loan.type}</div>
            </div>
            <div className="flex gap-2">
              {(sec === 'schedule' || sec === 'collateral') && (
                <button onClick={() => window.print()} className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md border border-slate-300 px-3 text-sm text-slate-600 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus:ring-[#134b9e]"><Printer className="h-4 w-4" />列印</button>
              )}
              <button onClick={() => { setExportOpen(true); setAuthCode(''); setAuthError('') }} className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md bg-[#0b2a5b] px-3 text-sm font-medium text-white outline-none transition-colors hover:bg-[#134b9e] focus-visible:ring-2 focus:ring-blue-300"><Download className="h-4 w-4" />導出全部結果 Excel</button>
            </div>
          </div>

          <div className="flex overflow-x-auto border-b border-slate-200 px-3" role="tablist" aria-label="企業貸款查詢功能">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button key={key} role="tab" aria-selected={sec === key} onClick={() => switchSection(key)} className={`flex min-h-12 shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-3 text-sm outline-none transition-colors focus-visible:bg-slate-100 ${sec === key ? 'border-[#c8102e] font-medium text-[#c8102e]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {sec === 'detail' && <Detail loan={loan} onSchedule={() => switchSection('schedule')} />}
            {sec === 'balance' && <Balance loan={loan} />}
            {sec === 'schedule' && (
              <Schedule loan={loan} repayments={filteredRepayments} from={from} to={to} type={type} query={query} error={queryError}
                setFrom={setFrom} setTo={setTo} setType={setType} onQuery={runQuery} onReset={resetQuery} />
            )}
            {sec === 'collateral' && <CollateralView loan={loan} />}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
            <DataTime />
            <span className="text-xs text-slate-400">查詢、導出及列印結果不構成還款指示、貸款證明或正式結欠證明。</span>
          </div>
        </section>
      </div>

      {exportOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={e => e.target === e.currentTarget && setExportOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="loan-export-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-[#134b9e]"><ShieldCheck className="h-6 w-6" /></div>
                <div><h2 id="loan-export-title" className="font-semibold text-slate-800">導出安全認證</h2><p className="mt-0.5 text-xs text-slate-500">沿用企網統一雙重認證及安全審計</p></div>
              </div>
              <button aria-label="關閉導出認證" onClick={() => setExportOpen(false)} className="cursor-pointer rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              將導出 <b>{NAV.find(n => n.key === sec)?.label}</b> 在當前查詢條件下的全部結果，檔案含完整貸款及還款賬號。
            </div>
            <label className="mt-4 block text-sm font-medium text-slate-700">6 位認證碼
              <input autoFocus inputMode="numeric" maxLength={6} value={authCode} onChange={e => { setAuthCode(e.target.value.replace(/\D/g, '')); setAuthError('') }} onKeyDown={e => e.key === 'Enter' && confirmExport()} placeholder="演示環境輸入任意 6 位數字" className="mt-2 min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm tracking-widest outline-none focus:border-[#134b9e] focus:ring-2 focus:ring-blue-100" />
            </label>
            {authError && <p role="alert" className="mt-2 flex items-center gap-1 text-xs text-red-600"><CircleAlert className="h-3.5 w-3.5" />{authError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setExportOpen(false)} className="min-h-10 cursor-pointer rounded-md border border-slate-300 px-4 text-sm text-slate-600 hover:bg-slate-50">取消</button>
              <button onClick={confirmExport} className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md bg-[#c8102e] px-4 text-sm font-medium text-white hover:bg-[#a50d26]"><CheckCircle2 className="h-4 w-4" />確認並導出</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div role="status" className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />{toast}</div>}
    </div>
  )
}

function Detail({ loan, onSchedule }: { loan: LoanRecord; onSchedule: () => void }) {
  const last = loan.lastRepayment
  const current = loan.currentSchedule
  return (
    <div>
      <SectionTitle title="貸款基本資料" note="完整賬號按統一權限展示" />
      <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-2 lg:gap-x-5">
        <div><Row label="貸款賬號" value={loan.id} /><Row label="戶名" value={COMPANY} /><Row label="貸款種類" value={loan.type} /><Row label="幣種" value={loan.ccy} /><Row label="賬戶狀態" value={loan.status} /><Row label="執行利率" value={`${loan.rate.toFixed(2)}%`} /><Row label="貸款金額" value={money(loan.principal, loan.ccy)} /><Row label="貸款餘額" value={money(loan.outstanding, loan.ccy)} strong /></div>
        <div><Row label="貸款行" value={loan.branch} /><Row label="還款總期數" value={`${loan.totalPeriods} 期`} /><Row label="剩餘期數" value={`${loan.remainingPeriods} 期`} /><Row label="起息日" value={loan.startDate} /><Row label="到期日" value={loan.maturityDate} /><Row label="下次還款日" value={nullable(loan.nextPaymentDate)} /><Row label="還款賬號" value={loan.repaymentAccount} /><div className="flex min-h-[45px] items-center px-4"><button onClick={onSchedule} className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-[#134b9e] hover:underline">查看還款明細<ChevronRight className="h-4 w-4" /></button></div></div>
      </div>

      <SectionTitle title="當期還款計劃" />
      {current ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[max-content] text-sm"><thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-3 py-2.5 font-medium">期數</th><th className="px-3 py-2.5 font-medium">還款日</th><th className="px-3 py-2.5 text-right font-medium">當期還款金額</th><th className="px-3 py-2.5 text-right font-medium">當期應還本金</th><th className="px-3 py-2.5 text-right font-medium">當期利息</th><th className="px-3 py-2.5 text-right font-medium">貸款狀態</th></tr></thead>
            <tbody><tr><td className="px-3 py-3">{current.period}</td><td className="px-3 py-3">{current.date}</td><td className="px-3 py-3 text-right">{money(current.amount, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(current.principal, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(current.interest, loan.ccy)}</td><td className="px-3 py-3 text-right">{loan.status}</td></tr></tbody></table>
        </div>
      ) : <Empty title="沒有當期還款計劃" description="此貸款已結清，沒有待還期次；相關日期及金額不以 0 代替。" />}

      <SectionTitle title="上期還款記錄" />
      {last ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[max-content] text-sm"><thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-3 py-2.5 font-medium">還款日期</th><th className="px-3 py-2.5 text-right font-medium">還款金額</th><th className="px-3 py-2.5 text-right font-medium">還款本金</th><th className="px-3 py-2.5 text-right font-medium">還款利息</th><th className="px-3 py-2.5 text-right font-medium">逾期本金罰息</th><th className="px-3 py-2.5 text-right font-medium">逾期利息罰息</th></tr></thead>
            <tbody><tr><td className="px-3 py-3">{last.actualDate}</td><td className="px-3 py-3 text-right">{money(last.amount, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(last.principal, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(last.interest, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(last.principalPenalty, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(last.interestPenalty, loan.ccy)}</td></tr></tbody></table>
        </div>
      ) : <Empty title="沒有上期還款記錄" description="有權系統未返回已發生的還款記錄。" />}
    </div>
  )
}

function Balance({ loan }: { loan: LoanRecord }) {
  const a = loan.arrears
  return (
    <div>
      <SectionTitle title="貸款結欠" note="原幣展示，不作跨幣種加總" />
      <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-2 lg:gap-x-5">
        <div><Row label="貸款賬號" value={loan.id} /><Row label="賬戶別名" value={loan.alias} /><Row label="類別" value={loan.type} /><Row label="幣種" value={loan.ccy} /><Row label="賬戶狀態" value={loan.status} /><Row label="本金餘欠" value={money(loan.outstanding, loan.ccy)} strong /><Row label="現行利率" value={`${loan.rate.toFixed(2)}%`} /></div>
        <div><Row label="下期供款日期" value={nullable(loan.nextPaymentDate)} /><Row label="下期供款金額" value={loan.currentSchedule ? money(loan.currentSchedule.amount, loan.ccy) : '—'} /><Row label="借款起期日" value={loan.startDate} /><Row label="借款到期日" value={loan.maturityDate} /><Row label="還款賬號" value={loan.repaymentAccount} /><Row label="貸款行" value={loan.branch} /><Row label="資料日期" value={DATA_TIME.slice(0, 10)} /></div>
      </div>

      <SectionTitle title="尚欠逾期款項" note="各項及合計均由有權系統返回" />
      <div className="grid overflow-hidden rounded-lg border border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {[['逾期本金', a.principal], ['積欠利息', a.interest], ['逾期違約金', a.penalty], ['印花稅', a.stamp], ['保險費', a.insurance], ['其他應付款項', a.other]].map(([label, value]) => (
          <div key={String(label)} className="border-b border-r border-slate-100 p-4"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 text-sm font-semibold text-slate-800">{money(Number(value), loan.ccy)}</div></div>
        ))}
        <div className="bg-slate-50 p-4 sm:col-span-2"><div className="text-xs text-slate-500">合計</div><div className="mt-1 text-lg font-bold text-[#b4232f]">{money(a.total, loan.ccy)}</div></div>
      </div>

      <SectionTitle title="保險資料" />
      {loan.insurance ? (
        <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-3">
          <Row label="保險參考編號" value={loan.insurance.reference} /><Row label="保險到期日" value={loan.insurance.expiry} /><Row label="保費自動轉賬賬號" value={loan.insurance.autoDebitAccount} />
        </div>
      ) : <Empty title="沒有保險資料" description="有權系統未返回此貸款的保險參考資料；這不代表保險接口查詢失敗。" />}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800"><Info className="mt-0.5 h-4 w-4 shrink-0" />本頁不計算結欠、利息、罰息或保險費，亦不提供資金調撥及還款交易。如需正式結欠證明，請按現行銀行程序辦理。</div>
    </div>
  )
}

function Schedule({ loan, repayments, from, to, type, query, error, setFrom, setTo, setType, onQuery, onReset }: {
  loan: LoanRecord
  repayments: Repayment[]
  from: string
  to: string
  type: '全部' | RepaymentType
  query: { from: string; to: string; type: '全部' | RepaymentType }
  error: string
  setFrom: (v: string) => void
  setTo: (v: string) => void
  setType: (v: '全部' | RepaymentType) => void
  onQuery: () => void
  onReset: () => void
}) {
  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
          <label className="text-xs font-medium text-slate-600">貸款賬號<input readOnly value={loan.id} className="mt-1.5 min-h-10 w-full rounded-md border border-slate-200 bg-white px-3 font-mono text-sm text-slate-700" /></label>
          <label className="text-xs font-medium text-slate-600">實際還款日期（由）<input type="date" value={from} onChange={e => setFrom(e.target.value)} className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#134b9e]" /></label>
          <label className="text-xs font-medium text-slate-600">實際還款日期（至）<input type="date" value={to} onChange={e => setTo(e.target.value)} className="mt-1.5 min-h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#134b9e]" /></label>
          <label className="text-xs font-medium text-slate-600">還款類型<select value={type} onChange={e => setType(e.target.value as '全部' | RepaymentType)} className="mt-1.5 min-h-10 w-full cursor-pointer rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#134b9e]"><option>全部</option><option>正常還款</option><option>逾期還款</option></select></label>
          <div className="flex gap-2"><button onClick={onQuery} className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md bg-[#134b9e] px-4 text-sm font-medium text-white hover:bg-[#0b2a5b]"><Search className="h-4 w-4" />查詢</button><button aria-label="重設還款明細查詢" onClick={onReset} className="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-slate-300 px-3 text-slate-600 hover:bg-white"><RotateCcw className="h-4 w-4" /></button></div>
        </div>
        {error && <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs text-red-600"><CircleAlert className="h-4 w-4" />{error}</p>}
        <p className="mt-3 text-xs text-slate-500">預設最近 12 個月；單次查詢最長 12 個月，可分次查詢更早記錄。還款類型由有權系統提供。</p>
      </div>

      <div className="mb-3 mt-5 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#0b2a5b]">還款明細</h3><span className="text-xs text-slate-500">查詢條件：{query.from} 至 {query.to} · {query.type} · 共 {repayments.length} 筆</span></div>
      {repayments.length ? (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[max-content] text-sm"><thead className="bg-slate-50 text-left text-xs text-slate-500"><tr><th className="px-3 py-2.5 font-medium">實際還款日期</th><th className="px-3 py-2.5 text-right font-medium">還款期次</th><th className="px-3 py-2.5 font-medium">應還款日期</th><th className="px-3 py-2.5 text-right font-medium">實際還款金額</th><th className="px-3 py-2.5 text-right font-medium">本金</th><th className="px-3 py-2.5 text-right font-medium">利息</th><th className="px-3 py-2.5 text-right font-medium">逾期本金罰息</th><th className="px-3 py-2.5 text-right font-medium">逾期利息罰息</th><th className="px-3 py-2.5 text-right font-medium">還款類型</th></tr></thead>
            <tbody>{repayments.map(r => <tr key={`${r.actualDate}-${r.period}`} className="border-t border-slate-100 hover:bg-slate-50"><td className="px-3 py-3">{r.actualDate}</td><td className="px-3 py-3 text-right">{r.period}</td><td className="px-3 py-3">{r.dueDate}</td><td className="px-3 py-3 text-right font-medium">{money(r.amount, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(r.principal, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(r.interest, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(r.principalPenalty, loan.ccy)}</td><td className="px-3 py-3 text-right">{money(r.interestPenalty, loan.ccy)}</td><td className="px-3 py-3 text-right"><span className={`rounded px-2 py-0.5 text-xs ${r.type === '正常還款' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.type}</span></td></tr>)}</tbody></table>
        </div>
      ) : <Empty title="目前條件下沒有還款記錄" description="請調整貸款賬號、日期區間或還款類型；無記錄不等同於查詢失敗。" />}
    </div>
  )
}

function CollateralView({ loan }: { loan: LoanRecord }) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="text-xs font-medium text-slate-600">貸款賬號<input readOnly value={loan.id} className="mt-1.5 min-h-10 w-64 rounded-md border border-slate-200 bg-white px-3 font-mono text-sm text-slate-700" /></label>
        <div className="flex items-center gap-1.5 text-xs text-slate-500"><Building2 className="h-4 w-4" />押品資料由 BANCS 提供，企網只讀展示</div>
      </div>
      {loan.collateral.length ? (
        <div className="space-y-4">{loan.collateral.map((c, index) => (
          <div key={`${c.buildingCode}-${c.unitCode}-${c.parkingCode}`}>
            <SectionTitle title={`抵押物業 ${index + 1}`} />
            <div className="grid overflow-hidden rounded-lg border border-slate-200 lg:grid-cols-2 lg:gap-x-5">
              <div><Row label="樓宇代號" value={c.buildingCode} /><Row label="單位代號" value={c.unitCode} /><Row label="車位代號" value={c.parkingCode} /></div>
              <div><Row label="樓宇名稱" value={c.buildingName} /><Row label="簽契日期" value={c.deedDate} /><Row label="簽契地點" value={c.deedPlace} /></div>
            </div>
          </div>
        ))}</div>
      ) : <Empty title="此貸款沒有抵押物業資料" description="BANCS 未返回關聯押品記錄；企網不得自行補錄、修改或推斷押品資料。" />}
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-[#174b86]"><Info className="mt-0.5 h-4 w-4 shrink-0" />本頁僅表達信息結構及核對要點，不展示估值、抵押順位或擔保人資料，也不作為抵押登記證明。</div>
    </div>
  )
}
