import { useState } from 'react'
import { Landmark, Smartphone, ShieldCheck, Palette, QrCode, Building2, RefreshCw, CheckCircle2 } from 'lucide-react'

const SKINS = [
  { key: 'ocean', name: '經典藍', cls: 'from-[#0b2a5b] to-[#134b9e]' },
  { key: 'crimson', name: '小鋒紅', cls: 'from-[#7f1d1d] to-[#b91c1c]' },
  { key: 'festival', name: '節日主題', cls: 'from-[#7c2d12] to-[#c2410c]' },
]

const ENTS = ['澳門永利供應鏈有限公司', '珠海永利貿易有限公司（關聯企業）', '香港永利控股集團（關聯企業）']

// 偽二維碼圖案（演示用，固定隨機種子）
function FakeQR() {
  const cells: boolean[] = []
  let seed = 42
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  for (let i = 0; i < 21 * 21; i++) cells.push(rand() > 0.52)
  const finder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)
  const inFinder = (r: number, c: number) => {
    if (r < 7 && c < 7) return (r === 0 || r === 6 || c === 0 || c === 6) || (r >= 2 && r <= 4 && c >= 2 && c <= 4)
    if (r < 7 && c >= 14) return (r === 0 || r === 6 || c === 14 || c === 20) || (r >= 2 && r <= 4 && c >= 16 && c <= 18)
    if (r >= 14 && c < 7) return (r === 14 || r === 20 || c === 0 || c === 6) || (r >= 16 && r <= 18 && c >= 2 && c <= 4)
    return false
  }
  return (
    <div className="grid grid-cols-[repeat(21,1fr)] w-44 h-44 bg-white p-2 border-2 border-slate-200 rounded-lg">
      {cells.map((on, i) => {
        const r = Math.floor(i / 21), c = i % 21
        const filled = finder(r, c) ? inFinder(r, c) : on
        return <div key={i} className={filled ? 'bg-slate-900' : 'bg-white'} />
      })}
    </div>
  )
}

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pwd, setPwd] = useState('')
  const [skin, setSkin] = useState(0)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'pwd' | 'qr'>('pwd')
  const [ent, setEnt] = useState(0)
  const [scanned, setScanned] = useState(false)
  const [scanTick, setScanTick] = useState(0)

  const submit = () => {
    if (!user.trim() || !pwd.trim()) {
      setError('請輸入企業用戶名及密碼（演示環境輸入任意內容即可登錄）')
      return
    }
    onLogin()
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${SKINS[skin].cls} flex flex-col`}>
      <div className="bg-amber-400 text-amber-950 text-center text-sm py-1.5 font-medium">
        演示版 —— 本環境所有數據均為模擬數據，僅供功能體驗
      </div>
      <header className="flex items-center gap-3 px-10 py-5 text-white">
        <Landmark className="w-8 h-8" />
        <div>
          <div className="text-xl font-bold tracking-widest">小鋒銀行</div>
          <div className="text-xs text-white/70 tracking-wider">SIAO FONG BANK　新一代企業網銀</div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Palette className="w-4 h-4" /> 換膚：
          {SKINS.map((s, i) => (
            <button key={s.key} onClick={() => setSkin(i)}
              className={`px-3 py-1 rounded-full text-xs border ${skin === i ? 'bg-white text-slate-900 border-white' : 'border-white/40 hover:bg-white/10'}`}>
              {s.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center gap-16 px-10">
        <div className="text-white max-w-lg hidden lg:block">
          <h1 className="text-4xl font-bold leading-snug mb-4">企業金融服務<br />一個平台，三端暢通</h1>
          <p className="text-white/70 leading-relaxed mb-8">
            覆蓋網上銀行、企業手機銀行、銀企直連三大渠道，統一認證、統一授權、統一限額、統一風控。
            客戶一次簽約，多渠道協同使用。
          </p>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            {[['賬戶服務', '多幣種一覽'], ['轉賬匯款', '7×24 實時'], ['交易審批', '多級多人']].map(([a, b]) => (
              <div key={a} className="bg-white/10 rounded-lg py-3 backdrop-blur">
                <div className="font-medium">{a}</div>
                <div className="text-white/60 text-xs mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl w-[380px] p-8">
          <div className="flex bg-slate-100 rounded-lg p-1 mb-6 text-sm">
            {([['pwd', '密碼登錄'], ['qr', '掃碼登錄']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${tab === k ? 'bg-white text-[#0b2a5b] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'pwd' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">企業用戶登錄</h2>
              <p className="text-xs text-slate-400 mb-6">演示環境：輸入任意用戶名及密碼即可登錄</p>
              <label className="block text-sm text-slate-600 mb-1">企業用戶名</label>
              <input value={user} onChange={e => { setUser(e.target.value); setError('') }}
                placeholder="企業號 / 用戶代碼"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
              <label className="block text-sm text-slate-600 mb-1">登錄密碼</label>
              <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="登錄密碼"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#134b9e]" />
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 mt-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                支持短訊驗證碼、Soft Token、UKEY 多種認證方式組合
              </div>
              <div className="border border-slate-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <Building2 className="w-3.5 h-3.5" /> 關聯企業切換（一個用戶代碼可綁定多家企業）
                </div>
                <select value={ent} onChange={e => setEnt(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm">
                  {ENTS.map((e2, i) => <option key={e2} value={i}>{e2}</option>)}
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">登錄後可於頂欄快速切換關聯企業，各企業資料與授權相互隔離。</p>
              </div>
              <button onClick={submit}
                className="w-full bg-[#c8102e] hover:bg-[#a50d26] text-white font-medium rounded-lg py-2.5 transition-colors">
                登 錄
              </button>
              <div className="flex justify-between mt-4 text-xs text-slate-500">
                <button className="hover:text-[#134b9e]">忘記密碼？</button>
                <button className="hover:text-[#134b9e]">開通企業網銀</button>
              </div>
            </>
          )}

          {tab === 'qr' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-1">掃碼登錄</h2>
              <p className="text-xs text-slate-400 mb-5">使用企業手機銀行 App 掃描二維碼，安全快捷免輸密碼</p>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <FakeQR key={scanTick} />
                  {scanned && (
                    <div className="absolute inset-0 bg-white/90 rounded-lg flex flex-col items-center justify-center gap-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">掃碼成功，請在手機上確認</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {!scanned ? (
                    <button onClick={() => setScanned(true)}
                      className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 hover:border-[#134b9e] hover:text-[#134b9e]">
                      <Smartphone className="w-4 h-4" /> 模擬手機掃碼成功
                    </button>
                  ) : (
                    <>
                      <button onClick={onLogin}
                        className="bg-[#c8102e] hover:bg-[#a50d26] text-white rounded-lg px-5 py-2 text-sm font-medium">確認登錄</button>
                      <button onClick={() => { setScanned(false); setScanTick(t => t + 1) }}
                        className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-600 hover:border-slate-400">
                        <RefreshCw className="w-4 h-4" /> 刷新二維碼
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" /> 二維碼每 60 秒自動刷新，請勿泄露予他人
                </p>
              </div>
            </>
          )}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Smartphone className="w-4 h-4" /> 掃碼下載企業手機銀行　<span className="text-slate-300">|</span>　演示版與正式版同步更新
          </div>
        </div>
      </div>

      <footer className="text-center text-white/50 text-xs py-4">
        小鋒銀行股份有限公司　版權所有　|　客戶服務熱線：（853）8800 0000
      </footer>
    </div>
  )
}
