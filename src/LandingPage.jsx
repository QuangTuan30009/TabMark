import { useEffect, useRef, useState } from 'react'
import {
  BookmarkIcon,
  Brain,
  ChevronRight,
  Globe,
  MessageSquare,
  Mail,
  Kanban,
  Search,
  Zap,
  Check,
  Star,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react'

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function RevealSection({ className = '', children, ...props }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`} {...props}>{children}</div>
}

/* ── Navbar ── */
function Navbar({ onOpenDashboard }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or fallback to initial html class
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const navLinks = [
    { href: "#features", text: "Features" },
    { href: "#pricing", text: "Pricing" },
    { href: "#contact", text: "Contact" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/90 dark:bg-[#06111f]/90 backdrop-blur-xl shadow-lg border-slate-200 dark:border-white/10' 
          : 'bg-white/50 dark:bg-[#06111f]/50 backdrop-blur-md border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center group cursor-pointer" onClick={onOpenDashboard}>
              <img 
                src="/Tabmark-removebg-preview.png" 
                alt="Tabmark Logo" 
                className="w-32 sm:w-40 lg:w-48 h-auto object-contain transition-transform group-hover:scale-105 dark:invert" 
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.text} 
                href={link.href} 
                className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative group"
              >
                {link.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={onOpenDashboard}
              className="px-4 lg:px-6 py-2 text-sm lg:text-base font-semibold bg-primary text-white hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 rounded-full"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-1">
              {navLinks.map(link => (
                <a 
                  key={link.text} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.text}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={onOpenDashboard}
                  className="w-full px-3 py-3 text-base font-medium bg-primary text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ── */
function HeroSection({ onOpenDashboard }) {
  return (
    <section className="hero-gradient relative overflow-hidden px-6 pb-16 pt-20 md:pb-24 md:pt-32">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#8B5CF6]/10 blur-[100px] animate-pulse-glow delay-500" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Left – copy */}
        <div className="animate-fade-in-left">
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-pretty md:text-5xl lg:text-[3.4rem]">
            Quản lý bookmark{' '}
            <br className="hidden sm:block" />
            thông minh bằng{' '}
            <span className="gradient-text">AI </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Tổ chức, gắn thẻ và tìm kiếm bookmark của bạn dễ dàng với sức mạnh của AI
            và giao diện Kanban trực quan. Trải nghiệm năng suất vượt trội ngay hôm nay.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onOpenDashboard}
              className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(47,155,255,0.35)]"
            >
              Try for free
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpenDashboard}
              className="rounded-full border border-white/15 px-8 py-3.5 font-semibold text-foreground backdrop-blur transition-all hover:border-white/30 hover:bg-white/5"
            >
              Xem demo
            </button>
          </div>
        </div>

        {/* Right – dashboard mockup */}
        <div className="animate-fade-in-right delay-200">
          <div className="img-hover rounded-2xl border border-white/10 bg-card/60 p-3 shadow-2xl glow-blue">
            <img
              src="/dashboard-mockup.png"
              alt="Tabmark Dashboard Preview"
              className="w-full rounded-xl"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}



/* ── Features ── */
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

function FeaturesSection() {
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

/* ── Pricing ── */
const plans = [
  {
    name: 'Starter',
    target: 'Sinh viên',
    price: '50.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'Workspace cơ bản',
      'Tìm kiếm thông tin',
      'Tối ưu cho người mới',
    ],
    cta: 'Đăng ký Starter',
  },
  {
    name: 'Mid-tier',
    target: 'Freelancer, NVVP',
    price: '80.000 đ',
    period: '/tháng',
    popular: true,
    features: [
      'Mọi tính năng của Starter',
      'AI Summary',
      'AI Classification',
      '2.000 lượt request AI',
    ],
    cta: 'Nâng cấp lên Mid-tier',
  },
  {
    name: 'Premium',
    target: 'Phòng ban R&D',
    price: '150.000 đ',
    period: '/tháng',
    popular: false,
    features: [
      'AI đầy đủ tính năng',
      'Đồng bộ trên mọi thiết bị',
      'Cộng tác nhóm',
      '5.000 lượt request AI',
    ],
    cta: 'Đăng ký Premium',
  },
]

const addons = [
  {
    name: 'Basic AI Credit',
    target: 'Người dùng hết quota AI',
    price: '30.000 đ',
    features: ['Thêm 3.000 lượt request AI'],
  },
  {
    name: 'Advanced AI Credit',
    target: 'Người dùng AI chuyên sâu',
    price: '50.000 đ',
    features: ['Thêm 3.500 lượt request AI', 'Sử dụng mô hình AI cao cấp khác'],
  },
]

function PricingSection({ onOpenDashboard }) {
  return (
    <section id="pricing" className="px-6 py-20 md:py-28 relative">
      <div className="mx-auto max-w-6xl">
        <RevealSection className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h2 className="text-3xl font-bold md:text-4xl">Bảng giá </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Lựa chọn gói cước phù hợp nhất với nhu cầu quản lý của bạn
          </p>
        </RevealSection>

        {/* 3 Main Plans */}
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <RevealSection key={plan.name} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className={`relative h-full flex flex-col rounded-3xl border p-8 transition-all duration-300 ${plan.popular ? 'pricing-popular glow-blue bg-[#0b0e14]' : 'glass-card'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[#8B5CF6] px-4 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(47,155,255,0.4)]">
                    Phổ biến nhất
                  </span>
                )}
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xl font-bold">{plan.name}</p>
                </div>
                <p className="text-sm font-medium text-primary mb-6">{plan.target}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onOpenDashboard}
                  className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all ${plan.popular
                    ? 'bg-primary text-primary-foreground hover:brightness-110 hover:shadow-[0_0_20px_rgba(47,155,255,0.3)]'
                    : 'bg-white/5 border border-white/10 text-foreground hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Add-ons Section */}
        <RevealSection className="mt-20">
          <div className="rounded-3xl border border-white/10 bg-[#080a10]/50 p-8 md:p-10 backdrop-blur-md">
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-2xl font-bold">Gói Mua Thêm (Add-ons)</h3>
              <p className="mt-2 text-sm text-muted-foreground">Mua thêm dung lượng AI Credit khi bạn cần sử dụng nhiều hơn giới hạn của gói.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {addons.map((addon) => (
                <div key={addon.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
                  <div>
                    <h4 className="font-bold text-white">{addon.name}</h4>
                    <p className="text-xs text-primary mt-1">{addon.target}</p>
                    <ul className="mt-3 space-y-1">
                      {addon.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Check className="h-3 w-3 text-accent" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t border-white/5 pt-4 sm:border-0 sm:pt-0">
                    <span className="text-xl font-bold text-white">{addon.price}</span>
                    <button onClick={onOpenDashboard} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 sm:mt-2">
                      Mua thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

      </div>
    </section>
  )
}

/* ── Footer ── */
const footerLinks = {
  Tabmark: ['Features', 'Pricing', 'Team & Doanh nghiệp'],
  Stack: ['React', 'Supabase', 'Vercel'],
  'Condition': ['About', 'Privacy', 'Blog'],
}

function Footer() {
  return (
    <footer className="footer-gradient border-t border-white/[0.06] px-6 pb-8 pt-16">
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

/* ── Main export ── */
export default function LandingPage({ onOpenDashboard }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onOpenDashboard={onOpenDashboard} />
      <HeroSection onOpenDashboard={onOpenDashboard} />
      <FeaturesSection />
      <PricingSection onOpenDashboard={onOpenDashboard} />
      <Footer />
    </div>
  )
}
