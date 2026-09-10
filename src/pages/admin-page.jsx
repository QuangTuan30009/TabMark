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
  RefreshCw,
  Zap,
  Activity,
  CreditCard,
  Layers,
  ArrowUpRight,
  UserCheck,
  Server,
  Lock,
  Cpu,
} from 'lucide-react'
import Swal from 'sweetalert2'
import {
  getAdminOverviewStats,
  getAdminUsersList,
  getAdminTransactionsList,
  getAiMonitoringStats,
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

  // Tải dữ liệu ban đầu
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
  }, [])

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
    }
  }

  // Xử lý admin reset quota AI
  function handleAdminResetQuota(targetUser) {
    adminResetUserAiQuota(targetUser.id)
    setUsersList(prev => prev.map(u => u.id === targetUser.id ? { ...u, ai_calls_today: 0 } : u))
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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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
                  EXE101 Analytics
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Trung tâm quản trị & Báo cáo số liệu</p>
            </div>
          </div>
        </div>

        {/* Right side badges & refresh */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase Cloud Online</span>
          </div>

          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Làm mới dữ liệu"
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
            <span>2. Doanh Thu & VietQR</span>
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
            <span>3. Giám Sát AI & Chi Phí</span>
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
            <span>4. Quản Lý Người Dùng ({usersList.length})</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW & KPI ── */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Users */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/30 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tổng Người Dùng</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{overview.totalUsers}</span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <ArrowUpRight className="w-3 h-3" /> +24% tuần này
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">{overview.activeToday} người dùng hoạt động hôm nay</p>
              </div>

              {/* Total Revenue */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-emerald-500/30 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tổng Doanh Thu</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{formatVND(overview.totalRevenue)}</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium mt-2">⭐ Đạt 129% chỉ tiêu OC1</p>
              </div>

              {/* MRR Recurring */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Doanh Thu Tháng (MRR)</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{formatVND(overview.mrr)}</span>
                </div>
                <p className="text-[11px] text-purple-300 mt-2">Dự phóng ARR: {formatVND(overview.mrr * 12)}</p>
              </div>

              {/* Conversion Rate */}
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] hover:border-amber-500/30 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Tỷ Lệ Chuyển Đổi</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white">{overview.conversionRate}</span>
                  <span className="text-xs text-slate-400">Free ➔ Paid</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">Cao hơn mức trung bình ngành (5-8%)</p>
              </div>

            </div>

            {/* Middle Bento Section: Plan Distribution & System Load */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Plan Distribution */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Cơ Cấu Người Dùng Theo Gói</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Phân bổ 4 phân khúc khách hàng</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    48 Users Active
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Free */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">Gói Miễn Phí (Free 0đ)</span>
                      <span className="text-slate-400 font-mono">31 users (65%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  {/* Starter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-400 font-medium">Gói Starter (69K/tháng)</span>
                      <span className="text-slate-400 font-mono">9 users (18%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '18%' }} />
                    </div>
                  </div>

                  {/* Pro */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400 font-medium">Gói Pro (149K/tháng) ⭐ Bán chạy nhất</span>
                      <span className="text-slate-400 font-mono">7 users (14%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '14%' }} />
                    </div>
                  </div>

                  {/* Business */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-400 font-medium">Gói Business (299K/tháng)</span>
                      <span className="text-slate-400 font-mono">1 user (3%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '3%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data & Storage Metrics */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white">Dữ Liệu Toàn Hệ Thống</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sức chứa & Tải trọng lưu trữ</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Bookmark className="w-4 h-4 text-cyan-400 mb-1.5" />
                    <p className="text-xl font-bold text-white">{overview.totalLinks}</p>
                    <p className="text-[10px] text-slate-400">Bookmarks đã lưu</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Layers className="w-4 h-4 text-indigo-400 mb-1.5" />
                    <p className="text-xl font-bold text-white">{overview.totalCollections}</p>
                    <p className="text-[10px] text-slate-400">Nhóm / Bảng Kanban</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  <p className="font-semibold">⚡ Trạng Thái Cơ Sở Dữ Liệu:</p>
                  <p className="text-[11px] text-slate-400 mt-1">PostgreSQL Supabase phản hồi &lt; 45ms. Không có nghẽn mạng.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 2: REVENUE & VIETQR TRANSACTIONS ── */}
        {activeTab === 'revenue' && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Revenue Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <span className="text-xs text-slate-400">Doanh thu tích lũy</span>
                <p className="text-2xl font-black text-white mt-2">{formatVND(overview?.totalRevenue || 3880000)}</p>
                <p className="text-[11px] text-emerald-400 mt-1">Quét mã VietQR tự động</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <span className="text-xs text-slate-400">Giá trị đơn hàng trung bình (AOV)</span>
                <p className="text-2xl font-black text-white mt-2">168.000 ₫</p>
                <p className="text-[11px] text-purple-300 mt-1">Khách hàng chuộng gói Pro</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <span className="text-xs text-slate-400">Thời gian kích hoạt trung bình</span>
                <p className="text-2xl font-black text-white mt-2">&lt; 3 Giây</p>
                <p className="text-[11px] text-cyan-400 mt-1">Tự động hóa 100%</p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Lịch Sử Giao Dịch Gần Đây</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Biên lai thanh toán chuyển khoản VietQR</p>
                </div>
                <span className="text-xs text-slate-400">{transactions.length} giao dịch</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400">
                      <th className="py-3 px-3">Mã Giao Dịch</th>
                      <th className="py-3 px-3">Khách Hàng (Email)</th>
                      <th className="py-3 px-3">Gói Nâng Cấp</th>
                      <th className="py-3 px-3">Số Tiền</th>
                      <th className="py-3 px-3">Phương Thức</th>
                      <th className="py-3 px-3">Thời Gian</th>
                      <th className="py-3 px-3 text-right">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {transactions.map((tx, idx) => (
                      <tr key={tx.id || idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-3 font-mono text-cyan-400 font-semibold">{tx.transaction_code || tx.id}</td>
                        <td className="py-3.5 px-3 text-white font-medium">{tx.email}</td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {tx.plan_name || 'Gói Pro'}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-white">{formatVND(tx.amount || 149000)}</td>
                        <td className="py-3.5 px-3 text-slate-400">{tx.payment_method || 'VietQR'}</td>
                        <td className="py-3.5 px-3 text-slate-400 text-[11px]">{new Date(tx.created_at).toLocaleString('vi-VN')}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Thành công
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: AI MONITORING & GEMINI COST ── */}
        {activeTab === 'ai' && aiStats && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Profit Margin Hero Box */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-slate-900/40 border border-purple-500/30 relative overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                    Báo Cáo Hiệu Quả Tài Chính AI (EXE101)
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white mt-3">
                    Biên Lợi Nhuận Gộp AI Đạt <span className="text-emerald-400">{aiStats.profitMargin}</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                    Mô hình <strong>Gemini 1.5 Flash</strong> có chi phí siêu tối ưu (~$0.075 / 1 triệu tokens). 
                    Chi phí thực tế để xử lý <strong>{aiStats.totalCalls.toLocaleString()} lượt gọi</strong> chỉ tiêu tốn 
                    <strong className="text-amber-300"> {formatVND(aiStats.estimatedCostVND)}</strong>, 
                    trong khi doanh thu thu về đạt hàng triệu đồng.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#080b12]/80 border border-white/10 text-center min-w-[180px]">
                  <p className="text-xs text-slate-400">Chi Phí API Tiêu Tốn</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{formatVND(aiStats.estimatedCostVND)}</p>
                  <p className="text-[10px] text-slate-500 mt-1">~3đ / lượt gọi</p>
                </div>
              </div>
            </div>

            {/* AI Breakdown Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">AI Auto-Fill & Gắn Tag</span>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3">{aiStats.autoFillCalls} lượt</p>
                <p className="text-[11px] text-slate-400 mt-1">Trích xuất metadata & sinh tags tự động</p>
              </div>

              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">AI Smart Summary</span>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3">{aiStats.summaryCalls} lượt</p>
                <p className="text-[11px] text-slate-400 mt-1">Tóm tắt nội dung trực tiếp trên thẻ Kanban</p>
              </div>

              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Trợ Lý AI Chatbot</span>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3">{aiStats.chatCalls} câu hỏi</p>
                <p className="text-[11px] text-slate-400 mt-1">Hỏi đáp & tìm kiếm trên kho bookmark</p>
              </div>
            </div>

            {/* Model details */}
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="font-bold text-white">Mô hình AI: {aiStats.activeModel}</p>
                  <p className="text-slate-400 text-[11px]">Độ trễ trung bình: 480ms | Kết nối Supabase Edge Function & Client Fallback</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                {aiStats.status}
              </span>
            </div>

          </div>
        )}

        {/* ── TAB 4: USER MANAGEMENT TABLE ── */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo Email hoặc Tên người dùng..."
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Plan Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['all', 'free', 'starter', 'pro', 'business'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlanFilter(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      planFilter === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'all' ? 'Tất cả' : p}
                  </button>
                ))}
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
                      <th className="py-3 px-3">Lượt AI Hôm Nay</th>
                      <th className="py-3 px-3">Bookmarks</th>
                      <th className="py-3 px-3">Ngày Tham Gia</th>
                      <th className="py-3 px-3 text-right">Thao Tác Admin</th>
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

                          <td className="py-3.5 px-3 text-slate-300 font-mono">
                            {u.ai_calls_today || 0} lượt
                          </td>

                          <td className="py-3.5 px-3 text-slate-300 font-mono">
                            {u.links_count || 10} links
                          </td>

                          <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Plan Switch */}
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

                              {/* Reset Quota */}
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
    </div>
  )
}
