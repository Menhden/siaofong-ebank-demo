import { useState } from 'react'
import Layout from '@/components/Layout'
import type { PageKey } from '@/components/Layout'
import Login from '@/pages/Login'
import Workbench from '@/pages/Workbench'
import Accounts from '@/pages/Accounts'
import Transfer from '@/pages/Transfer'
import Payments from '@/pages/Payments'
import Collections from '@/pages/Collections'
import Wealth from '@/pages/Wealth'
import Loans from '@/pages/Loans'
import CashMgmt from '@/pages/CashMgmtV15'
import Approvals from '@/pages/Approvals'
import Merchant from '@/pages/Merchant'
import Security from '@/pages/Security'
import Messages from '@/pages/Messages'
import ServiceHub from '@/pages/ServiceHub'
import MobileBank from '@/pages/MobileBank'
import BankDirect from '@/pages/BankDirect'
import AdminConsole from '@/pages/AdminConsole'
import { initialApprovals, initialMessages, USER } from '@/lib/mock'
import type { Approval, Message } from '@/lib/mock'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState<PageKey>('workbench')
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  const pendingCount = approvals.filter(a => a.status === 'pending').length

  const onTransferSubmitted = (info?: { amount: number; payeeName: string; payee: string }) => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const now = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
    setApprovals(prev => [{
      id: 'TF' + Date.now().toString().slice(-11),
      type: '行內轉賬',
      amount: info?.amount ?? null,
      ccy: 'MOP',
      payee: info?.payeeName,
      payeeAcct: info?.payee,
      initiator: `${USER}（錄入員）`,
      time: now,
      status: 'pending',
      memo: '演示版新提交之轉賬',
      steps: [
        { node: '交易發起', operator: `${USER}（錄入員）`, time: now, result: '已提交' },
        { node: '一級審批', operator: '陳大文（審批員）', time: '—', result: '待處理' },
        { node: '二級審批', operator: '黃志強（財務總監）', time: '—', result: '未開始' },
      ],
    }, ...prev])
  }

  return (
    <Layout page={page} setPage={setPage} pendingCount={pendingCount} onLogout={() => { setLoggedIn(false); setPage('workbench') }}>
      {page === 'workbench' && <Workbench setPage={setPage} pendingCount={pendingCount} />}
      {page === 'accounts' && <Accounts />}
      {page === 'transfer' && <Transfer setPage={setPage} onSubmitted={onTransferSubmitted} />}
      {page === 'payments' && <Payments />}
      {page === 'collections' && <Collections />}
      {page === 'wealth' && <Wealth />}
      {page === 'loans' && <Loans />}
      {page === 'cash' && <CashMgmt />}
      {page === 'approvals' && <Approvals approvals={approvals} setApprovals={setApprovals} />}
      {page === 'merchant' && <Merchant />}
      {page === 'service' && <ServiceHub />}
      {page === 'mobile' && <MobileBank approvals={approvals} setApprovals={setApprovals} />}
      {page === 'direct' && <BankDirect />}
      {page === 'admin' && <AdminConsole />}
      {page === 'security' && <Security />}
      {page === 'messages' && <Messages messages={messages} setMessages={setMessages} />}
    </Layout>
  )
}
