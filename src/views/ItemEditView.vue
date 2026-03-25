<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import ItemForm from '../components/ItemForm.vue'
import { db } from '../firebase'

const route = useRoute()
const item = ref(null)
const loading = ref(false)
const exists = ref(true)

const loadItem = async () => {
  loading.value = true
  try {
    const itemRef = doc(db, 'items', route.params.id)
    const itemDoc = await getDoc(itemRef)

    if (!itemDoc.exists()) {
      exists.value = false
      item.value = null
      return
    }

    exists.value = true
    item.value = { id: itemDoc.id, ...itemDoc.data() }
  } catch (error) {
    console.error('Errore durante il caricamento item:', error)
    exists.value = false
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
    <h1 class="mb-4 text-2xl font-semibold">Modifica item</h1>

    <p v-if="loading">Caricamento...</p>
    <p v-else-if="!exists">Item non trovato.</p>

    <ItemForm
      v-else
      mode="edit"
      :item-id="String(route.params.id)"
      :initial-item="item || {}"
    />
  </section>
</template>
