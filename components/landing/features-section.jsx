import { RevealSection } from '@/components/landing/reveal'

const features = [
  {
    img: '/feature-kanban.png',
    title: 'Kéo thả Kanban trực quan',
    desc: 'Sắp xếp và di chuyển bookmark của bạn giữa các cột một cách dễ dàng, tạo quy trình làm việc cá nhân hóa.',
  },
  {
    img: '/feature-ai.png',
    title: 'Tự động gán thẻ AI',
    desc: 'Hệ thống AI thông minh tự động phân loại và gắn thẻ bookmark của bạn dựa trên nội dung và ngữ cảnh.',
  },
  {
    img: '/feature-search.png',
    title: 'Tìm kiếm ngôn ngữ tự nhiên',
    desc: 'Tìm kiếm bookmark bằng các câu hỏi thông thường. AI sẽ hiểu và trả về kết quả chính xác nhất.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <RevealSection className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="text-3xl font-bold md:text-4xl">Tính năng nổi bật</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Tập trung vào trải nghiệm quản lý bookmark hiệu quả nhất
          </p>
        </RevealSection>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <RevealSection key={f.title} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="glass-card group rounded-2xl p-1.5 transition-all duration-300">
                <div className="feature-img-wrapper mb-0">
                  <img src={f.img} alt={f.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5 pt-4">
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}
