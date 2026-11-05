// 演示版模拟数据 —— 全部虚构，仅供演示
export interface Account {
  no: string
  name: string
  ccy: string
  balance: number
  available: number
  branch: string
  type: string
}

export interface Txn {
  date: string
  summary: string
  out: number | null
  in: number | null
  balance: number
  counterparty: string
  ref: string
}

export interface Approval {
  id: string
  type: string
  amount: number | null
  ccy: string
  initiator: string
  time: string
  status: 'pending' | 'approved' | 'rejected'
  payee?: string
  payeeAcct?: string
  memo?: string
  steps: { node: string; operator: string; time: string; result: string }[]
}

export interface Message {
  id: number
  kind: '公告' | '交易通知' | '營銷活動'
  title: string
  date: string
  read: boolean
  body: string
}

export const COMPANY = '誠信貿易（澳門）一人有限公司'
export const USER = '陳大文'

export const accounts: Account[] = [
  { no: '101-88-123456-7', name: '澳門元往來賬戶', ccy: 'MOP', balance: 2863450.55, available: 2863450.55, branch: '總行營業部', type: '往來' },
  { no: '101-22-654321-8', name: '港元往來賬戶', ccy: 'HKD', balance: 5120800.0, available: 5020800.0, branch: '總行營業部', type: '往來' },
  { no: '101-13-778899-0', name: '人民幣往來賬戶', ccy: 'CNY', balance: 890150.3, available: 890150.3, branch: '珠海分行', type: '往來' },
  { no: '201-88-334455-6', name: '澳門元定期存款', ccy: 'MOP', balance: 2000000.0, available: 0, branch: '總行營業部', type: '定期' },
  { no: '101-14-990011-2', name: '美元往來賬戶', ccy: 'USD', balance: 153200.75, available: 153200.75, branch: '總行營業部', type: '往來' },
]

export const txns: Txn[] = [
  { date: '2026-10-05', summary: '行內轉賬', out: 150000.0, in: null, balance: 2863450.55, counterparty: '永利供應鏈有限公司', ref: 'TF202610050012' },
  { date: '2026-10-03', summary: '批量代付-薪金', out: 385600.0, in: null, balance: 3013450.55, counterparty: '批量代付（32 筆）', ref: 'TF202610030088' },
  { date: '2026-10-02', summary: '匯款存入', out: null, in: 920000.0, balance: 3399050.55, counterparty: 'Heng Seng Trading Co.', ref: 'TF202610020031' },
  { date: '2026-09-30', summary: '繳費-電費', out: 12450.6, in: null, balance: 2479050.55, counterparty: '澳門電力股份有限公司', ref: 'TF202609300152' },
  { date: '2026-09-28', summary: '支票清算', out: 68000.0, in: null, balance: 2491501.15, counterparty: '澳門建築材料有限公司', ref: 'TF202609280077' },
  { date: '2026-09-25', summary: '貨款存入', out: null, in: 1350000.0, balance: 2559501.15, counterparty: '廣州遠洋實業集團', ref: 'TF202609250019' },
  { date: '2026-09-22', summary: '跨行轉賬', out: 220000.0, in: null, balance: 1209501.15, counterparty: '中山五金批發有限公司', ref: 'TF202609220046' },
  { date: '2026-09-20', summary: '利息存入', out: null, in: 8450.15, balance: 1429501.15, counterparty: '本行結息', ref: 'TF202609200003' },
]

export const payees = [
  { name: '永利供應鏈有限公司', acct: '101-88-556677-8', bank: '小鋒銀行' },
  { name: '澳門建築材料有限公司', acct: '101-88-990011-2', bank: '小鋒銀行' },
  { name: '中山五金批發有限公司', acct: '6222 **** **** 8834', bank: '中國銀行中山分行' },
  { name: 'Heng Seng Trading Co.', acct: '024-888-112233-4', bank: '恒生銀行' },
]

export const initialApprovals: Approval[] = [
  {
    id: 'TF20261006001',
    type: '行內轉賬',
    amount: 580000.0,
    ccy: 'MOP',
    initiator: '李小梅（錄入員）',
    time: '2026-10-06 09:42',
    status: 'pending',
    payee: '永利供應鏈有限公司',
    payeeAcct: '101-88-556677-8',
    memo: '十月份貨款',
    steps: [
      { node: '交易發起', operator: '李小梅（錄入員）', time: '2026-10-06 09:42', result: '已提交' },
      { node: '一級審批', operator: '陳大文（審批員）', time: '—', result: '待處理' },
      { node: '二級審批', operator: '黃志強（財務總監）', time: '—', result: '未開始' },
    ],
  },
  {
    id: 'TF20261005012',
    type: '批量代付',
    amount: 385600.0,
    ccy: 'MOP',
    initiator: '李小梅（錄入員）',
    time: '2026-10-05 16:20',
    status: 'pending',
    payee: '批量代付-薪金（32 筆）',
    memo: '十月份薪金',
    steps: [
      { node: '交易發起', operator: '李小梅（錄入員）', time: '2026-10-05 16:20', result: '已提交' },
      { node: '一級審批', operator: '陳大文（審批員）', time: '—', result: '待處理' },
      { node: '二級審批', operator: '黃志強（財務總監）', time: '—', result: '未開始' },
    ],
  },
  {
    id: 'TF20261003031',
    type: '跨行匯款',
    amount: 1200000.0,
    ccy: 'HKD',
    initiator: '王志明（錄入員）',
    time: '2026-10-03 11:05',
    status: 'approved',
    payee: 'Heng Seng Trading Co.',
    payeeAcct: '024-888-112233-4',
    memo: 'Q3 採購尾款',
    steps: [
      { node: '交易發起', operator: '王志明（錄入員）', time: '2026-10-03 11:05', result: '已提交' },
      { node: '一級審批', operator: '陳大文（審批員）', time: '2026-10-03 11:31', result: '通過' },
      { node: '二級審批', operator: '黃志強（財務總監）', time: '2026-10-03 14:02', result: '通過' },
    ],
  },
  {
    id: 'TF20260929008',
    type: '定期存款開立',
    amount: 2000000.0,
    ccy: 'MOP',
    initiator: '王志明（錄入員）',
    time: '2026-09-29 15:44',
    status: 'rejected',
    memo: '三個月定期',
    steps: [
      { node: '交易發起', operator: '王志明（錄入員）', time: '2026-09-29 15:44', result: '已提交' },
      { node: '一級審批', operator: '陳大文（審批員）', time: '2026-09-29 17:10', result: '拒絕', },
      { node: '二級審批', operator: '黃志強（財務總監）', time: '—', result: '未開始' },
    ],
  },
]

export const initialMessages: Message[] = [
  { id: 1, kind: '公告', title: '關於新一代企業網銀演示版上線的通知', date: '2026-10-06', read: false, body: '尊貴的客戶：新一代企業網銀演示版現已上線，歡迎體驗全新工作台、轉賬匯款及審批流程。演示環境數據均為模擬數據。' },
  { id: 2, kind: '公告', title: '企業網銀系統 10 月 12 日凌晨維護公告', date: '2026-10-04', read: false, body: '本行將於 2026 年 10 月 12 日 02:00–06:00 進行系統維護，期間企業網銀服務將暫停，敬請留意。' },
  { id: 3, kind: '交易通知', title: '行內轉賬 MOP 150,000.00 已完成', date: '2026-10-05', read: false, body: '您提交的行內轉賬交易（參考編號 TF202610050012）已於 2026-10-05 15:22 完成扣賬。' },
  { id: 4, kind: '交易通知', title: '批量代付（薪金）32 筆處理完成', date: '2026-10-03', read: true, body: '批量代付批次 TF202610030088 共 32 筆，成功 32 筆，失敗 0 筆，回單已可下載。' },
  { id: 5, kind: '營銷活動', title: '網銀渠道定期存款利率上浮優惠', date: '2026-10-01', read: true, body: '即日起至 12 月 31 日，經企業網銀開立三個月或以上澳門元定期存款，可享年利率上浮 20 點子優惠。' },
]

