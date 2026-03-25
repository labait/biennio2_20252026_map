<script setup>
import ItemForm from '../components/ItemForm.vue'
</script>

<template>
  <section class="h-full w-full overflow-auto">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Nuovo item</h1>
    <ItemForm mode="new" />
  </section>
</template>
