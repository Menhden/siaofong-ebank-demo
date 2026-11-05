import { useState } from 'react'
import { adminTodos, adminVersions, adminLogs, fmt } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import AdminLimitParams from './AdminLimitParams'
import AdminDiscountParams from './AdminDiscountParams'
import { ServerCog, Check, Pause, Play, RotateCcw, TrendingUp, ScrollText, Gauge, BadgePercent } from 'lucide-react'

// 銀行端後台（演示預覽）：一站式簽約受理 / 統計報表 / 版本與灰度 / 日誌與異常監控
export default function AdminConsole() {
  const [todos, setTodos] = useState(adminTodos)
  const [vers, setVers] = useState(adminVersions)
  const [acted, setActed] = useState('')
  const [view, setView] = useState<'overview' | 'limits' | 'discounts'>('overview')

  const approve = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    setActed(id)
  }
  const op = (idx: number, action: string) =>
    setVers(prev => prev.map((v, i) => i === idx ? { ...v, stage: action === 'rollback' ? '已回滾' : v.stage, gray: action === 'expand' ? '30% 用戶' : v.gray } : v))

  if (view === 'limits') return <AdminLimitParams onBack={() => setView('overview')} />
  if (view === 'discounts') return <AdminDiscountParams onBack={() => setView('overview')} />

  return (
    <div className="relative z-10 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb items={['銀行端後台', '演示預覽']} />
        <div className="flex gap-2">
          <button onClick={() => setView('discounts')} className="flex items-center gap-1.5 text-sm text-[#134b9e] border border-[#134b9e] rounded-lg px-4 py-2 hover:bg-blue-50"><BadgePercent className="w-4 h-4" />渠道優惠參數</button>
          <button onClick={() => setView('limits')} className="flex items-center gap-1.5 text-sm text-[#134b9e] border border-[#134b9e] rounded-lg px-4 py-2 hover:bg-blue-50"><Gauge className="w-4 h-4" />限額參數設置</button>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
        本頁為銀行端內部後台的演示預覽（總行視角）：一站式簽約受理、限額參數、數據埋點統計、版本號管理與灰度／試點投產。企業客戶端功能請從左側其他模塊進入。
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { t: '本月網銀交易量', v: fmt(48620000, 'MOP'), d: '+12.4% 按月' },
          { t: '渠道中間業務收入', v: fmt(186400, 'MOP'), d: '手續費及服務費' },
          { t: '離櫃交易佔比', v: '86.2%', d: '+5.1 百分點' },
          { t: '活躍企業客戶', v: '3,842 戶', d: '滲透率持續提升' },
        ].map(x => (
          <div key={x.t} className="bg-white rounded-xl shadow-sm p-4">
            <div className="text-xs text-slate-400 flex items-center gap-1">{x.t}<TrendingUp className="w-3 h-3 text-emerald-500" /></div>
            <div className="text-xl font-bold text-slate-800 mt-1.5">{x.v}</div>
            <div className="text-[10px] text-slate-400 mt-1">{x.d}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* 一站式簽約受理 */}
        <div className="col-span-3 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-1">一站式簽約受理（分行提交複核 → 總行審批）</h3>
          <p className="text-xs text-slate-400 mb-3">分散於多系統之業務受理已合併為一站式操作，應審盡審、數據實時更新；核心系統留存之企網用戶及簽約信息已遷移至企網側統一管理。</p>
          {acted && <div className="mb-3 text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2.5">✓ {acted} 已審批通過並實時生效。</div>}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
                <th className="py-2.5 font-medium">編號</th>
                <th className="font-medium">業務</th>
                <th className="font-medium">企業</th>
                <th className="font-medium">受理分行</th>
                <th className="font-medium">狀態</th>
                <th className="font-medium text-right pr-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(t => (
                <tr key={t.id} className="border-b border-slate-100">
                  <td className="py-3 text-slate-500 font-mono text-xs">{t.id}</td>
                  <td className="text-slate-700">{t.type}</td>
                  <td className="text-slate-600 text-xs">{t.company}</td>
                  <td className="text-slate-500 text-xs">{t.branch}</td>
                  <td><span className="text-xs bg-amber-50 text-amber-700 rounded px-2 py-0.5">{t.status}</span></td>
                  <td className="text-right pr-2">
                    <button onClick={() => approve(t.id)} className="text-xs text-[#134b9e] hover:underline"><Check className="w-3 h-3 inline" /> 總行審批通過</button>
                  </td>
                </tr>
              ))}
              {todos.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-sm">✓ 待辦已清空</td></tr>}
            </tbody>
          </table>
        </div>

        {/* 版本號管理 / 灰度 / 試點投產 */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><ServerCog className="w-4 h-4 text-[#134b9e]" />版本號管理 · 灰度／試點投產</h3>
          <div className="space-y-3">
            {vers.map((v, i) => (
              <div key={v.product} className="border border-slate-200 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800">{v.product}</span>
                  <span className="text-xs font-mono text-slate-500">{v.version}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-xs rounded px-2 py-0.5 ${v.stage === '正式版' ? 'bg-emerald-50 text-emerald-700' : v.stage === '已回滾' ? 'bg-red-50 text-[#c8102e]' : 'bg-blue-50 text-[#134b9e]'}`}>{v.stage} · {v.gray}</span>
                  <span className="text-[10px] text-slate-400">更新於 {v.updated}</span>
                </div>
                {v.stage !== '正式版' && v.stage !== '已回滾' && (
                  <div className="flex gap-2 mt-2.5">
                    <button onClick={() => op(i, 'pause')} className="flex items-center gap-1 text-[10px] border border-slate-300 rounded px-2 py-1 text-slate-500 hover:border-amber-400"><Pause className="w-3 h-3" />暫停</button>
                    <button onClick={() => op(i, 'resume')} className="flex items-center gap-1 text-[10px] border border-slate-300 rounded px-2 py-1 text-slate-500"><Play className="w-3 h-3" />繼續</button>
                    <button onClick={() => op(i, 'expand')} className="flex items-center gap-1 text-[10px] border border-slate-300 rounded px-2 py-1 text-slate-500 hover:border-[#134b9e]">擴量</button>
                    <button onClick={() => op(i, 'rollback')} className="flex items-center gap-1 text-[10px] border border-slate-300 rounded px-2 py-1 text-slate-500 hover:border-[#c8102e]"><RotateCcw className="w-3 h-3" />回滾</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">支持按用戶比例、白名單規則逐步放量；發佈過程可查指標、暫停、繼續、擴量、回滾，全部操作記入日誌。</p>
        </div>
      </div>

      {/* 日誌與異常監控 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><ScrollText className="w-4 h-4 text-[#134b9e]" />後台日誌 · 異常監控</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800">
              <th className="py-2.5 font-medium">時間</th>
              <th className="font-medium">操作人</th>
              <th className="font-medium">動作</th>
              <th className="font-medium">對象</th>
              <th className="font-medium text-right pr-2">來源 IP</th>
            </tr>
          </thead>
          <tbody>
            {adminLogs.map((l, i) => (
              <tr key={i} className={`border-b border-slate-100 ${l.action.includes('預警') ? 'bg-amber-50/50' : ''}`}>
                <td className="py-3 text-slate-500 text-xs whitespace-nowrap">{l.time}</td>
                <td className="text-slate-600">{l.user}</td>
                <td><span className={`text-xs rounded px-2 py-0.5 ${l.action.includes('預警') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>{l.action}</span></td>
                <td className="text-slate-600 text-xs">{l.target}</td>
                <td className="text-right pr-2 text-slate-400 font-mono text-xs">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-3">對查詢、維護、撤銷、鑒權（NUAS、通知平台）、代收付等各類交易日誌分類完整記錄，公共日誌可精準定位問題；重點財務交易與批量交易異常監控已啟用。</p>
      </div>
    </div>
  )
}
