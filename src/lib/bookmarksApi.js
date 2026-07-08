import { isSupabaseConfigured, supabase } from './supabaseClient'

export { isSupabaseConfigured }

function toCollection(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    shareMode: row.share_mode ?? 'private',
    ownerId: row.owner_id,
    links: (row.bookmark_links ?? [])
      .sort((a, b) => a.position - b.position)
      .map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon,
        tags: link.tags ?? [],
        note: link.note ?? '',
      })),
  }
}

export async function fetchCollections(userId) {
  if (!isSupabaseConfigured) return null

  let query = supabase
    .from('bookmark_collections')
    .select('*, bookmark_links(*)')
    .order('created_at', { ascending: true })

  if (userId) {
    query = query.eq('owner_id', userId)
  }

  const { data, error } = await query

  if (error) throw error
  return data.map(toCollection)
}

export async function createCollection(collection) {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('bookmark_collections')
    .insert({
      name: collection.name,
      description: collection.description,
    })
    .select('*, bookmark_links(*)')
    .single()

  if (error) throw error
  return toCollection(data)
}

export async function createLink(link, collectionId, position = 0) {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('bookmark_links')
    .insert({
      collection_id: collectionId,
      title: link.title,
      url: link.url,
      icon: link.icon,
      tags: link.tags,
      note: link.note,
      position,
    })
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    title: data.title,
    url: data.url,
    icon: data.icon,
    tags: data.tags ?? [],
    note: data.note ?? '',
  }
}

export async function updateLink(id, link) {
  if (!isSupabaseConfigured) return null

  const updateFields = {
    title: link.title,
    url: link.url,
    icon: link.icon,
    tags: link.tags,
    note: link.note,
    updated_at: new Date().toISOString(),
  }

  if (link.collection_id) {
    updateFields.collection_id = link.collection_id
  }

  const { data, error } = await supabase
    .from('bookmark_links')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return {
    id: data.id,
    title: data.title,
    url: data.url,
    icon: data.icon,
    tags: data.tags ?? [],
    note: data.note ?? '',
  }
}

export async function deleteLink(id) {
  if (!isSupabaseConfigured) return null

  const { error } = await supabase
    .from('bookmark_links')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function updateCollection(id, collection) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('bookmark_collections')
    .update({
      name: collection.name,
      description: collection.description,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCollection(id) {
  if (!isSupabaseConfigured) return null
  const { error } = await supabase
    .from('bookmark_collections')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

export async function fetchSharedCollection(id) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('bookmark_collections')
    .select('*, bookmark_links(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return toCollection(data)
}

export async function updateCollectionShareMode(id, shareMode) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('bookmark_collections')
    .update({ share_mode: shareMode })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
