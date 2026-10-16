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
} from '@/services/bookmarks.service'
import { supabase } from '@/lib/supabaseClient'
import { defaultCollections } from '@/constants/default-collections'

const STORAGE_KEY = 'tabmark.collections.v7'

export function createId() {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function loadStoredCollections() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
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
          if (sharedCollectionId.startsWith('bundle:')) {
            try {
              const base64Str = sharedCollectionId.replace('bundle:', '')
              const binString = atob(base64Str)
              const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0))
              const decodedStr = new TextDecoder().decode(bytes)
              const parsed = JSON.parse(decodedStr)
              const bundleCols = Array.isArray(parsed) ? parsed : (parsed.collections || [parsed])
              cloudCollections = bundleCols.map(c => ({
                id: c.id || 'shared-col',
                name: c.name || 'Shared Bookmarks',
                description: c.description || 'Danh sách bookmark được chia sẻ',
                shareMode: 'view',
                links: c.links || []
              }))
            } catch (bundleErr) {
              console.error('Lỗi khi giải mã bundle shared:', bundleErr)
            }
          } else {
            // Chỉ tải collection được share từ Supabase
            const sharedCol = await fetchSharedCollection(sharedCollectionId)
            if (sharedCol) {
              cloudCollections = [sharedCol]
            }
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
  }, [user?.id, sharedCollectionId])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
    window.postMessage({ type: 'TABMARK_COLLECTIONS_UPDATED', collections }, '*')
  }, [collections])

  // Listen for live link saves from TabMark Chrome Extension via window.postMessage
  useEffect(() => {
    function handleWindowMessage(event) {
      if (event.data?.type === 'TABMARK_EXT_ADD_LINK') {
        const { link, collectionId } = event.data
        if (!link) return

        const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
        const targetId = (collectionId || activeCollectionId || 'default').toString().trim().toLowerCase()
        const newLink = {
          id: link.id || createId(),
          title: link.title || 'Untitled',
          url: link.url,
          icon: link.icon || '🔗',
          tags: link.tags || [],
          note: link.note || '',
          status: link.status || 'todo',
          time: link.time || '5 min'
        }

        let targetCol = null

        setCollections(current => {
          let matched = false
          const updated = current.map(col => {
            const isMatch = (col.id && col.id.toString().toLowerCase() === targetId) ||
                            (col.name && col.name.trim().toLowerCase() === targetId) ||
                            (targetId === 'default' && col.id === current[0]?.id)
            if (isMatch) {
              matched = true
              targetCol = col
              return {
                ...col,
                links: [newLink, ...(col.links || []).filter(l => l.url !== newLink.url || l.title !== newLink.title)]
              }
            }
            return col
          })

          if (!matched && updated.length > 0) {
            targetCol = updated[0]
            updated[0] = {
              ...updated[0],
              links: [newLink, ...(updated[0].links || []).filter(l => l.url !== newLink.url || l.title !== newLink.title)]
            }
          }
          return updated
        })

        // Nếu chưa lưu trên Cloud (link.id chưa phải UUID) và user đang login, lưu tiếp vào Supabase
        if (isSupabaseConfigured && user && targetCol?.id && isUUID(targetCol.id) && !isUUID(newLink.id)) {
          createLink(newLink, targetCol.id).catch(err => console.warn('[TabMark Extension Sync] Supabase save error:', err))
        }

        setToast({
          message: `🔖 Extension đã lưu: "${newLink.title}"`
        })
      }
    }

    window.addEventListener('message', handleWindowMessage)
    return () => window.removeEventListener('message', handleWindowMessage)
  }, [activeCollectionId, user])



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
    let targetLink = null
    let targetCol = null
    for (const c of collections) {
      const found = (c.links || []).find(l => l.id === linkId)
      if (found) {
        targetLink = found
        targetCol = c
        break
      }
    }

    if (animatedSwal && targetLink) {
      const result = await animatedSwal.fire({
        title: 'Xóa bookmark?',
        text: `Bạn có chắc muốn xóa link "${targetLink.title}" khỏi nhóm "${targetCol?.name || ''}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#3b82f6',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
      })
      if (!result.isConfirmed) return
    }

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
      links: (collection.links || []).filter((link) => link.id !== linkId)
    })))

    if (targetLink) {
      setToast({
        message: `🗑️ Đã xóa link "${targetLink.title}"`
      })
    }
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

  async function handleDrop(e, toCollectionId, targetCardId = null) {
    const cardId = e.dataTransfer.getData('cardId')
    const fromCollectionId = e.dataTransfer.getData('fromCollectionId')
    
    if (!cardId || !fromCollectionId) return

    // TRƯỜNG HỢP 1: Sắp xếp lại thứ tự ngay trong cùng 1 collection
    if (fromCollectionId === toCollectionId) {
      if (!targetCardId || targetCardId === cardId) return

      const col = collections.find(c => c.id === toCollectionId)
      if (!col || !col.links) return

      const fromIndex = col.links.findIndex(l => l.id === cardId)
      const toIndex = col.links.findIndex(l => l.id === targetCardId)
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

      const newLinks = [...col.links]
      const [movedLink] = newLinks.splice(fromIndex, 1)
      newLinks.splice(toIndex, 0, movedLink)

      setCollections(current => current.map(c => 
        c.id === toCollectionId ? { ...c, links: newLinks } : c
      ))

      if (isSupabaseConfigured) {
        try {
          setSyncStatus('Sắp xếp lại link...')
          await updateLink(cardId, {
            ...movedLink,
            position: toIndex
          })
          setSyncStatus('Đã sắp xếp lại thứ tự link')
        } catch (error) {
          console.error('Lỗi Supabase khi sắp xếp link:', error)
          setSyncStatus('Lỗi khi lưu vị trí lên Cloud')
        }
      }
      return
    }

    // TRƯỜNG HỢP 2: Di chuyển từ collection này sang collection khác
    const sourceCol = collections.find(c => c.id === fromCollectionId)
    const targetCol = collections.find(c => c.id === toCollectionId)
    if (!sourceCol || !targetCol) return

    const linkToUpdate = sourceCol.links.find(l => l.id === cardId)
    if (!linkToUpdate) return

    let targetInsertIndex = 0

    setCollections(current => current.map(col => {
      if (col.id === fromCollectionId) {
        return {
          ...col,
          links: col.links.filter(l => l.id !== cardId)
        }
      }
      if (col.id === toCollectionId) {
        const nextLinks = [...col.links]
        if (targetCardId) {
          const idx = nextLinks.findIndex(l => l.id === targetCardId)
          if (idx !== -1) {
            nextLinks.splice(idx, 0, linkToUpdate)
            targetInsertIndex = idx
            return { ...col, links: nextLinks }
          }
        }
        return {
          ...col,
          links: [linkToUpdate, ...nextLinks]
        }
      }
      return col
    }))

    if (isSupabaseConfigured) {
      try {
        setSyncStatus('Chuyển nhóm link...')
        await updateLink(cardId, {
          ...linkToUpdate,
          collection_id: toCollectionId,
          position: targetInsertIndex
        })
        setSyncStatus('Đã chuyển nhóm thành công')
      } catch (error) {
        console.error(error)
        setSyncStatus('Lỗi khi chuyển nhóm link')
      }
    }
  }

  // Hỗ trợ nút mũi tên Lên/Xuống trên từng thẻ bookmark
  async function handleMoveLink(cardId, direction) {
    const parentCol = collections.find(c => c.links?.some(l => l.id === cardId))
    if (!parentCol || !parentCol.links) return

    const currentIndex = parentCol.links.findIndex(l => l.id === cardId)
    if (currentIndex === -1) return

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= parentCol.links.length) return

    const newLinks = [...parentCol.links]
    const [movedLink] = newLinks.splice(currentIndex, 1)
    newLinks.splice(targetIndex, 0, movedLink)

    setCollections(current => current.map(c => 
      c.id === parentCol.id ? { ...c, links: newLinks } : c
    ))

    if (isSupabaseConfigured) {
      try {
        await updateLink(cardId, {
          ...movedLink,
          position: targetIndex
        })
      } catch (error) {
        console.error('Lỗi đổi vị trí:', error)
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
          if (!Array.isArray(imported)) {
            animatedSwal.fire({
              title: 'Định dạng không hợp lệ',
              text: 'File sao lưu phải là một danh sách các nhóm bookmark (JSON array).',
              icon: 'error'
            })
            return
          }

          // 1. Chuẩn hóa dữ liệu imported
          const formattedImported = imported.map((col, cIdx) => ({
            id: col.id || createId(),
            name: col.name || `Nhóm ${cIdx + 1}`,
            description: col.description || '',
            shareMode: col.shareMode || 'private',
            links: Array.isArray(col.links)
              ? col.links.map((l, lIdx) => ({
                  id: l.id || createId(),
                  title: l.title || 'Untitled',
                  url: l.url || 'https://tabmark.app',
                  icon: l.icon || '🔗',
                  tags: Array.isArray(l.tags) ? l.tags : [],
                  note: l.note || '',
                  status: l.status || 'todo',
                  time: l.time || '5 min',
                  aiSummary: l.aiSummary || l.ai_summary || '',
                }))
              : []
          }))

          // 2. Cập nhật state và localStorage ngay lập tức
          setCollections(formattedImported)
          if (formattedImported.length > 0) {
            setActiveCollectionId(formattedImported[0].id)
          }
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formattedImported))
          setSyncStatus('Backup imported')

          // 3. Nếu đang đăng nhập Supabase, đồng bộ đè lên Cloud để F5 không bị mất
          if (isSupabaseConfigured && user?.id && user.id !== 'mock') {
            try {
              setSyncStatus('Đang lưu dữ liệu lên Supabase Cloud...')

              // Xóa toàn bộ collections cũ của user trên Cloud
              const { data: oldCols } = await supabase
                .from('bookmark_collections')
                .select('id')
                .eq('owner_id', user.id)

              if (oldCols && oldCols.length > 0) {
                const oldIds = oldCols.map(c => c.id)
                await supabase.from('bookmark_links').delete().in('collection_id', oldIds)
                await supabase.from('bookmark_collections').delete().in('id', oldIds)
              }

              // Chèn toàn bộ collections và links mới vào Supabase
              const cloudNewCols = []
              for (let colIdx = 0; colIdx < formattedImported.length; colIdx++) {
                const col = formattedImported[colIdx]
                const { data: createdCol, error: colErr } = await supabase
                  .from('bookmark_collections')
                  .insert({
                    owner_id: user.id,
                    name: col.name,
                    description: col.description,
                    share_mode: col.shareMode || 'private',
                  })
                  .select()
                  .single()

                if (colErr || !createdCol) {
                  console.warn('Lỗi import collection lên Supabase:', colErr)
                  continue
                }

                const linksToInsert = (col.links || []).map((l, lIdx) => ({
                  collection_id: createdCol.id,
                  title: l.title,
                  url: l.url,
                  icon: l.icon || '🔗',
                  tags: l.tags || [],
                  note: l.note || '',
                  status: l.status || 'todo',
                  time: l.time || '5 min',
                  ai_summary: l.aiSummary || '',
                  position: lIdx,
                }))

                if (linksToInsert.length > 0) {
                  const { data: insertedLinks } = await supabase
                    .from('bookmark_links')
                    .insert(linksToInsert)
                    .select()

                  cloudNewCols.push({
                    id: createdCol.id,
                    name: createdCol.name,
                    description: createdCol.description,
                    shareMode: createdCol.share_mode,
                    ownerId: createdCol.owner_id,
                    links: (insertedLinks || []).map(il => ({
                      id: il.id,
                      title: il.title,
                      url: il.url,
                      icon: il.icon,
                      tags: il.tags ?? [],
                      note: il.note ?? '',
                      status: il.status ?? 'todo',
                      time: il.time ?? '5 min',
                      aiSummary: il.ai_summary ?? '',
                    }))
                  })
                } else {
                  cloudNewCols.push({
                    id: createdCol.id,
                    name: createdCol.name,
                    description: createdCol.description,
                    shareMode: createdCol.share_mode,
                    ownerId: createdCol.owner_id,
                    links: []
                  })
                }
              }

              if (cloudNewCols.length > 0) {
                setCollections(cloudNewCols)
                setActiveCollectionId(cloudNewCols[0]?.id)
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudNewCols))
              }
              setSyncStatus('Synced with Supabase')
            } catch (syncErr) {
              console.error('Lỗi đồng bộ import lên Supabase:', syncErr)
            }
          }

          const totalLinks = formattedImported.reduce((acc, c) => acc + (c.links?.length || 0), 0)
          animatedSwal.fire({
            title: 'Nhập dữ liệu thành công! 🎉',
            text: `Đã khôi phục ${formattedImported.length} nhóm và ${totalLinks} bookmark liên kết vào hệ thống.`,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
          })
        } catch (err) {
          console.error(err)
          animatedSwal.fire({
            title: 'Nhập thất bại',
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

  async function handleResetToDefault() {
    try {
      // 1. Cập nhật ngay LocalStorage và xóa các key cũ
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCollections))
      window.localStorage.removeItem('tabmark.collections.v2')
      window.localStorage.removeItem('tabmark.collections.v3')
      window.localStorage.removeItem('tabmark.collections.v4')
      window.localStorage.removeItem('tabmark.collections.v5')
      window.localStorage.removeItem('tabmark.collections.v6')

      // 2. Cập nhật state giao diện ngay lập tức
      setCollections(defaultCollections)
      setActiveCollectionId(defaultCollections[0]?.id)
      setToast({ message: 'Đã sắp xếp lại toàn bộ bookmark sang danh sách chuẩn!' })

      // 3. Nếu tài khoản đã đăng nhập trên Supabase, đồng bộ đè lên Cloud
      if (isSupabaseConfigured && user?.id && user.id !== 'mock') {
        try {
          setSyncStatus('Đang đồng bộ lên Supabase...')

          // Xóa các collections & links cũ của user trên Cloud
          const { data: oldCols } = await supabase
            .from('bookmark_collections')
            .select('id')
            .eq('owner_id', user.id)

          if (oldCols && oldCols.length > 0) {
            const oldIds = oldCols.map(c => c.id)
            await supabase.from('bookmark_links').delete().in('collection_id', oldIds)
            await supabase.from('bookmark_collections').delete().in('id', oldIds)
          }

          // Tạo các collection & links mới trên Supabase
          const cloudNewCols = []
          for (let colIdx = 0; colIdx < defaultCollections.length; colIdx++) {
            const defCol = defaultCollections[colIdx]
            const { data: createdCol, error: colErr } = await supabase
              .from('bookmark_collections')
              .insert({
                owner_id: user.id,
                name: defCol.name,
                description: defCol.description,
                share_mode: 'private',
              })
              .select()
              .single()

            if (colErr || !createdCol) {
              console.warn('Lỗi tạo collection trên Supabase:', colErr)
              continue
            }

            const linksToInsert = (defCol.links || []).map((l, lIdx) => ({
              collection_id: createdCol.id,
              title: l.title,
              url: l.url,
              icon: l.icon || '🔗',
              tags: l.tags || [],
              note: l.note || '',
              status: l.status || 'todo',
              time: l.time || '5 min',
              position: lIdx,
            }))

            if (linksToInsert.length > 0) {
              const { data: insertedLinks } = await supabase
                .from('bookmark_links')
                .insert(linksToInsert)
                .select()

              cloudNewCols.push({
                id: createdCol.id,
                name: createdCol.name,
                description: createdCol.description,
                shareMode: createdCol.share_mode,
                ownerId: createdCol.owner_id,
                links: (insertedLinks || []).map(il => ({
                  id: il.id,
                  title: il.title,
                  url: il.url,
                  icon: il.icon,
                  tags: il.tags ?? [],
                  note: il.note ?? '',
                  status: il.status ?? 'todo',
                  time: il.time ?? '5 min',
                }))
              })
            } else {
              cloudNewCols.push({
                id: createdCol.id,
                name: createdCol.name,
                description: createdCol.description,
                shareMode: createdCol.share_mode,
                ownerId: createdCol.owner_id,
                links: []
              })
            }
          }

          if (cloudNewCols.length > 0) {
            setCollections(cloudNewCols)
            setActiveCollectionId(cloudNewCols[0]?.id)
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudNewCols))
            setSyncStatus('Synced with Supabase')
            setToast({ message: 'Đã lưu danh sách link chuẩn vào tài khoản đám mây vĩnh viễn!' })
          }
        } catch (cloudErr) {
          console.error('Lỗi lưu cloud:', cloudErr)
          setSyncStatus('Lỗi đồng bộ Cloud, đã lưu cục bộ')
        }
      }
    } catch (e) {
      console.error(e)
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
    handleMoveLink,
    handleReorderCollections,
    handleExport,
    handleImport,
    handleSync,
    handleUpdateShareMode,
    handleResetToDefault,
  }
}

export { defaultCollections }
