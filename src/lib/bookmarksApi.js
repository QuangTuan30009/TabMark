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

// ==========================================
// USER PROFILE & PRO MEMBERSHIP MANAGEMENT
// ==========================================

export async function getUserProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.warn('Could not fetch user profile:', err.message)
    return null
  }
}

export async function updateUserProfile(userId, updates) {
  if (!isSupabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function upgradeUserToPro(userId, plan = 'pro') {
  if (!isSupabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from('profiles')
    .update({
      is_pro: true,
      plan: plan,
      pro_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function recordTransaction({ userId, email, planId, planName, amount, transactionCode }) {
  if (!isSupabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      email: email || '',
      plan_id: planId,
      plan_name: planName,
      amount: amount,
      transaction_code: transactionCode,
      status: 'completed',
      payment_method: 'vietqr',
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchUserTransactions(userId) {
  if (!isSupabaseConfigured || !userId) return []
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}


