import { useState } from 'react'
import { fmt, type Approval } from '@/lib/mock'
import { Breadcrumb } from './Accounts'
import { Smartphone, Fingerprint, Home, Wallet, ClipboardCheck, User } from 'lucide-react'

// 企業手機銀行（演示預覽）：一期功能 —— 安全設置、賬戶服務、轉賬/代收付審批、皮膚、公告
export default function MobileBank({ approvals, setApprovals }: {
  approvals: Approval[]
  setApprovals: (fn: (prev: Approval[]) => Approval[]) => void
}) {
  const [tab, setTab] = useState<'home' | 'acct' | 'cash' | 'todo' | 'me'>('home')
  const pending = approvals.filter(a => a.status === 'pending')

  const act = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(prev => prev.map(a => {
      if (a.id !== id) return a
      const steps = a.steps.map(s =>
        s.result === '待處理' ? { ...s, time: '2026-10-07 16:45', result: action === 'approved' ? '通過' : '拒絕' } : s)
      return { ...a, status: action, steps }
    }))
  }

  return (
    <div className="relative z-10 max-w-5xl mx-auto">
      <Breadcrumb items={['企業手機銀行', '演示預覽']} />
      <div className="flex gap-8 mt-4 items-start">
        {/* 手機框 */}
        <div className="shrink-0 mx-auto">
          <div className="w-[300px] h-[600px] bg-slate-900 rounded-[2.5rem] p-2.5 shadow-2xl">
            <div className="w-full h-full bg-slate-100 rounded-[2rem] overflow-hidden flex flex-col relative">
              {/* 頂部 */}
              <div className="bg-[#0b2a5b] text-white px-4 pt-6 pb-4">
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <span>小鋒企業銀行</span>
                  <span>16:45　<Fingerprint className="w-3.5 h-3.5 inline" /></span>
                </div>
                <div className="text-sm mt-2">誠信貿易（澳門）一人有限公司</div>
                <div className="text-xs text-blue-200 mt-0.5">陳大文（管理員）</div>
              </div>
              {/* 內容 */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {tab === 'home' && (
                  <>
                    <div className="bg-gradient-to-br from-[#134b9e] to-[#0b2a5b] rounded-xl p-4 text-white">
                      <div className="text-[10px] text-blue-200">總資產（MOP 折合）</div>
                      <div className="text-xl font-bold mt-1">MOP 7,562,801</div>
                      <div className="text-[10px] text-blue-200 mt-2">總負債 MOP 14,100,000 · 淨值 MOP -6,537,199</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[['轉賬審批', pending.length, '筆待辦'], ['代收付審批', 1, '筆待辦'], ['動賬通知', 3, '條未讀'], ['匯率牌價', 5, '幣種']].map(([k, v, u]) => (
                        <button key={k as string} onClick={() => setTab(k === '動賬通知' || k === '匯率牌價' ? 'home' : 'todo')}
                          className="bg-white rounded-xl p-3 text-left shadow-sm">
                          <div className="text-[10px] text-slate-400">{k}</div>
                          <div className="text-lg font-bold text-slate-800 mt-0.5">{v}<span className="text-[10px] font-normal text-slate-400 ml-1">{u}</span></div>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setTab('cash')} className="w-full bg-white rounded-xl p-3 shadow-sm text-left">
                      <div className="text-xs font-medium text-slate-800">現金管理</div>
                      <div className="text-[10px] text-slate-400 mt-1">集團資金視圖 · 預警通知 · 調撥及統一支付審批</div>
                      <div className="text-[10px] text-[#c8102e] mt-2">1 項還原異常 · 2 筆現金管理待辦</div>
                    </button>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[10px] text-amber-800">
                      公告：企業網銀 10 月 12 日凌晨維護（多語言設置 · 消息推送 · 聲明信息於「我的」頁管理）
                    </div>
                  </>
                )}
                {tab === 'cash' && (
                  <>
                    <div className="bg-gradient-to-br from-[#134b9e] to-[#0b2a5b] rounded-xl p-4 text-white">
                      <div className="text-[10px] text-blue-200">誠信企業集團 · 可用資金</div>
                      <div className="text-sm font-bold mt-2">MOP 3,598,001.65</div>
                      <div className="text-sm font-bold mt-1">HKD 5,120,800.00</div>
                      <div className="text-sm font-bold mt-1">CNY 890,150.30</div>
                      <div className="text-[10px] text-blue-200 mt-2">按幣種分列 · BANCS 11:30</div>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <div className="text-xs text-red-700 font-medium">綜合計息還原異常</div>
                      <div className="text-[10px] text-red-600 mt-1">誠信（珠海）待還原 MOP 152,300.00</div>
                    </div>
                    {[['主動調撥審批', 'CT20261027003 · MOP 200,000.00'], ['統一支付總部審批', 'PP20261027004 · MOP 86,000.00']].map(([t, d]) => (
                      <button key={t} onClick={() => setTab('todo')} className="w-full bg-white rounded-xl p-3 shadow-sm text-left">
                        <div className="text-xs text-slate-800">{t}</div><div className="text-[10px] text-slate-400 mt-1">{d}</div>
                        <div className="text-[10px] text-[#134b9e] mt-2">前往審批 ›</div>
                      </button>
                    ))}
                    <div className="text-[10px] text-slate-400 text-center">手機端不提供後台維護功能</div>
                  </>
                )}
                {tab === 'acct' && (
                  <>
                    {['澳門元往來賬戶|MOP 2,863,450.55', '港元往來賬戶|HKD 5,120,800.00', '人民幣往來賬戶|CNY 890,150.30'].map(s => {
                      const [n, b] = s.split('|')
                      return (
                        <div key={n} className="bg-white rounded-xl p-3 shadow-sm">
                          <div className="text-xs text-slate-800 font-medium">{n}</div>
                          <div className="text-sm font-bold text-slate-800 mt-1">{b}</div>
                          <div className="text-[10px] text-slate-400 mt-1">今日 / 歷史餘額 · 今日 / 歷史交易可查</div>
                        </div>
                      )
                    })}
                  </>
                )}
                {tab === 'todo' && (
                  <>
                    <div className="text-xs text-slate-500 font-medium">待我審批（{pending.length}）</div>
                    {pending.map(a => (
                      <div key={a.id} className="bg-white rounded-xl p-3 shadow-sm">
                        <div className="text-xs font-medium text-slate-800">{a.type}　{a.amount ? fmt(a.amount, a.ccy) : ''}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{a.payee ?? ''} · {a.initiator}</div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => act(a.id, 'approved')}
                            className="flex-1 bg-[#c8102e] text-white rounded-lg py-1.5 text-xs font-medium">通過</button>
                          <button onClick={() => act(a.id, 'rejected')}
                            className="flex-1 border border-slate-300 rounded-lg py-1.5 text-xs text-slate-600">拒絕</button>
                        </div>
                      </div>
                    ))}
                    {pending.length === 0 && <div className="text-center text-xs text-slate-400 py-8">✓ 待辦已清空，「批得快」</div>}
                  </>
                )}
                {tab === 'me' && (
                  <>
                    {['登錄密碼設置', '預留信息', '常用設備管理', '流動安全密碼', '安全問題設置', '電郵通知服務', '皮膚換膚（豐付寶同款節日主題）', '禁止錄屏策略', 'Soft Token 認證'].map(s => (
                      <div key={s} className="bg-white rounded-xl px-3 py-2.5 shadow-sm text-xs text-slate-700 flex justify-between items-center">
                        {s}<span className="text-slate-300">›</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* 底部導航 */}
              <div className="bg-white border-t border-slate-100 grid grid-cols-4 py-2">
                {([['home', '首頁', Home], ['acct', '賬戶', Wallet], ['todo', '審批', ClipboardCheck], ['me', '我的', User]] as const).map(([k, label, Icon]) => (
                  <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center gap-0.5 text-[10px] ${tab === k ? 'text-[#134b9e]' : 'text-slate-400'}`}>
                    <Icon className="w-4 h-4" />{label}
                    {k === 'todo' && pending.length > 0 && <span className="absolute -mt-1 ml-6 w-3.5 h-3.5 bg-[#c8102e] text-white text-[8px] rounded-full flex items-center justify-center">{pending.length}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 說明 */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#134b9e]" />企業手機銀行（演示預覽）</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              左側為手機端高保真預覽，覆蓋需求書一期功能：Soft Token 認證登錄（探索指紋／手勢／人臉生物識別）、
              賬戶一覽與今日／歷史查詢、轉賬匯款與代收付待辦審批（外出場景「批得快」）、動賬通知，
              以及現金管理集團查詢、預警與結果通知、主動調撥及統一支付審批；手機端不提供後台維護。
              預覽中的審批操作與網銀審批中心數據實時聯動。
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="text-sm font-bold text-slate-800 mb-3">審批聯動演示</div>
            <p className="text-xs text-slate-500 leading-relaxed">在手機預覽中通過或拒絕交易後，切換到「交易審批」頁可看到狀態已同步更新（演示版數據同源）。</p>
            <div className="mt-3 flex gap-3">
              <span className="text-xs bg-emerald-50 text-emerald-700 rounded px-2 py-1">待審批 {pending.length} 筆</span>
              <span className="text-xs bg-blue-50 text-[#134b9e] rounded px-2 py-1">與企業網銀共享認證、授權、限額體系</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
