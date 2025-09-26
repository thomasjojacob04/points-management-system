import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export const checkAuthStatus = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is authorized admin
        try {
          const adminQuery = query(
            collection(db, 'adminUsers'),
            where('uid', '==', user.uid),
            where('isActive', '==', true)
          )
          
          const adminSnapshot = await getDocs(adminQuery)
          resolve(!adminSnapshot.empty)
        } catch (error) {
          console.error('Error checking admin status:', error)
          resolve(false)
        }
      } else {
        resolve(false)
      }
    })
  })
}

export const getCurrentUser = () => {
  return auth.currentUser
}