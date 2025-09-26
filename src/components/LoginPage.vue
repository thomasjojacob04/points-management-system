<template>
  <div class="h-screen overflow-hidden flex items-start justify-center px-4 pt-32">
    <div class="max-w-sm w-full">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-xl font-bold text-red-700 mb-1">
          THIRUVALLA MEKHALA KALOLSAVAM 2K25
        </h1>
        <div class="w-16 h-0.5 bg-red-500 mx-auto mb-4"></div>
        <h2 class="text-lg font-semibold text-gray-800">Admin Login</h2>
        <p class="text-sm text-gray-600 mt-1">Sign in to manage the dashboard</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-lg shadow-sm border border-red-100 p-6">
        <!-- Email/Password Login Form -->
        <form @submit.prevent="handleEmailLogin" class="space-y-4">
          <div>
            <input
              v-model="credentials.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              v-model="credentials.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 text-sm"
              placeholder="Password"
            />
          </div>

          <div v-if="error" class="text-red-600 text-xs text-center bg-red-50 p-2 rounded">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Signing in...' : 'Sign in with Email' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-4">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        <!-- Google Login Button -->
        <button
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full py-2 px-4 border border-red-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ loading ? 'Signing in...' : 'Sign in with Google' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase/config'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const credentials = ref({
      email: '',
      password: ''
    })
    const error = ref('')
    const loading = ref(false)

    // Check if user is authorized admin
    const checkAdminAuthorization = async (user) => {
      try {
        const adminQuery = query(
          collection(db, 'adminUsers'),
          where('uid', '==', user.uid),
          where('isActive', '==', true)
        )
        
        const adminSnapshot = await getDocs(adminQuery)
        return !adminSnapshot.empty
      } catch (err) {
        console.error('Error checking admin authorization:', err)
        return false
      }
    }

    // Handle email/password login
    const handleEmailLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          credentials.value.email, 
          credentials.value.password
        )
        
        const isAuthorized = await checkAdminAuthorization(userCredential.user)
        
        if (isAuthorized) {
          router.push('/admin')
        } else {
          await auth.signOut()
          error.value = 'You are not authorized to access the admin panel'
        }
      } catch (err) {
        console.error('Email login error:', err)
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            error.value = 'Invalid email or password'
            break
          case 'auth/invalid-email':
            error.value = 'Invalid email address'
            break
          case 'auth/too-many-requests':
            error.value = 'Too many failed attempts. Please try again later'
            break
          default:
            error.value = 'Login failed. Please try again'
        }
      }

      loading.value = false
    }

    // Handle Google login
    const handleGoogleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        const result = await signInWithPopup(auth, googleProvider)
        
        const isAuthorized = await checkAdminAuthorization(result.user)
        
        if (isAuthorized) {
          router.push('/admin')
        } else {
          await auth.signOut()
          error.value = 'You are not authorized to access the admin panel'
        }
      } catch (err) {
        console.error('Google login error:', err)
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            error.value = 'Login cancelled'
            break
          case 'auth/popup-blocked':
            error.value = 'Popup blocked. Please allow popups for this site'
            break
          default:
            error.value = 'Google login failed. Please try again'
        }
      }

      loading.value = false
    }

    // Reset scroll position when component mounts
    onMounted(() => {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
    })

    // Reset body overflow when component unmounts
    onUnmounted(() => {
      document.body.style.overflow = 'auto'
    })

    // Check if user is already logged in
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAuthorized = await checkAdminAuthorization(user)
        if (isAuthorized) {
          router.push('/admin')
        }
      }
    })

    return {
      credentials,
      error,
      loading,
      handleEmailLogin,
      handleGoogleLogin
    }
  }
}
</script>