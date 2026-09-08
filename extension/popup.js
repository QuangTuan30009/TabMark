// Supabase Config
const SUPABASE_URL = 'https://onhaqbjipydrdkwteufv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_GbttFoFdk7_dz3DbUd1zCA_Fnsu0wsa'

// Default fallback collections matching the TabMark Web App
const DEFAULT_COLLECTIONS = [
  { id: 'default', name: 'Default' },
  { id: 'redbean', name: 'Redbean' },
  { id: 'digiin', name: 'Digiin' },
  { id: 'cloudair', name: 'Cloudair' },
  { id: 'tools', name: 'Tools' },
  { id: 'dev-tools', name: 'Dev - Tools' },
  { id: 'dev-icons', name: 'Dev - Icons & logo' },
  { id: 'dev-ui-ux', name: 'Dev - UI/UX' },
  { id: 'dev-css-animations', name: 'Dev - CSS Animations' },
  { id: 'dev-css-generator', name: 'Dev - CSS generator' },
  { id: 'dev-ai', name: 'Dev - AI' },
  { id: 'shadcn', name: 'Shadcn' }
]

async function getAuthSession() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const data = await new Promise(resolve => {
      chrome.storage.local.get(['tabmark_auth_session'], resolve)
    })
    return data.tabmark_auth_session || null
  }
  return null
}