export const fmt = (n: number, ccy = '') =>
  (ccy ? ccy + ' ' : '') +
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const maskAcct = (s: string) => {
  const d = s.replace(/[^0-9]/g, '')
  if (d.length < 6) return s
  return s.slice(0, 5) + ' **** ' + s.slice(-4)
}

// ===== 以下為「現有功能平移優化」新增模塊模擬數據 =====

// 網上繳費
export interface Bill {
  id: string
  category: '公共事業' | '政府' | '電訊'
  merchant: string
  acctNo: string
  amount: number
  dueDate: string
  status: '待繳' | '已繳'
}
export const bills: Bill[] = [
  { id: 'B001', category: '公共事業', merchant: '澳門電力股份有限公司', acctNo: 'E-88213456', amount: 12450.6, dueDate: '2026-10-15', status: '待繳' },
  { id: 'B002', category: '公共事業', merchant: '澳門自來水股份有限公司', acctNo: 'W-22014578', amount: 3860.0, dueDate: '2026-10-18', status: '待繳' },
  { id: 'B003', category: '電訊', merchant: '澳門電訊（CTM）', acctNo: 'T-33445566', amount: 2288.0, dueDate: '2026-10-10', status: '待繳' },
  { id: 'B004', category: '電訊', merchant: '中國電信（澳門）', acctNo: 'T-99001122', amount: 1150.0, dueDate: '2026-10-08', status: '待繳' },
  { id: 'B005', category: '政府', merchant: '財政局（地租）', acctNo: 'G-11223344', amount: 5200.0, dueDate: '2026-10-31', status: '待繳' },
  { id: 'B006', category: '公共事業', merchant: '澳門電力股份有限公司', acctNo: 'E-88213456', amount: 10890.2, dueDate: '2026-09-15', status: '已繳' },
]

// 自動轉賬
export interface AutoTransfer {
  id: string
  from: string
  to: string
  amount: number
  freq: '每月' | '每週' | '每日'
  nextDate: string
  status: '生效中' | '已暫停'
}
export const autoTransfers: AutoTransfer[] = [
  { id: 'AT01', from: '澳門元往來賬戶', to: '人民幣往來賬戶（兌換）', amount: 50000, freq: '每月', nextDate: '2026-11-01', status: '生效中' },
  { id: 'AT02', from: '港元往來賬戶', to: '集團資金歸集賬戶', amount: 200000, freq: '每日', nextDate: '2026-10-07', status: '生效中' },
  { id: 'AT03', from: '澳門元往來賬戶', to: '備用金賬戶', amount: 30000, freq: '每週', nextDate: '2026-10-12', status: '已暫停' },
]

// 月結單
export interface Statement {
  month: string
  acct: string
  channel: '電子結單' | '紙質結單'
  size: string
}
export const statements: Statement[] = [
  { month: '2026-09', acct: '澳門元往來賬戶', channel: '電子結單', size: '486 KB' },
  { month: '2026-08', acct: '澳門元往來賬戶', channel: '電子結單', size: '512 KB' },
  { month: '2026-07', acct: '澳門元往來賬戶', channel: '電子結單', size: '455 KB' },
  { month: '2026-09', acct: '港元往來賬戶', channel: '電子結單', size: '398 KB' },
  { month: '2026-09', acct: '美元往來賬戶', channel: '電子結單', size: '312 KB' },
]

// 支票簿申請記錄
export interface ChequeBook {
  id: string
  acct: string
  leaves: number
  applyDate: string
  status: '處理中' | '已寄出' | '已完成'
}
export const chequeBooks: ChequeBook[] = [
  { id: 'CB20260901', acct: '澳門元往來賬戶', leaves: 50, applyDate: '2026-09-12', status: '已完成' },
  { id: 'CB20261002', acct: '港元往來賬戶', leaves: 25, applyDate: '2026-10-02', status: '已寄出' },
]

// 資產證明書申請記錄
export interface AssetCert {
  id: string
  purpose: string
  lang: '中文' | '英文' | '中／英文'
  copies: number
  fee: number
  date: string
  status: string
}
export const assetCerts: AssetCert[] = [
  { id: 'AC20260915', purpose: '投標資格證明', lang: '中／英文', copies: 2, fee: 400, date: '2026-09-15', status: '已完成' },
  { id: 'AC20260928', purpose: '審計用途', lang: '中文', copies: 1, fee: 150, date: '2026-09-28', status: '已完成' },
]

// 定期存款
export interface Deposit {
  id: string
  acct: string
  ccy: string
  principal: number
  rate: number
  term: string
  openDate: string
  maturityDate: string
  interest: number
  status: '持有中' | '已到期'
  autoRenew: boolean
}
export const deposits: Deposit[] = [
  { id: 'TD2026070101', acct: '澳門元定期存款', ccy: 'MOP', principal: 2000000, rate: 2.55, term: '三個月', openDate: '2026-07-01', maturityDate: '2026-10-01', interest: 12750, status: '已到期', autoRenew: false },
  { id: 'TD2026091002', acct: '澳門元定期存款', ccy: 'MOP', principal: 2000000, rate: 2.75, term: '六個月', openDate: '2026-09-10', maturityDate: '2027-03-10', interest: 27500, status: '持有中', autoRenew: true },
  { id: 'TD2026100503', acct: '港元定期存款', ccy: 'HKD', principal: 1000000, rate: 3.1, term: '十二個月', openDate: '2026-10-05', maturityDate: '2027-10-05', interest: 31000, status: '持有中', autoRenew: false },
]

// 外匯牌價（每 1 單位外幣兌 MOP）
export interface FxRate {
  ccy: string
  buyCash: number
  sellCash: number
  buySpot: number
  sellSpot: number
  trend: 'up' | 'down'
}
export const fxRates: FxRate[] = [
  { ccy: 'USD', buyCash: 7.9820, sellCash: 8.0620, buySpot: 8.0120, sellSpot: 8.0520, trend: 'up' },
  { ccy: 'HKD', buyCash: 1.0280, sellCash: 1.0380, buySpot: 1.0320, sellSpot: 1.0360, trend: 'down' },
  { ccy: 'CNY', buyCash: 1.1280, sellCash: 1.1480, buySpot: 1.1350, sellSpot: 1.1420, trend: 'up' },
  { ccy: 'EUR', buyCash: 9.2850, sellCash: 9.4650, buySpot: 9.3250, sellSpot: 9.4250, trend: 'down' },
  { ccy: 'GBP', buyCash: 10.7200, sellCash: 10.9200, buySpot: 10.7800, sellSpot: 10.8600, trend: 'up' },
]

// 企業貸款
export interface Loan {
  id: string
  type: string
  principal: number
  outstanding: number
  rate: number
  startDate: string
  maturityDate: string
  repayMethod: string
  collateral: { name: string; address: string; value: number; order: string }[]
  schedules: { date: string; principal: number; interest: number; total: number; status: '已還' | '待還' }[]
}
export const loans: Loan[] = [
  {
    id: 'LN2023-0888', type: '中小企業循環貸款', principal: 5000000, outstanding: 3250000, rate: 3.85,
    startDate: '2023-06-15', maturityDate: '2028-06-15', repayMethod: '按月等額本息',
    collateral: [
      { name: '澳門半島皇朝區商業單位', address: '澳門宋玉生廣場 255 號中土大廈 12 樓', value: 8800000, order: '第一順位' },
    ],
    schedules: [
      { date: '2026-10-15', principal: 54167, interest: 10422, total: 64589, status: '待還' },
      { date: '2026-09-15', principal: 54167, interest: 10556, total: 64723, status: '已還' },
      { date: '2026-08-15', principal: 54167, interest: 10689, total: 64856, status: '已還' },
      { date: '2026-07-15', principal: 54167, interest: 10823, total: 64990, status: '已還' },
      { date: '2026-06-15', principal: 54167, interest: 10956, total: 65123, status: '已還' },
    ],
  },
  {
    id: 'LN2024-0120', type: '物業按揭貸款', principal: 12000000, outstanding: 10850000, rate: 3.35,
    startDate: '2024-03-20', maturityDate: '2039-03-20', repayMethod: '按月等額本金',
    collateral: [
      { name: '氹仔市中心工業大廈單位', address: '氹仔孫逸仙博士大馬路 326 號工業中心 B 座 8 樓', value: 18500000, order: '第一順位' },
    ],
    schedules: [
      { date: '2026-10-20', principal: 66667, interest: 30306, total: 96973, status: '待還' },
      { date: '2026-09-20', principal: 66667, interest: 30492, total: 97159, status: '已還' },
      { date: '2026-08-20', principal: 66667, interest: 30678, total: 97345, status: '已還' },
    ],
  },
]

