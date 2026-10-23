import { RevealSection } from '@/components/ui/reveal-section'
import { Users, Mail, ExternalLink, Code2 } from 'lucide-react'

// Danh sách thành viên nhóm phát triển dự án TabMark (EXE101)
// Bạn có thể dễ dàng thay đổi tên, chức danh và thông tin liên hệ của từng bạn
const teamMembers = [
  {
    name: 'Tạ Quang Tuấn',
    role: 'Project Leader & AI / Fullstack Dev',
    bio: 'Phụ trách kiến trúc hệ thống, tích hợp Supabase Database, Gemini AI và phát triển Web App.',
    avatarText: 'TQT',
    contact: 'taquangtuan2016@gmail.com',
    github: 'https://github.com/QuangTuan30009',
  },
  {
    name: 'Nguyễn Phương Vũ',
    role: 'AI Core & Backend Engineer',
    bio: 'Nghiên cứu mô hình ngôn ngữ lớn, prompt engineering và pipeline tóm tắt dữ liệu liên kết.',
    avatarText: 'NPV',
    contact: 'vunp@tabmark.app',
  },
  {
    name: 'Phạm Hoàng Nam',
    role: 'AI & Frontend Engineer',
    bio: 'Phát triển trải nghiệm kéo thả Kanban, tối ưu hóa tìm kiếm thông minh và Chrome Extension.',
    avatarText: 'PHN',
    contact: 'namph@tabmark.app',
  },
  {
    name: 'Nguyễn Cao Thành Trung',
    role: 'AI & QA Engineer',
    bio: 'Đo lường độ chính xác kết quả tóm tắt AI, kiểm thử hiệu năng hệ thống và bảo mật dữ liệu.',
    avatarText: 'NCT',
    contact: 'trungnct@tabmark.app',
  },
  {
    name: 'Võ Nguyễn Thiên Thanh',
    role: 'UI/UX & Graphic Designer (GD)',
    bio: 'Thiết kế bộ nhận diện thương hiệu, Design System Dark Mode và toàn bộ visual assets của TabMark.',
    avatarText: 'VNT',
    contact: 'thanhvnt@tabmark.app',
  },
]

export function TeamSection() {
  return (
    <section id="team" className="px-4 sm:px-6 py-12 md:py-16 bg-[#080b13] relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <RevealSection className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 mb-3 tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>ĐỘI NGŨ PHÁT TRIỂN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Thành Viên Nhóm Dự Án TabMark
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Dự án khởi nghiệp công nghệ được phát triển bởi sinh viên trong khuôn khổ môn học EXE101.
          </p>
        </RevealSection>

        {/* Team Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {teamMembers.map((member, idx) => (
            <RevealSection key={idx} style={{ transitionDelay: `${idx * 100}ms` }}>
              <div className="h-full rounded-2xl p-5 bg-[#0d121e]/90 border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between group">
                <div>
                  {/* Avatar */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-white/10 text-slate-200 font-bold text-sm group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                      {member.avatarText}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-[11px] font-medium text-cyan-400/90 leading-tight">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Footer links */}
                <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] truncate max-w-[120px]">{member.contact}</span>
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

      </div>
    </section>
  )
}
