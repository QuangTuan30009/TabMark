import { RevealSection } from '@/components/ui/reveal-section'
import { Sparkles, Layers, Search } from 'lucide-react'

const features = [
  {
    badge: 'Quy Trình Kanban',
    icon: Layers,
    img: '/feature-kanban.png',
    title: 'Kéo thả Kanban trực quan',
    desc: 'Sắp xếp và di chuyển bookmark của bạn giữa các cột một cách dễ dàng, tạo quy trình làm việc khoa học và cá nhân hóa.',
    gradient: 'from-blue-500/20 to-indigo-500/10'
  },
  {
    badge: 'Trí Tuệ Nhân Tạo',
    icon: Sparkles,
    img: '/feature-ai.png',
    title: 'Tự động gán thẻ & tóm tắt AI',
    desc: 'Hệ thống Gemini AI thông minh tự động đọc hiểu trang, tóm tắt ý chính và gắn thẻ phân loại chỉ trong vài giây.',
    gradient: 'from-purple-500/20 to-pink-500/10'
  },
  {
    badge: 'Tìm Kiếm Thông Minh',
    icon: Search,
    img: '/feature-search.png',
    title: 'Tìm kiếm ngôn ngữ tự nhiên',
    desc: 'Tìm kiếm bookmark bằng các câu hỏi thông thường. AI sẽ hiểu sâu ngữ cảnh và trả về liên kết chính xác nhất.',
    gradient: 'from-cyan-500/20 to-teal-500/10'
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 sm:px-6 py-20 md:py-28 bg-[#080b13] relative">
      {/* Background glow orb */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-blue-600/[0.03] blur-[150px]" />

      <div className="mx-auto max-w-7xl relative z-10">
        <RevealSection className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-3 tracking-widest uppercase">
            <span>CÔNG NGHỆ ĐỘT PHÁ</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl tracking-tight text-balance">
            Hệ Sinh Thái Tính Năng Toàn Diện
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-400 text-balance leading-relaxed">
            Được thiết kế tỉ mỉ để tối ưu hóa năng suất học tập, nghiên cứu và làm việc hàng ngày của bạn.
          </p>
        </RevealSection>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <RevealSection key={f.title} style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="group relative h-full flex flex-col rounded-3xl p-6 bg-[#0d121e]/80 border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-[0_15px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-cyan-300">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{f.badge}</span>
                    </div>
                  </div>

                  {/* Image wrapper */}
                  <div className="mb-5 overflow-hidden rounded-2xl border border-white/5 bg-black/40 shadow-inner">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {f.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
