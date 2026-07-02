import { useEffect, useMemo, useState, useRef } from 'react'
import {
  BookmarkIcon,
  Brain,
  ChevronRight,
  ExternalLink,
  FolderPlus,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Download,
  X,
  Zap,
  LogOut,
  Send,
  Sparkles
} from 'lucide-react'
import Swal from 'sweetalert2'
import 'animate.css'
import {
  createCollection,
  createLink,
  deleteLink,
  fetchCollections,
  isSupabaseConfigured,
  updateLink,
  updateCollection,
  deleteCollection,
} from '@/src/lib/bookmarksApi'
import LandingPage from './LandingPage'
import WelcomeScreen from './WelcomeScreen'
import AuthScreen from './AuthScreen'
import Sidebar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'
import KanbanBoard from '@/components/dashboard/kanban-board'
import { supabase } from '@/src/lib/supabaseClient'

// Custom SweetAlert2 instance with dark mode and Animate.css animations
const animatedSwal = Swal.mixin({
  background: '#10141f',
  color: '#fff',
  customClass: {
    popup: 'border border-white/10 rounded-2xl',
    confirmButton: 'px-5 py-2 rounded-xl font-semibold',
    cancelButton: 'px-5 py-2 rounded-xl font-semibold'
  },
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
})

const STORAGE_KEY = 'tabmark.collections.v2'

