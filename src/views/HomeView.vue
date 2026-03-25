<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import Map from '../components/Map.vue'
import { db } from '../firebase'

const items = ref([])

const loadItems = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'items'))
    items.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Errore durante il caricamento degli items:', error)
    items.value = []
  }
}

onMounted(async () => {
  await loadItems()
})
</script>

<template>
  <section class="h-full w-full">
    <Map :items="items" />
  </section>
</template>
