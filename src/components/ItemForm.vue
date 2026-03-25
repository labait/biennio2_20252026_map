<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useCurrentAccount } from '../composables/useCurrentAccount'
import { db } from '../firebase'

const props = defineProps({
  mode: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    default: null
  },
  initialItem: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()
const { currentUser, isAdmin } = useCurrentAccount()
const canManageItems = computed(() => Boolean(currentUser.value) && isAdmin.value)

const form = reactive({
  name: '',
  latitude: '',
  longitude: ''
})

watch(
  () => props.initialItem,
  (value) => {
    form.name = value?.name || value?.title || ''
    form.latitude = value?.latitude ?? ''
    form.longitude = value?.longitude ?? ''
  },
  { immediate: true }
)

const submit = async () => {
  if (!canManageItems.value) {
    window.alert('Solo utenti admin autenticati possono creare o modificare item.')
    return
  }

  try {
    const payload = {
      name: form.name,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    }

    if (props.mode === 'edit') {
      await updateDoc(doc(db, 'items', props.itemId), payload)
      await router.push(`/items/${props.itemId}`)
    } else {
      const newDoc = await addDoc(collection(db, 'items'), payload)
      await router.push(`/items/${newDoc.id}`)
    }
  } catch (error) {
    console.error('Errore durante il salvataggio item:', error)
  }
}
</script>

<template>
  <form class="mx-auto space-y-6 " @submit.prevent="submit">
    <p v-if="!canManageItems" class="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 font-medium text-amber-800">
      Solo utenti admin autenticati possono salvare modifiche.
    </p>

    <div class="space-y-1">
      <label class="block font-semibold text-gray-700">Name</label>
      <input
        v-model="form.name"
        :disabled="!canManageItems"
        type="text"
        placeholder="Es. Piazza della Loggia"
        class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-1">
        <label class="block font-semibold text-gray-700">Latitude</label>
        <input
          v-model="form.latitude"
          :disabled="!canManageItems"
          type="number"
          step="any"
          placeholder="Es. 45.5416"
          class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          required
        />
      </div>
      <div class="space-y-1">
        <label class="block font-semibold text-gray-700">Longitude</label>
        <input
          v-model="form.longitude"
          :disabled="!canManageItems"
          type="number"
          step="any"
          placeholder="Es. 10.2118"
          class="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          required
        />
      </div>
    </div>

    <button
      :disabled="!canManageItems"
      type="submit"
      class="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
    >
      {{ mode === 'edit' ? 'Aggiorna item' : 'Crea item' }}
    </button>
  </form>
</template>
