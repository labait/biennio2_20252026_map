<script setup>
import { onMounted, ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import Map from './components/Map.vue'
import Navbar from './components/Navbar.vue'
import { db } from './firebase'

const apiKey = 'AIzaSyBdOS8kOcnVjCVpsIrqbVyyFmM2eB9n4FA'

function randomCoord(base, delta = 0.03) {
  return base + (Math.random() - 0.5) * delta
}

const items = ref([])

const itemsDebug = () => {
  const baseLat = 45.5416 // Brescia
  const baseLng = 10.2118

  return Array.from({ length: 5 }, (_, i) => ({
    title: `Punto ${i + 1}`,
    content: `Contenuto descrittivo del punto ${i + 1}`,
    latitude: randomCoord(baseLat),
    longitude: randomCoord(baseLng)
  }))
}

const loadItems = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'items'))
    items.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    console.log('Items da Firebase:', items.value)
  } catch (error) { 
    console.error('Errore durante il caricamento degli items:', error)
    items.value = itemsDebug()
  }
}

onMounted(async () => {
  console.log('loading...')
  await loadItems()
})
</script>

<template>
  <main class="h-screen w-screen flex flex-col overflow-hidden">
    <Navbar />

    <section class="min-h-0 flex-1">
      <Map :apiKey="apiKey" :items="items" />
    </section>
  </main>
</template>
