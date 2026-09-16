import { Globe, MessageSquare, Mail, Sparkles } from 'lucide-react'

const footerLinks = {
  'Sản phẩm': ['Tính năng', 'Bảng giá', 'Doanh nghiệp'],
  'Công nghệ': ['React 19', 'Supabase Cloud', 'Gemini AI'],
  'Dự án': ['Về chúng tôi', 'Chính sách bảo mật', 'Báo cáo OC3 EXE101'],
}

export function Footer() {
  return (
    <footer id="contact" className="footer-gradient border-t border-white/[0.06] px-6 pb-8 pt-16 bg-[#05070d]">
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

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-4 text-sm font-bold text-white tracking-wide">{heading}</p>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  const isPrivacy = link === 'Chính sách bảo mật';
                  return (
                    <li key={link}>
                      <a 
                        href={isPrivacy ? '/privacy-policy.html' : '#'} 
                        target={isPrivacy ? '_blank' : '_self'}
                        rel={isPrivacy ? 'noopener noreferrer' : undefined}
                        className="text-xs sm:text-sm text-slate-400 transition-colors hover:text-cyan-300"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row text-xs text-slate-500">
          <p>© 2026 TabMark • Nền tảng quản lý bookmark trực quan AI • EXE101 Production</p>
          <div className="flex items-center gap-4">
            <a href="https://tabmark.app" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title="Website"><Globe className="h-4 w-4" /></a>
            <a href="#contact" className="text-slate-400 hover:text-white transition-colors" title="Cộng đồng"><MessageSquare className="h-4 w-4" /></a>
            <a href="mailto:support@tabmark.app" className="text-slate-400 hover:text-white transition-colors" title="Email hỗ trợ"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