const defaultCollections = [
  {
    id: 'default',
    name: 'Default',
    description: 'Dự án và tài liệu mặc định.',
    links: [
      { id: 'def1', title: 'My Storage', url: 'drive.google.com', icon: 'drive', tags: ['storage', 'google'], note: 'Google Drive storage' },
      { id: 'def2', title: 'SAIGON FOODS', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['work', 'data'], note: 'Bảng tính công việc' },
      { id: 'def3', title: 'DOCKER và KUBERNETES', url: 'docs.google.com/presentation', icon: 'slides', tags: ['devops', 'learning'], note: 'Slide đào tạo Docker & Kubernetes' },
      { id: 'def4', title: 'Tailwind CSS button collection', url: 'buttons.tailwind.co', icon: 'css', tags: ['design', 'css', 'tailwind'], note: 'Thư viện mẫu button Tailwind' },
      { id: 'def5', title: 'Watch and Rebuild Storybook', url: 'dev.to/storybook', icon: 'book', tags: ['dev', 'storybook'], note: 'Hướng dẫn tối ưu Storybook' },
      { id: 'def6', title: 'Componentix', url: 'docs.gray.land', icon: 'docs', tags: ['ui', 'docs'], note: 'Tài liệu UI Component' }
    ]
  },
  {
    id: 'redbean',
    name: 'Redbean',
    description: 'Dự án Redbean.',
    links: [
      { id: 'rb1', title: 'MEET', url: 'meet.google.com', icon: 'meet', tags: ['meeting', 'google'], note: 'Link họp dự án' },
      { id: 'rb2', title: 'Trello', url: 'trello.com', icon: 'trello', tags: ['management', 'task'], note: 'Bảng công việc Trello' },
      { id: 'rb3', title: 'FSD', url: 'drive.google.com', icon: 'drive', tags: ['docs', 'design'], note: 'Tài liệu thiết kế FSD' },
      { id: 'rb4', title: 'MASTER DATA', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['data', 'analytics'], note: 'Dữ liệu tổng hợp' },
      { id: 'rb5', title: 'TimeSheet', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['hr', 'timesheet'], note: 'Bảng chấm công' },
      { id: 'rb6', title: 'Master Plan', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['plan', 'project'], note: 'Kế hoạch tổng thể dự án' }
    ]
  },
  {
    id: 'digiin',
    name: 'Digiin',
    description: 'Dự án Digiin.',
    links: [
      { id: 'di1', title: 'MEET', url: 'meet.google.com', icon: 'meet', tags: ['meeting'], note: 'Họp định kỳ' },
      { id: 'di2', title: 'Trello', url: 'trello.com', icon: 'trello', tags: ['trello'], note: 'Quản lý task' },
      { id: 'di3', title: 'DBV - Mapping API', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['api', 'mapping'], note: 'Bảng ánh xạ API' },
      { id: 'di4', title: 'CarData', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['data'], note: 'Dữ liệu xe' },
      { id: 'di5', title: 'TimeSheet', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['hr'], note: 'Chấm công dự án' },
      { id: 'di6', title: 'DATABASE SCHEMA V1.3.2', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['database', 'schema'], note: 'Sơ đồ cơ sở dữ liệu' }
    ]
  },
  {
    id: 'cloudair',
    name: 'Cloudair',
    description: 'Dự án Cloudair.',
    links: [
      { id: 'ca1', title: 'GitLab', url: 'gitlab.com', icon: 'gitlab', tags: ['code', 'git'], note: 'Kho lưu trữ mã nguồn' },
      { id: 'ca2', title: 'Taiga', url: 'taiga.io', icon: 'taiga', tags: ['pm', 'scrum'], note: 'Quản lý dự án Agile' },
      { id: 'ca3', title: 'Jira', url: 'jira.com', icon: 'jira', tags: ['jira', 'task'], note: 'Theo dõi lỗi & công việc' },
      { id: 'ca4', title: 'Cloud Air Solution', url: 'cloud-air.com', icon: 'cloud', tags: ['website', 'solution'], note: 'Trang giải pháp Cloud' },
      { id: 'ca5', title: 'Pham Huu Loc - Timesheet', url: 'docs.google.com/spreadsheets', icon: 'sheets', tags: ['timesheet'], note: 'Bảng chấm công cá nhân' }
    ]
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Các công cụ hữu ích.',
    links: [
      { id: 'to1', title: 'Extension devconsole', url: 'chrome.google.com/webstore', icon: 'chrome', tags: ['chrome', 'extension'], note: 'Tiện ích nhà phát triển' },
      { id: 'to2', title: 'Tab Board', url: 'chromewebstore.google.com', icon: 'chrome', tags: ['extension', 'tabs'], note: 'Quản lý tab trình duyệt' },
      { id: 'to3', title: 'Quay video', url: 'caplet.com', icon: 'video', tags: ['media', 'record'], note: 'Công cụ quay màn hình' },
      { id: 'to4', title: 'Tra mã vận đơn SPX', url: 'spx.vn', icon: 'delivery', tags: ['shipping', 'spx'], note: 'Tra cứu đơn hàng Shopee Express' },
      { id: 'to5', title: 'Create voice', url: 'voicemaker.in', icon: 'voice', tags: ['ai', 'voice'], note: 'Chuyển văn bản thành giọng nói' },
      { id: 'to6', title: 'J2TEAM Security', url: 'chrome.google.com', icon: 'chrome', tags: ['security', 'extension'], note: 'Bảo mật tài khoản Facebook' }
    ]
  },
  {
    id: 'dev-tools',
    name: 'Dev - Tools',
    description: 'Công cụ hỗ trợ phát triển.',
    links: [
      { id: 'dt1', title: 'UI colors', url: 'uicolors.app/create', icon: 'color', tags: ['design', 'tailwind'], note: 'Tạo bảng màu Tailwind CSS' },
      { id: 'dt2', title: 'Search library', url: 'npmjs.com', icon: 'npm', tags: ['package', 'npm'], note: 'Tìm kiếm thư viện Node' },
      { id: 'dt3', title: 'Link VPS Giá rẻ', url: 'docs.google.com', icon: 'sheets', tags: ['hosting', 'vps'], note: 'Danh sách nhà cung cấp VPS' },
      { id: 'dt4', title: 'Tools for designers & developers', url: 'magicpattern.design', icon: 'design', tags: ['patterns', 'ui'], note: 'Tạo hình nền & họa tiết' },
      { id: 'dt5', title: 'Dev Tools', url: 'frontend-checklist.org', icon: 'checklist', tags: ['frontend', 'checklist'], note: 'Danh sách kiểm tra Frontend' },
      { id: 'dt6', title: 'DB schema designer', url: 'dbdiagram.io', icon: 'database', tags: ['database', 'diagram'], note: 'Vẽ sơ đồ quan hệ thực thể ERD' }
    ]
  },
  {
    id: 'dev-icons',
    name: 'Dev - Icons & logo',
    description: 'Bộ sưu tập icon & logo.',
    links: [
      { id: 'di_ic1', title: 'Lucide', url: 'lucide.dev/icons/', icon: 'lucide', tags: ['icons', 'svg'], note: 'Thư viện icon SVG tối giản' },
      { id: 'di_ic2', title: 'Iconer SVG icons', url: 'iconer.app/', icon: 'iconer', tags: ['icons', 'customize'], note: 'Tùy chỉnh & tải icon SVG' },
      { id: 'di_ic3', title: 'Heroicons SVG icons', url: 'heroicons.com/', icon: 'heroicons', tags: ['icons', 'tailwind'], note: 'Icon của tác giả Tailwind CSS' },
      { id: 'di_ic4', title: 'Essential SVG Icons', url: 'lineicons.com/icons/', icon: 'lineicons', tags: ['icons', 'outline'], note: 'Bộ icon đường nét hiện đại' },
      { id: 'di_ic5', title: 'Streamline Icons', url: 'streamlinehq.com/', icon: 'streamline', tags: ['icons', 'graphics'], note: 'Bộ sưu tập vector đồ sộ' },
      { id: 'di_ic6', title: 'Remix Icon', url: 'remixicon.com/', icon: 'remix', tags: ['icons', 'open-source'], note: 'Hơn 2000 icon mã nguồn mở' }
    ]
  },
  {
    id: 'dev-ui-ux',
    name: 'Dev - UI/UX',
    description: 'Cảm hứng thiết kế UI/UX.',
    links: [
      { id: 'duu1', title: 'Dribbble', url: 'dribbble.com/', icon: 'dribbble', tags: ['inspiration', 'design'], note: 'Cộng đồng designer chia sẻ sản phẩm' },
      { id: 'duu2', title: 'Behance', url: 'behance.net/', icon: 'behance', tags: ['portfolio', 'creative'], note: 'Nền tảng trưng bày portfolio sáng tạo' },
      { id: 'duu3', title: 'Collect UI', url: 'collectui.com/', icon: 'collectui', tags: ['ui', 'inspiration'], note: 'Mẫu thiết kế UI theo chủ đề' },
      { id: 'duu4', title: 'Calltoidea', url: 'calltoidea.com/', icon: 'calltoidea', tags: ['ideas', 'elements'], note: 'Cảm hứng thiết kế các thành phần UI' },
      { id: 'duu5', title: 'Recent Design', url: 'recentdesign.com/', icon: 'recent', tags: ['uiux', 'trends'], note: 'Xu hướng thiết kế mới nhất' },
      { id: 'duu6', title: 'Copy file hoặc folder từ Drive', url: 'gdrive.vip', icon: 'drive', tags: ['tool', 'gdrive'], note: 'Sao chép file Google Drive nhanh' }
    ]
  },
  {
    id: 'dev-css-animations',
    name: 'Dev - CSS Animations',
    description: 'Hiệu ứng chuyển động CSS.',
    links: [
      { id: 'dca1', title: 'Animated UI Components', url: 'lottiefiles.com/', icon: 'lottie', tags: ['animation', 'lottie'], note: 'Thư viện hoạt họa Lottie chất lượng cao' },
      { id: 'dca2', title: 'CSS Animations Library', url: 'animate.style/', icon: 'animate', tags: ['css', 'library'], note: 'Thư viện Animate.css ăn liền' },
      { id: 'dca3', title: 'Keyframes Animation', url: 'keyframes.app/animate', icon: 'keyframes', tags: ['keyframes', 'generator'], note: 'Tạo keyframes trực quan' },
      { id: 'dca4', title: 'Interactive SVG Animation', url: 'svgator.com/', icon: 'svg', tags: ['svg', 'editor'], note: 'Phần mềm làm hoạt hình SVG' },
      { id: 'dca5', title: 'TailwindCSS Buttons', url: 'tailwindcss-buttons.com', icon: 'tailwind', tags: ['css', 'buttons'], note: 'Nút bấm đẹp với Tailwind CSS' },
      { id: 'dca6', title: 'CSS Loaders', url: 'css-loaders.com/', icon: 'loader', tags: ['loaders', 'spinner'], note: 'Hơn 500 mẫu hiệu ứng loading CSS' }
    ]
  },
  {
    id: 'dev-css-generator',
    name: 'Dev - CSS generator',
    description: 'Trình tạo code CSS tự động.',
    links: [
      { id: 'dcg1', title: 'Low Poly Pattern Generator', url: 'trianglify.io/', icon: 'trianglify', tags: ['pattern', 'svg'], note: 'Tạo ảnh nền dạng lưới đa giác' },
      { id: 'dcg2', title: 'Gradients for Tailwind CSS', url: 'hypercolor.dev/', icon: 'gradient', tags: ['gradients', 'tailwind'], note: 'Bảng màu gradient tuyệt đẹp' },
      { id: 'dcg3', title: 'CSS shadow generator', url: 'neumorphism.io/', icon: 'neumorphism', tags: ['shadow', 'neumorphism'], note: 'Tạo đổ bóng phong cách Neumorphism' },
      { id: 'dcg4', title: 'Border Radius Generator', url: '9elements.github.io/fancy-border-radius/', icon: 'border', tags: ['border', 'css'], note: 'Bo góc hình dạng bất quy tắc' },
      { id: 'dcg5', title: 'Gradient Generator', url: 'cssgradient.io/', icon: 'gradient', tags: ['gradients', 'css'], note: 'Thiết kế dải màu chuyển tiếp' },
      { id: 'dcg6', title: 'Create SVG waves', url: 'getwaves.io/', icon: 'waves', tags: ['waves', 'svg'], note: 'Tạo sóng SVG trang trí' }
    ]
  },
  {
    id: 'dev-ai',
    name: 'Dev - AI',
    description: 'Công cụ trí tuệ nhân tạo.',
    links: [
      { id: 'dai1', title: 'ChatGPT', url: 'chatgpt.com/', icon: 'chatgpt', tags: ['ai', 'chatbot'], note: 'Mô hình AI của OpenAI' },
      { id: 'dai2', title: 'Claude AI', url: 'claude.ai/', icon: 'claude', tags: ['ai', 'anthropic'], note: 'Mô hình trợ lý AI Claude' },
      { id: 'dai3', title: 'Gemini AI', url: 'gemini.google.com/', icon: 'gemini', tags: ['ai', 'google'], note: 'AI thế hệ mới của Google' },
      { id: 'dai4', title: 'Midjourney', url: 'midjourney.com/', icon: 'midjourney', tags: ['ai', 'images'], note: 'Trình tạo ảnh nghệ thuật từ văn bản' }
    ]
  },
  {
    id: 'shadcn',
    name: 'Shadcn',
    description: 'Thư viện UI Shadcn.',
    links: [
      { id: 'sh1', title: 'shadcn/ui', url: 'ui.shadcn.com/', icon: 'shadcn', tags: ['components', 'react', 'tailwind'], note: 'Bộ UI component đẹp mắt & tái sử dụng' }
    ]
  }
]

