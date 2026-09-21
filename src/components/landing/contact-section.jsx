import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle2, User, Phone, MapPin, Sparkles, ExternalLink, Code2 } from 'lucide-react'

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setSubmitted(false), 5000)
    }, 600)
  }

  return (
    <section id="contact" className="relative py-20 px-6 bg-[#070a13] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-10 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Liên Hệ & Hỗ Trợ Dự Án</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kết nối với đội ngũ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">TabMark</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Bạn có câu hỏi, góp ý tính năng hoặc cần hỗ trợ về tài khoản? Chúng tôi luôn sẵn sàng lắng nghe và phản hồi nhanh chóng!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Column: Contact Cards (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Email hỗ trợ</h3>
              <p className="text-xs text-slate-400 mt-1">Giải đáp kỹ thuật và thắc mắc về gói dịch vụ</p>
              <div className="mt-3 space-y-1">
                <a href="mailto:support@tabmark.app" className="block text-xs font-semibold text-cyan-300 hover:underline">
                  support@tabmark.app
                </a>
                <a href="mailto:taquangtuan2016@gmail.com" className="block text-xs text-slate-300 hover:text-white">
                  taquangtuan2016@gmail.com
                </a>
              </div>
            </div>

            {/* University & Project Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Thông tin dự án</h3>
              <p className="text-xs text-slate-400 mt-1">Dự án Khởi nghiệp EXE201 — FPT University</p>
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                <p><span className="text-slate-400">Trưởng nhóm:</span> <strong>Tạ Quang Tuấn</strong></p>
                <p><span className="text-slate-400">Đề tài:</span> Quản lý Bookmark thông minh bằng AI</p>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-blue-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Mã nguồn & Đóng góp</h3>
              <p className="text-xs text-slate-400 mt-1">Theo dõi các bản cập nhật mới nhất trên GitHub</p>
              <a 
                href="https://github.com/QuangTuan30009/TabMark" 
                target="_blank" 
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:underline"
              >
                <span>github.com/QuangTuan30009/TabMark</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Feedback Form (3 cols) */}
          <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Gửi tin nhắn hoặc góp ý</h3>
            <p className="text-xs text-slate-400 mb-6">
              Điền thông tin bên dưới, chúng tôi sẽ tiếp nhận và phản hồi sớm nhất có thể.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Cảm ơn bạn đã liên hệ! 🎉</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Tin nhắn của bạn đã được gửi thành công. Đội ngũ TabMark sẽ liên hệ lại qua email trong thời gian sớm nhất!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Họ và tên <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 focus:border-cyan-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Địa chỉ Email <span className="text-rose-400">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 focus:border-cyan-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nội dung tin nhắn / Góp ý <span className="text-rose-400">*</span></label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mô tả ý kiến đóng góp, báo lỗi hoặc nhu cầu hợp tác của bạn..."
                    className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 focus:border-cyan-500 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>{sending ? 'Đang gửi...' : 'Gửi phản hồi ngay'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
