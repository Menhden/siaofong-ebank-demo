import { useState } from 'react'
import { batches, collections, fmt, type Collection } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Users, Upload, FileSpreadsheet, CheckCircle2, XCircle, QrCode, Link2, Plus } from 'lucide-react'

export default function Collections() {
  const [tab, setTab] = useState<'pay' | 'recv'>('pay')
  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['收付款服務']} />
      <div className="flex border-b border-slate-100 bg-white rounded-t-xl shadow-sm mt-4 px-5">
        {([['pay', '代付款'], ['recv', '代收款']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-3.5 text-sm border-b-2 -mb-px ${tab === k ? 'border-[#c8102e] text-[#c8102e] font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {label}
          </button>
        ))}
        <div className="flex-1" />
        <span className="self-center text-xs text-slate-400">統一入口 · 統一授權 · 統一回單</span>
      </div>
      {tab === 'pay' ? <PayPanel /> : <RecvPanel />}
    </div>
  )
}

const PAY_KINDS = ['代發薪金', '批量代付', '跨境批量付款', 'FPS 批量付款', '代付學費津貼']

function PayPanel() {
  const [kind, setKind] = useState('代發薪金')
  const [uploaded, setUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 模擬上傳名冊校驗結果（支持多幣種混合單次上傳）
  const rows = [
    { name: '陳小明', acct: '101-55-223311-0', amount: 12500, ccy: 'MOP', ok: true },
    { name: '黃美仪', acct: '101-55-445522-1', amount: 11800, ccy: 'MOP', ok: true },
    { name: '劉志強', acct: '101-55-6677', amount: 13200, ccy: 'MOP', ok: false, err: '賬號位數不符' },
    { name: '張淑儀', acct: '6222 **** **** 5588', amount: 12100, ccy: 'MOP', ok: true },
    { name: 'SALES AGENT HK LTD', acct: '024-888-112233-4', amount: 9200, ccy: 'HKD', ok: true },
    { name: '梁國豪', acct: '101-55-889900-3', amount: 12900, ccy: 'MOP', ok: false, err: '戶名與賬號不匹配' },
  ]

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      {/* 服務種類 */}
      <div className="flex gap-2 flex-wrap">
        {PAY_KINDS.map(k => (
          <button key={k} onClick={() => setKind(k)}
            className={`px-4 py-2 rounded-lg text-sm border ${kind === k ? 'border-[#134b9e] bg-blue-50 text-[#134b9e] font-medium' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* 上傳區 */}
        <div className="col-span-2 space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-[#134b9e] transition-colors">
            <Upload className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-sm text-slate-700 mt-2 font-medium">上傳批量文件</div>
            <div className="text-xs text-slate-400 mt-1">支持 Excel / CSV 格式，單批最多 2,000 筆</div>
            <div className="mt-2 inline-flex items-center gap-1 text-xs bg-blue-50 text-[#134b9e] rounded-full px-3 py-1">
              支持 MOP / HKD / CNY / USD 多幣種名冊單次混合上傳，系統按幣種自動拆分批次
            </div>
            <button onClick={() => { setUploaded(true); setSubmitted(false) }}
              className="mt-3 text-sm bg-[#0b2a5b] text-white rounded-lg px-4 py-2 hover:bg-[#134b9e]">選擇文件</button>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-xs leading-relaxed text-slate-500">
            <div className="font-medium text-slate-700 mb-1.5 flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5" />批量文件規範（已優化）</div>
            <p>· 附言格式不作字體限制；</p>
            <p>· 文件須包含收款人名稱列及幣種列（MOP/HKD/CNY/USD），系統自動與賬號匹配校驗；</p>
            <p>· 提交後按收款人分別出具回單，並提供結果文件及報表下載。</p>
          </div>
        </div>

        {/* 校驗結果 */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">名冊校驗結果</h3>
            {uploaded && <span className="text-xs text-slate-400">已解析 6 筆 · 通過 4 筆 · 失敗 2 筆 · 涉及 2 個幣種</span>}
          </div>
          {!uploaded ? (
            <div className="border border-slate-200 rounded-xl py-14 text-center text-slate-400 text-sm">上傳批量文件後在此顯示校驗結果</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs border-b border-slate-100">
                    <th className="py-2.5 font-medium">收款人名稱</th>
                    <th className="font-medium">收款賬號</th>
                    <th className="font-medium">幣種</th>
                    <th className="font-medium text-right">金額</th>
                    <th className="font-medium text-right pr-2">校驗結果</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.acct} className="border-b border-slate-50">
                      <td className="py-2.5 text-slate-700">{r.name}</td>
                      <td className="text-slate-500 font-mono text-xs">{r.acct}</td>
                      <td><span className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{r.ccy}</span></td>
                      <td className="text-right text-slate-800">{fmt(r.amount, r.ccy)}</td>
                      <td className="text-right pr-2">
                        {r.ok
                          ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" />通過</span>
                          : <span className="inline-flex items-center gap-1 text-xs text-[#c8102e]"><XCircle className="w-3.5 h-3.5" />{r.err}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setSubmitted(true)}
                  className="bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-6 py-2 text-sm font-medium">提交代付（4 筆 · MOP 36,400.00 + HKD 9,200.00）</button>
                <button onClick={() => setUploaded(false)} className="border border-slate-300 rounded-lg px-5 text-sm text-slate-600">重新上傳</button>
              </div>
              {submitted && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                  批次已提交，待一級審批。審批通過後按收款人分別出具回單，結果文件可在「代付記錄」下載。
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 歷史批次 */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">代付記錄</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">批次號</th>
              <th className="font-medium">類型</th>
              <th className="font-medium text-right">筆數</th>
              <th className="font-medium text-right">成功 / 失敗</th>
              <th className="font-medium text-right">合計金額</th>
              <th className="font-medium">日期</th>
              <th className="font-medium">狀態</th>
              <th className="font-medium text-right pr-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 text-slate-700 font-mono text-xs">{b.id}</td>
                <td className="text-slate-700">{b.kind}</td>
                <td className="text-right text-slate-600">{b.count}</td>
                <td className="text-right"><span className="text-emerald-600">{b.success}</span> / <span className={b.failed ? 'text-[#c8102e]' : 'text-slate-400'}>{b.failed}</span></td>
                <td className="text-right text-slate-800 font-medium">{fmt(b.amount, 'MOP')}</td>
                <td className="text-slate-500">{b.date}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${b.status === '處理完成' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{b.status}</span></td>
                <td className="text-right pr-2"><button className="text-xs text-[#134b9e] hover:underline">結果文件 / 回單下載</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RecvPanel() {
  const [list, setList] = useState<Collection[]>(collections)
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'收款鏈接' | '二維碼'>('收款鏈接')

  const add = () => {
    if (!name.trim()) return
    setList(prev => [{ id: 'CL' + Date.now().toString().slice(-6), name, channel: mode, amount: null, received: 0, count: 0, status: '收款中', date: '2026-10-06' }, ...prev])
    setName('')
  }

  return (
    <div className="bg-white rounded-b-xl shadow-sm p-5 space-y-5">
      <div className="flex gap-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="輸入代收款名稱，如：供應商誠意金"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm" />
        <div className="flex gap-2">
          {(['收款鏈接', '二維碼'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm ${mode === m ? 'border-[#134b9e] bg-blue-50 text-[#134b9e]' : 'border-slate-200 text-slate-600'}`}>
              {m === '收款鏈接' ? <Link2 className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}{m}
            </button>
          ))}
        </div>
        <button onClick={add} className="flex items-center gap-1 bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-5 text-sm font-medium"><Plus className="w-4 h-4" />登記代收款</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {list.map(c => (
          <div key={c.id} className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.channel === '收款鏈接' ? 'bg-blue-50 text-[#134b9e]' : 'bg-emerald-50 text-emerald-600'}`}>
                {c.channel === '收款鏈接' ? <Link2 className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-0.5">{c.status}</span>
            </div>
            <div className="font-medium text-slate-800 mt-2 text-sm">{c.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{c.channel} · 登記日 {c.date}</div>
            <div className="flex items-end justify-between mt-3">
              <div>
                <div className="text-lg font-bold text-slate-800">{fmt(c.received, 'MOP')}</div>
                <div className="text-xs text-slate-400">已收 {c.count} 筆{c.amount ? ` · 每筆定額 ${fmt(c.amount, 'MOP')}` : ' · 金額由付款方填寫'}</div>
              </div>
              <button className="text-xs text-[#134b9e] hover:underline">查看明細</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" />代收款與代付款共用統一收付款服務入口，按企業審批模式授權。</p>
    </div>
  )
}