document.addEventListener('DOMContentLoaded', async () => {
  const collectionSelect = document.getElementById('collection-select')
  const pageTitleInput = document.getElementById('page-title')
  const pageUrlInput = document.getElementById('page-url')
  const pageFavicon = document.getElementById('page-favicon')
  const pageTagsInput = document.getElementById('page-tags')
  const pageNoteInput = document.getElementById('page-note')
  const btnSave = document.getElementById('btn-save')
  const formSection = document.getElementById('form-section')
  const successSection = document.getElementById('success-section')
  const savedTargetText = document.getElementById('saved-target-text')
  const btnClosePopup = document.getElementById('btn-close-popup')
  const tagChips = document.querySelectorAll('.tag-chip')
  const authStatusBadge = document.getElementById('auth-status-badge')

  // 1. Display Auth Status Badge
  const authSession = await getAuthSession()
  if (authStatusBadge) {
    if (authSession?.email) {
      authStatusBadge.innerText = '🟢 ' + authSession.email.split('@')[0]
      authStatusBadge.className = 'auth-tag connected'
      authStatusBadge.title = `Đã kết nối: ${authSession.email}`
    } else {
      authStatusBadge.innerText = '🟡 Local Mode'
      authStatusBadge.className = 'auth-tag local'
      authStatusBadge.title = 'Đang đồng bộ trực tiếp với Web Dashboard'
    }
  }

  // 2. Get current active tab info
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        pageTitleInput.value = tab.title || ''
        pageUrlInput.value = tab.url || ''
        
        // Favicon resolution
        if (tab.favIconUrl) {
          pageFavicon.src = tab.favIconUrl
        } else if (tab.url) {
          try {
            const domain = new URL(tab.url).hostname
            pageFavicon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
          } catch {
            // Keep default icon
          }
        }
      }
    } catch (e) {
      console.warn('Cannot query chrome tabs:', e)
    }
  } else {
    // For test preview
    pageTitleInput.value = 'Demo: Trang web'
    pageUrlInput.value = 'https://example.com'
  }

  // 3. Fetch and render collections
  await loadCollections(collectionSelect)

  // 4. Quick Tag Chips
  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-tag')
      const currentTags = pageTagsInput.value
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)

      if (currentTags.includes(tag)) {
        pageTagsInput.value = currentTags.filter(t => t !== tag).join(', ')
        chip.classList.remove('active')
      } else {
        currentTags.push(tag)
        pageTagsInput.value = currentTags.join(', ')
        chip.classList.add('active')
      }
    })
  })

  // 5. Handle Save Bookmark
  btnSave.addEventListener('click', async () => {
    const title = pageTitleInput.value.trim() || 'Untitled'
    const url = pageUrlInput.value.trim()
    const targetColId = collectionSelect.value
    const targetColName = collectionSelect.options[collectionSelect.selectedIndex]?.text || 'Nhóm đã chọn'
    const tags = pageTagsInput.value
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean)
    const note = pageNoteInput.value.trim()

    if (!url) {
      alert('Không tìm thấy đường dẫn URL của trang web!')
      return
    }

    // UI Loading state
    btnSave.disabled = true
    btnSave.innerHTML = '<span>⏳ Đang lưu vào TabMark...</span>'

    try {
      const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
      const iconText = title.slice(0, 2).toUpperCase()

      // ── BƯỚC 1: GỬI LÊN CLOUD SUPABASE ĐẦU TIÊN ──
      const currentAuth = await getAuthSession()
      const authHeaders = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${currentAuth?.access_token || SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      }

      let validCollectionId = targetColId

      // Nếu targetColId chưa phải UUID nhưng user đã đăng nhập, tự tìm hoặc tạo collection trên Supabase
      if (!isUUID(validCollectionId) && currentAuth?.access_token) {
        try {
          const colQuery = await fetch(`${SUPABASE_URL}/rest/v1/bookmark_collections?name=eq.${encodeURIComponent(targetColName)}&select=id`, {
            headers: authHeaders
          })
          if (colQuery.ok) {
            const found = await colQuery.json()
            if (found && found[0]?.id) {
              validCollectionId = found[0].id
            } else {
              const createColRes = await fetch(`${SUPABASE_URL}/rest/v1/bookmark_collections`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ name: targetColName, description: '' })
              })
              if (createColRes.ok) {
                const created = await createColRes.json()
                if (created && created[0]?.id) {
                  validCollectionId = created[0].id
                }
              }
            }
          }
        } catch (e) {
          console.warn('[TabMark Extension] Auto-resolve collection UUID in Supabase:', e)
        }
      }

      let savedFromCloud = null

      // Chỉ gửi lên Supabase khi có valid UUID
      if (isUUID(validCollectionId)) {
        try {
          const cloudPayload = {
            collection_id: validCollectionId,
            title: title,
            url: url,
            icon: iconText,
            tags: tags,
            note: note,
            position: 0
          }

          const cloudRes = await fetch(`${SUPABASE_URL}/rest/v1/bookmark_links`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(cloudPayload)
          })
          if (cloudRes.ok || cloudRes.status === 201) {
            const data = await cloudRes.json()
            if (Array.isArray(data) && data[0]) {
              savedFromCloud = data[0]
            }
          }
        } catch (cloudErr) {
          console.warn('Supabase cloud network save fallback:', cloudErr)
        }
      }

      const finalLink = savedFromCloud || {
        id: 'ext-' + Date.now(),
        title,
        url,
        icon: iconText,
        tags,
        note,
        status: 'todo',
        time: '5 min'
      }

      // ── BƯỚC 2: CẬP NHẬT STORAGE & BẮN REALTIME VÀO WEB DASHBOARD ──
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await new Promise((resolve) => {
          chrome.storage.local.get(['tabmark_pending_links', 'tabmark_collections'], (result) => {
            const pending = result.tabmark_pending_links || []
            pending.unshift({ link: finalLink, collectionId: validCollectionId || targetColId, timestamp: Date.now() })
            
            const cols = result.tabmark_collections || []
            const foundCol = cols.find(c => c.id === validCollectionId || c.id === targetColId || c.name?.toLowerCase() === targetColName?.toLowerCase()) || cols[0]
            if (foundCol) {
              if (!foundCol.links) foundCol.links = []
              foundCol.links.unshift(finalLink)
            }

            chrome.storage.local.set({
              tabmark_pending_links: pending,
              tabmark_collections: cols
            }, resolve)
          })
        })
      }

      // ── BƯỚC 3: GỬI THÔNG ĐIỆP ĐẾN CÁC TAB TABMARK ĐANG MỞ ──
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          const tabs = await chrome.tabs.query({})
          const tabmarkTabs = tabs.filter(t => t.url && (t.url.includes('localhost') || t.url.includes('127.0.0.1') || t.url.includes('tabmark') || t.url.includes('vercel.app')))
          for (const t of tabmarkTabs) {
            try {
              chrome.tabs.sendMessage(t.id, {
                action: 'SAVE_TABMARK_LINK',
                link: finalLink,
                collectionId: validCollectionId || targetColId
              })
            } catch (err) {}
          }
        } catch (queryErr) {}
      }

      // Show Success Screen
      formSection.classList.add('hidden')
      successSection.classList.remove('hidden')
      savedTargetText.innerText = `Đã lưu thành công vào "${targetColName}"`
    } catch (error) {
      console.error('Error saving bookmark:', error)
      alert('Đã xảy ra lỗi khi lưu: ' + error.message)
      btnSave.disabled = false
      btnSave.innerHTML = '<span class="btn-icon">💾</span><span class="btn-text">Lưu vào TabMark</span>'
    }
  })

  // 6. Close popup
  btnClosePopup.addEventListener('click', () => {
    window.close()
  })
})