// 預約／周期轉賬
export interface Scheduled {
  id: string
  type: '單次預約' | '周期轉賬'
  payee: string
  amount: number
  ccy: string
  execTime: string
  freq?: string
  status: '待執行' | '已執行' | '已撤銷'
  note?: string
}
export const scheduledTxns: Scheduled[] = [
  { id: 'SC20261007001', type: '單次預約', payee: '永利供應鏈有限公司', amount: 88000, ccy: 'MOP', execTime: '2026-10-07 09:00', status: '待執行', note: '預約時間處於銀行營業時間外，涉及匯兌場景可能無法順利匯出' },
  { id: 'SC20261015002', type: '周期轉賬', payee: '中山五金批發有限公司', amount: 150000, ccy: 'CNY', execTime: '每月 15 日 10:00', freq: '每月', status: '待執行' },
  { id: 'SC20261001003', type: '單次預約', payee: '澳門建築材料有限公司', amount: 66000, ccy: 'MOP', execTime: '2026-10-01 14:00', status: '已執行' },
]

// 收款人名冊（含分組）
export interface PayeeGroup {
  group: string
  payees: { name: string; acct: string; bank: string; ccy: string }[]
}
export const payeeGroups: PayeeGroup[] = [
  { group: '常用供應商', payees: [
    { name: '永利供應鏈有限公司', acct: '101-88-556677-8', bank: '小鋒銀行', ccy: 'MOP' },
    { name: '澳門建築材料有限公司', acct: '101-88-990011-2', bank: '小鋒銀行', ccy: 'MOP' },
    { name: '中山五金批發有限公司', acct: '6222 **** **** 8834', bank: '中國銀行中山分行', ccy: 'CNY' },
  ]},
  { group: '跨境收款人', payees: [
    { name: 'Heng Seng Trading Co.', acct: '024-888-112233-4', bank: '恒生銀行（香港）', ccy: 'HKD' },
    { name: 'Shenzhen Tech Imports Ltd.', acct: '6217 **** **** 9902', bank: '招商銀行深圳分行', ccy: 'CNY' },
  ]},
]


// 過數易（FPS）明細
export interface FpsTxn {
  date: string
  proxy: string
  proxyType: '手機號' | '電郵' | 'FPS ID'
  name: string
  amount: number
  status: string
  ref: string
}
export const fpsTxns: FpsTxn[] = [
  { date: '2026-10-05 11:22', proxy: '66** **34', proxyType: '手機號', name: '梁志明', amount: 12800, status: '已完成', ref: 'FPS20261005001' },
  { date: '2026-10-03 16:05', proxy: 'fps@66**', proxyType: 'FPS ID', name: '金記五金', amount: 23500, status: '已完成', ref: 'FPS20261003002' },
  { date: '2026-09-29 09:48', proxy: 'a**@macau.ctm.net', proxyType: '電郵', name: '陳美玲', amount: 5600, status: '已完成', ref: 'FPS20260929003' },
]

// 批量代付批次
export interface Batch {
  id: string
  kind: '代發薪金' | '批量代付' | 'FPS 批量付款'
  count: number
  success: number
  failed: number
  amount: number
  date: string
  status: string
}
export const batches: Batch[] = [
  { id: 'BT20261003088', kind: '代發薪金', count: 32, success: 32, failed: 0, amount: 385600, date: '2026-10-03', status: '處理完成' },
  { id: 'BT20260915066', kind: '批量代付', count: 18, success: 17, failed: 1, amount: 246800, date: '2026-09-15', status: '部分失敗' },
]

// 代收款登記
export interface Collection {
  id: string
  name: string
  channel: '收款鏈接' | '二維碼'
  amount: number | null
  received: number
  count: number
  status: string
  date: string
}
export const collections: Collection[] = [
  { id: 'CL20261001', name: '十月份會費收取', channel: '收款鏈接', amount: null, received: 86000, count: 43, status: '收款中', date: '2026-10-01' },
  { id: 'CL20260912', name: '供應商誠意金', channel: '二維碼', amount: 10000, received: 50000, count: 5, status: '收款中', date: '2026-09-12' },
]

// 電子支付
export interface MerchantTxn {
  date: string
  orderNo: string
  subMerchant: string
  channel: '掃碼支付' | '線上收銀台' | 'POS'
  amount: number
  fee: number
  status: '成功' | '退款' | '處理中'
}
export const merchantTxns: MerchantTxn[] = [
  { date: '2026-10-06 12:31', orderNo: 'EP202610060001', subMerchant: '旗艦店（新馬路）', channel: '掃碼支付', amount: 1580, fee: 9.48, status: '成功' },
  { date: '2026-10-06 11:05', orderNo: 'EP202610060002', subMerchant: '旗艦店（新馬路）', channel: '線上收銀台', amount: 3260, fee: 19.56, status: '成功' },
  { date: '2026-10-05 18:47', orderNo: 'EP202610050003', subMerchant: '氹仔分店', channel: '掃碼支付', amount: 880, fee: 5.28, status: '退款' },
  { date: '2026-10-05 15:20', orderNo: 'EP202610050004', subMerchant: '外賣平台', channel: '線上收銀台', amount: 12440, fee: 74.64, status: '成功' },
  { date: '2026-10-04 20:12', orderNo: 'EP202610040005', subMerchant: '氹仔分店', channel: 'POS', amount: 5600, fee: 33.6, status: '成功' },
]

export const ePaymentReports = [
  { month: '2026-09', count: 1240, amount: 486520, fee: 2919.1 },
  { month: '2026-08', count: 1102, amount: 421380, fee: 2528.3 },
  { month: '2026-07', count: 986, amount: 365900, fee: 2195.4 },
]

export const reconcileFiles = [
  { date: '2026-10-05', name: 'EP_RECON_20261005.csv', size: '128 KB' },
  { date: '2026-10-04', name: 'EP_RECON_20261004.csv', size: '116 KB' },
  { date: '2026-10-03', name: 'EP_RECON_20261003.csv', size: '122 KB' },
]

export const subMerchants = [
  { code: 'SM001', name: '旗艦店（新馬路）', status: '正常', openDate: '2024-01-15' },
  { code: 'SM002', name: '氹仔分店', status: '正常', openDate: '2024-06-20' },
  { code: 'SM003', name: '外賣平台', status: '正常', openDate: '2025-03-08' },
]

// 企業使用者與權限
export interface CompanyUser {
  name: string
  role: '管理員' | '錄入員' | '審批員' | '查詢員'
  dept: string
  status: '正常' | '停用'
  lastLogin: string
  auth: '硬件令牌' | 'Soft Token' | '短訊驗證碼'
}
export const companyUsers: CompanyUser[] = [
  { name: '陳大文', role: '管理員', dept: '財務部', status: '正常', lastLogin: '2026-10-05 17:08', auth: 'Soft Token' },
  { name: '李小梅', role: '錄入員', dept: '財務部', status: '正常', lastLogin: '2026-10-06 09:30', auth: '短訊驗證碼' },
  { name: '王志明', role: '錄入員', dept: '營業部', status: '正常', lastLogin: '2026-10-03 14:12', auth: '硬件令牌' },
  { name: '黃志強', role: '審批員', dept: '財務部', status: '正常', lastLogin: '2026-10-04 18:40', auth: 'Soft Token' },
  { name: '周麗娟', role: '查詢員', dept: '人事部', status: '停用', lastLogin: '2026-08-21 10:05', auth: '短訊驗證碼' },
]

