<template>
  <div>
    <!-- Admin Header with User Info -->
    <div class="flex justify-between items-center mb-6 bg-white rounded-lg shadow p-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p class="text-sm text-gray-600" v-if="currentUser">
          Welcome, {{ currentUser.displayName || currentUser.email }}
        </p>
      </div>
      <button
        @click="logout"
        class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 flex items-center"
      >
        Logout
      </button>
    </div>

    <!-- Award/Deduct Points -->
      <div class="bg-white rounded-lg shadow p-6 mb-6 lg:col-span-2">
        <h3 class="text-xl font-bold mb-4">Award or Deduct Points</h3>
        <form @submit.prevent="awardPoints" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select v-model="newPoints.unitId" class="p-3 border border-gray-300 rounded-lg" required>
              <option value="">Select Unit</option>
              <option v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }}
              </option>
            </select>
            <select v-model="newPoints.activityId" class="p-3 border border-gray-300 rounded-lg" required>
              <option value="">Select Activity</option>
              <option v-for="activity in activities" :key="activity.id" :value="activity.id">
                {{ activity.name }}
              </option>
            </select>
          </div>
          
          <!-- Point Action Selection -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select v-model="newPoints.action" class="w-full p-3 border border-gray-300 rounded-lg">
                <option value="add">Award Points (+)</option>
                <option value="subtract">Deduct Points (-)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                v-model.number="newPoints.points"
                type="number"
                placeholder="Points"
                class="w-full p-3 border border-gray-300 rounded-lg"
                required
                min="1"
              />
            </div>
            <button 
              type="submit" 
              :class="newPoints.action === 'subtract' ? 
                'bg-red-600 text-white py-3 rounded-lg hover:bg-red-700' : 
                'bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700'"
            >
              {{ newPoints.action === 'subtract' ? 'Deduct Points' : 'Award Points' }}
            </button>
          </div>
        </form>
      </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Manage Units -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-bold mb-4">Manage Units</h3>
        
        <!-- Add New Unit Form -->
        <form @submit.prevent="addUnit" class="space-y-4 mb-6">
          <input
            v-model="newUnit.name"
            type="text"
            placeholder="Unit Name"
            class="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Add Unit
          </button>
        </form>

        <!-- Existing Units List -->
        <div class="space-y-2">
          <h4 class="font-semibold text-gray-700 mb-3">Existing Units</h4>
          <div 
            v-for="unit in units" 
            :key="unit.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <span class="font-medium">{{ unit.name }}</span>
            <button
              @click="deleteUnit(unit.id, unit.name)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
          <div v-if="units.length === 0" class="text-gray-500 italic text-center py-4">
            No units added yet
          </div>
        </div>
      </div>

      <!-- Manage Activities -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-bold mb-4">Manage Activities</h3>
        
        <!-- Add New Activity Form -->
        <form @submit.prevent="addActivity" class="space-y-4 mb-6">
          <input
            v-model="newActivity.name"
            type="text"
            placeholder="Activity Name"
            class="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
          <button type="submit" class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Add Activity
          </button>
        </form>

        <!-- Existing Activities List -->
        <div class="space-y-2">
          <h4 class="font-semibold text-gray-700 mb-3">Existing Activities</h4>
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <span class="font-medium">{{ activity.name }}</span>
            <button
              @click="deleteActivity(activity.id, activity.name)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
          <div v-if="activities.length === 0" class="text-gray-500 italic text-center py-4">
            No activities added yet
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 class="text-xl font-bold mb-4">Recent Point Awards</h3>
        <div class="space-y-3">
          <div
            v-for="point in validRecentPoints"
            :key="point.id"
            class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <span class="font-medium">{{ getUnitName(point.unitId) }}</span>
              <span class="mx-2">•</span>
              <span class="text-gray-600">{{ getActivityName(point.activityId) }}</span>
            </div>
            <span 
              :class="point.points > 0 ? 'font-bold text-purple-600' : 'font-bold text-red-600'"
            >
              {{ point.points > 0 ? `+${point.points}` : point.points }}
            </span>
          </div>
          <div v-if="validRecentPoints.length === 0" class="text-gray-500 italic text-center py-4">
            No recent point awards with valid units and activities
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, getDocs, orderBy, query, limit, serverTimestamp, doc, deleteDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { db } from '../firebase/config'

