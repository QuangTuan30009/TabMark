// TabMark Content Script Bridge

const isTabmarkPage = 
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('tabmark') ||
  window.location.hostname.includes('vercel.app') ||
  document.title.toLowerCase().includes('tabmark')

if (isTabmarkPage) {
  console.log('🚀 [TabMark Extension Bridge] Connected to TabMark Web App at', window.location.href)

  // 1. Sync Supabase Auth Token to Extension Storage
  function syncAuthSessionToStorage() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const raw = localStorage.getItem(key)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed.access_token) {
              chrome.storage.local.set({
                tabmark_auth_session: {
                  access_token: parsed.access_token,
                  user_id: parsed.user?.id,
                  email: parsed.user?.email,
                  expires_at: parsed.expires_at
                }
              })
              return
            }
          }
        }
      }
    } catch (e) {
      console.warn('[TabMark Extension] Auth sync error:', e)
    }
  }

  // 2. Sync Collections to Extension Storage
  function syncCollectionsToStorage(collections) {
    try {
      if (!collections) {
        const stored = localStorage.getItem('tabmark.collections.v7') || localStorage.getItem('tabmark.collections.v6') || localStorage.getItem('tabmark.collections.v2')
        if (stored) collections = JSON.parse(stored)
      }
      if (Array.isArray(collections) && collections.length > 0) {
        chrome.storage.local.set({ tabmark_collections: collections })
      }
    } catch (e) {
      console.warn('[TabMark Extension] Sync error:', e)
    }
  }

  // Initial sync on load
  syncAuthSessionToStorage()
  syncCollectionsToStorage()

  // Sync on storage and custom events
  window.addEventListener('storage', () => {
    syncAuthSessionToStorage()
    syncCollectionsToStorage()
  })

  // Listen for PostMessage from React Web App
  window.addEventListener('message', (event) => {
    if (event.source !== window) return
    if (event.data?.type === 'TABMARK_COLLECTIONS_UPDATED' && Array.isArray(event.data.collections)) {
      syncCollectionsToStorage(event.data.collections)
      syncAuthSessionToStorage()
    }
  })

  // Forward storage updates to React Web App via window.postMessage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.tabmark_pending_links) {
        const pending = changes.tabmark_pending_links.newValue || []
        if (pending.length > 0) {
          pending.forEach((item) => {
            window.postMessage({
              type: 'TABMARK_EXT_ADD_LINK',
              link: item.link,
              collectionId: item.collectionId
            }, '*')
          })
          chrome.storage.local.set({ tabmark_pending_links: [] })
        }
      }
    })
  }

  // Check pending links on load
  function checkPendingLinks() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['tabmark_pending_links'], (result) => {
        const pending = result.tabmark_pending_links || []
        if (pending.length > 0) {
          pending.forEach((item) => {
            window.postMessage({
              type: 'TABMARK_EXT_ADD_LINK',
              link: item.link,
              collectionId: item.collectionId
            }, '*')
          })
          chrome.storage.local.set({ tabmark_pending_links: [] })
        }
      })
    }
  }

  setTimeout(checkPendingLinks, 300)
  setTimeout(checkPendingLinks, 1200)

  // Listen for direct messages from Popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_TABMARK_COLLECTIONS') {
      try {
        const stored = localStorage.getItem('tabmark.collections.v7') || localStorage.getItem('tabmark.collections.v6') || localStorage.getItem('tabmark.collections.v2')
        if (stored) {
          sendResponse({ success: true, collections: JSON.parse(stored) })
          return true
        }
      } catch (e) {}
      sendResponse({ success: false, collections: [] })
      return true
    }

    if (request.action === 'SAVE_TABMARK_LINK') {
      const { link, collectionId } = request
      // Post directly to React via window.postMessage
      window.postMessage({
        type: 'TABMARK_EXT_ADD_LINK',
        link,
        collectionId
      }, '*')
      sendResponse({ success: true })
      return true
    }
  })
}
