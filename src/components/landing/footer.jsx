import { Globe, MessageSquare, Mail } from 'lucide-react'

const footerLinks = {
  Tabmark: ['Features', 'Pricing', 'Team & Doanh nghiệp'],
  Stack: ['React', 'Supabase', 'Vercel'],
  'Condition': ['About', 'Privacy', 'Blog'],
}

export function Footer() {
  return (
    <footer id="contact" className="footer-gradient border-t border-white/[0.06] px-6 pb-8 pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center cursor-pointer">
                <img src="/Tabmark-removebg-preview.png" alt="Tabmark Logo" className="w-32 sm:w-40 h-auto object-contain opacity-90 transition-transform hover:scale-105 dark:invert" />
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Quản lý bookmark thông minh bằng AI, giúp bạn tổ chức và tìm kiếm link nhanh hơn bao giờ hết.
            </p>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-4 text-sm font-semibold">{heading}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground/60">© Copyright tabmark.com</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground/60 transition-colors hover:text-foreground"><Globe className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground/60 transition-colors hover:text-foreground"><MessageSquare className="h-4 w-4" /></a>
            <a href="#" className="text-muted-foreground/60 transition-colors hover:text-foreground"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
