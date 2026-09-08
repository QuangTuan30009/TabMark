import { useState, useMemo } from 'react'
import { X, Check, Copy, Sparkles, ShieldCheck, Zap, QrCode, ArrowRight, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'
import { PAYMENT_CONFIG, generateVietQRUrl } from '@/lib/paymentConfig'
import { upgradeUserToPro, recordTransaction } from '@/lib/bookmarksApi'

export function PaymentModal({ isOpen, onClose, user, onUpgradeSuccess }) {
  const [selectedPlan, setSelectedPlan] = useState(PAYMENT_CONFIG.plans[0])
  const [step, setStep] = useState('choose') // 'choose' | 'pay'
  const [copiedField, setCopiedField] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Sinh mã chuyển khoản duy nhất dựa trên email user hoặc timestamp
  const transferCode = useMemo(() => {
    const userIdentifier = user?.email
      ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()
      : 'GUEST'
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    return `TABMARK ${userIdentifier} ${randomSuffix}`
  }, [user, isOpen])

  if (!isOpen) return null

  const qrUrl = generateVietQRUrl({
    amount: selectedPlan.price,
    memo: transferCode,
  })

  function handleCopy(text, fieldName) {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  async function handleConfirmPayment() {
    setIsProcessing(true)
    try {
      if (user?.id) {
        // 1. Ghi nhận giao dịch
        await recordTransaction({
          userId: user.id,
          email: user.email,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: selectedPlan.price,
          transactionCode: transferCode,
        })

        // 2. Nâng cấp user lên Pro
        await upgradeUserToPro(user.id, selectedPlan.id)
      }

      setIsProcessing(false)
      onClose()

      // 3. Thông báo chúc mừng
      Swal.fire({
        title: '🎉 Nâng Cấp PRO Thành Công!',
        html: `
          <div class="text-left text-sm text-slate-300 space-y-2 mt-2">
            <p>Cảm ơn bạn đã đồng hành và ủng hộ dự án <b>TabMark</b>!</p>
            <p>Gói <b>${selectedPlan.name}</b> đã được kích hoạt thành công.</p>
            <p class="text-xs text-amber-400 font-medium">⭐ Toàn bộ tính năng AI và không giới hạn lưu trữ đã sẵn sàng phục vụ bạn.</p>
          </div>
        `,
        icon: 'success',
        background: '#0d111a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Bắt đầu trải nghiệm ngay 🚀',
        customClass: {
          popup: 'border border-blue-500/30 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)]',
          confirmButton: 'px-6 py-2.5 rounded-xl font-bold',
        }
      }).then(() => {
        if (onUpgradeSuccess) {
          onUpgradeSuccess(selectedPlan)
        }
      })
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
      Swal.fire({
        title: 'Thông báo',
        text: 'Đã tiếp nhận yêu cầu! Quản trị viên sẽ kiểm tra sao kê và kích hoạt gói cho bạn trong giây lát.',
        icon: 'info',
        background: '#0d111a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      })
      onClose()
      if (onUpgradeSuccess) onUpgradeSuccess(selectedPlan)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c101a] text-white shadow-[0_0_60px_rgba(59,130,246,0.2)]">
        {/* Header Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Nâng Cấp TabMark PRO
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Ưu Đãi Đặc Biệt
                </span>
              </h3>
              <p className="text-xs text-slate-400">Mở khóa sức mạnh AI không giới hạn & đồng bộ mượt mà</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {step === 'choose' ? (
            /* STEP 1: CHỌN GÓI */
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {PAYMENT_CONFIG.plans.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative flex flex-col justify-between rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.25)] scale-[1.02]'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider shadow-md">
                          {plan.badge}
                        </span>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{plan.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                        <div className="my-4">
                          <span className="text-2xl font-extrabold text-white">{plan.formattedPrice}</span>
                          <span className="text-xs text-slate-400 ml-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          {plan.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5 pt-3 border-t border-white/5">
                        <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'
                        }`}>
                          {isSelected ? 'Đang chọn ✓' : 'Chọn gói này'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Next Button */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Kích hoạt tài khoản ngay sau khi thanh toán</span>
                </div>
                <button
                  onClick={() => setStep('pay')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-sm text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
                >
                  <span>Tiếp tục thanh toán</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: THANH TOÁN VIETQR */
            <div className="space-y-6">
              <button
                onClick={() => setStep('choose')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Chọn lại gói cước khác</span>
              </button>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Cột Trái: Mã QR */}
                <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-white/10 bg-white/5">
                  <div className="relative rounded-xl overflow-hidden bg-white p-3 shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                    <img
                      src={qrUrl}
                      alt="VietQR Chuyển Khoản"
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <QrCode className="h-4 w-4 text-blue-400" />
                    <span>Mở App Ngân hàng hoặc MoMo để quét QR</span>
                  </div>
                </div>

                {/* Cột Phải: Thông tin Chuyển khoản */}
                <div className="space-y-3.5 text-sm">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                    Gói đang chọn: <b className="text-white font-bold">{selectedPlan.name}</b> ({selectedPlan.formattedPrice})
                  </div>

                  {/* Ngân hàng */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-xs text-slate-400">Ngân hàng</p>
                      <p className="font-semibold text-white">{PAYMENT_CONFIG.bankName}</p>
                    </div>
                  </div>

                  {/* Số tài khoản */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-xs text-slate-400">Số tài khoản</p>
                      <p className="font-mono text-base font-bold text-amber-400">{PAYMENT_CONFIG.accountNo}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(PAYMENT_CONFIG.accountNo, 'acc')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                    >
                      {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'acc' ? 'Đã copy' : 'Copy STK'}</span>
                    </button>
                  </div>

                  {/* Chủ tài khoản */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-xs text-slate-400">Chủ tài khoản</p>
                      <p className="font-semibold text-white">{PAYMENT_CONFIG.accountName}</p>
                    </div>
                  </div>

                  {/* Số tiền */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-xs text-slate-400">Số tiền thanh toán</p>
                      <p className="font-bold text-lg text-emerald-400">{selectedPlan.formattedPrice}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(selectedPlan.price.toString(), 'amount')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                    >
                      {copiedField === 'amount' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'amount' ? 'Đã copy' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Nội dung chuyển khoản */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs text-amber-300 font-medium">Nội dung chuyển khoản (Bắt buộc)</p>
                      <p className="font-mono text-sm font-bold text-white truncate">{transferCode}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'memo')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-xs text-amber-300 font-semibold transition-colors shrink-0"
                    >
                      {copiedField === 'memo' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedField === 'memo' ? 'Đã copy' : 'Copy nội dung'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Sau khi chuyển khoản, bấm nút xác nhận bên dưới</span>
                </div>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>{isProcessing ? 'Đang xử lý...' : 'Tôi đã chuyển khoản thành công'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
