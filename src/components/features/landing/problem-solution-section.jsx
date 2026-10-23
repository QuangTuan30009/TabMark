import { RevealSection } from '@/components/ui/reveal-section'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'

const problems = [
  {
    title: 'Hội chứng "Tab Overload"',
    desc: 'Mở hàng chục tab cùng lúc làm chậm trình duyệt, ngốn RAM và khiến bạn phân tâm, dễ đóng nhầm nội dung quan trọng.'
  },
  {
    title: 'Bookmark trở thành "nghĩa địa link"',
    desc: 'Lưu trữ theo cây thư mục truyền thống của trình duyệt khó tìm lại, nhanh chóng bị lãng quên sau khi lưu.'
  },
  {
    title: 'Mất thời gian đọc & tóm tắt',
    desc: 'Cần tra cứu lại tài liệu nghiên cứu dài nhưng phải bấm vào từng trang để đọc lại từ đầu, làm giảm hiệu suất.'
  }
]

const solutions = [
  {
    title: 'Quy trình Kanban trực quan',
    desc: 'Sắp xếp bookmark theo các cột trạng thái linh hoạt, kéo thả mượt mà để quản lý công việc và học tập khoa học.'
  },
  {
    title: 'Tóm tắt tự động bằng Gemini AI',
    desc: 'Chỉ với 1 click, AI đọc hiểu toàn bộ nội dung trang web và trích xuất tóm tắt ý chính trong chưa đầy 3 giây.'
  },
  {
    title: 'Tìm kiếm ngữ nghĩa thông minh',
    desc: 'Tìm kiếm bằng ngôn ngữ tự nhiên theo ý niệm trong đầu thay vì phải nhớ chính xác từng ký tự URL hay tiêu đề.'
  }
]

export function ProblemSolutionSection({ onOpenDashboard }) {
  return (
    <section id="solution" className="px-4 sm:px-6 py-16 md:py-24 bg-[#06080f] relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <RevealSection className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-3 tracking-wider uppercase">
            <span>VẤN ĐỀ & GIẢI PHÁP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Từ Quá Tải Thông Tin Đến Quản Lý Tinh Gọn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            TabMark giải quyết triệt để thói quen lưu trữ lộn xộn, biến kho tài nguyên số của bạn thành không gian làm việc có tổ chức.
          </p>
        </RevealSection>

        {/* 2-Column Comparison */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          
          {/* Cột Vấn đề */}
          <RevealSection>
            <div className="h-full rounded-2xl p-6 sm:p-8 bg-[#0b0e17] border border-red-500/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-white/[0.06] mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Thực trạng người dùng gặp phải</h3>
                    <p className="text-xs text-slate-400">Những trở ngại với cách quản lý bookmark truyền thống</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {problems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 text-xs font-semibold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-slate-500">
                Gây lãng phí trung bình 20-30 phút mỗi ngày chỉ để tìm lại các liên kết cũ.
              </div>
            </div>
          </RevealSection>

          {/* Cột Giải pháp TabMark */}
          <RevealSection style={{ transitionDelay: '150ms' }}>
            <div className="h-full rounded-2xl p-6 sm:p-8 bg-[#0d121e] border border-cyan-500/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-5 border-b border-white/[0.06] mb-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">Giải pháp đột phá từ TabMark</h3>
                    <p className="text-xs text-cyan-300/80">Tích hợp Kanban trực quan và sức mạnh của AI</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {solutions.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-cyan-400/90 font-medium">Sắp xếp dữ liệu theo tốc độ tư duy</span>
                {onOpenDashboard && (
                  <button 
                    onClick={onOpenDashboard}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Trải nghiệm ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </RevealSection>

        </div>
      </div>
    </section>
  )
}