// 短訊提醒服務項
export const smsAlerts = [
  { event: '登錄驗證', on: true, desc: '每次登錄網銀發送驗證碼' },
  { event: '交易發起', on: true, desc: '發起轉賬、匯款、繳費等交易' },
  { event: '交易完成', on: true, desc: '交易最終完成或失敗' },
  { event: '審批提醒', on: true, desc: '有待審批業務時提醒審批人' },
  { event: '賬戶變動', on: false, desc: '賬戶餘額發生變動' },
  { event: '月結單生成', on: true, desc: '電子月結單生成後推送' },
]

// 網上匯款記錄（跨境）
export interface Remit {
  id: string
  channel: 'SWIFT GPI' | 'FPS 跨境支付通'
  payee: string
  country: string
  amount: number
  ccy: string
  feeBear: 'OUR' | 'SHA' | 'BEN'
  status: '處理中' | '已完成' | '已退匯' | '改匯處理中'
  date: string
}
export const remits: Remit[] = [
  { id: 'RM20261002001', channel: 'SWIFT GPI', payee: 'Heng Seng Trading Co.', country: '中國香港', amount: 1200000, ccy: 'HKD', feeBear: 'SHA', status: '已完成', date: '2026-10-02' },
  { id: 'RM20261005002', channel: 'FPS 跨境支付通', payee: '深圳市創新電子有限公司', country: '中國內地', amount: 268000, ccy: 'CNY', feeBear: 'BEN', status: '處理中', date: '2026-10-05' },
  { id: 'RM20260920003', channel: 'SWIFT GPI', payee: 'Global Textile GmbH', country: '德國', amount: 45000, ccy: 'EUR', feeBear: 'OUR', status: '已退匯', date: '2026-09-20' },
]

// ===== 現金管理（新增模塊）模擬數據 =====

// 集團關係 / 多企業資金視圖（東主視角）
export interface GroupAcct { name: string; no: string; ccy: string; balance: number }
export interface GroupCompany {
  id: string
  name: string
  relation: '牽頭公司' | '成員單位'
  accts: GroupAcct[]
  income7d: number
  expense7d: number
  agreement: '已簽署授權協議' | '待簽署'
}
export const groupCompanies: GroupCompany[] = [
  {
    id: 'GC01', name: '誠信貿易（澳門）一人有限公司', relation: '牽頭公司',
    accts: [
      { name: '澳門元往來賬戶（集團主賬戶）', no: '101-88-123456-7', ccy: 'MOP', balance: 2863450.55 },
      { name: '港元往來賬戶', no: '101-22-654321-8', ccy: 'HKD', balance: 5120800 },
    ],
    income7d: 2260000, expense7d: 616450.6, agreement: '已簽署授權協議',
  },
  {
    id: 'GC02', name: '誠信物流（澳門）有限公司', relation: '成員單位',
    accts: [{ name: '澳門元往來賬戶', no: '101-88-887766-1', ccy: 'MOP', balance: 486200.3 }],
    income7d: 368000, expense7d: 412000, agreement: '已簽署授權協議',
  },
  {
    id: 'GC03', name: '誠信（珠海）貿易有限公司', relation: '成員單位',
    accts: [
      { name: '人民幣往來賬戶', no: '101-13-778899-0', ccy: 'CNY', balance: 890150.3 },
      { name: '澳門元結算賬戶', no: '101-14-556677-9', ccy: 'MOP', balance: 152300 },
    ],
    income7d: 1350000, expense7d: 220000, agreement: '已簽署授權協議',
  },
  {
    id: 'GC04', name: '誠信餐飲管理（澳門）有限公司', relation: '成員單位',
    accts: [{ name: '澳門元往來賬戶', no: '101-15-334455-2', ccy: 'MOP', balance: 96250.8 }],
    income7d: 286000, expense7d: 198000, agreement: '待簽署',
  },
]

// 關聯企業間內部往來記錄
export const internalLedger = [
  { id: 'IL20261005001', from: '誠信物流（澳門）', to: '誠信貿易（澳門）', amount: 200000, ccy: 'MOP', time: '2026-10-05 17:30', type: '日終歸集', ref: 'PO2026100501' },
  { id: 'IL20261004002', from: '誠信貿易（澳門）', to: '誠信物流（澳門）', amount: 150000, ccy: 'MOP', time: '2026-10-04 09:15', type: '定額下撥', ref: 'PO2026100401' },
  { id: 'IL20261003003', from: '誠信（珠海）貿易', to: '誠信貿易（澳門）', amount: 100000, ccy: 'CNY', time: '2026-10-03 17:30', type: '限額歸集', ref: 'PO2026100301' },
  { id: 'IL20261002004', from: '誠信貿易（澳門）', to: '誠信餐飲管理（澳門）', amount: 50000, ccy: 'MOP', time: '2026-10-02 10:20', type: '主動調撥', ref: 'PO2026100201' },
]

// 歸集規則
export interface CollectionRule {
  id: string
  from: string
  mode: '全額歸集' | '限額歸集' | '差額歸集' | '取整歸集' | '比例歸集'
  param: string
  freq: '定時' | '日終'
  time: string
  status: '生效中' | '已暫停'
}
export const collectionRules: CollectionRule[] = [
  { id: 'CR01', from: '誠信物流（澳門）', mode: '限額歸集', param: '保留 MOP 50,000，超出部分上劃', freq: '日終', time: '每日 17:30', status: '生效中' },
  { id: 'CR02', from: '誠信餐飲管理（澳門）', mode: '全額歸集', param: '營業款全額上劃主賬戶', freq: '日終', time: '每日 17:30', status: '生效中' },
  { id: 'CR03', from: '誠信（珠海）貿易', mode: '取整歸集', param: '保留千元以下尾數', freq: '定時', time: '每日 15:00', status: '生效中' },
  { id: 'CR04', from: '誠信（珠海）貿易', mode: '比例歸集', param: '按日終餘額 60% 上劃', freq: '日終', time: '每日 17:30', status: '已暫停' },
]

// 下撥規則
export interface AllocRule {
  id: string
  to: string
  mode: '定額下撥' | '零餘額賬戶管理'
  param: string
  freq: string
  status: '生效中' | '已暫停'
}
export const allocRules: AllocRule[] = [
  { id: 'AR01', to: '誠信物流（澳門）', mode: '定額下撥', param: '每週一撥付周轉金 MOP 150,000', freq: '每週一 09:00', status: '生效中' },
  { id: 'AR02', to: '誠信餐飲管理（澳門）', mode: '零餘額賬戶管理', param: '支付前按需自動下撥，支付後餘額歸零', freq: '實時觸發', status: '生效中' },
]

// 主動調撥記錄
export interface CashTransfer {
  id: string
  dir: '上劃' | '下撥'
  from: string
  to: string
  amount: number
  ccy: string
  time: string
  status: string
  operator: string
}
export const cashTransfers: CashTransfer[] = [
  { id: 'CT20261002004', dir: '下撥', from: '集團主賬戶', to: '誠信餐飲管理（澳門）', amount: 50000, ccy: 'MOP', time: '2026-10-02 10:20', status: '已完成', operator: '陳大文（管理員）' },
  { id: 'CT20260928002', dir: '上劃', from: '誠信物流（澳門）', to: '集團主賬戶', amount: 300000, ccy: 'MOP', time: '2026-09-28 14:05', status: '已完成', operator: '陳大文（管理員）' },
]

