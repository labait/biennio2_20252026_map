<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <main class="h-screen w-screen flex flex-col overflow-hidden p-6">
    <Navbar class="mb-4"/>

    <section class="min-h-0 flex-1">
      <RouterView />
    </section>
  </main>
</template>
