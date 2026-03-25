import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import Items from './components/Items.vue'
import ItemShowView from './views/ItemShowView.vue'
import ItemEditView from './views/ItemEditView.vue'
import ItemNewView from './views/ItemNewView.vue'
import { useCurrentAccount } from './composables/useCurrentAccount'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/items',
    name: 'items',
    component: Items
  },
  {
    path: '/items/new',
    name: 'item-new',
    component: ItemNewView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/items/:id',
    name: 'item-show',
    component: ItemShowView
  },
  {
    path: '/items/:id/edit',
    name: 'item-edit',
    component: ItemEditView,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) return true

  const { currentUser, isAdmin, waitForAuthInit } = useCurrentAccount()
  await waitForAuthInit()

  if (!currentUser.value || !isAdmin.value) {
    return { name: 'items' }
  }

  return true
})

export default router