// 集團綜合計息明細
export interface InterestDetail {
  date: string
  acct: string
  company: string
  ccy: string
  eodBalance: number
  poolBalance: number
  rate: number
  interest: number
}
export const interestDetails: InterestDetail[] = [
  { date: '2026-10-05', acct: '集團主賬戶', company: '誠信貿易（澳門）', ccy: 'MOP', eodBalance: 2863450.55, poolBalance: 3597913.65, rate: 1.85, interest: 184.11 },
  { date: '2026-10-05', acct: '澳門元往來賬戶', company: '誠信物流（澳門）', ccy: 'MOP', eodBalance: 486200.3, poolBalance: 3597913.65, rate: 1.85, interest: 24.95 },
  { date: '2026-10-05', acct: '澳門元結算賬戶', company: '誠信（珠海）貿易', ccy: 'MOP', eodBalance: 152300, poolBalance: 3597913.65, rate: 1.85, interest: 7.82 },
  { date: '2026-10-05', acct: '人民幣往來賬戶', company: '誠信（珠海）貿易', ccy: 'CNY', eodBalance: 890150.3, poolBalance: 1014956.8, rate: 1.35, interest: 37.59 },
]

// 統一支付（代理支付）記錄
export interface ProxyPay {
  id: string
  payer: string
  agent: string
  payee: string
  amount: number
  ccy: string
  mode: '直接代理支付' | '間接代理支付'
  date: string
  status: string
}
export const proxyPays: ProxyPay[] = [
  { id: 'PP20261005001', payer: '誠信物流（澳門）', agent: '集團主賬戶', payee: '澳門柴油供應有限公司', amount: 86000, ccy: 'MOP', mode: '直接代理支付', date: '2026-10-05', status: '已完成' },
  { id: 'PP20261003002', payer: '誠信餐飲管理（澳門）', agent: '集團主賬戶', payee: '澳門鮮活食品批發中心', amount: 45200, ccy: 'MOP', mode: '間接代理支付', date: '2026-10-03', status: '已完成' },
  { id: 'PP20261006003', payer: '誠信（珠海）貿易', agent: '集團主賬戶', payee: '廣州遠洋實業集團', amount: 380000, ccy: 'CNY', mode: '間接代理支付', date: '2026-10-06', status: '跨行清算處理中' },
]

// 信息加工報告
export const cashReports = [
  { id: 'RPT01', name: '三方信息報告（主賬戶／收款單位／被代理企業）', cycle: '按日', type: '統一支付' },
  { id: 'RPT02', name: '兩方信息報告（成員單位／收款單位）', cycle: '按日', type: '統一支付' },
  { id: 'RPT03', name: '簿記賬戶交易報告單', cycle: '按周', type: '簿記賬戶' },
  { id: 'RPT04', name: '內部計價報表', cycle: '按月', type: '內部計價' },
  { id: 'RPT05', name: '資金池信息查詢（池水位／歸集下撥匯總）', cycle: '實時', type: '資金池' },
  { id: 'RPT06', name: '關聯企業收支匯總報告', cycle: '按日／周／月', type: '多企業視圖' },
]

// 賬戶看管
export interface WatchRule {
  id: string
  acct: string
  type: '餘額臨界值' | '大額交易' | '交易對象預警'
  condition: string
  notify: ('電郵' | '網銀' | '短訊')[]
  status: '生效中' | '已暫停'
}
export const watchRules: WatchRule[] = [
  { id: 'WR01', acct: '集團主賬戶', type: '餘額臨界值', condition: '低於 MOP 1,000,000 時通知', notify: ['網銀', '短訊'], status: '生效中' },
  { id: 'WR02', acct: '全部賬戶', type: '大額交易', condition: '單筆達 MOP 500,000 時通知', notify: ['電郵', '短訊'], status: '生效中' },
  { id: 'WR03', acct: '集團主賬戶', type: '交易對象預警', condition: '向黑名單對象發起交易時攔截並通知', notify: ['網銀'], status: '生效中' },
]
export const watchWhitelist = ['永利供應鏈有限公司', '澳門電力股份有限公司', '廣州遠洋實業集團']
export const watchBlacklist = ['XX 娛樂場帳房（示例）', '某高風險貿易公司（示例）']

// 現金管理限額（賬戶組共享限額）
export const groupLimit = {
  single: 5000000,
  naturalCycle: 20000000,
  customCycle: { label: '按營業週期（週四至週三）', value: 12000000 },
  shared: true,
}
export const groupLimitDims = [
  { dim: '支付渠道限額', detail: '網銀 MOP 5,000,000／筆；銀企直連 MOP 10,000,000／筆' },
  { dim: '交易類型限額', detail: '行內調撥免授權額度 MOP 300,000；對外行內轉賬 MOP 2,000,000／筆' },
  { dim: '自然周期限額', detail: '單日累計 MOP 20,000,000（賬戶組共享）' },
  { dim: '自定義周期限額', detail: '營業週期累計 MOP 12,000,000（賬戶組共享）' },
]

// ===== 一期補充功能模擬數據 =====

// 來賬信息（補全對手欄位）
export interface Incoming {
  date: string
  amount: number
  ccy: string
  payerName: string
  payerAcct: string
  payerBank: string
  postscript: string
  ref: string
}
export const incomings: Incoming[] = [
  { date: '2026-10-05', amount: 920000, ccy: 'HKD', payerName: 'Heng Seng Trading Co.', payerAcct: '024-888-112233-4', payerBank: '恒生銀行（香港）', postscript: 'Q3 SETTLEMENT INV-7788', ref: 'IN20261005001' },
  { date: '2026-09-25', amount: 1350000, ccy: 'MOP', payerName: '廣州遠洋實業集團', payerAcct: '4402 **** **** 9917', payerBank: '中國銀行廣州分行', postscript: '八月貨款', ref: 'IN20260925002' },
  { date: '2026-09-20', amount: 8450.15, ccy: 'MOP', payerName: '本行結息', payerAcct: '—', payerBank: '小鋒銀行', postscript: '季度利息', ref: 'IN20260920003' },
  { date: '2026-09-18', amount: 228000, ccy: 'CNY', payerName: '深圳市創新電子有限公司', payerAcct: '6217 **** **** 3345', payerBank: '招商銀行深圳分行', postscript: '訂金 30%', ref: 'IN20260918004' },
]

// 交易對手檔案（按歷史交易聚合）
export interface Counterparty {
  name: string
  acct: string
  bank: string
  txnCount: number
  lastTxn: string
  lastAmount: number
  direction: '收款' | '付款' | '雙向'
}
export const counterparties: Counterparty[] = [
  { name: '永利供應鏈有限公司', acct: '101-88-556677-8', bank: '小鋒銀行', txnCount: 12, lastTxn: '2026-10-05', lastAmount: 150000, direction: '付款' },
  { name: 'Heng Seng Trading Co.', acct: '024-888-112233-4', bank: '恒生銀行（香港）', txnCount: 6, lastTxn: '2026-10-02', lastAmount: 920000, direction: '收款' },
  { name: '澳門電力股份有限公司', acct: 'E-88213456', bank: '澳門電力（代收）', txnCount: 9, lastTxn: '2026-10-05', lastAmount: 12450.6, direction: '付款' },
  { name: '廣州遠洋實業集團', acct: '4402 **** **** 9917', bank: '中國銀行廣州分行', txnCount: 4, lastTxn: '2026-09-25', lastAmount: 1350000, direction: '收款' },
  { name: '中山五金批發有限公司', acct: '6222 **** **** 8834', bank: '中國銀行中山分行', txnCount: 7, lastTxn: '2026-09-22', lastAmount: 220000, direction: '付款' },
]

// 電子回單
export interface Receipt {
  id: string
  type: string
  payer: string
  payee: string
  amount: number
  ccy: string
  date: string
  channel: string
}
export const receipts: Receipt[] = [
  { id: 'RC20261005012', type: '行內轉賬回單', payer: '誠信貿易（澳門）', payee: '永利供應鏈有限公司', amount: 150000, ccy: 'MOP', date: '2026-10-05', channel: '網上銀行' },
  { id: 'RC20261003088', type: '批量代付回單（32 筆）', payer: '誠信貿易（澳門）', payee: '按收款人分別出具', amount: 385600, ccy: 'MOP', date: '2026-10-03', channel: '網上銀行' },
  { id: 'RC20261002031', type: '跨境匯款回單（SWIFT）', payer: '誠信貿易（澳門）', payee: 'Heng Seng Trading Co.', amount: 1200000, ccy: 'HKD', date: '2026-10-02', channel: 'SWIFT GPI' },
  { id: 'RC20260930077', type: '繳費回單', payer: '誠信貿易（澳門）', payee: '澳門電力股份有限公司', amount: 12450.6, ccy: 'MOP', date: '2026-09-30', channel: '網上銀行' },
]

