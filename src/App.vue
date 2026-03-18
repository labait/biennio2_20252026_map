<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import Map from './components/Map.vue'
import { auth, db, googleProvider } from './firebase'

const apiKey = 'AIzaSyBdOS8kOcnVjCVpsIrqbVyyFmM2eB9n4FA'

function randomCoord(base, delta = 0.03) {
  return base + (Math.random() - 0.5) * delta
}

const items = ref([])
const currentUser = ref(null)
let unsubscribeAuth = null

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

const connectWithGoogle = async () => {
  if (currentUser.value) return

  try {
    const result = await signInWithPopup(auth, googleProvider)
    currentUser.value = result.user
    console.log('Utente connesso:', result.user)
  } catch (error) {
    console.error('Errore durante il login con Google:', error)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
    currentUser.value = null
    console.log('Utente disconnesso')
  } catch (error) {
    console.error('Errore durante il logout:', error)
  }
}

onMounted(async () => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })

  console.log('loading...')
  await loadItems();
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})
  
</script>

<template>
  <main class="relative h-screen w-screen m-auto container flex flex-col items-center justify-center border">
    <div class="absolute top-3 right-3 z-20">
      <button
        v-if="!currentUser"
        class="inline-flex min-h-8 cursor-pointer items-center justify-center rounded-xs border border-[#dadce0] bg-white px-3 py-1.5 font-medium text-[#1f1f1f] shadow-[0_1px_2px_rgba(60,64,67,0.3)] transition-shadow duration-150 hover:shadow-[0_1px_3px_rgba(60,64,67,0.4)]"
        type="button"
        @click="connectWithGoogle"
      >
        Connect with Google
      </button>

      <div
        v-else
        class="inline-flex min-h-8 items-center gap-2 rounded-xs border border-[#dadce0] bg-white p-2 shadow-[0_1px_2px_rgba(60,64,67,0.3)]"
      >
        <img
          v-if="currentUser.photoURL"
          :src="currentUser.photoURL"
          alt="Avatar utente"
          class="h-6 w-6 rounded-full border border-[#e5e7eb] object-cover"
          referrerpolicy="no-referrer"
        />
        <span class="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[#1f1f1f]">
          {{ currentUser.displayName || currentUser.email || 'Utente connesso' }}
        </span>
        <a href="#" class="font-medium text-[#1a73e8] hover:underline" @click.prevent="logout">Logout</a>
      </div>
    </div>

    <Map :apiKey="apiKey" :items="items" />
  </main>
</template>
