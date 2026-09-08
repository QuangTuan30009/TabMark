// Background Service Worker for TabMark Extension

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu Items
  chrome.contextMenus.create({
    id: 'tabmark-save-page',
    title: '🔖 Lưu trang này vào TabMark',
    contexts: ['page']
  })

  chrome.contextMenus.create({
    id: 'tabmark-save-link',
    title: '🔗 Lưu liên kết này vào TabMark',
    contexts: ['link']
  })
})

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const SUPABASE_URL = 'https://onhaqbjipydrdkwteufv.supabase.co'
  const SUPABASE_ANON_KEY = 'sb_publishable_GbttFoFdk7_dz3DbUd1zCA_Fnsu0wsa'

  let title = tab.title || 'Saved from Context Menu'
  let url = tab.url

  if (info.menuItemId === 'tabmark-save-link' && info.linkUrl) {
    url = info.linkUrl
    title = info.selectionText || info.linkUrl
  }

  if (!url) return

  try {
    const payload = {
      collection_id: 'default',
      title: title,
      url: url,
      icon: title.slice(0, 2).toUpperCase(),
      tags: ['quick-save'],
      note: 'Lưu nhanh qua chuột phải',
      position: 0
    }

    await fetch(`${SUPABASE_URL}/rest/v1/bookmark_links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    })

    // Show badge notification
    chrome.action.setBadgeText({ text: '✓' })
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' })
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' })
    }, 2500)
  } catch (err) {
    console.error('Context menu save failed:', err)
  }
})