// 匯款模板
export interface RemitTemplate {
  id: string
  name: string
  channel: string
  payee: string
  ccy: string
  amount: number | null
  lastUsed: string
}
export const remitTemplates: RemitTemplate[] = [
  { id: 'TP01', name: '恒生月度採購尾款', channel: 'SWIFT GPI', payee: 'Heng Seng Trading Co.', ccy: 'HKD', amount: null, lastUsed: '2026-10-02' },
  { id: 'TP02', name: '深圳創新訂金', channel: 'FPS 跨境支付通', payee: '深圳市創新電子有限公司', ccy: 'CNY', amount: 268000, lastUsed: '2026-10-05' },
  { id: 'TP03', name: '德國貨款', channel: 'SWIFT GPI', payee: 'Global Textile GmbH', ccy: 'EUR', amount: 45000, lastUsed: '2026-09-20' },
]

// SWIFT GPI 追蹤
export interface GpiTrack {
  uetr: string
  ref: string
  payee: string
  amount: number
  ccy: string
  stages: { node: string; detail: string; time: string; done: boolean }[]
}
export const gpiTracks: GpiTrack[] = [
  {
    uetr: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', ref: 'RM20261002001', payee: 'Heng Seng Trading Co.', amount: 1200000, ccy: 'HKD',
    stages: [
      { node: '付款行受理', detail: '小鋒銀行已受理並完成合規檢查', time: '2026-10-02 10:12', done: true },
      { node: '匯出', detail: '已通過 SWIFT 網絡匯出（GPI 全程可追蹤）', time: '2026-10-02 10:15', done: true },
      { node: '中轉行處理', detail: '中轉行已入賬處理，無額外扣費', time: '2026-10-02 11:40', done: true },
      { node: '收款行入賬', detail: '恒生銀行（香港）已入賬', time: '2026-10-02 14:05', done: true },
    ],
  },
  {
    uetr: 'f9e8d7c6-b5a4-3210-fedc-ba0987654321', ref: 'RM20261005002', payee: '深圳市創新電子有限公司', amount: 268000, ccy: 'CNY',
    stages: [
      { node: '付款行受理', detail: '小鋒銀行已受理', time: '2026-10-05 09:30', done: true },
      { node: '匯出', detail: '經 FPS 跨境支付通匯出', time: '2026-10-05 09:31', done: true },
      { node: '收款行處理', detail: '招商銀行深圳分行處理中', time: '—', done: false },
      { node: '入賬完成', detail: '待完成', time: '—', done: false },
    ],
  },
]

// 下載中心
export const downloadCenter = [
  { cat: '業務表單', name: '企業網銀服務申請表（開戶套餐）', format: 'PDF', size: '486 KB' },
  { cat: '業務表單', name: '代收付服務協議書', format: 'PDF', size: '312 KB' },
  { cat: '業務表單', name: '銀企直連接入申請表', format: 'PDF', size: '268 KB' },
  { cat: '業務表單', name: '現金管理服務協議（示範文本）', format: 'PDF', size: '590 KB' },
  { cat: '操作手冊', name: '新一代企業網銀操作手冊 V1.0', format: 'PDF', size: '8.2 MB' },
  { cat: '操作手冊', name: '批量代付文件製作指引', format: 'PDF', size: '1.4 MB' },
  { cat: '軟件工具', name: '企業手機銀行（iOS / Android）', format: 'APP', size: '掃碼下載' },
  { cat: '軟件工具', name: '批量文件格式校驗工具', format: 'ZIP', size: '3.6 MB' },
]

// 幫助中心 FAQ
export const faqs = [
  { q: '忘記網上通密碼怎麼辦？', a: '企業管理員可在「安全中心 → 使用者管理」為使用者重置密碼；管理員本人忘記密碼需攜帶證件及授權文件前往櫃檯辦理。' },
  { q: '轉賬限額是多少？如何調整？', a: '當前單筆限額 MOP 5,000,000、單日累計 MOP 20,000,000，可在「安全中心 → 交易限額設置」自助調低；調高超標準限額需提交申請並經銀行審批。' },
  { q: '批量代付文件提示校驗失敗？', a: '請確認文件包含收款人名稱列，且名稱與賬號匹配；附言格式不作字體限制。可使用「下載中心」的格式校驗工具預檢。' },
  { q: '跨境匯款多久到賬？', a: 'FPS 跨境支付通一般實時至數分鐘；SWIFT GPI 通常 1 個工作日內，可在「轉賬匯款 → GPI 追蹤」實時查看進度。' },
  { q: '如何開通電子月結單？', a: '「賬戶服務 → 月結單」頁面支持在線自助開通及關閉，無需臨櫃。' },
  { q: '企業手機銀行如何下載？', a: 'iOS 於 App Store、Android 於各大應用市場搜索「小鋒企業銀行」，或於「服務中心 → 下載中心」掃碼下載。' },
]

// 網點查詢
export const branches = [
  { name: '總行營業部', addr: '澳門新馬路 100 號大豐廣場地下', tel: '(853) 8800 0001', hours: '週一至週五 09:00–17:00' },
  { name: '皇朝分行', addr: '澳門宋玉生廣場 255 號中土大廈地下', tel: '(853) 8800 0002', hours: '週一至週五 09:00–17:00' },
  { name: '氹仔分行', addr: '氹仔孫逸仙博士大馬路 326 號地下', tel: '(853) 8800 0003', hours: '週一至週五 09:00–17:00' },
  { name: '珠海分行', addr: '珠海市香洲區情侶南路 88 號', tel: '(0756) 8800 000', hours: '週一至週五 09:00–17:00' },
]

// 渠道優惠（客戶端可查看）
export interface ChannelDiscount {
  scope: string
  item: string
  standard: string
  discount: string
  preferential: string
  channel: string
  validity: string
}
export const channelDiscounts: ChannelDiscount[] = [
  { scope: '支票業務', item: '支票簿申請（25 頁）', standard: 'MOP 60.00', discount: '75 折｜減免 MOP 15.00', preferential: 'MOP 45.00', channel: '企網 Web', validity: '至 2026-12-31' },
  { scope: '結單服務', item: '過往電子結單', standard: 'MOP 10.00／份', discount: '全額減免', preferential: 'MOP 0.00', channel: 'Web＋銀企直連', validity: '至 2026-12-31' },
  { scope: '匯款業務', item: 'FPS 跨境支付通匯費', standard: 'MOP 50.00／筆', discount: '8 折｜減免 MOP 10.00', preferential: 'MOP 40.00／筆', channel: 'Web＋銀企直連', validity: '至 2026-12-31' },
  { scope: '匯款業務', item: 'SWIFT GPI 匯費', standard: 'MOP 220.00／筆', discount: '8 折｜減免 MOP 44.00', preferential: 'MOP 176.00／筆', channel: 'Web＋銀企直連', validity: '至 2026-12-31' },
  { scope: '存款業務', item: '三個月定期存款（示例）', standard: '標準渠道年利率 1.50%', discount: '渠道加點＋0.20 個百分點', preferential: '年利率 1.70%', channel: '企網 Web', validity: '2026-11-02 至 11-08' },
]

