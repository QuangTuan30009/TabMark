import { Globe, MessageSquare, Mail, Sparkles, Code2 } from 'lucide-react'

const footerLinkGroups = [
  {
    heading: 'Sản phẩm',
    links: [
      { text: 'Tính năng', href: '#features' },
      { text: 'Bảng giá', href: '#pricing' },
      { text: 'Liên hệ', href: 'https://github.com/QuangTuan30009/TabMark', isExternal: true },
    ],
  },
  {
    heading: 'Công nghệ',
    links: [
      { text: 'React 19', href: 'https://react.dev', isExternal: true },
      { text: 'Supabase Cloud', href: 'https://supabase.com', isExternal: true },
      { text: 'Gemini AI', href: 'https://ai.google.dev', isExternal: true },
    ],
  },
  {
    heading: 'Dự án',
    links: [
      { text: 'Về chúng tôi', href: '#team' },
      { text: 'Chính sách bảo mật', href: '/privacy-policy.html', isExternal: true },
      { text: 'Liên hệ hỗ trợ', href: 'mailto:support@tabmark.app', isExternal: true },
    ],
  },
]

const teamMembers = [
  { name: 'Tạ Quang Tuấn', role: 'Project Leader & AI / Fullstack' },
  { name: 'Nguyễn Phương Vũ', role: 'AI Core & Backend Engineer' },
  { name: 'Phạm Hoàng Nam', role: 'AI & Frontend Engineer' },
  { name: 'Nguyễn Cao Thành Trung', role: 'AI & QA Engineer' },
  { name: 'Võ Nguyễn Thiên Thanh', role: 'UI/UX & Graphic Designer (GD)' },
]

export function Footer() {
  return (
    <footer className="footer-gradient border-t border-white/[0.06] px-6 pb-8 pt-16 bg-[#05070d]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <a href="#" className="flex items-center cursor-pointer">
                <img 
                  src="/tabmark-logo-white.png" 
                  alt="TabMark Logo" 
                  className="h-9 w-auto object-contain transition-transform hover:scale-105" 
                />
              </a>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Quản lý bookmark thông minh bằng Gemini AI, giúp bạn tổ chức và tìm kiếm dữ liệu trực quan theo tốc độ tư duy.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Dự án khởi nghiệp sinh viên EXE101</span>
            </div>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.heading}>
              <p className="mb-4 text-sm font-bold text-white tracking-wide">{group.heading}</p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <a 
                      href={link.href} 
                      target={link.isExternal ? '_blank' : '_self'}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Đội ngũ phát triển dự án (EXE101) */}
        <div id="team" className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Đội ngũ phát triển dự án (EXE101)
            </span>
            <span className="text-[11px] text-slate-500">Khởi nghiệp đổi mới sáng tạo</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs hover:border-cyan-500/30 transition-colors flex flex-col justify-between">
                <p className="font-semibold text-slate-200">{m.name}</p>
                <p className="text-[11px] text-cyan-400/80 mt-1 leading-tight">{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row text-xs text-slate-500">
          <p>© 2026 TabMark • Nền tảng quản lý bookmark trực quan AI • EXE101 Production</p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/QuangTuan30009/TabMark" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Mã nguồn GitHub"><Code2 className="h-4 w-4" /></a>
            <a href="https://tabmark.app" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Website"><Globe className="h-4 w-4" /></a>
            <a href="mailto:support@tabmark.app" className="text-slate-400 hover:text-white transition-colors" title="Email hỗ trợ"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
