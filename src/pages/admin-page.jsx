import { useState, useEffect, useMemo } from 'react'
import {
  Users,
  DollarSign,
  TrendingUp,
  Bookmark,
  Sparkles,
  Shield,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
  Server,
  Check,
  X,
  AlertCircle,
  Eye,
  Filter,
  Calendar,
  CreditCard,
  BarChart3
} from 'lucide-react'
import Swal from 'sweetalert2'
import {
  getAdminOverviewStats,
  getAdminUsersList,
  getAdminTransactionsList,
  getAiMonitoringStats,
  adminApproveTransaction,
  adminRejectTransaction,
  adminUpdateUserPlan,
  adminResetUserAiQuota,
} from '@/lib/adminApi'

export function AdminPage({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'revenue' | 'ai' | 'users'
  const [overview, setOverview] = useState(null)
  const [usersList, setUsersList] = useState([])
  const [transactions, setTransactions] = useState([])
  const [aiStats, setAiStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Bộ lọc & tìm kiếm ở Tab Doanh Thu
  const [txSearchQuery, setTxSearchQuery] = useState('')
  const [txStatusFilter, setTxStatusFilter] = useState('all') // 'all' | 'pending' | 'completed' | 'failed'

  // Modal chi tiết người dùng
  const [selectedUserDetail, setSelectedUserDetail] = useState(null)

  // Tải dữ liệu thực tế từ Database
  async function loadAdminData() {
    setIsLoading(true)
    try {
      const [ovData, uData, txData] = await Promise.all([
        getAdminOverviewStats(),
        getAdminUsersList(),
        getAdminTransactionsList(),
      ])
      setOverview(ovData)
      setUsersList(uData)
      setTransactions(txData)
      setAiStats(getAiMonitoringStats())
    } catch (e) {
      console.error('Lỗi load admin data:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
    const handleTxUpdate = () => loadAdminData()
    window.addEventListener('tabmark_transaction_updated', handleTxUpdate)
    return () => window.removeEventListener('tabmark_transaction_updated', handleTxUpdate)
  }, [])

  // Giao dịch đang chờ duyệt
  const pendingTransactions = useMemo(() => {
    return transactions.filter(t => t.status === 'pending')
  }, [transactions])

  // Lọc giao dịch theo tìm kiếm và trạng thái
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const code = (t.transaction_code || t.transactionCode || '').toLowerCase()
      const email = (t.email || '').toLowerCase()
      const matchSearch = code.includes(txSearchQuery.toLowerCase()) || email.includes(txSearchQuery.toLowerCase())
      
      if (txStatusFilter === 'all') return matchSearch
      const status = (t.status || '').toLowerCase()
      if (txStatusFilter === 'completed') {
        return matchSearch && (status === 'completed' || status === 'success')
      }
      if (txStatusFilter === 'failed') {
        return matchSearch && (status === 'failed' || status === 'rejected')
      }
      return matchSearch && status === txStatusFilter
    })
  }, [transactions, txSearchQuery, txStatusFilter])

  // Biểu đồ Doanh thu 7 ngày gần nhất
  const revenueTrend7Days = useMemo(() => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dayStr = `${d.getDate()}/${d.getMonth() + 1}`
      const dateIsoPrefix = d.toISOString().split('T')[0]
      
      const dayRevenue = transactions
        .filter(t => {
          const tDate = (t.created_at || '').split('T')[0]
          return tDate === dateIsoPrefix && (t.status === 'completed' || t.status === 'success')
        })
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)

      days.push({
        label: dayStr,
        dayOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()],
        revenue: dayRevenue,
      })
    }
    const maxRev = Math.max(...days.map(d => d.revenue), 1)
    const totalWeek = days.reduce((sum, d) => sum + d.revenue, 0)
    return { days, maxRev, totalWeek }
  }, [transactions])

  // Giao dịch riêng của user đang được chọn xem chi tiết
  const selectedUserTransactions = useMemo(() => {
    if (!selectedUserDetail) return []
    return transactions.filter(t => 
      (selectedUserDetail.id && (t.user_id === selectedUserDetail.id || t.userId === selectedUserDetail.id)) ||
      (selectedUserDetail.email && (t.email || '').toLowerCase() === selectedUserDetail.email.toLowerCase())
    )
  }, [selectedUserDetail, transactions])

  // Lọc danh sách user
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = 
        (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      if (planFilter === 'all') return matchSearch
      return matchSearch && (u.plan || 'free').toLowerCase() === planFilter.toLowerCase()
    })
  }, [usersList, searchQuery, planFilter])

  // Admin DUYỆT giao dịch
  async function handleApprove(tx) {
    const confirm = await Swal.fire({
      title: 'Xác nhận đối soát thành công?',
      html: `
        <div style="text-align: left; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
          <p>Bạn đã kiểm tra sao kê tài khoản ngân hàng và nhận được <b>${formatVND(tx.amount || 149000)}</b> từ <b>${tx.email}</b>?</p>
          <p style="margin-top: 8px; color: #38bdf8;">Hệ thống sẽ lập tức kích hoạt <b>${tx.plan_name || tx.planName || 'Gói Pro'}</b> cho tài khoản này.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '✅ Duyệt & Kích hoạt ngay',
      cancelButtonText: 'Đóng',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      background: '#0d111a',
      color: '#fff',
    })

    if (confirm.isConfirmed) {
      setActionLoadingId(tx.id)
      const res = await adminApproveTransaction(
        tx.id,
        tx.user_id || tx.userId,
        tx.plan_id || tx.planId || 'pro',
        tx.transaction_code || tx.transactionCode,
        tx.email
      )
      setActionLoadingId(null)

      if (res.success) {
        Swal.fire({
          title: 'Đã kích hoạt gói thành công!',
          text: `Gói ${tx.plan_name || tx.planName || 'Pro'} đã được cấp cho ${tx.email}.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#0d111a',
          color: '#fff',
        })
        loadAdminData()
      } else {
        Swal.fire('Lỗi', res.error || 'Không thể duyệt giao dịch.', 'error')
      }
    }
  }

  // Admin TỪ CHỐI giao dịch
  async function handleReject(tx) {
    const confirm = await Swal.fire({
      title: 'Từ chối giao dịch?',
      text: `Giao dịch ${tx.transaction_code || tx.transactionCode} của ${tx.email} sẽ bị đánh dấu là Không hợp lệ.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      background: '#0d111a',
      color: '#fff',
    })

    if (confirm.isConfirmed) {
      setActionLoadingId(tx.id)
      await adminRejectTransaction(tx.id, tx.transaction_code || tx.transactionCode)
      setActionLoadingId(null)
      Swal.fire({
        title: 'Đã từ chối giao dịch',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        background: '#0d111a',
        color: '#fff',
      })
      loadAdminData()
    }
  }

  // Xử lý admin đổi gói user
  async function handleAdminChangePlan(targetUser, newPlan) {
    const planNames = { free: 'Gói Free (0đ)', starter: 'Gói Starter (69K)', pro: 'Gói Pro (149K)', business: 'Gói Business (299K)' }
    const result = await Swal.fire({
      title: 'Xác nhận đổi gói?',
      text: `Chuyển tài khoản "${targetUser.email}" sang ${planNames[newPlan]}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#334155',
      background: '#0d111a',
      color: '#fff',
    })

    if (result.isConfirmed) {
      await adminUpdateUserPlan(targetUser.id, newPlan)
      setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, plan: newPlan, is_pro: newPlan !== 'free' } : u))
      Swal.fire({
        title: 'Thành công!',
        text: `Đã cập nhật sang ${planNames[newPlan]}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#0d111a',
        color: '#fff',
      })
      loadAdminData()
    }
  }

  // Xử lý admin reset quota AI
  function handleAdminResetQuota(targetUser) {
    adminResetUserAiQuota(targetUser.id)
    Swal.fire({
      title: 'Đã Reset Quota AI!',
      text: `Tài khoản ${targetUser.email} đã được đặt lại 0 lượt dùng hôm nay.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      background: '#0d111a',
      color: '#fff',
    })
  }

  function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0)
  }

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 font-sans selection:bg-purple-500/30">
      
      {/* ── TOP NAV BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0a0d18]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Dashboard</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white tracking-wide">TabMark Admin</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live Database
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Dữ liệu thực tế 100% từ Database</p>
            </div>
          </div>
        </div>

        {/* Right side badges & refresh */}
        <div className="flex items-center gap-3">
          {pendingTransactions.length > 0 && (
            <button
              onClick={() => setActiveTab('revenue')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300 animate-pulse cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingTransactions.length} Chờ duyệt</span>
            </button>
          )}

          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Làm mới dữ liệu thực tế"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* ── TAB SELECTOR ── */}
        <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>1. Tổng Quan KPI</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>2. Doanh Thu & Duyệt VietQR</span>
            {pendingTransactions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-extrabold text-[9px]">
                {pendingTransactions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3. Giám Sát AI Thực Tế</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Người Dùng Thật ({usersList.length})</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & KPI ── */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Users */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/30 transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tổng Tài Khoản Đã Đăng Ký</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{overview.totalUsers}</span>
                  <span className="text-xs text-slate-400">users</span>
                </div>
                <p className="text-[11px] text-emerald-400 mt-2">Dữ liệu từ bảng `profiles`</p>
              </div>

              {/* Total Real Revenue */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Doanh Thu Đã Thu (Thực tế)</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{formatVND(overview.totalRevenue)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  {overview.pendingRevenue > 0 ? `⏳ Chờ đối soát: ${formatVND(overview.pendingRevenue)}` : 'Đã đối soát xong'}
                </p>
              </div>

              {/* MRR Recurring */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Doanh Thu Tháng (MRR)</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{formatVND(overview.mrr)}</span>
                </div>
                <p className="text-[11px] text-purple-300 mt-2">Theo các gói đã kích hoạt</p>
              </div>

              {/* Conversion Rate */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/30 transition-all relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tỷ Lệ Chuyển Đổi</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{overview.conversionRate}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Tỷ lệ User nâng cấp trả phí</p>
              </div>

            </div>

            {/* Plan Distribution & Data Load */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Phân Bổ Người Dùng Theo Gói Thực Tế</h3>
                  <span className="text-xs text-slate-400 font-mono">Tổng {overview.totalUsers} tài khoản</span>
                </div>

                {/* Multi-segment Progress Bar */}
                <div className="space-y-2">
                  <div className="h-3 w-full rounded-full bg-white/[0.05] overflow-hidden flex p-0.5 gap-0.5">
                    {overview.planBreakdown.free > 0 && (
                      <div
                        style={{ width: `${(overview.planBreakdown.free / overview.totalUsers) * 100}%` }}
                        className="h-full bg-slate-500 rounded-full transition-all"
                        title={`Free: ${overview.planBreakdown.free}`}
                      />
                    )}
                    {overview.planBreakdown.starter > 0 && (
                      <div
                        style={{ width: `${(overview.planBreakdown.starter / overview.totalUsers) * 100}%` }}
                        className="h-full bg-blue-500 rounded-full transition-all"
                        title={`Starter: ${overview.planBreakdown.starter}`}
                      />
                    )}
                    {overview.planBreakdown.pro > 0 && (
                      <div
                        style={{ width: `${(overview.planBreakdown.pro / overview.totalUsers) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        title={`Pro: ${overview.planBreakdown.pro}`}
                      />
                    )}
                    {overview.planBreakdown.business > 0 && (
                      <div
                        style={{ width: `${(overview.planBreakdown.business / overview.totalUsers) * 100}%` }}
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        title={`Business: ${overview.planBreakdown.business}`}
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      Gói Miễn Phí (Free 0đ)
                    </span>
                    <span className="font-bold text-white font-mono">{overview.planBreakdown.free} users ({((overview.planBreakdown.free / overview.totalUsers) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Gói Starter (69K/tháng)
                    </span>
                    <span className="font-bold text-blue-400 font-mono">{overview.planBreakdown.starter} users ({((overview.planBreakdown.starter / overview.totalUsers) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Gói Pro (149K/tháng) ⭐ Bán chạy nhất
                    </span>
                    <span className="font-bold text-purple-400 font-mono">{overview.planBreakdown.pro} users ({((overview.planBreakdown.pro / overview.totalUsers) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Gói Business (299K/tháng)
                    </span>
                    <span className="font-bold text-amber-400 font-mono">{overview.planBreakdown.business} users ({((overview.planBreakdown.business / overview.totalUsers) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                <h3 className="text-base font-bold text-white">Dữ Liệu Kho Lưu Trữ</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Bookmark className="w-4 h-4 text-cyan-400 mb-1.5" />
                    <p className="text-2xl font-bold text-white">{overview.totalLinks}</p>
                    <p className="text-[10px] text-slate-400">Links trong DB</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Layers className="w-4 h-4 text-indigo-400 mb-1.5" />
                    <p className="text-2xl font-bold text-white">{overview.totalCollections}</p>
                    <p className="text-[10px] text-slate-400">Nhóm / Board</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Revenue Trend Chart */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Xu Hướng Doanh Thu 7 Ngày Gần Nhất</span>
                  </h3>
                  <p className="text-xs text-slate-400">Doanh số thực tế phát sinh theo từng ngày qua VietQR</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold">
                  <span>Tổng tuần này: {formatVND(revenueTrend7Days.totalWeek)}</span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="pt-4 pb-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40">
                  {revenueTrend7Days.days.map((d, i) => {
                    const heightPercent = revenueTrend7Days.maxRev > 0
                      ? Math.max((d.revenue / revenueTrend7Days.maxRev) * 100, 8)
                      : 8
                    const isPeak = d.revenue === revenueTrend7Days.maxRev && d.revenue > 0

                    return (
                      <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatVND(d.revenue)}
                        </div>
                        <div className="w-full max-w-[48px] bg-white/[0.04] rounded-xl overflow-hidden flex flex-col justify-end p-1 relative h-28">
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full rounded-lg transition-all duration-500 ${
                              isPeak
                                ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : d.revenue > 0
                                ? 'bg-gradient-to-t from-blue-600 to-cyan-400'
                                : 'bg-white/10'
                            }`}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-slate-300">{d.dayOfWeek}</p>
                          <p className="text-[9px] text-slate-500">{d.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: REVENUE & TRANSACTIONS & APPROVALS ── */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Pending Transactions Section */}
            {pendingTransactions.length > 0 ? (
              <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <h3 className="text-base font-bold text-white">Có {pendingTransactions.length} Giao Dịch Chờ Đối Soát Ngân Hàng</h3>
                      <p className="text-xs text-amber-300/80">Vui lòng kiểm tra tài khoản ngân hàng và bấm Duyệt để kích hoạt gói</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-500/20 text-amber-200">
                        <th className="py-2.5 px-3">Mã Chuyển Khoản</th>
                        <th className="py-2.5 px-3">Khách Hàng (Email)</th>
                        <th className="py-2.5 px-3">Gói Yêu Cầu</th>
                        <th className="py-2.5 px-3">Số Tiền</th>
                        <th className="py-2.5 px-3">Thời Gian</th>
                        <th className="py-2.5 px-3 text-right">Hành Động Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-500/10">
                      {pendingTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-amber-500/5 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-cyan-300">{tx.transaction_code || tx.transactionCode}</td>
                          <td className="py-3 px-3 text-white font-medium">{tx.email}</td>
                          <td className="py-3 px-3 font-bold text-purple-300">{tx.plan_name || tx.planName || 'Gói Pro'}</td>
                          <td className="py-3 px-3 font-extrabold text-emerald-400">{formatVND(tx.amount)}</td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">{new Date(tx.created_at).toLocaleString('vi-VN')}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(tx)}
                                disabled={actionLoadingId === tx.id}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all cursor-pointer shadow-md"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Duyệt & Kích hoạt</span>
                              </button>
                              <button
                                onClick={() => handleReject(tx)}
                                disabled={actionLoadingId === tx.id}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                                title="Từ chối"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Hiện không có giao dịch nào đang chờ duyệt</h3>
                    <p className="text-xs text-slate-400">Tất cả giao dịch VietQR đã được đối soát hoặc chưa có yêu cầu chuyển khoản mới.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={loadAdminData}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                  </button>
                </div>
              </div>
            )}

            {/* All Transactions History */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Lịch Sử Giao Dịch VietQR</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Tìm kiếm & Lọc trạng thái đối soát ngân hàng</p>
                </div>

                {/* Search Bar for Transactions */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={txSearchQuery}
                    onChange={(e) => setTxSearchQuery(e.target.value)}
                    placeholder="Mã GD hoặc email..."
                    className="w-full pl-9 pr-8 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  {txSearchQuery && (
                    <button
                      onClick={() => setTxSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setTxStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    txStatusFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  Tất cả ({transactions.length})
                </button>

                <button
                  onClick={() => setTxStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    txStatusFilter === 'pending'
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'bg-white/[0.04] text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Chờ duyệt ({transactions.filter(t => t.status === 'pending').length})</span>
                </button>

                <button
                  onClick={() => setTxStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    txStatusFilter === 'completed'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'bg-white/[0.04] text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Thành công ({transactions.filter(t => t.status === 'completed' || t.status === 'success').length})</span>
                </button>

                <button
                  onClick={() => setTxStatusFilter('failed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    txStatusFilter === 'failed'
                      ? 'bg-rose-600 text-white font-bold shadow-md'
                      : 'bg-white/[0.04] text-rose-400 hover:bg-rose-500/10'
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                  <span>Từ chối ({transactions.filter(t => t.status === 'failed' || t.status === 'rejected').length})</span>
                </button>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  {transactions.length === 0
                    ? 'Chưa có giao dịch thanh toán nào được ghi nhận.'
                    : 'Không tìm thấy giao dịch nào phù hợp với bộ lọc tìm kiếm.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-slate-400">
                        <th className="py-3 px-3">Mã GD</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Gói</th>
                        <th className="py-3 px-3">Số Tiền</th>
                        <th className="py-3 px-3">Thời Gian</th>
                        <th className="py-3 px-3 text-right">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-3 font-mono text-cyan-400 font-semibold">{tx.transaction_code || tx.transactionCode || tx.id}</td>
                          <td className="py-3.5 px-3 text-white font-medium">{tx.email}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {tx.plan_name || tx.planName || 'Gói Pro'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-white">{formatVND(tx.amount)}</td>
                          <td className="py-3.5 px-3 text-slate-400 text-[11px]">{new Date(tx.created_at).toLocaleString('vi-VN')}</td>
                          <td className="py-3.5 px-3 text-right">
                            {tx.status === 'completed' || tx.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" /> Thành công
                              </span>
                            ) : tx.status === 'pending' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Clock className="w-3 h-3" /> Chờ duyệt
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                <XCircle className="w-3 h-3" /> Từ chối
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── TAB 3: AI MONITORING ── */}
        {activeTab === 'ai' && aiStats && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-500/30 space-y-3">
              <span className="text-xs font-bold uppercase text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                Hiệu Suất AI Thực Tế
              </span>
              <h2 className="text-2xl font-black text-white">
                Tổng Số Lượt Gọi AI Thực Tế: <span className="text-cyan-400">{aiStats.totalCalls} lượt</span>
              </h2>
              <p className="text-xs text-slate-300">
                Chi phí ước tính API Google Gemini tiêu tốn: <strong className="text-amber-400">{formatVND(aiStats.estimatedCostVND)}</strong> (~3.5đ/lượt).
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 4: USERS LIST ── */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Search Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm Email hoặc Tên người dùng..."
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400">
                      <th className="py-3 px-3">Người Dùng</th>
                      <th className="py-3 px-3">Gói Hiện Tại</th>
                      <th className="py-3 px-3">Ngày Tham Gia</th>
                      <th className="py-3 px-3 text-right">Phân Quyền / Đổi Gói</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredUsers.map((u) => {
                      const userPlan = (u.plan || 'free').toLowerCase()
                      return (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover border border-white/10"
                              />
                              <div>
                                <p className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.full_name || 'Người dùng'}</span>
                                  {u.role === 'Super Admin' && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                                      Admin
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              userPlan === 'business'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : userPlan === 'pro'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : userPlan === 'starter'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>
                              {userPlan}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedUserDetail(u)}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors cursor-pointer"
                                title="Xem hồ sơ & Lịch sử thanh toán"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <select
                                value={userPlan}
                                onChange={(e) => handleAdminChangePlan(u, e.target.value)}
                                className="bg-white/[0.06] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                              >
                                <option value="free" className="bg-[#0b0f19] text-white">Gói Free (0đ)</option>
                                <option value="starter" className="bg-[#0b0f19] text-white">Gói Starter (69K)</option>
                                <option value="pro" className="bg-[#0b0f19] text-white">Gói Pro (149K)</option>
                                <option value="business" className="bg-[#0b0f19] text-white">Gói Business (299K)</option>
                              </select>

                              <button
                                onClick={() => handleAdminResetQuota(u)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                title="Reset lượt AI hôm nay"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── USER DETAIL MODAL (FEATURE 4) ── */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c101a] text-white shadow-[0_0_60px_rgba(59,130,246,0.2)]">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserDetail.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedUserDetail.full_name || 'Người dùng TabMark'}
                    {selectedUserDetail.role === 'Super Admin' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedUserDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* 3 Summary Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-400">Gói hiện tại</p>
                  <p className="text-xs font-bold text-purple-300 uppercase mt-1">{selectedUserDetail.plan || 'Free'}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-400">Tổng GD VietQR</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1">{selectedUserTransactions.length} GD</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-400">Ngày tham gia</p>
                  <p className="text-xs font-bold text-white mt-1">{new Date(selectedUserDetail.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Lịch sử giao dịch của user này */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Lịch Sử Giao Dịch Chuyển Khoản ({selectedUserTransactions.length})</span>
                </h4>

                {selectedUserTransactions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-500">
                    Người dùng này chưa phát sinh giao dịch chuyển khoản VietQR nào.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedUserTransactions.map((tx) => (
                      <div key={tx.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-mono font-bold text-cyan-300 text-[11px]">{tx.transaction_code || tx.transactionCode}</p>
                          <p className="text-[10px] text-slate-400">{new Date(tx.created_at).toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-emerald-400">{formatVND(tx.amount)}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            tx.status === 'completed' || tx.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {tx.status === 'completed' || tx.status === 'success' ? 'Thành công' : tx.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-slate-300">Tác Vụ Quản Trị Cho Tài Khoản</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={(selectedUserDetail.plan || 'free').toLowerCase()}
                    onChange={(e) => {
                      handleAdminChangePlan(selectedUserDetail, e.target.value)
                      setSelectedUserDetail(prev => ({ ...prev, plan: e.target.value }))
                    }}
                    className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="free" className="bg-[#0b0f19] text-white">Gói Free (0đ)</option>
                    <option value="starter" className="bg-[#0b0f19] text-white">Gói Starter (69K)</option>
                    <option value="pro" className="bg-[#0b0f19] text-white">Gói Pro (149K)</option>
                    <option value="business" className="bg-[#0b0f19] text-white">Gói Business (299K)</option>
                  </select>

                  <button
                    onClick={() => handleAdminResetQuota(selectedUserDetail)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Quota AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-white/[0.01]">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