const emptyCollection = {
  name: '',
  description: '',
}

const emptyLink = {
  title: '',
  url: '',
  icon: '',
  tags: '',
  note: '',
  status: 'todo',
  time: '5 min',
}

function createId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadStoredCollections() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.some(c => c.id === 'default')) {
        return parsed
      }
    }
    return defaultCollections
  } catch {
    return defaultCollections
  }
}

function normalizeUrl(url) {
  if (!url) return '#'
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}




function CollectionModal({ onClose, onSave }) {
  const [form, setForm] = useState(emptyCollection)

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <Modal title="Create collection" subtitle="Tạo một bộ bookmark mới." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="EXE101 Research" autoFocus />
        <TextField label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="Link tham khảo cho môn học" />
        <FormActions onClose={onClose} submitLabel="Create collection" />
      </form>
    </Modal>
  )
}

function LinkModal({ mode, initialValues, onClose, onSave }) {
  const [form, setForm] = useState(initialValues ?? emptyLink)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    const url = form.url.trim()
    if (!title || !url) return

    onSave({
      title,
      url,
      icon: form.icon.trim() || title.slice(0, 2).toUpperCase(),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      note: form.note.trim(),
    })
  }

  return (
    <Modal title={mode === 'edit' ? 'Edit link' : 'Add link'} subtitle={isSupabaseConfigured ? 'Lưu vào Supabase database.' : 'Chưa cấu hình Supabase, tạm lưu localStorage.'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField label="Title" value={form.title} onChange={(value) => updateField('title', value)} placeholder="React Docs" autoFocus />
        <TextField label="URL" value={form.url} onChange={(value) => updateField('url', value)} placeholder="https://react.dev" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Icon" value={form.icon} onChange={(value) => updateField('icon', value)} placeholder="RE" />
          <TextField label="Tags" value={form.tags} onChange={(value) => updateField('tags', value)} placeholder="react, docs" />
        </div>
        <TextField label="Note" value={form.note} onChange={(value) => updateField('note', value)} placeholder="Ghi chú ngắn về link này" />
        <FormActions onClose={onClose} submitLabel={mode === 'edit' ? 'Save changes' : 'Add link'} />
      </form>
    </Modal>
  )
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </>
  )
}

