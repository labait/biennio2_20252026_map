<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCurrentAccount } from '../composables/useCurrentAccount'

const { currentUser, connectWithGoogle, logout, initAuth } = useCurrentAccount()

onMounted(() => {
  initAuth()
})
</script>

<template>
  <header class="z-20 w-full" >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="text-2xl font-semibold hover:underline">App</RouterLink>
        <RouterLink to="/items" class="text-blue-600 hover:underline">items</RouterLink>
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