async function loadCollections(selectEl) {
  selectEl.innerHTML = ''
  let collectionMap = new Map() // Key: normalized name, Value: { id, displayName, isUUID }
  const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

  // 1. Fetch Cloud Collections from Supabase FIRST if user is logged in
  try {
    const currentAuth = await getAuthSession()
    if (currentAuth?.access_token) {
      const authHeaders = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${currentAuth.access_token}`
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/bookmark_collections?select=id,name,bookmark_links(id)&order=created_at.asc`, {
        headers: authHeaders
      })
      if (res.ok) {
        const cloudCols = await res.json()
        if (Array.isArray(cloudCols) && cloudCols.length > 0) {
          cloudCols.forEach(c => {
            const key = (c.name || '').trim().toLowerCase()
            const linkCount = c.bookmark_links?.length || 0
            if (c.id && key) {
              collectionMap.set(key, {
                id: c.id,
                displayName: `📁 ${c.name} (Cloud · ${linkCount} links)`,
                isUUID: true
              })
            }
          })
        }
      }
    }
  } catch (err) {
    console.warn('[TabMark Extension] Cloud collections fetch error:', err)
  }

  // 2. Try to load from chrome.storage.local (synced from Web App)
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const storageData = await new Promise(resolve => {
        chrome.storage.local.get(['tabmark_collections'], resolve)
      })
      if (Array.isArray(storageData?.tabmark_collections) && storageData.tabmark_collections.length > 0) {
        storageData.tabmark_collections.forEach(col => {
          const key = (col.name || '').trim().toLowerCase()
          if (col.id && key) {
            // Overwrite if existing is not UUID or doesn't exist
            const existing = collectionMap.get(key)
            if (!existing || (!existing.isUUID && isUUID(col.id))) {
              collectionMap.set(key, {
                id: col.id,
                displayName: `📁 ${col.name} (${col.links?.length || 0} links)`,
                isUUID: isUUID(col.id)
              })
            }
          }
        })
      }
    } catch (e) {}
  }

  // 3. Try to query open TabMark tabs if storage is empty
  if (collectionMap.size === 0 && typeof chrome !== 'undefined' && chrome.tabs) {
    try {
      const tabs = await chrome.tabs.query({})
      const tabmarkTabs = tabs.filter(t => t.url && (t.url.includes('localhost') || t.url.includes('127.0.0.1') || t.url.includes('tabmark') || t.url.includes('vercel.app')))
      for (const t of tabmarkTabs) {
        try {
          const res = await chrome.tabs.sendMessage(t.id, { action: 'GET_TABMARK_COLLECTIONS' })
          if (res?.success && Array.isArray(res.collections) && res.collections.length > 0) {
            res.collections.forEach(col => {
              const key = (col.name || '').trim().toLowerCase()
              if (col.id && key && !collectionMap.has(key)) {
                collectionMap.set(key, {
                  id: col.id,
                  displayName: `📁 ${col.name} (${col.links?.length || 0} links)`,
                  isUUID: isUUID(col.id)
                })
              }
            })
            break
          }
        } catch (err) {}
      }
    } catch (tabsErr) {}
  }

  // 4. If STILL empty, use default collections as fallback
  if (collectionMap.size === 0) {
    DEFAULT_COLLECTIONS.forEach(col => {
      const key = (col.name || '').trim().toLowerCase()
      if (key && !collectionMap.has(key)) {
        collectionMap.set(key, {
          id: col.id,
          displayName: `📁 ${col.name}`,
          isUUID: false
        })
      }
    })
  }

  // 5. Populate dropdown (Zero duplicates guaranteed!)
  collectionMap.forEach((item) => {
    const opt = document.createElement('option')
    opt.value = item.id
    opt.innerText = item.displayName
    selectEl.appendChild(opt)
  })
}