// 銀企直連
export interface DirectService {
  name: string
  scope: string
  status: '已開通' | '未開通'
  calls30d: number
}
export const directServices: DirectService[] = [
  { name: '賬戶查詢服務', scope: '實時餘額（MOP/HKD/多幣寶）、歷史餘額、當日明細、歷史明細', status: '已開通', calls30d: 12680 },
  { name: '定期賬戶查詢服務', scope: '定期賬戶餘額查詢、賬戶流水查詢', status: '已開通', calls30d: 2140 },
  { name: '支付結算服務', scope: '行內轉賬（單筆/批量）、本地跨行轉賬/匯款、跨境匯款（單筆/批量）', status: '已開通', calls30d: 3846 },
  { name: '線上發薪', scope: '通過接口發起代發薪金', status: '已開通', calls30d: 32 },
  { name: '集團資金歸集', scope: '集團內賬戶資金歸集（需綁定集團牽頭公司）', status: '未開通', calls30d: 0 },
  { name: '交易電子回單', scope: '電子回單查詢及批量打印（含電子簽章）', status: '未開通', calls30d: 0 },
]
export const directCalls = [
  { time: '2026-10-06 15:58:12', api: '餘額查詢 GET /acct/balance', result: '成功', duration: '86ms' },
  { time: '2026-10-06 15:57:40', api: '批量代付 POST /batch/payroll', result: '成功', duration: '412ms' },
  { time: '2026-10-06 15:55:03', api: '行內轉賬 POST /transfer/domestic', result: '成功', duration: '203ms' },
  { time: '2026-10-06 15:52:47', api: '歷史明細 GET /acct/history', result: '成功', duration: '145ms' },
  { time: '2026-10-06 15:50:19', api: '跨境匯款 POST /remittance/swift', result: '待審批', duration: '—' },
]

// 銀行端後台（演示）
export const adminTodos = [
  { id: 'SG2026100601', type: '企業網銀開戶（標準套餐）', company: '澳門海風旅遊有限公司', branch: '皇朝分行', status: '分行已提交', time: '2026-10-06 10:22' },
  { id: 'SG2026100602', type: '銀企直連簽約', company: '誠信貿易（澳門）一人有限公司', branch: '總行營業部', status: '分行已提交', time: '2026-10-06 11:05' },
  { id: 'SG2026100503', type: '現金管理服務簽約', company: '誠信物流（澳門）有限公司', branch: '氹仔分行', status: '總行審批中', time: '2026-10-05 16:40' },
]
export const adminVersions = [
  { product: '企業網銀', version: 'V1.2.0', stage: '試點投產', gray: '10% 用戶', updated: '2026-10-01' },
  { product: '企業手機銀行', version: 'V1.0.0-beta.3', stage: '灰度發佈', gray: '白名單 50 戶', updated: '2026-09-28' },
  { product: '現金管理', version: 'V1.0.0', stage: '正式版', gray: '—', updated: '2026-09-15' },
  { product: '銀企直連', version: 'V2.1.0', stage: '正式版', gray: '—', updated: '2026-08-20' },
]
export const adminLogs = [
  { time: '2026-10-06 14:22:10', user: '總行-梁梓鋒', action: '審批通過', target: 'SG2026100503 現金管理簽約', ip: '10.20.3.15' },
  { time: '2026-10-06 11:08:44', user: '分行-黃麗珍', action: '提交複核', target: 'SG2026100602 銀企直連簽約', ip: '10.20.7.32' },
  { time: '2026-10-06 09:41:02', user: '總行-系統', action: '異常監控預警', target: '批量代付 BT20261006011 校驗失敗率 8%', ip: '—' },
  { time: '2026-10-05 17:30:00', user: '系統', action: '核心同步', target: '企網用戶及簽約信息遷移校驗完成', ip: '—' },
]

// 新功能推薦
export const newFeatures = [
  { name: '現金管理', desc: '多企業資金視圖、資金歸集與下撥、集團綜合計息' },
  { name: '電子回單', desc: '每筆轉賬／匯款在線查詢、下載及列印' },
  { name: 'SWIFT GPI 追蹤', desc: '跨境匯款全程進度實時掌握' },
  { name: '銀企直連', desc: '查詢連接升級動賬連接，接口化發起支付結算' },
  { name: '企業手機銀行（預覽）', desc: '外出場景「批得快」，轉賬代收付隨手審批' },
]


// ===== V1.3 現金管理需求書補充數據 =====

// 產品組合（總行預設，簽約時整體選取）
export const productPackages = [
  { name: '集團查詢服務包', products: ['多企業資金視圖', '賬戶看管', '信息加工'], scene: '集團客戶基礎之資金可視化及通知服務' },
  { name: '流動性管理服務包', products: ['實體資金池', '歸集下撥', '主動調撥', '集團綜合計息', '現金管理限額管理'], scene: '集團資金集中管理及內部調撥' },
  { name: '收付款管理服務包', products: ['統一支付', '信息加工', '現金管理限額管理'], scene: '集團統一對外支付及信息流分離管理' },
]

// 賬戶組（主-子兩層結構，產品簽約載體）
export interface AcctGroupMember {
  acct: string
  no: string
  company: string
  role: '主賬戶' | '子賬戶'
  products: string[]
  effDate: string
  status: '已生效' | '待生效'
}
export interface AcctGroup {
  id: string
  name: string
  pkg: string
  pkgEffDate: string
  members: AcctGroupMember[]
}
export const acctGroups: AcctGroup[] = [
  {
    id: 'AG2026001', name: '澳門元流動性賬戶組', pkg: '流動性管理服務包', pkgEffDate: '2026-08-01',
    members: [
      { acct: '澳門元往來賬戶', no: '101-88-123456-7', company: '誠信貿易（澳門）', role: '主賬戶', products: ['實體資金池', '歸集下撥', '主動調撥', '集團綜合計息', '統一支付'], effDate: '2026-08-01', status: '已生效' },
      { acct: '澳門元往來賬戶', no: '101-88-887766-1', company: '誠信物流（澳門）', role: '子賬戶', products: ['實體資金池', '歸集下撥', '主動調撥', '集團綜合計息', '統一支付'], effDate: '2026-08-01', status: '已生效' },
      { acct: '澳門元結算賬戶', no: '101-14-556677-9', company: '誠信（珠海）貿易', role: '子賬戶', products: ['實體資金池', '歸集下撥', '主動調撥', '集團綜合計息'], effDate: '2026-08-01', status: '已生效' },
      { acct: '澳門元往來賬戶', no: '101-15-334455-2', company: '誠信餐飲管理（澳門）', role: '子賬戶', products: ['實體資金池', '歸集下撥'], effDate: '2026-10-23', status: '待生效' },
    ],
  },
  {
    id: 'AG2026002', name: '收付款管理賬戶組', pkg: '收付款管理服務包', pkgEffDate: '2026-09-01',
    members: [
      { acct: '澳門元往來賬戶', no: '101-88-123456-7', company: '誠信貿易（澳門）', role: '主賬戶', products: ['統一支付', '信息加工', '現金管理限額管理'], effDate: '2026-09-01', status: '已生效' },
      { acct: '人民幣往來賬戶', no: '101-13-778899-0', company: '誠信（珠海）貿易', role: '子賬戶', products: ['統一支付', '信息加工'], effDate: '2026-09-01', status: '已生效' },
    ],
  },
]

// 生效初始化記錄（含異常處理）
export const initRecords = [
  { date: '2026-10-23', target: '誠信餐飲管理（澳門）· 澳門元往來賬戶', pkg: '實體資金池、歸集下撥', status: '待初始化', note: '約定生效日 2026-10-23，系統將於當日日初自動初始化' },
  { date: '2026-09-15', target: '誠信（珠海）貿易 · 人民幣往來賬戶', pkg: '集團綜合計息', status: '異常已排除', note: '初始化失敗（核心賬戶臨時凍結）→ 生成異常記錄 → 排除後重新初始化成功' },
  { date: '2026-08-01', target: '澳門元流動性賬戶組（3 戶）', pkg: '流動性管理服務包', status: '初始化成功', note: '生效日當日完成產品組合初始化，影子賬戶餘額同步自核心' },
]