export default {
  setup() {
    const router = useRouter()
    const auth = getAuth()
    
    // Auth state
    const currentUser = ref(null)
    const loading = ref(true)
    
    // Data refs
    const units = ref([])
    const activities = ref([])
    const points = ref([])
    const newUnit = ref({ name: '' })
    const newActivity = ref({ name: '' })
    const newPoints = ref({ unitId: '', activityId: '', points: 0, action: 'add' })

    // Fetch data function
    const fetchData = async () => {
      try {
        const unitsSnapshot = await getDocs(collection(db, 'units'))
        units.value = unitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const activitiesSnapshot = await getDocs(collection(db, 'activities'))
        activities.value = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const pointsQuery = query(collection(db, 'points'), orderBy('awardedAt', 'desc'), limit(10))
        const pointsSnapshot = await getDocs(pointsQuery)
        points.value = pointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Add unit function
    const addUnit = async () => {
      if (newUnit.value.name.trim()) {
        try {
          await addDoc(collection(db, 'units'), {
            name: newUnit.value.name,
            createdAt: serverTimestamp()
          })
          newUnit.value.name = ''
          await fetchData()
        } catch (error) {
          console.error('Error adding unit:', error)
        }
      }
    }

    // Add activity function
    const addActivity = async () => {
      if (newActivity.value.name.trim()) {
        try {
          await addDoc(collection(db, 'activities'), {
            name: newActivity.value.name,
            createdAt: serverTimestamp()
          })
          newActivity.value.name = ''
          await fetchData()
        } catch (error) {
          console.error('Error adding activity:', error)
        }
      }
    }

    // Delete unit function
    const deleteUnit = async (unitId, unitName) => {
      if (confirm(`Are you sure you want to delete the unit "${unitName}"? This action cannot be undone.`)) {
        try {
          await deleteDoc(doc(db, 'units', unitId))
          await fetchData()
        } catch (error) {
          console.error('Error deleting unit:', error)
          alert('Error deleting unit. Please try again.')
        }
      }
    }

    // Delete activity function
    const deleteActivity = async (activityId, activityName) => {
      if (confirm(`Are you sure you want to delete the activity "${activityName}"? This action cannot be undone.`)) {
        try {
          await deleteDoc(doc(db, 'activities', activityId))
          await fetchData()
        } catch (error) {
          console.error('Error deleting activity:', error)
          alert('Error deleting activity. Please try again.')
        }
      }
    }

    // Award points function
    const awardPoints = async () => {
      if (newPoints.value.unitId && newPoints.value.activityId && newPoints.value.points > 0) {
        try {
          const pointValue = newPoints.value.action === 'subtract' ? 
            -Math.abs(newPoints.value.points) : 
            Math.abs(newPoints.value.points)
          
          await addDoc(collection(db, 'points'), {
            unitId: newPoints.value.unitId,
            activityId: newPoints.value.activityId,
            points: pointValue,
            awardedAt: serverTimestamp()
          })
          newPoints.value = { unitId: '', activityId: '', points: 0, action: 'add' }
          await fetchData()
        } catch (error) {
          console.error('Error awarding points:', error)
        }
      }
    }

    // Logout function
    const logout = async () => {
      try {
        await signOut(auth)
        router.push('/login')
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }

    // Helper functions
    const getUnitName = (unitId) => {
      const unit = units.value.find(u => u.id === unitId)
      return unit ? unit.name : 'Deleted Unit'
    }

    const getActivityName = (activityId) => {
      const activity = activities.value.find(a => a.id === activityId)
      return activity ? activity.name : 'Deleted Activity'
    }

    // Check if unit and activity still exist
    const isValidPointEntry = (point) => {
      const unitExists = units.value.some(u => u.id === point.unitId)
      const activityExists = activities.value.some(a => a.id === point.activityId)
      return unitExists && activityExists
    }

    // Computed properties
    const recentPoints = computed(() => points.value.slice(0, 10))
    
    // Filter out points for deleted units/activities
    const validRecentPoints = computed(() => {
      return recentPoints.value.filter(point => isValidPointEntry(point)).slice(0, 5)
    })

    // Auth state listener
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      loading.value = false
      
      if (user) {
        fetchData()
      } else {
        router.push('/login')
      }
    })

    // Lifecycle
    onMounted(() => {
      // Auth state will be handled by onAuthStateChanged
    })

    // Return all reactive refs and functions
    return {
      currentUser,
      loading,
      units,
      activities,
      newUnit,
      newActivity,
      newPoints,
      recentPoints,
      validRecentPoints,
      addUnit,
      addActivity,
      awardPoints,
      deleteUnit,
      deleteActivity,
      getUnitName,
      getActivityName,
      logout
    }
  }
}
</script>