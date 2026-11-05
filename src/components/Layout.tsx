import { useState } from 'react'
import type { ReactNode } from 'react'
import { COMPANY, USER } from '@/lib/mock'
import { Landmark, LayoutDashboard, Wallet, ArrowLeftRight, ClipboardCheck, Bell, LogOut, LifeBuoy, Download, MessageSquareMore, Zap, HandCoins, PiggyBank, Banknote, QrCode, ShieldCheck, Vault, Smartphone, Cable, ServerCog, Palette } from 'lucide-react'

export type PageKey = 'workbench' | 'accounts' | 'transfer' | 'payments' | 'collections' | 'wealth' | 'loans' | 'cash' | 'approvals' | 'merchant' | 'service' | 'mobile' | 'direct' | 'admin' | 'security' | 'messages'

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard; preview?: boolean }[] = [
  { key: 'workbench', label: '首頁工作台', icon: LayoutDashboard },
  { key: 'accounts', label: '賬戶服務', icon: Wallet },
  { key: 'transfer', label: '轉賬匯款', icon: ArrowLeftRight },
  { key: 'payments', label: '繳費支付', icon: Zap },
  { key: 'collections', label: '收付款服務', icon: HandCoins },
  { key: 'wealth', label: '投資理財', icon: PiggyBank },
  { key: 'loans', label: '企業貸款', icon: Banknote },
  { key: 'cash', label: '現金管理', icon: Vault },
  { key: 'approvals', label: '交易審批', icon: ClipboardCheck },
  { key: 'merchant', label: '電子支付', icon: QrCode },
  { key: 'service', label: '服務中心', icon: LifeBuoy },
  { key: 'mobile', label: '手機銀行', icon: Smartphone, preview: true },
  { key: 'direct', label: '銀企直連', icon: Cable },
  { key: 'admin', label: '銀行後台', icon: ServerCog, preview: true },
  { key: 'security', label: '安全中心', icon: ShieldCheck },
  { key: 'messages', label: '消息中心', icon: Bell },
]

const SKINS: Record<string, { label: string; main: string; side: string }> = {
  blue: { label: '商務藍', main: '#0b2a5b', side: '#0b2a5b' },
  red: { label: '小鋒紅', main: '#8a1f1f', side: '#8a1f1f' },
  green: { label: '自然綠', main: '#134e3a', side: '#134e3a' },
}

export default function Layout({ page, setPage, pendingCount, children, onLogout }: {
  page: PageKey
  setPage: (p: PageKey) => void
  pendingCount: number
  children: ReactNode
  onLogout: () => void
}) {
  const [skin, setSkin] = useState<keyof typeof SKINS>('blue')
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col" data-skin={skin}>
      <style>{`
        [data-skin="red"] header[class*="bg-[#0b2a5b]"], [data-skin="red"] aside[class*="bg-[#0b2a5b]"] { background-color: ${SKINS.red.main} !important; }
        [data-skin="green"] header[class*="bg-[#0b2a5b]"], [data-skin="green"] aside[class*="bg-[#0b2a5b]"] { background-color: ${SKINS.green.main} !important; }
      `}</style>
      {/* 演示版提示條 */}
      <div className="bg-amber-400 text-amber-950 text-center text-sm py-1.5 font-medium tracking-wide">
        演示版 —— 本環境所有數據均為模擬數據，僅供功能體驗，不構成任何真實交易
      </div>

      {/* 頂欄 */}
      <header className="bg-[#0b2a5b] text-white flex items-center gap-4 px-6 h-14 shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg tracking-wider">
          <Landmark className="w-6 h-6 text-red-400" />
          小鋒銀行 <span className="text-slate-300 font-normal text-sm">Siao Fong Bank</span>
          <span className="ml-2 text-xs bg-red-500/90 rounded px-2 py-0.5 font-normal">新一代企業網銀</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 text-sm text-slate-200">
          <Palette className="w-4 h-4" />
          {(Object.keys(SKINS) as Array<keyof typeof SKINS>).map(k => (
            <button key={k} onClick={() => setSkin(k)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${skin === k ? 'bg-white text-slate-900 border-white font-medium' : 'border-white/40 hover:bg-white/10'}`}>
              {SKINS[k].label}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-white/20" />
        <button onClick={() => setPage('service')} className="flex items-center gap-1 text-sm text-slate-200 hover:text-white"><LifeBuoy className="w-4 h-4" />幫助中心</button>
        <button onClick={() => setPage('service')} className="flex items-center gap-1 text-sm text-slate-200 hover:text-white"><Download className="w-4 h-4" />下載中心</button>
        <button className="flex items-center gap-1 text-sm text-slate-200 hover:text-white"><MessageSquareMore className="w-4 h-4" />在線客服</button>
        <div className="w-px h-5 bg-white/20" />
        <div className="text-sm text-slate-200">
          {USER}　<span className="text-slate-400">上次登錄 2026-10-05 17:08</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1 text-sm text-slate-200 hover:text-white">
          <LogOut className="w-4 h-4" />退出
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* 側欄 */}
        <aside className="w-56 bg-[#0b2a5b] text-slate-200 flex flex-col shrink-0">
          <div className="px-5 py-4 text-xs text-slate-400 border-t border-white/10">{COMPANY}</div>
          <nav className="flex-1 px-2 space-y-1">
            {NAV.map(n => {
              const Icon = n.icon
              const active = page === n.key
              return (
                <button key={n.key} onClick={() => setPage(n.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? 'bg-white/15 text-white font-medium' : 'hover:bg-white/5'}`}>
                  <Icon className="w-4 h-4" />
                  {n.label}
                  {n.preview && <span className="ml-auto text-[10px] bg-white/10 border border-white/20 rounded px-1 py-px leading-none">預覽</span>}
                  {n.key === 'approvals' && pendingCount > 0 && (
                    <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">{pendingCount}</span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="p-4 text-xs text-slate-500 leading-relaxed">
            24 小時服務熱線<br />（853） 8800 0000
          </div>
        </aside>

        {/* 主區域 */}
        <main className="flex-1 overflow-auto p-6 relative">
          {children}
          {/* 演示版水印 */}
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.05] select-none z-0">
            <div className="text-[120px] font-black text-[#0b2a5b] -rotate-12 whitespace-nowrap">演示版 DEMO</div>
          </div>
        </main>
      </div>
    </div>
  )
}
