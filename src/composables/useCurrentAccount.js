import { computed, ref } from 'vue'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

const currentUser = ref(null)
const roles = ref([])
const authReady = ref(false)

let unsubscribeAuth = null
let initPromise = null

const isAdmin = computed(() => roles.value.includes('admin'))

const loadRoles = async (user) => {
  if (!user) {
    roles.value = []
    return
  }

  try {
    const accountRef = doc(db, 'accounts', user.uid)
    const accountDoc = await getDoc(accountRef)

    if (!accountDoc.exists()) {
      roles.value = []
      return
    }

    const accountData = accountDoc.data()
    roles.value = Array.isArray(accountData.roles) ? accountData.roles : []
  } catch (error) {
    console.error('Errore durante il caricamento ruoli account:', error)
    roles.value = []
  }
}

const initAuth = () => {
  if (initPromise) return initPromise

  initPromise = new Promise((resolve) => {
    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      currentUser.value = user
      await loadRoles(user)

      if (!authReady.value) {
        authReady.value = true
        resolve()
      }
    })
  })

  return initPromise
}

const ensureAccountDocument = async (user) => {
  await setDoc(
    doc(db, 'accounts', user.uid),
    {
      uid: user.uid,
      roles: []
    },
    { merge: true }
  )
}

const connectWithGoogle = async () => {
  if (currentUser.value) return

  try {
    const result = await signInWithPopup(auth, googleProvider)
    currentUser.value = result.user

    await ensureAccountDocument(result.user)
    await loadRoles(result.user)

    console.log('Utente connesso:', result.user)
  } catch (error) {
    console.error('Errore durante il login con Google:', error)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
    currentUser.value = null
    roles.value = []
    console.log('Utente disconnesso')
  } catch (error) {
    console.error('Errore durante il logout:', error)
  }
}

const waitForAuthInit = async () => {
  await initAuth()
}

const disposeAuth = () => {
  if (unsubscribeAuth) {
    unsubscribeAuth()
    unsubscribeAuth = null
    initPromise = null
    authReady.value = false
  }
}

export const useCurrentAccount = () => ({
  currentUser,
  roles,
  isAdmin,
  authReady,
  initAuth,
  waitForAuthInit,
  connectWithGoogle,
  logout,
  disposeAuth
})
