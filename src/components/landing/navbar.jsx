import { useState, useEffect } from 'react'
import { X, Menu } from 'lucide-react'

export function Navbar({ onOpenDashboard, onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Luôn khóa chế độ Dark Mode chuẩn
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

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

  const navLinks = [
    { href: "#features", text: "Tính năng" },
    { href: "#pricing", text: "Bảng giá" },
    { href: "#contact", text: "Liên hệ" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe ${
        isScrolled || isMenuOpen
          ? 'bg-[#06080f]/98 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.9)]' 
          : 'bg-[#06080f]/80 backdrop-blur-md md:bg-transparent border-b border-white/[0.04] md:border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-14 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center group cursor-pointer" onClick={onOpenDashboard}>
              <img 
                src="/tabmark-logo-white.png" 
                alt="TabMark Logo" 
                className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.text} 
                href={link.href} 
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group py-1"
              >
                {link.text}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={onLoginClick}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2 cursor-pointer"
            >
              Đăng nhập
            </button>
            <button 
              onClick={onOpenDashboard}
              className="px-5 py-2 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] rounded-full transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Dùng thử miễn phí
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-gray-300 hover:bg-white/10 rounded-md transition-colors"
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
              <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false)
                    onLoginClick()
                  }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10 cursor-pointer"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false)
                    onOpenDashboard()
                  }}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl transition-all hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer"
                >
                  Bắt đầu miễn phí
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
