<script setup>
import Map from './components/Map.vue'

const apiKey = 'AIzaSyBdOS8kOcnVjCVpsIrqbVyyFmM2eB9n4FA'

function randomCoord(base, delta = 0.03) {
  return base + (Math.random() - 0.5) * delta
}

const baseLat = 45.5416 // Brescia
const baseLng = 10.2118

const items = Array.from({ length: 5 }, (_, i) => ({
  Name: `Punto ${i + 1}`,
  Latitude: randomCoord(baseLat),
  Longitude: randomCoord(baseLng)
}))
console.log(items)
</script>

<template>
  <main class="h-screen w-screen m-auto container flex flex-col items-center justify-center border">
    <Map :apiKey="apiKey" :items="items" />
  </main>
</template>

<style scoped>

</style>