// 實體資金池視圖
export const poolView = {
  name: '澳門元實體資金池',
  group: 'AG2026001 澳門元流動性賬戶組',
  ccy: 'MOP',
  allowOverdraft: false,
  exPolicy: '跳過異常賬戶繼續執行',
  master: { acct: '誠信貿易（澳門）· 澳門元往來賬戶', balance: 2863450.55 },
  subs: [
    { acct: '誠信物流（澳門）', balance: 486200.3 },
    { acct: '誠信（珠海）貿易', balance: 152300 },
    { acct: '誠信餐飲管理（澳門）', balance: 96250.8 },
  ],
}

// 歸集／下撥每期執行報告
export interface ExecDetail { acct: string; amount: number; ccy: string; result: '成功' | '跳過' | '失敗'; note?: string }
export interface ExecReport {
  id: string
  type: '歸集' | '下撥'
  runTime: string
  result: '成功' | '部分成功' | '失敗'
  details: ExecDetail[]
}
export const execReports: ExecReport[] = [
  {
    id: 'EX2026100608', type: '下撥', runTime: '2026-10-06 08:00', result: '成功',
    details: [
      { acct: '誠信物流（澳門）', amount: 150000, ccy: 'MOP', result: '成功', note: '定額下撥周轉金' },
      { acct: '誠信餐飲管理（澳門）', amount: 80000, ccy: 'MOP', result: '成功', note: '零餘額賬戶備付金' },
    ],
  },
  {
    id: 'EX2026100521', type: '歸集', runTime: '2026-10-05 21:00', result: '部分成功',
    details: [
      { acct: '誠信物流（澳門）', amount: 436200.3, ccy: 'MOP', result: '成功', note: '限額歸集：保留 MOP 50,000' },
      { acct: '誠信餐飲管理（澳門）', amount: 96250.8, ccy: 'MOP', result: '成功', note: '全額歸集' },
      { acct: '誠信（珠海）貿易', amount: 0, ccy: 'CNY', result: '跳過', note: '核心賬戶狀態異常，按策略跳過並生成異常記錄，已通知客戶經理跟進' },
    ],
  },
  {
    id: 'EX2026100421', type: '歸集', runTime: '2026-10-04 21:00', result: '成功',
    details: [
      { acct: '誠信物流（澳門）', amount: 402800, ccy: 'MOP', result: '成功' },
      { acct: '誠信餐飲管理（澳門）', amount: 88100.5, ccy: 'MOP', result: '成功' },
      { acct: '誠信（珠海）貿易', amount: 534090.18, ccy: 'CNY', result: '成功', note: '比例歸集 60%' },
    ],
  },
]

// 賬戶看管預警記錄
export const watchAlerts = [
  { id: 'AL2026100501', time: '2026-10-05 21:02', acct: '集團主賬戶', type: '大額交易', threshold: '單筆 ≥ MOP 500,000', actual: '歸集入賬 MOP 532,451.10', channel: '短訊、網銀消息', status: '已送達' },
  { id: 'AL2026100302', time: '2026-10-03 14:20', acct: '誠信物流（澳門）', type: '餘額下限', threshold: '低於 MOP 100,000', actual: '餘額 MOP 86,200.30', channel: '電郵、短訊', status: '已送達' },
  { id: 'AL2026092803', time: '2026-09-28 09:41', acct: '集團主賬戶', type: '交易對象預警', threshold: '黑名單對象', actual: '向「某高風險貿易公司」發起 MOP 68,000', channel: '網銀消息', status: '已送達' },
  { id: 'AL2026092504', time: '2026-09-25 18:30', acct: '誠信（珠海）貿易', type: '大額交易', threshold: '單筆 ≥ MOP 500,000', actual: '跨行匯出 CNY 620,000', channel: '電郵', status: '發送失敗（已重試）' },
]

// 信息加工訂閱
export interface ReportSub {
  id: string
  report: string
  scope: string
  cycle: string
  push: string[]
  receiver: string
  effDate: string
  status: '生效中' | '已停用'
}
export const reportSubs: ReportSub[] = [
  { id: 'SUB01', report: '三方信息報告', scope: '全集團', cycle: '按日', push: ['網銀消息', '電郵'], receiver: '陳大文（che***@siaofongdemo.mo）', effDate: '2026-08-02', status: '生效中' },
  { id: 'SUB02', report: '集團賬戶餘額報告', scope: '全集團', cycle: '按月', push: ['電郵'], receiver: '集團財務部', effDate: '2026-08-02', status: '生效中' },
  { id: 'SUB03', report: '內部計價報表', scope: '賬戶組 AG2026001', cycle: '按月', push: ['網銀消息'], receiver: '陳大文', effDate: '2026-09-02', status: '生效中' },
]
export const reportTypes = ['餘額報告', '交易明細報告', '簽約信息報告', '三方信息報告', '兩方信息報告', '簿記賬戶交易報告單', '內部計價報表', '資金池信息報告']

// 限額額度佔用（當期）
export const limitUsage = [
  { dim: '單筆限額（網銀渠道）', limit: 5000000, used: 0, note: '逐筆校驗，不累計佔用' },
  { dim: '單日累計（自然周期 · 賬戶組共享）', limit: 20000000, used: 12830451.1, note: '每日 00:00 重置' },
  { dim: '營業週期累計（自定義 · 賬戶組共享）', limit: 12000000, used: 9820000, note: '週四至週三，週四重置' },
]
export const limitScheme = { warnLine: 80, overRule: '轉人工審批', scope: '賬戶組共享限額與單賬戶限額並存，疊加企網操作員限額及賬戶限額，從嚴執行' }

// 集團綜合計息方案
export const interestScheme = {
  group: 'AG2026001 澳門元流動性賬戶組',
  master: '集團主賬戶（誠信貿易（澳門））',
  rate: 'MOP 1.85%／CNY 1.35%（協議利率，變更自下一計息周期生效）',
  cycle: '按月結息（結息日按我行現行結息規則）',
  method: '分幣種綜合計息（支持多幣種折算綜合計息）',
  fxSource: '我行牌價 · 日終取值',
  alloc: '按各子賬戶貢獻比例分配',
}

// 計息還原記錄（次日還原）
export const interestRestores = [
  { date: '2026-10-06', acct: '誠信物流（澳門）', amount: 436200.3, ccy: 'MOP', status: '已還原' },
  { date: '2026-10-06', acct: '誠信餐飲管理（澳門）', amount: 96250.8, ccy: 'MOP', status: '已還原' },
  { date: '2026-10-06', acct: '誠信（珠海）貿易', amount: 534090.18, ccy: 'CNY', status: '已還原' },
]

// 利息分配報告（結息日）
export const interestAllocs = [
  { period: '2026-09', settleDate: '2026-09-21', total: 4520.6, ccy: 'MOP', rule: '按貢獻比例分配', lines: [
    { acct: '誠信物流（澳門）', ratio: '36.8%', interest: 1663.58 },
    { acct: '誠信（珠海）貿易', ratio: '11.5%', interest: 519.87 },
    { acct: '誠信餐飲管理（澳門）', ratio: '7.2%', interest: 325.48 },
    { acct: '集團主賬戶留存', ratio: '44.5%', interest: 2011.67 },
  ] },
]

// 統一支付資金路徑（間接代理支付兩步原子性 / 跨行進度）
export interface ProxyStep { step: string; time: string; status: 'done' | 'doing' | 'pending' }
export const proxyPaySteps: Record<string, ProxyStep[]> = {
  PP20261003002: [
    { step: '第一步：主賬戶 → 子賬戶（誠信餐飲管理）', time: '2026-10-03 10:15:08', status: 'done' },
    { step: '第二步：子賬戶 → 收款單位（澳門鮮活食品批發中心）', time: '2026-10-03 10:15:12', status: 'done' },
  ],
  PP20261006003: [
    { step: '第一步：主賬戶 → 子賬戶（誠信（珠海）貿易）', time: '2026-10-06 15:40:02', status: 'done' },
    { step: '第二步：子賬戶 → 收款單位（跨境清算處理中）', time: '預計 1-2 個工作日', status: 'doing' },
  ],
}