function TextField({ label, value, onChange, placeholder, autoFocus = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </label>
  )
}

function FormActions({ onClose, submitLabel }) {
  return (
    <div className="flex justify-end gap-3 border-t border-border pt-4">
      <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
        Cancel
      </button>
      <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        {submitLabel}
      </button>
    </div>
  )
}

function DashboardPage({ onBackHome, user, onLogout }) {
  const [collections, setCollections] = useState(loadStoredCollections)
  const [activeCollectionId, setActiveCollectionId] = useState(() => loadStoredCollections()[0]?.id)
  const [highlightedColumnId, setHighlightedColumnId] = useState(null)
  const [query, setQuery] = useState('')
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('')
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [linkEditor, setLinkEditor] = useState(null)
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'Connecting Supabase...' : 'Local mode')

  // Undo delete and Toast states
  const [toast, setToast] = useState(null)
  const [recentlyDeletedCollection, setRecentlyDeletedCollection] = useState(null)

  // AI Chat states
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: 'Xin chào! Tôi là Tabmark AI. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể yêu cầu tôi tóm tắt các bookmark trong nhóm này hoặc tìm kiếm bookmark bất kỳ!' }
  ])
  const [aiChatInput, setAiChatInput] = useState('')
  const [isAiResponding, setIsAiResponding] = useState(false)
  const chatEndRef = useRef(null)

  // Auto dismiss Toast
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
      setRecentlyDeletedCollection(null)
    }, 8000)
    return () => clearTimeout(timer)
  }, [toast])

  // Listen for Ctrl+Z / Cmd+Z
  useEffect(() => {
    function handleKeyDown(e) {
      const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if ((e.ctrlKey || e.metaKey) && e.key?.toLowerCase() === 'z' && !isInputActive) {
        e.preventDefault()
        handleUndoDelete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recentlyDeletedCollection])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiChatMessages, aiChatOpen])

  useEffect(() => {
    let ignore = false

    async function loadCollections() {
      if (!isSupabaseConfigured) return

      try {
        const cloudCollections = await fetchCollections()
        if (!ignore) {
          if (cloudCollections && cloudCollections.length > 0) {
            setCollections(cloudCollections)
            setActiveCollectionId(cloudCollections[0]?.id)
            setSyncStatus('Synced with Supabase')
          } else {
            // Database is empty, seed with new default collections to have valid UUIDs
            setSyncStatus('Seeding default collections to Supabase...')
            const seeded = []
            for (const col of defaultCollections) {
              const savedCol = await createCollection({
                name: col.name,
                description: col.description || ''
              })
              const savedLinks = []
              if (col.links && col.links.length > 0) {
                for (let i = 0; i < col.links.length; i++) {
                  const link = col.links[i]
                  const savedLink = await createLink({
                    title: link.title,
                    url: link.url,
                    icon: link.icon || link.title.slice(0, 2).toUpperCase(),
                    tags: link.tags || [],
                    note: link.note || '',
                    status: link.status || 'todo',
                    time: link.time || '5 min'
                  }, savedCol.id, i)
                  savedLinks.push(savedLink)
                }
              }
              seeded.push({
                ...savedCol,
                links: savedLinks
              })
            }
            setCollections(seeded)
            if (seeded.length > 0) {
              setActiveCollectionId(seeded[0].id)
            }
            setSyncStatus('Database seeded and synced')
          }
        }
      } catch (error) {
        console.error(error)
        if (!ignore) setSyncStatus(error.message ?? 'Supabase error, using local data')
      }
    }

    loadCollections()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
  }, [collections])

  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) ?? collections[0]
  
  // Filter links in each collection column dynamically based on search keyword
  const filteredCollections = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return collections

    return collections.map((col) => {
      const filtered = (col.links || []).filter((link) => {
        const searchable = `${link.title} ${link.url} ${(link.tags || []).join(' ')} ${link.note}`.toLowerCase()
        return searchable.includes(keyword)
      })
      return { ...col, links: filtered }
    })
  }, [collections, query])

  // Count total links for description
  const totalFilteredLinksCount = useMemo(() => {
    return filteredCollections.reduce((acc, col) => acc + (col.links?.length || 0), 0)
  }, [filteredCollections])

  const handleSelectCollection = (id) => {
    setActiveCollectionId(id)
    setHighlightedColumnId(id)
    // Clear highlight after 2.5 seconds
    setTimeout(() => {
      setHighlightedColumnId(prev => prev === id ? null : prev)
    }, 2500)
  }

  function handleOpenAddLinkModal(colId = null) {
    setLinkEditor({
      mode: 'add',
      link: null,
      collectionId: colId || activeCollectionId
    })
  }

  async function handleCreateCollection(collection) {
    const localCollection = {
      id: createId(),
      ...collection,
      links: [],
    }

    if (isSupabaseConfigured) {
      try {
        const savedCollection = await createCollection(collection)
        localCollection.id = savedCollection.id
        setSyncStatus('Collection saved to Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus(error.message ?? 'Collection save failed')
      }
    }

    setCollections((current) => [...current, localCollection])
    setActiveCollectionId(localCollection.id)
    setCollectionModalOpen(false)
  }

  async function handleEditGroup(collectionId) {
    const group = collections.find(c => c.id === collectionId)
    if (!group) return
    const newName = prompt('Enter a new name for the group:', group.name)
    if (!newName || !newName.trim() || newName.trim() === group.name) return

    const updated = { ...group, name: newName.trim() }

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Updating collection in Supabase...')
        await updateCollection(collectionId, updated)
        setSyncStatus('Collection updated in Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to update collection in Supabase')
      }
    }

    setCollections(current => current.map(c => c.id === collectionId ? updated : c))
  }

  async function handleDeleteGroup(collectionId) {
    const group = collections.find(c => c.id === collectionId)
    if (!group) return
    
    const result = await animatedSwal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the group "${group.name}" and all its bookmarks?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!'
    })
    
    if (!result.isConfirmed) return

    const index = collections.findIndex(c => c.id === collectionId)
    setRecentlyDeletedCollection({
      collection: group,
      index: index
    })

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Deleting collection in Supabase...')
        await deleteCollection(collectionId)
        setSyncStatus('Collection deleted from Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to delete collection in Supabase')
      }
    }

    setCollections(current => current.filter(c => c.id !== collectionId))
    if (activeCollectionId === collectionId) {
      setActiveCollectionId(collections.find(c => c.id !== collectionId)?.id || null)
    }

    setToast({
      message: `Deleted group "${group.name}"`
    })
  }

  async function handleUndoDelete() {
    if (!recentlyDeletedCollection) return

    const { collection, index } = recentlyDeletedCollection
    setRecentlyDeletedCollection(null)
    setToast(null)

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Restoring collection in Supabase...')
        const restoredCol = await createCollection({
          name: collection.name,
          description: collection.description
        })
        
        const restoredLinks = []
        if (collection.links && collection.links.length > 0) {
          for (let i = 0; i < collection.links.length; i++) {
            const link = collection.links[i]
            const savedLink = await createLink({
              title: link.title,
              url: link.url,
              icon: link.icon,
              tags: link.tags,
              note: link.note,
              status: link.status || 'todo',
              time: link.time || '5 min'
            }, restoredCol.id, i)
            restoredLinks.push(savedLink)
          }
        }
        
        const finalRestored = {
          ...restoredCol,
          links: restoredLinks
        }

        setCollections(current => {
          const updated = [...current]
          updated.splice(index, 0, finalRestored)
          return updated
        })
        setActiveCollectionId(finalRestored.id)
        setSyncStatus('Collection restored in Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to restore collection')
      }
    } else {
      setCollections(current => {
        const updated = [...current]
        updated.splice(index, 0, collection)
        return updated
      })
      setActiveCollectionId(collection.id)
      setSyncStatus('Collection restored')
    }
  }

  async function handleDuplicateGroup(collectionId) {
    const group = collections.find(c => c.id === collectionId)
    if (!group) return

    const newGroupId = createId()
    const duplicatedCollection = {
      id: newGroupId,
      name: `${group.name} (Copy)`,
      description: group.description || '',
      links: (group.links || []).map(link => ({
        ...link,
        id: createId()
      }))
    }

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Duplicating group in Supabase...')
        const savedCollection = await createCollection({
          name: duplicatedCollection.name,
          description: duplicatedCollection.description
        })
        
        const savedLinks = []
        if (duplicatedCollection.links && duplicatedCollection.links.length > 0) {
          for (let i = 0; i < duplicatedCollection.links.length; i++) {
            const link = duplicatedCollection.links[i]
            const savedLink = await createLink({
              title: link.title,
              url: link.url,
              icon: link.icon,
              tags: link.tags,
              note: link.note,
              status: link.status || 'todo',
              time: link.time || '5 min'
            }, savedCollection.id, i)
            savedLinks.push(savedLink)
          }
        }
        
        duplicatedCollection.id = savedCollection.id
        duplicatedCollection.links = savedLinks
        setSyncStatus('Group duplicated in Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to duplicate group')
      }
    }

    setCollections(current => {
      const index = current.findIndex(c => c.id === collectionId)
      const updated = [...current]
      updated.splice(index + 1, 0, duplicatedCollection)
      return updated
    })
    setActiveCollectionId(duplicatedCollection.id)
  }

  async function handleSaveLink(link) {
    const targetCollectionId = linkEditor?.collectionId || activeCollectionId
    const targetCol = collections.find(c => c.id === targetCollectionId)
    if (!targetCol) return

    if (linkEditor?.mode === 'edit') {
      const updatedLink = {
        ...link,
        id: linkEditor.link.id,
        status: linkEditor.link.status || 'todo',
        time: linkEditor.link.time || '5 min'
      }

      if (isSupabaseConfigured) {
        try {
          await updateLink(updatedLink.id, updatedLink)
          setSyncStatus('Link updated in Supabase')
        } catch (error) {
          console.error(error)
          setSyncStatus(error.message ?? 'Link update failed')
        }
      }

      setCollections((current) => current.map((collection) => (
        collection.id === targetCollectionId
          ? { ...collection, links: collection.links.map((item) => item.id === updatedLink.id ? updatedLink : item) }
          : collection
      )))
    } else {
      const newLink = {
        ...link,
        id: createId(),
        status: 'todo',
        time: '5 min'
      }

      if (isSupabaseConfigured) {
        try {
          const savedLink = await createLink(newLink, targetCollectionId, targetCol.links.length)
          newLink.id = savedLink.id
          setSyncStatus('Link saved to Supabase')
        } catch (error) {
          console.error(error)
          setSyncStatus(error.message ?? 'Link save failed')
        }
      }

      setCollections((current) => current.map((collection) => (
        collection.id === targetCollectionId
          ? { ...collection, links: [newLink, ...collection.links] }
          : collection
      )))
    }

    setLinkEditor(null)
  }

  async function handleDeleteLink(linkId) {
    if (isSupabaseConfigured) {
      try {
        await deleteLink(linkId)
        setSyncStatus('Link deleted from Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus(error.message ?? 'Link delete failed')
      }
    }

    setCollections((current) => current.map((collection) => ({
      ...collection,
      links: collection.links.filter((link) => link.id !== linkId)
    })))
  }

  async function handleDuplicateLink(link) {
    const parentCollection = collections.find(c => c.links.some(l => l.id === link.id))
    if (!parentCollection) return

    const duplicatedLink = {
      ...link,
      id: createId(),
      title: `${link.title} (Copy)`,
    }

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Duplicating in Supabase...')
        const savedLink = await createLink(duplicatedLink, parentCollection.id, parentCollection.links.length)
        duplicatedLink.id = savedLink.id
        setSyncStatus('Link duplicated in Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to duplicate link in Supabase')
      }
    }

    setCollections((current) => current.map((collection) => (
      collection.id === parentCollection.id
        ? { ...collection, links: [duplicatedLink, ...collection.links] }
        : collection
    )))
  }

  // Drag and Drop support
  function handleDragStart(e, cardId, fromCollectionId) {
    e.dataTransfer.setData('cardId', cardId)
    e.dataTransfer.setData('fromCollectionId', fromCollectionId)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  async function handleDrop(e, toCollectionId) {
    const cardId = e.dataTransfer.getData('cardId')
    const fromCollectionId = e.dataTransfer.getData('fromCollectionId')
    
    if (!cardId || !fromCollectionId || fromCollectionId === toCollectionId) return

    const sourceCol = collections.find(c => c.id === fromCollectionId)
    const targetCol = collections.find(c => c.id === toCollectionId)
    if (!sourceCol || !targetCol) return

    const linkToUpdate = sourceCol.links.find(l => l.id === cardId)
    if (!linkToUpdate) return

    // Optimistic Update State
    setCollections(current => current.map(col => {
      if (col.id === fromCollectionId) {
        return {
          ...col,
          links: col.links.filter(l => l.id !== cardId)
        }
      }
      if (col.id === toCollectionId) {
        return {
          ...col,
          links: [linkToUpdate, ...col.links]
        }
      }
      return col
    }))

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Moving link in Supabase...')
        await updateLink(cardId, {
          ...linkToUpdate,
          collection_id: toCollectionId
        })
        setSyncStatus('Link moved in Supabase')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to move link in Supabase')
      }
    }
  }

  function handleReorderCollections(draggedId, targetId) {
    setCollections(current => {
      const fromIndex = current.findIndex(c => c.id === draggedId)
      const toIndex = current.findIndex(c => c.id === targetId)
      if (fromIndex === -1 || toIndex === -1) return current

      const updated = [...current]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }

  // Export/Import/Sync Action Triggers
  function handleExport() {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(collections, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href",     dataStr)
      downloadAnchor.setAttribute("download", `tabmark_backup_${new Date().toISOString().slice(0,10)}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setSyncStatus('Backup exported')
    } catch (err) {
      console.error(err)
      animatedSwal.fire({
        title: 'Export Failed',
        text: err.message,
        icon: 'error'
      })
    }
  }

  // Import Action
  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = async (readerEvent) => {
        try {
          const imported = JSON.parse(readerEvent.target.result)
          if (Array.isArray(imported)) {
            setCollections(imported)
            setSyncStatus('Backup imported successfully')
          } else {
            animatedSwal.fire({
              title: 'Invalid Format',
              text: 'The backup file is not in the correct format. It should be a list of groups.',
              icon: 'error'
            })
          }
        } catch (err) {
          animatedSwal.fire({
            title: 'Import Failed',
            text: err.message,
            icon: 'error'
          })
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  async function handleSync() {
    if (!isSupabaseConfigured) {
      setSyncStatus('Sync: Local mode, not connected to Supabase')
      return
    }
    try {
      setSyncStatus('Syncing with Supabase...')
      const cloudCollections = await fetchCollections()
      if (cloudCollections && cloudCollections.length > 0) {
        setCollections(cloudCollections)
        setSyncStatus('Synced with Supabase')
      }
    } catch (error) {
      console.error(error)
      setSyncStatus(error.message ?? 'Sync failed')
    }
  }

  // AI Chat Submission
  function handleSendAiMessage(e) {
    e.preventDefault()
    if (!aiChatInput.trim()) return

    const userQuery = aiChatInput.trim()
    const newMessages = [...aiChatMessages, { sender: 'user', text: userQuery }]
    setAiChatMessages(newMessages)
    setAiChatInput('')
    setIsAiResponding(true)

    setTimeout(() => {
      let responseText = ''
      const queryLower = userQuery.toLowerCase()

      if (queryLower.includes('tóm tắt') || queryLower.includes('summarize')) {
        const linksCount = activeCollection?.links?.length || 0
        if (linksCount === 0) {
          responseText = `Bộ sưu tập "${activeCollection?.name}" hiện tại chưa có bookmark nào để tóm tắt.`
        } else {
          responseText = `Dưới đây là tóm tắt nhanh các bookmark trong nhóm **${activeCollection.name}**:\n\n`
          activeCollection.links.slice(0, 5).forEach((link, idx) => {
            responseText += `${idx + 1}. **${link.title}** (${link.url})\n   👉 *${link.note || 'Không có mô tả.'}*\n\n`
          })
          if (linksCount > 5) {
            responseText += `*Và ${linksCount - 5} bookmark khác...*`
          }
        }
      } else if (queryLower.includes('tìm') || queryLower.includes('search') || queryLower.includes('find')) {
        const searchTerm = queryLower.replace(/tìm kiếm|tìm|search|find/g, '').trim()
        if (!searchTerm) {
          responseText = 'Bạn muốn tìm kiếm từ khóa nào? Hãy nhập ví dụ: "Tìm React".'
        } else {
          const found = []
          collections.forEach(col => {
            (col.links || []).forEach(link => {
              if (link.title.toLowerCase().includes(searchTerm) || link.url.toLowerCase().includes(searchTerm)) {
                found.push({ ...link, colName: col.name })
              }
            })
          })
          if (found.length === 0) {
            responseText = `Không tìm thấy bookmark nào liên quan đến từ khóa **"${searchTerm}"**.`
          } else {
            responseText = `Tìm thấy **${found.length}** liên kết liên quan đến **"${searchTerm}"**:\n\n`
            found.forEach((link, idx) => {
              responseText += `${idx + 1}. **${link.title}** (${link.url}) - trong nhóm *${link.colName}*\n`
            })
          }
        }
      } else if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('chào')) {
        responseText = 'Xin chào! Tôi có thể giúp gì cho bạn? Hãy thử gõ: **"Tóm tắt các link"** hoặc **"Tìm React"**.'
      } else {
        responseText = 'Tôi là Tabmark AI. Tôi có thể:\n- 📝 **Tóm tắt** các bookmark hiện tại (gõ "tóm tắt")\n- 🔍 **Tìm kiếm** link trong hệ thống (gõ "tìm [từ khóa]")\n- 🤖 Giải đáp thắc mắc của bạn về bộ sưu tập link.'
      }

      setAiChatMessages(prev => [...prev, { sender: 'ai', text: responseText }])
      setIsAiResponding(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        collections={collections}
        activeCollectionId={activeCollection?.id}
        onSelectCollection={handleSelectCollection}
        searchQuery={sidebarSearchQuery}
        onSearchChange={setSidebarSearchQuery}
        onAIChatToggle={() => setAiChatOpen(!aiChatOpen)}
        user={user}
        onSettingsClick={() => animatedSwal.fire({
          title: 'Coming Soon',
          text: 'Settings and configuration interface is being updated!',
          icon: 'info'
        })}
        onLogout={onLogout}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Component */}
        <DashboardHeader
          query={query}
          onQueryChange={setQuery}
          onAddGroup={() => setCollectionModalOpen(true)}
          onAddLink={() => handleOpenAddLinkModal()}
          onExport={handleExport}
          onImport={handleImport}
          onSync={handleSync}
          syncStatus={syncStatus}
          isCloudEnabled={isSupabaseConfigured}
        />

        {/* Kanban Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#080a10]">
          {/* Active Group Description Header */}
          <div className="px-6 pt-5 pb-1 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">{activeCollection?.name ?? 'No group'}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{activeCollection?.description || 'Thêm link vào bảng Kanban này.'}</p>
            </div>
            <div className="text-[10px] font-bold text-slate-500 bg-white/[0.02] border border-white/5 px-3 py-1 rounded-full">
              {totalFilteredLinksCount} links
            </div>
          </div>

          {/* Kanban Board Component */}
          <KanbanBoard
            collections={filteredCollections}
            activeCollectionId={activeCollection?.id}
            highlightedColumnId={highlightedColumnId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEdit={(card) => {
              const containingCol = collections.find(c => c.links.some(l => l.id === card.id))
              setLinkEditor({ mode: 'edit', link: card, collectionId: containingCol?.id })
            }}
            onDelete={handleDeleteLink}
            onDuplicate={handleDuplicateLink}
            onAddLink={handleOpenAddLinkModal}
            onEditGroup={handleEditGroup}
            onDeleteGroup={handleDeleteGroup}
            onDuplicateGroup={handleDuplicateGroup}
            onReorderCollections={handleReorderCollections}
          />
        </main>
      </div>

      {/* Right AI Chat Sidebar Drawer */}
      {aiChatOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setAiChatOpen(false)} />
          
          {/* Drawer Content */}
          <div className="relative w-96 max-w-full bg-[#0c0f16] border-l border-white/5 shadow-2xl flex flex-col h-full z-10 animate-fade-in-up">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400/10" />
                <div>
                  <h3 className="font-bold text-sm text-white">AI Assistant</h3>
                  <p className="text-[10px] text-slate-500">Hỏi đáp về các bookmark của bạn</p>
                </div>
              </div>
              <button
                onClick={() => setAiChatOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                        : 'bg-white/[0.03] border border-white/5 text-slate-300 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiResponding && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 text-slate-300 rounded-2xl rounded-bl-none p-3.5 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendAiMessage} className="p-4 border-t border-white/5 bg-[#090b11]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  placeholder="Gõ 'tóm tắt' hoặc đặt câu hỏi..."
                  className="flex-1 px-3.5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!aiChatInput.trim()}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {collectionModalOpen && (
        <CollectionModal onClose={() => setCollectionModalOpen(false)} onSave={handleCreateCollection} />
      )}
      {linkEditor && (
        <LinkModal
          mode={linkEditor.mode}
          initialValues={linkEditor.link ? { ...linkEditor.link, tags: linkEditor.link.tags.join(', ') } : emptyLink}
          onClose={() => setLinkEditor(null)}
          onSave={handleSaveLink}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-4 px-4 py-3 bg-[#10141f]/95 border border-blue-500/30 rounded-xl shadow-2xl glass-card animate-fade-in-up max-w-sm w-full mx-4">
          <span className="text-xs text-white font-medium">{toast.message}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUndoDelete}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              Undo
            </button>
            <button
              onClick={() => { setToast(null); setRecentlyDeletedCollection(null); }}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState(() => window.location.hash === '#dashboard' ? 'dashboard' : 'home')
  const [showWelcome, setShowWelcome] = useState(() => window.location.hash !== '#dashboard')
  const [user, setUser] = useState(null)

  // Restore session
  useEffect(() => {
    if (isSupabaseConfigured) {
      // Restore from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          setPage('dashboard')
        }
      })

      return () => subscription.unsubscribe()
    } else {
      // Restore from local storage for mock user
      try {
        const saved = localStorage.getItem('tabmark_mock_user')
        if (saved) {
          setUser(JSON.parse(saved))
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  function goToDashboard() {
    if (user) {
      window.history.replaceState(null, '', '#dashboard')
      setPage('dashboard')
    } else {
      setPage('login')
    }
  }

  function goHome() {
    window.history.replaceState(null, '', window.location.pathname)
    setPage('home')
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
    if (loggedInUser.isMock) {
      localStorage.setItem('tabmark_mock_user', JSON.stringify(loggedInUser))
    }
    window.history.replaceState(null, '', '#dashboard')
    setPage('dashboard')
  }

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('tabmark_mock_user')
      setUser(null)
    }
    window.history.replaceState(null, '', window.location.pathname)
    setPage('home')
  }

  return (
    <>
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
      
      {page === 'login' ? (
        <AuthScreen onLogin={handleLogin} onBackHome={goHome} />
      ) : page === 'dashboard' ? (
        user ? (
          <DashboardPage onBackHome={goHome} user={user} onLogout={handleLogout} />
        ) : (
          <AuthScreen onLogin={handleLogin} onBackHome={goHome} />
        )
      ) : (
        <LandingPage onOpenDashboard={goToDashboard} />
      )}
    </>
  )
}
