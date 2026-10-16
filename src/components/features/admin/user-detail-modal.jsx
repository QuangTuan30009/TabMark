import { X, CreditCard, RefreshCw } from 'lucide-react'

export function UserDetailModal({
  selectedUserDetail,
  onClose,
  selectedUserTransactions = [],
  formatVND,
  handleAdminChangePlan,
  handleAdminResetQuota,
  setSelectedUserDetail,
}) {
  if (!selectedUserDetail) return null

  return (
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
            onClick={onClose}
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
                      <p className="font-extrabold text-emerald-400">{formatVND ? formatVND(tx.amount) : tx.amount}</p>
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
                  if (typeof setSelectedUserDetail === 'function') {
                    setSelectedUserDetail(prev => ({ ...prev, plan: e.target.value }))
                  }
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
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
