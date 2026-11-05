import { useState } from 'react'
import { Download, FileText, Printer, ShieldCheck } from 'lucide-react'

type Receipt = { id: string; biz: string; kind: '受理回執' | '結果回單'; product: string; payee: string; amount: string; date: string; status: string }
const seed: Receipt[] = [
  { id: 'RC20261028001', biz: 'RM20261028001', kind: '受理回執', product: '普通匯款', payee: 'Heng Seng Trading Co.', amount: 'HKD 1,200,000.00', date: '2026-10-28 19:40', status: '待審批' },
  { id: 'RC20261002009', biz: 'RM20261002001', kind: '結果回單', product: '普通匯款', payee: 'Heng Seng Trading Co.', amount: 'HKD 1,200,000.00', date: '2026-10-02 16:22', status: '處理成功' },
  { id: 'RC20261018003', biz: 'MC20261018003', kind: '結果回單', product: '澳中轉賬', payee: '中山五金批發有限公司', amount: 'HKD 100,000.00', date: '2026-10-18 11:08', status: '處理成功' },
  { id: 'RC20260920006', biz: 'RM20260920003', kind: '結果回單', product: '普通匯款', payee: 'Global Textile GmbH', amount: 'EUR 45,000.00', date: '2026-09-20 15:30', status: '處理失敗' },
]
export default function Receipts() {
  const [preview, setPreview] = useState<Receipt | null>(null)
  const [notice, setNotice] = useState('')
  return <div className="max-w-6xl mx-auto space-y-4">
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-1"><h3 className="font-bold text-slate-800 flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#134b9e]" />企網渠道電子回單</h3><span className="text-xs text-slate-400">受理回執與結果回單分開展示</span></div>
      <p className="text-xs text-slate-400 mb-4">僅處理成功的結果回單可作提供予供應商的付款憑證；不代表收款人最終入賬。本頁不延伸為全行回單或統一驗真系統。</p>
      <table className="w-full text-sm"><thead><tr className="text-left text-slate-400 text-xs border-y-2 border-slate-800"><th className="py-2.5 font-medium">回單／業務編號</th><th className="font-medium">類型</th><th className="font-medium">產品／收款人</th><th className="font-medium text-right">金額</th><th className="font-medium">狀態</th><th className="font-medium">生成時間</th><th className="font-medium text-right pr-2">操作</th></tr></thead><tbody>{seed.map(r => <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3 text-slate-600 font-mono text-xs">{r.id}<br /><span className="text-slate-400">{r.biz}</span></td><td><span className={`text-xs rounded px-2 py-0.5 ${r.kind === '結果回單' ? 'bg-blue-50 text-[#134b9e]' : 'bg-slate-100 text-slate-600'}`}>{r.kind}</span></td><td className="text-slate-600 text-xs">{r.product}<br /><span className="text-slate-700">{r.payee}</span></td><td className="text-right text-slate-800 whitespace-nowrap pr-4">{r.amount}</td><td className={(r.status === '處理成功' ? 'text-emerald-600' : 'text-slate-500') + ' text-xs whitespace-nowrap pr-3'}>{r.status}</td><td className="text-slate-500 text-xs">{r.date}</td><td className="text-right pr-2 space-x-2"><button onClick={() => setPreview(r)} className="text-xs text-[#134b9e]">預覽</button><button onClick={() => setNotice(`${r.id}：PDF 下載須按敏感資料規則完成適用的 2FA；銀企直連沿用同一回單標準及渠道業務編號。`)} className="text-xs text-[#134b9e]"><Download className="w-3 h-3 inline" /> 下載</button><button onClick={() => setNotice(`${r.id}：已開啟列印預覽（原型操作提示）。`)} className="text-xs text-[#134b9e]"><Printer className="w-3 h-3 inline" /> 列印</button></td></tr>)}</tbody></table>
      {notice && <p className="text-xs text-[#134b9e] bg-blue-50 rounded p-3 mt-3">{notice}</p>}
      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />列表預設脫敏；完整敏感資料查看、複製、導出及下載按公共 2FA 和日誌規則控制。</p>
    </div>
    {preview && <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6" onClick={() => setPreview(null)}><div className="bg-white rounded-xl shadow-xl w-[620px] max-h-full overflow-auto p-8" onClick={e => e.stopPropagation()}>
      <div className="text-center border-b-2 border-slate-800 pb-3"><div className="font-bold text-slate-800">小鋒銀行 SIAO FONG BANK</div><div className="text-sm text-slate-600 mt-1">企網渠道{preview.kind}（目標方案原型示意）</div></div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-5"><D k="回單編號" v={preview.id} /><D k="渠道業務編號" v={preview.biz} /><D k="產品" v={preview.product} /><D k="實際狀態" v={preview.status} /><D k="付款企業" v="誠信貿易（澳門）一人有限公司" /><D k="收款人（交易快照）" v={preview.payee} /><D k="交易金額" v={preview.amount} /><D k="費用／總扣款" v={preview.kind === '受理回執' ? '尚未確定' : '以有權賬務結果列示'} /><D k="清算附言快照" v="INV-2026-Q3-018" /><D k="生成時間" v={preview.date} />{preview.product === '澳中轉賬' && <><D k="實際匯率（原型示例）" v="1 HKD = 1.0320 MOP" /><D k="兌換金額" v="MOP 103,200.00" /></>}</dl>
      <div className="mt-5 bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900">{preview.kind === '受理回執' ? '本回執只證明企網已受理，不表示已扣賬、已發送或交易成功，不得作成功付款憑證。' : preview.status === '處理成功' ? '本結果回單可作提供予供應商的付款憑證。普通跨境匯款之成功代表本行相應處理節點完成，不當然代表收款人最終入賬。' : '本回單只反映所示處理結果，不得作成功付款憑證。'}</div>
      <button onClick={() => setPreview(null)} className="mt-5 w-full border border-slate-300 rounded-lg py-2 text-sm text-slate-600">關閉</button>
    </div></div>}
  </div>
}
function D({ k, v }: { k: string; v: string }) { return <div><dt className="text-xs text-slate-400">{k}</dt><dd className="text-slate-700 mt-1">{v}</dd></div> }
