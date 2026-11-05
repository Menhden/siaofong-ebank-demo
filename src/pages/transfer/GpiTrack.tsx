import { useState } from 'react'
import { gpiTracks, fmt } from '@/lib/mock'
import { Radar, CircleCheck, CircleDashed, Copy, CheckCircle2 } from 'lucide-react'

export default function GpiTrack() {
  const [selected, setSelected] = useState(gpiTracks[0].uetr)
  const [copied, setCopied] = useState(false)
  const t = gpiTracks.find(g => g.uetr === selected)!

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><Radar className="w-4 h-4 text-[#134b9e]" />SWIFT GPI 跨境匯款追蹤</h3>
        <p className="text-xs text-slate-400 mb-4">輸入 UETR（唯一交易追蹤碼）或選擇近期匯款，實時掌握匯款處理進度及費用透明信息。</p>
        <div className="flex gap-2 mb-4">
          <input defaultValue={t.uetr} onChange={e => { const hit = gpiTracks.find(g => g.uetr.startsWith(e.target.value.trim())); if (hit) setSelected(hit.uetr) }}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono" />
          <button onClick={() => setCopied(true)}
            className="flex items-center gap-1 border border-slate-300 rounded-lg px-4 text-sm text-slate-600 hover:border-slate-400">
            <Copy className="w-4 h-4" />{copied ? '已複製' : '複製 UETR'}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap mb-5">
          {gpiTracks.map(g => (
            <button key={g.uetr} onClick={() => { setSelected(g.uetr); setCopied(false) }}
              className={`text-left border rounded-lg px-3 py-2 text-xs ${selected === g.uetr ? 'border-[#134b9e] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="text-slate-700 font-medium">{g.ref} · {fmt(g.amount, g.ccy)}</div>
              <div className="text-slate-400">{g.payee}</div>
            </button>
          ))}
        </div>

        {/* 進度時間軸 */}
        <div className="bg-slate-50 rounded-xl p-5">
          <div className="flex justify-between text-sm mb-4">
            <span className="font-medium text-slate-800">{t.payee}　<span className="text-[#c8102e] font-bold">{fmt(t.amount, t.ccy)}</span></span>
            <span className={`text-xs rounded px-2 py-0.5 ${t.stages.every(s => s.done) ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {t.stages.every(s => s.done) ? '已入賬' : '處理中'}
            </span>
          </div>
          <div className="space-y-0">
            {t.stages.map((s, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {s.done ? <CircleCheck className="w-5 h-5 text-emerald-500" /> : <CircleDashed className="w-5 h-5 text-slate-300" />}
                  {i < t.stages.length - 1 && <div className={`w-px flex-1 my-1 ${s.done && t.stages[i + 1].done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                </div>
                <div className="pb-5">
                  <div className="text-sm text-slate-800 font-medium">{s.node}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.detail}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-3 text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            GPI 費用透明：匯款全鏈路費用已鎖定，收款金額 = 匯出金額（SHA 模式下中轉費用由中轉行顯示）。
          </div>
        </div>
      </div>
    </div>
  )
}
