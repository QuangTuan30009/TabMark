import { useState, useEffect, useMemo } from 'react'
import {
  createCollection,
  createLink,
  deleteLink,
  fetchCollections,
  fetchSharedCollection,
  updateCollectionShareMode,
  isSupabaseConfigured,
  updateLink,
  updateCollection,
  deleteCollection,
} from '@/src/lib/bookmarksApi'
import { supabase } from '@/src/lib/supabaseClient'

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

export function createId() {
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

export function useCollections({ animatedSwal, user, sharedCollectionId }) {
  const [collections, setCollections] = useState(loadStoredCollections)
  const [activeCollectionId, setActiveCollectionId] = useState(() => sharedCollectionId || loadStoredCollections()[0]?.id)
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'Connecting Supabase...' : 'Local mode')
  const [toast, setToast] = useState(null)
  const [recentlyDeletedCollection, setRecentlyDeletedCollection] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadCollections() {
      if (!isSupabaseConfigured) return

      try {
        let cloudCollections = []
        if (sharedCollectionId) {
          // Chỉ tải collection được share
          const sharedCol = await fetchSharedCollection(sharedCollectionId)
          if (sharedCol) {
            cloudCollections = [sharedCol]
          }
        } else if (user) {
          // Tải danh sách collection của user
          cloudCollections = await fetchCollections(user.id)
        } else {
          // Không có user, không có shared -> không làm gì
          return
        }
        
        if (!ignore) {
          if (cloudCollections && cloudCollections.length > 0) {
            setCollections(cloudCollections)
            setActiveCollectionId(sharedCollectionId || cloudCollections[0]?.id)
            setSyncStatus(sharedCollectionId ? 'Viewing shared collection' : 'Synced with Supabase')
          } else if (sharedCollectionId) {
            setCollections([])
            setActiveCollectionId(null)
            setSyncStatus('Shared collection not found or access denied')
          } else if (user) {
            setCollections([])
            setActiveCollectionId(null)
            setSyncStatus('Synced with Supabase')
          }
        }
      } catch (error) {
        console.error(error)
        if (!ignore) setSyncStatus(error.message ?? 'Supabase error, using local data')
      }
    }

    loadCollections()

    // --- SETUP REALTIME SUBSCRIPTIONS ---
    let channel = null
    if (isSupabaseConfigured) {
      channel = supabase.channel('realtime_collections_links')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmark_links' }, (payload) => {
          // Thay vì tự merge thủ công, cách an toàn nhất là gọi lại loadCollections()
          // Nhưng loadCollections có thể chậm, thay vào đó ta có thể cập nhật cục bộ nếu cần
          loadCollections()
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmark_collections' }, (payload) => {
          loadCollections()
        })
        .subscribe()
    }

    return () => {
      ignore = true
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [user, sharedCollectionId])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
  }, [collections])

  const activeCollection = useMemo(() => {
    return collections.find((collection) => collection.id === activeCollectionId) ?? collections[0]
  }, [collections, activeCollectionId])

  async function handleCreateCollection(collection, callback) {
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
    if (callback) callback()
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

  async function handleUpdateShareMode(collectionId, shareMode) {
    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Updating share settings...')
        await updateCollectionShareMode(collectionId, shareMode)
        setSyncStatus('Share settings updated')
      } catch (error) {
        console.error(error)
        setSyncStatus('Failed to update share settings')
      }
    }

    setCollections(current => current.map(c => 
      c.id === collectionId ? { ...c, shareMode } : c
    ))
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

  async function handleSaveLink(link, linkEditorMode, linkEditorLinkId, targetCollectionId, callback) {
    const targetCol = collections.find(c => c.id === targetCollectionId)
    if (!targetCol) return

    if (linkEditorMode === 'edit') {
      const updatedLink = {
        ...link,
        id: linkEditorLinkId,
        status: link.status || 'todo',
        time: link.time || '5 min'
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

    if (callback) callback()
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

  async function handleDrop(e, toCollectionId) {
    const cardId = e.dataTransfer.getData('cardId')
    const fromCollectionId = e.dataTransfer.getData('fromCollectionId')
    
    if (!cardId || !fromCollectionId || fromCollectionId === toCollectionId) return

    const sourceCol = collections.find(c => c.id === fromCollectionId)
    const targetCol = collections.find(c => c.id === toCollectionId)
    if (!sourceCol || !targetCol) return

    const linkToUpdate = sourceCol.links.find(l => l.id === cardId)
    if (!linkToUpdate) return

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

  function handleExport() {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(collections, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
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

  return {
    collections,
    activeCollection,
    activeCollectionId,
    setActiveCollectionId,
    syncStatus,
    toast,
    setToast,
    recentlyDeletedCollection,
    setRecentlyDeletedCollection,
    handleCreateCollection,
    handleEditGroup,
    handleDeleteGroup,
    handleUndoDelete,
    handleDuplicateGroup,
    handleSaveLink,
    handleDeleteLink,
    handleDuplicateLink,
    handleDrop,
    handleReorderCollections,
    handleExport,
    handleImport,
    handleSync,
    handleUpdateShareMode
  }
}
