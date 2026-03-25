<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import Map from '../components/Map.vue'
import { db } from '../firebase'

const route = useRoute()
const item = ref(null)
const loading = ref(false)

const mapItems = computed(() => {
  if (!item.value) return []
  return [item.value]
})

const loadItem = async () => {
  loading.value = true
  try {
    const itemRef = doc(db, 'items', route.params.id)
    const itemDoc = await getDoc(itemRef)

    if (!itemDoc.exists()) {
      item.value = null
      return
    }

    item.value = { id: itemDoc.id, ...itemDoc.data() }
  } catch (error) {
    console.error('Errore durante il caricamento item:', error)
    item.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadItem()
})
</script>

<template>
  <section class="h-full w-full overflow-auto">
    <p v-if="loading">Caricamento...</p>

    <div v-else-if="item" class="space-y-3">
      <h1 class="text-2xl font-semibold">Dettaglio item</h1>
      <p><strong>name:</strong> {{ item.name || item.title || '' }}</p>
      <p><strong>latitude:</strong> {{ item.latitude }}</p>
      <p><strong>longitude:</strong> {{ item.longitude }}</p>

      <div class="h-[420px] w-full border border-gray-200">
        <Map :items="mapItems" />
      </div>
    </div>

    <p v-else>Item non trovato.</p>
  </section>
</template>
