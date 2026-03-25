<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

const currentUser = ref(null)
let unsubscribeAuth = null

const connectWithGoogle = async () => {
  if (currentUser.value) return

  try {
    const result = await signInWithPopup(auth, googleProvider)
    currentUser.value = result.user
    console.log('Utente connesso:', result.user)

    await setDoc(doc(db, 'accounts', result.user.uid), {
      uid: result.user.uid,
      roles: []
    })
    console.log('Account creato in Firestore')
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

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
  }
})
</script>

<template>
  <header class="z-20 w-full" >
    <div class="flex items-center justify-between p-3">
      <div class="text-2xl">
        map
      </div>

      <div>
        <button
          v-if="!currentUser"
          class="inline-flex min-h-8 cursor-pointer items-center justify-center "
          type="button"
          @click="connectWithGoogle"
        >
          Connect with Google
        </button>

        <div
          v-else
          class="inline-flex min-h-8 items-center gap-2 "
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
    </div>
  </header>
</template>