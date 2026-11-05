import { useState } from 'react'
import { AlertTriangle, CalendarClock, Pause, Play, Trash2 } from 'lucide-react'

type Status = '待執行' | '已暫停' | '待銀行處理' | '處理失敗' | '結果核實中' | '已取消'
type Plan = { id: string; product: string; type: string; payee: string; amount: string; next: string; status: Status; holiday: string }
const seed: Plan[] = [
  { id: 'SC20261102001', product: '普通匯款', type: '單次預約', payee: 'Heng Seng Trading Co.', amount: 'HKD 88,000.00', next: '2026-11-02 09:30', status: '待執行', holiday: '順延至下一可處理營業日' },
  { id: 'PL20261015002-03', product: '澳中轉賬', type: '周期第 3 期', payee: '中山五金批發有限公司', amount: 'HKD 100,000.00', next: '2026-11-15 10:00', status: '待執行', holiday: '取消該期' },
  { id: 'PL20260915006-02', product: '普通匯款', type: '周期第 2 期', payee: 'Global Textile GmbH', amount: 'EUR 45,000.00', next: '2026-10-15', status: '待銀行處理', holiday: '順延至下一可處理營業日' },
  { id: 'PL20260801003-01', product: '澳中轉賬', type: '周期第 1 期', payee: '珠海示例商貿有限公司', amount: 'MOP 60,000.00', next: '2026-10-01', status: '處理失敗', holiday: '取消該期' },
]

export default function ScheduledPanel() {
  const [list, setList] = useState(seed)
  const [notice, setNotice] = useState('')
  const update = (id: string, status: Status) => { setList(prev => prev.map(x => x.id === id ? { ...x, status } : x)); setNotice(`${id} 已更新為「${status}」。操作須完成適用認證及審批；已生成或已送出期次不因計劃維護而撤銷。`) }
  return <div className="max-w-6xl mx-auto space-y-4">
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs leading-relaxed text-amber-900 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><span>預約或期次日如遇不可處理營業日，按客戶建立計劃時選擇的「順延」或「取消該期」處理，不會靜默改期。每期仍檢查賬戶、限額、材料及風控；澳中交叉兌換按執行時有效匯率。失敗或結果未明時先查原期次，不自動補扣或重發。</span></div>
    <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-1.5"><CalendarClock className="w-4 h-4 text-[#134b9e]" />預約／周期計劃及期次管理</h3>
      <table className="w-full text-sm min-w-[1100px]">
        <thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">計劃／期次編號</th><th className="font-medium">產品／類型</th><th className="font-medium">收款人</th><th className="font-medium text-right">金額</th><th className="font-medium">下次／應執行時間</th><th className="font-medium">非營業日選擇</th><th className="font-medium">狀態</th><th className="font-medium text-right pr-2">操作</th></tr></thead>
        <tbody>{list.map(s => <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 text-slate-600 font-mono text-xs">{s.id}</td><td className="text-slate-600 text-xs">{s.product}<br />{s.type}</td><td className="text-slate-700">{s.payee}</td><td className="text-right text-slate-800">{s.amount}</td><td className="text-slate-500 text-xs">{s.next}</td><td className="text-slate-500 text-xs">{s.holiday}</td><td><span className={`text-xs rounded px-2 py-0.5 ${s.status === '待執行' ? 'bg-blue-50 text-[#134b9e]' : s.status === '處理失敗' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{s.status}</span></td><td className="text-right pr-2 space-x-2">{s.status === '待執行' && <><button onClick={() => update(s.id, '已暫停')} className="text-xs text-[#134b9e]"><Pause className="w-3 h-3 inline" /> 暫停</button><button onClick={() => update(s.id, '已取消')} className="text-xs text-[#c8102e]"><Trash2 className="w-3 h-3 inline" /> 取消</button></>}{s.status === '已暫停' && <button onClick={() => update(s.id, '待執行')} className="text-xs text-[#134b9e]"><Play className="w-3 h-3 inline" /> 恢復</button>}</td></tr>)}</tbody>
      </table>
      {notice && <p className="text-xs text-[#134b9e] bg-blue-50 rounded p-3 mt-3">{notice}</p>}
      <p className="text-xs text-slate-400 mt-3">首次審批通過後，後續期次自動執行而不逐期重複企業內部審批；修改、暫停、恢復及取消仍須按計劃維護規則辦理。</p>
    </div>
  </div>
}
