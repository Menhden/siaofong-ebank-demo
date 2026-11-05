import { useState } from 'react'
import { accounts, fmt, COMPANY, USER, initialMessages, newFeatures } from '@/lib/mock'
import { GripVertical, Plus, X, ArrowLeftRight, ClipboardCheck, FileText, Download, Bell, Megaphone, Sparkles, Zap, PiggyBank, HandCoins, Vault, Scale, Compass } from 'lucide-react'
import type { PageKey } from '@/components/Layout'

type CardKey = 'overview' | 'asset' | 'todo' | 'quick' | 'notice' | 'product' | 'msg'
const CARD_NAMES: Record<CardKey, string> = {
  overview: '賬戶總覽', asset: '資產負債一覽', todo: '我的待辦', quick: '快捷服務', notice: '最新公告', product: '產品推薦', msg: '消息提醒',
}

export default function Workbench({ setPage, pendingCount }: { setPage: (p: PageKey) => void; pendingCount: number }) {
  const [cards, setCards] = useState<CardKey[]>(['overview', 'asset', 'todo', 'quick', 'notice', 'product', 'msg'])
  const [customizing, setCustomizing] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [touring, setTouring] = useState(false)

  const totalMop = accounts.filter(a => a.ccy === 'MOP').reduce((s, a) => s + a.balance, 0)
  const totalAsset = accounts.reduce((s, a) => s + a.balance, 0)
  const totalLiability = 1250000
  const announcements = initialMessages.filter(m => m.kind === '公告')
  const unread = initialMessages.filter(m => !m.read)

  const onDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) return
    const next = [...cards]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    setCards(next)
    setDragIdx(null)
  }

  const renderCard = (key: CardKey) => {
    switch (key) {
      case 'overview':
        return (
          <>
            <CardHead title="賬戶總覽" more={() => setPage('accounts')} />
            <div className="text-sm text-slate-500">澳門元賬戶實時餘額合計</div>
            <div className="text-3xl font-bold text-slate-800 mt-1">{fmt(totalMop, 'MOP')}</div>
            <div className="mt-3 space-y-1.5 text-sm">
              {accounts.slice(0, 4).map(a => (
                <div key={a.no} className="flex justify-between text-slate-600">
                  <span>{a.name}</span><span className="font-medium text-slate-800">{fmt(a.balance, a.ccy)}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400 mt-3">賬戶總數 {accounts.length} 個　開戶機構 2 間</div>
          </>
        )
      case 'asset':
        return (
          <>
            <CardHead title="資產負債一覽" more={() => setPage('accounts')} />
            <div className="flex items-end gap-6 mt-1">
              <div>
                <div className="text-sm text-slate-500">總資產（折合 MOP）</div>
                <div className="text-3xl font-bold text-slate-800">{fmt(totalAsset, 'MOP')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">總負債</div>
                <div className="text-xl font-bold text-[#c8102e]">{fmt(totalLiability, 'MOP')}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">淨資產</div>
                <div className="text-xl font-bold text-emerald-600">{fmt(totalAsset - totalLiability, 'MOP')}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                <div className="bg-[#134b9e]" style={{ width: '72%' }} />
                <div className="bg-[#c8102e]" style={{ width: '28%' }} />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#134b9e] inline-block" />資產 {fmt(totalAsset, 'MOP')}</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#c8102e] inline-block" />貸款等負債 {fmt(totalLiability, 'MOP')}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />負債含營運貸款及信用證敞口；點擊查看賬戶明細
            </div>
          </>
        )
      case 'todo':
        return (
          <>
            <CardHead title="我的待辦" more={() => setPage('approvals')} />
            <div className="flex items-end gap-2 mt-1">
              <span className="text-4xl font-bold text-[#c8102e]">{pendingCount}</span>
              <span className="text-sm text-slate-500 mb-1">筆交易待我審批</span>
            </div>
            <div className="mt-3 space-y-2">
              <TodoRow label="行內轉賬 MOP 580,000.00" tag="一級審批" onClick={() => setPage('approvals')} />
              <TodoRow label="批量代付-薪金（32 筆）" tag="一級審批" onClick={() => setPage('approvals')} />
            </div>
          </>
        )
      case 'quick':
        return (
          <>
            <CardHead title="快捷服務" more={() => setCustomizing(true)} moreLabel="自定義" />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                { icon: ArrowLeftRight, label: '行內轉賬', page: 'transfer' as PageKey },
                { icon: ClipboardCheck, label: '交易審批', page: 'approvals' as PageKey },
                { icon: FileText, label: '月結單', page: 'accounts' as PageKey },
                { icon: Download, label: '對賬文件', page: 'merchant' as PageKey },
                { icon: Zap, label: '網上繳費', page: 'payments' as PageKey },
                { icon: PiggyBank, label: '定期存款', page: 'wealth' as PageKey },
                { icon: HandCoins, label: '代發薪金', page: 'collections' as PageKey },
                { icon: Vault, label: '現金管理', page: 'cash' as PageKey },
              ].map(q => (
                <button key={q.label} onClick={() => setPage(q.page)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-[#134b9e] transition-colors">
                  <q.icon className="w-5 h-5" />
                  <span className="text-xs">{q.label}</span>
                </button>
              ))}
            </div>
          </>
        )
      case 'notice':
        return (
          <>
            <CardHead title="最新公告" />
            <div className="space-y-2.5 mt-1">
              {announcements.map(a => (
                <div key={a.id} className="text-sm">
                  <span className="inline-block text-[10px] text-[#134b9e] bg-blue-50 rounded px-1 mr-2">銀行通知</span>
                  <span className="text-slate-700">{a.title}</span>
                  <span className="text-xs text-slate-400 ml-2">{a.date}</span>
                </div>
              ))}
              <button onClick={() => setPage('messages')} className="text-xs text-[#134b9e] hover:underline">查看全部通知 &gt;</button>
            </div>
          </>
        )
      case 'product':
        return (
          <>
            <CardHead title="產品推薦" />
            <div className="space-y-3 mt-1">
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800"><Sparkles className="w-4 h-4 text-amber-500" />網銀專享定期存款</div>
                <div className="text-xs text-slate-500 mt-1">三個月澳門元定期　年利率上浮 20 點子</div>
              </div>
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800"><Megaphone className="w-4 h-4 text-[#134b9e]" />現金管理成長版</div>
                <div className="text-xs text-slate-500 mt-1">更高轉賬限額 + 獨立費率優惠方案</div>
              </div>
            </div>
          </>
        )
      case 'msg':
        return (
          <>
            <CardHead title="消息提醒" more={() => setPage('messages')} />
            <div className="mt-1 space-y-2.5">
              {unread.slice(0, 3).map(m => (
                <div key={m.id} className="flex items-start gap-2 text-sm">
                  <Bell className="w-4 h-4 text-[#c8102e] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-slate-700">{m.title}</div>
                    <div className="text-xs text-slate-400">{m.kind} · {m.date}</div>
                  </div>
                </div>
              ))}
              {unread.length === 0 && <div className="text-sm text-slate-400">暫無未讀消息</div>}
            </div>
          </>
        )
    }
  }

  return (
    <div className="relative z-10 max-w-6xl mx-auto">
      {/* 歡迎條 */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">尊敬的 {USER}，您好！</h1>
          <p className="text-sm text-slate-500 mt-1">{COMPANY}　<span className="text-slate-300">|</span>　預留信息：安康</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTouring(true)}
            className="flex items-center gap-1.5 text-sm bg-[#0b2a5b] text-white rounded-lg px-3 py-2 hover:bg-[#134b9e]">
            <Compass className="w-4 h-4" /> 新功能推薦
            <span className="text-[10px] bg-[#c8102e] rounded-full px-1.5 py-0.5 font-bold">{newFeatures.length} NEW</span>
          </button>
          <button onClick={() => setCustomizing(true)}
            className="flex items-center gap-1.5 text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 hover:border-[#134b9e] hover:text-[#134b9e]">
            <Plus className="w-4 h-4" /> 自定義工作台
          </button>
        </div>
      </div>

      {/* 卡片網格 */}
      <div className="grid grid-cols-2 gap-5">
        {cards.map((key, i) => (
          <div key={key}
            draggable={customizing}
            onDragStart={() => setDragIdx(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className={`bg-white rounded-xl shadow-sm p-5 relative transition-shadow ${customizing ? 'ring-2 ring-dashed ring-[#134b9e]/40 cursor-move' : 'hover:shadow-md'}`}>
            {customizing && (
              <button onClick={() => setCards(cards.filter(c => c !== key))}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
            )}
            {customizing && <GripVertical className="absolute top-3.5 right-10 w-4 h-4 text-slate-300" />}
            {renderCard(key)}
          </div>
        ))}
      </div>

      {/* 自定義面板 */}
      {customizing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setCustomizing(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px]" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-slate-800 mb-1">自定義工作台</h3>
            <p className="text-xs text-slate-400 mb-4">勾選要展示的模塊；在頁面上拖拽卡片可調整順序</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CARD_NAMES) as CardKey[]).map(k => (
                <label key={k} className="flex items-center gap-2 text-sm text-slate-700 border border-slate-200 rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#134b9e]">
                  <input type="checkbox" checked={cards.includes(k)}
                    onChange={e => setCards(e.target.checked ? [...cards, k] : cards.filter(c => c !== k))}
                    className="accent-[#134b9e]" />
                  {CARD_NAMES[k]}
                </label>
              ))}
            </div>
            <button onClick={() => setCustomizing(false)}
              className="mt-5 w-full bg-[#0b2a5b] text-white rounded-lg py-2 text-sm hover:bg-[#134b9e]">完成</button>
          </div>
        </div>
      )}
      {/* 新功能導覽 */}
      {touring && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setTouring(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-[520px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Compass className="w-5 h-5 text-[#134b9e]" />新版功能導覽</h3>
              <button onClick={() => setTouring(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-400 mb-4">新一代企業網銀一期上線，以下功能為全新或重大升級</p>
            <div className="space-y-2.5">
              {newFeatures.map((f, i) => (
                <div key={f.name} className="flex items-start gap-3 border border-slate-100 rounded-lg p-3 hover:border-[#134b9e]">
                  <span className="text-xs font-bold text-[#c8102e] border border-[#c8102e]/40 rounded px-1.5 py-0.5 mt-0.5">NEW</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">{String(i + 1).padStart(2, '0')}　{f.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setTouring(false)}
              className="mt-5 w-full bg-[#0b2a5b] text-white rounded-lg py-2 text-sm hover:bg-[#134b9e]">開始體驗</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CardHead({ title, more, moreLabel }: { title: string; more?: () => void; moreLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold text-slate-800">{title}</h3>
      {more && <button onClick={more} className="text-xs text-[#134b9e] hover:underline">{moreLabel ?? '更多'} &gt;</button>}
    </div>
  )
}

function TodoRow({ label, tag, onClick }: { label: string; tag: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between text-sm border border-slate-100 rounded-lg px-3 py-2 hover:border-[#134b9e] hover:bg-blue-50/50 text-left">
      <span className="text-slate-700">{label}</span>
      <span className="text-[10px] bg-red-50 text-[#c8102e] rounded px-1.5 py-0.5 shrink-0">{tag}</span>
    </button>
  )
}
