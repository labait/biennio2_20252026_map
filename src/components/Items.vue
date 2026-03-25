<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { useCurrentAccount } from '../composables/useCurrentAccount'
import { db } from '../firebase'

const items = ref([])
const loading = ref(false)
const { currentUser, isAdmin, initAuth } = useCurrentAccount()

const loadItems = async () => {
  loading.value = true
  try {
    const snapshot = await getDocs(collection(db, 'items'))
    items.value = snapshot.docs.map((itemDoc) => ({ id: itemDoc.id, ...itemDoc.data() }))
  } catch (error) {
    console.error('Errore durante il caricamento items:', error)
    items.value = []
  } finally {
    loading.value = false
  }
}

const removeItem = async (itemId) => {
  if (!currentUser.value || !isAdmin.value) {
    window.alert('Solo utenti admin autenticati possono cancellare un item.')
    return
  }

  const confirmed = window.confirm('Confermi la cancellazione di questo item?')
  if (!confirmed) return

  try {
    await deleteDoc(doc(db, 'items', itemId))
    items.value = items.value.filter((item) => item.id !== itemId)
  } catch (error) {
    console.error('Errore durante la cancellazione item:', error)
  }
}

onMounted(async () => {
  await initAuth()
  await loadItems()
})
</script>

<template>
  <section class="h-full w-full overflow-auto">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Items</h1>
      <RouterLink
        v-if="currentUser && isAdmin"
        to="/items/new"
        class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
      >
        + New item
      </RouterLink>
      <p v-else class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-amber-700">
        Solo utenti admin autenticati possono creare o modificare item.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
      <span class="animate-pulse">Caricamento...</span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200">
      <table class="min-w-full text-left">
        <thead>
          <tr class="bg-gray-800 text-white">
            <th class="px-5 py-3 font-semibold tracking-wide">id</th>
            <th class="px-5 py-3 font-semibold tracking-wide">name</th>
            <th class="px-5 py-3 font-semibold tracking-wide">latitude</th>
            <th class="px-5 py-3 font-semibold tracking-wide">longitude</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr
            v-for="item in items"
            :key="item.id"
            class="transition hover:bg-gray-50"
          >
            <td class="px-5 py-3 font-mono text-gray-500">{{ item.id }}</td>
            <td class="px-5 py-3 font-medium text-gray-900">{{ item.name || item.title || '' }}</td>
            <td class="px-5 py-3 text-gray-600">{{ item.latitude }}</td>
            <td class="px-5 py-3 text-gray-600">{{ item.longitude }}</td>
            <td class="px-5 py-3">
              <div class="flex items-center justify-end gap-3">
                <RouterLink :to="`/items/${item.id}`" class="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700 transition hover:bg-gray-200">
                  show
                </RouterLink>
                <RouterLink
                  v-if="currentUser && isAdmin"
                  :to="`/items/${item.id}/edit`"
                  class="rounded-md bg-blue-50 px-3 py-1 font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  edit
                </RouterLink>
                <button
                  v-if="currentUser && isAdmin"
                  class="rounded-md bg-red-50 px-3 py-1 font-medium text-red-600 transition hover:bg-red-100"
                  type="button"
                  @click="removeItem(item.id)"
                >
                  delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
