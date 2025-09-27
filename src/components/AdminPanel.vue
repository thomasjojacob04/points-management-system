<template>
  <div class="min-h-screen bg-gray-50 p-3">
    <div class="max-w-6xl mx-auto space-y-5">
      
      <!-- Header -->
      <div class="flex items-center justify-between bg-red-100 rounded-lg shadow-sm p-4 border-l-4 border-red-500">
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-semibold text-gray-900 truncate">Admin Panel</h2>
          <p class="text-sm text-gray-600 truncate mt-1" v-if="currentUser">
            Welcome, {{ currentUser.displayName || currentUser.email }}
          </p>
        </div>
        <button
          @click="logout"
          class="ml-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex-shrink-0"
        >
          Logout
        </button>
      </div>

      <!-- Management Card - Button on right for large devices -->
      <div class="bg-indigo-50 rounded-lg shadow-sm p-5 border-l-4 border-indigo-500">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div class="text-center lg:text-left">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Units & Activities Management</h3>
            <p class="text-gray-600 text-sm mb-3">Add, edit, and manage all units and activities in the system.</p>
            <div class="flex justify-center lg:justify-start gap-6 text-sm text-gray-500 mb-4 lg:mb-0">
              <span class="font-medium">{{ units.length }} Units</span>
              <span class="font-medium">{{ activities.length }} Activities</span>
            </div>
          </div>
          <button
            @click="goToManagement"
            class="w-full lg:w-auto lg:ml-6 lg:flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors text-sm"
          >
            Manage Units & Activities
          </button>
        </div>
      </div>

      <!-- Award Points -->
      <div class="bg-green-50 rounded-lg shadow-sm p-5 border-l-4 border-green-500">
        <h3 class="text-lg font-semibold text-gray-900 mb-5">Award or Deduct Points</h3>
        <form @submit.prevent="awardPoints" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select 
                v-model="newPoints.unitId" 
                class="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                required
              >
                <option value="">Select Unit</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Activity</label>
              <select 
                v-model="newPoints.activityId" 
                class="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" 
                required
              >
                <option value="">Select Activity</option>
                <option v-for="activity in activities" :key="activity.id" :value="activity.id">{{ activity.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select 
                v-model="newPoints.action" 
                class="w-full p-3 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="add">Award Points (+)</option>
                <option value="subtract">Deduct Points (-)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                v-model.number="newPoints.points"
                type="number"
                placeholder="Enter points"
                class="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
                min="1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2 opacity-0">Submit</label>
              <button 
                type="submit" 
                :class="newPoints.action === 'subtract' ? 
                  'bg-red-600 hover:bg-red-700' : 
                  'bg-green-600 hover:bg-green-700'"
                class="w-full text-white py-3 rounded-md transition-colors font-medium text-sm"
              >
                {{ newPoints.action === 'subtract' ? 'Deduct Points' : 'Award Points' }}
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Unit-wise Summary -->
      <div class="bg-blue-50 rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-semibold text-gray-900">Unit-wise Points Summary</h3>
          <button
            @click="refreshUnitPoints"
            class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
        
        <div class="space-y-4">
          <div v-for="unitSummary in unitPointsSummary" :key="unitSummary.unitId" 
               class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h4 class="font-semibold text-gray-900 truncate flex-1 text-lg">{{ unitSummary.unitName }}</h4>
              <div class="flex items-center gap-3 ml-3">
                <div class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {{ unitSummary.totalPoints }} points
                </div>
                <button
                  @click="deleteUnit(unitSummary.unitId)"
                  class="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#b60000" fill="none">
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="#b60000" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M9 11.7349H15" stroke="#b60000" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M10.5 15.6543H13.5" stroke="#b60000" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M3 5.5H21M16.0555 5.5L15.3729 4.09173C14.9194 3.15626 14.6926 2.68852 14.3015 2.39681C14.2148 2.3321 14.1229 2.27454 14.0268 2.2247C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23412C9.89791 2.28601 9.80479 2.3459 9.7171 2.41317C9.32145 2.7167 9.10044 3.20155 8.65842 4.17126L8.05273 5.5" stroke="#b60000" stroke-width="1.5" stroke-linecap="round"></path>
</svg>
                </button>
              </div>
            </div>
            
            <div class="space-y-2">
              <div v-for="activity in unitSummary.activities" :key="activity.activityId" 
                   class="flex items-center justify-between bg-white rounded-md p-3 border border-gray-100">
                <span class="text-gray-800 text-sm font-medium truncate flex-1">{{ activity.activityName }}</span>
                <div class="flex items-center gap-2 ml-3">
                  <span :class="activity.points >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" 
                        class="px-3 py-1 rounded-full text-sm font-semibold min-w-[60px] text-center">
                    {{ activity.points >= 0 ? '+' : '' }}{{ activity.points }}
                  </span>
                  <button
                    @click="editActivityPoints(unitSummary.unitId, activity.activityId, activity.points)"
                    class="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-2 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#695800" fill="none">
    <path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="#695800" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="#695800" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
                  </button>
                  <button
                    @click="deleteActivity(unitSummary.unitId, activity.activityId)"
                    class="bg-red-100 text-red-700 hover:bg-red-200 px-2 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#d0021b" fill="none">
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="#d0021b" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M9 11.7349H15" stroke="#d0021b" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M10.5 15.6543H13.5" stroke="#d0021b" stroke-width="1.5" stroke-linecap="round"></path>
    <path d="M3 5.5H21M16.0555 5.5L15.3729 4.09173C14.9194 3.15626 14.6926 2.68852 14.3015 2.39681C14.2148 2.3321 14.1229 2.27454 14.0268 2.2247C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23412C9.89791 2.28601 9.80479 2.3459 9.7171 2.41317C9.32145 2.7167 9.10044 3.20155 8.65842 4.17126L8.05273 5.5" stroke="#d0021b" stroke-width="1.5" stroke-linecap="round"></path>
</svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="unitPointsSummary.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-sm">No points awarded yet</p>
          </div>
        </div>
      </div>

      <!-- Recent Awards -->
      <div class="bg-purple-50 rounded-lg shadow-sm p-5 border-l-4 border-purple-500">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-semibold text-gray-900">Recent Point Awards</h3>
          <button
            @click="clearRecentPoints"
            v-if="recentAwards.length > 0"
            class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="point in recentAwards"
            :key="point.id"
            class="flex items-center justify-between bg-gray-50 rounded-lg p-4 border-l-4"
            :class="point.points > 0 ? 'border-l-green-500' : 'border-l-red-500'"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 text-sm truncate">{{ getUnitName(point.unitId) }}</div>
              <div class="text-sm text-gray-600 truncate mt-1">{{ getActivityName(point.activityId) }}</div>
            </div>
            <div :class="point.points > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'" 
                 class="px-4 py-2 rounded-full font-semibold text-sm ml-3 min-w-[70px] text-center">
              {{ point.points > 0 ? `+${point.points}` : point.points }}
            </div>
          </div>
          
          <div v-if="recentAwards.length === 0" class="text-center py-12">
            <p class="text-gray-500 text-sm">No recent point awards</p>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Edit Activity Points</h3>
          
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <div class="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p class="text-gray-900 font-medium">{{ getUnitName(editingPoints.unitId) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Activity</label>
              <div class="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p class="text-gray-900 font-medium">{{ getActivityName(editingPoints.activityId) }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                v-model.number="editingPoints.newPoints"
                type="number"
                class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          
          <div class="flex gap-3">
            <button
              @click="saveEditedPoints"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition-colors font-medium"
            >
              Save Changes
            </button>
            <button
              @click="cancelEdit"
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-md transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, getDocs, orderBy, query, limit, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore'
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
    const recentAwards = ref([]) // Separate array for recent awards display
    const newPoints = ref({ unitId: '', activityId: '', points: 0, action: 'add' })
    
    // Edit modal state
    const showEditModal = ref(false)
    const editingPoints = ref({ unitId: '', activityId: '', newPoints: 0, originalPoints: 0 })

    // Fetch data function
    const fetchData = async () => {
      try {
        const unitsSnapshot = await getDocs(collection(db, 'units'))
        units.value = unitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const activitiesSnapshot = await getDocs(collection(db, 'activities'))
        activities.value = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        const pointsQuery = query(collection(db, 'points'), orderBy('awardedAt', 'desc'), limit(50))
        const pointsSnapshot = await getDocs(pointsQuery)
        points.value = pointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Award points function
    const awardPoints = async () => {
      if (newPoints.value.unitId && newPoints.value.activityId && newPoints.value.points > 0) {
        try {
          const pointValue = newPoints.value.action === 'subtract' ? 
            -Math.abs(newPoints.value.points) : 
            Math.abs(newPoints.value.points)
          
          const newPointData = {
            unitId: newPoints.value.unitId,
            activityId: newPoints.value.activityId,
            points: pointValue,
            awardedAt: serverTimestamp()
          }
          
          // Add to points collection (for unit-wise summary)
          await addDoc(collection(db, 'points'), newPointData)
          
          // Add to recent awards array (for recent display only)
          recentAwards.value.unshift({
            ...newPointData,
            id: Date.now().toString(),
            awardedAt: new Date()
          })
          
          // Keep only last 10 recent awards
          if (recentAwards.value.length > 10) {
            recentAwards.value = recentAwards.value.slice(0, 10)
          }
          
          newPoints.value = { unitId: '', activityId: '', points: 0, action: 'add' }
          await fetchData()
        } catch (error) {
          console.error('Error awarding points:', error)
        }
      }
    }

    // Delete activity points
    const deleteActivity = async (unitId, activityId) => {
      if (confirm('Are you sure you want to delete all points for this activity? This action cannot be undone.')) {
        try {
          // Find all point entries for this unit-activity combination
          const pointsToDelete = points.value.filter(p => 
            p.unitId === unitId && p.activityId === activityId
          )
          
          // Delete all matching point entries
          for (const point of pointsToDelete) {
            await deleteDoc(doc(db, 'points', point.id))
          }
          
          await fetchData()
        } catch (error) {
          console.error('Error deleting activity points:', error)
        }
      }
    }

    // Delete complete unit
    const deleteUnit = async (unitId) => {
      if (confirm('Are you sure you want to delete all points for this entire unit? This will remove all activities and points for this unit. This action cannot be undone.')) {
        try {
          // Find all point entries for this unit
          const pointsToDelete = points.value.filter(p => p.unitId === unitId)
          
          // Delete all matching point entries
          for (const point of pointsToDelete) {
            await deleteDoc(doc(db, 'points', point.id))
          }
          
          await fetchData()
        } catch (error) {
          console.error('Error deleting unit points:', error)
        }
      }
    }

    // Clear recent points (only clears recent display, not unit-wise summary)
    const clearRecentPoints = async () => {
      if (confirm('Are you sure you want to clear all recent point awards?')) {
        recentAwards.value = []
      }
    }

    // Edit activity points
    const editActivityPoints = (unitId, activityId, currentPoints) => {
      editingPoints.value = {
        unitId,
        activityId,
        newPoints: currentPoints,
        originalPoints: currentPoints
      }
      showEditModal.value = true
    }

    // Save edited points
    const saveEditedPoints = async () => {
      try {
        // Find the most recent point entry for this unit-activity combination
        const pointsForActivity = points.value.filter(p => 
          p.unitId === editingPoints.value.unitId && 
          p.activityId === editingPoints.value.activityId
        )
        
        if (pointsForActivity.length > 0) {
          // Update the most recent entry
          const mostRecent = pointsForActivity[0]
          await updateDoc(doc(db, 'points', mostRecent.id), {
            points: editingPoints.value.newPoints
          })
        } else {
          // Create new entry if none exists
          await addDoc(collection(db, 'points'), {
            unitId: editingPoints.value.unitId,
            activityId: editingPoints.value.activityId,
            points: editingPoints.value.newPoints,
            awardedAt: serverTimestamp()
          })
        }
        
        showEditModal.value = false
        await fetchData()
      } catch (error) {
        console.error('Error updating points:', error)
      }
    }

    // Cancel edit
    const cancelEdit = () => {
      showEditModal.value = false
      editingPoints.value = { unitId: '', activityId: '', newPoints: 0, originalPoints: 0 }
    }

    // Refresh unit points
    const refreshUnitPoints = () => {
      fetchData()
    }

    // Navigation function
    const goToManagement = () => {
      router.push('/admin/manage')
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

    // Unit-wise points summary
    const unitPointsSummary = computed(() => {
      const summary = {}
      
      points.value.forEach(point => {
        if (!isValidPointEntry(point)) return
        
        if (!summary[point.unitId]) {
          summary[point.unitId] = {
            unitId: point.unitId,
            unitName: getUnitName(point.unitId),
            totalPoints: 0,
            activities: {}
          }
        }
        
        if (!summary[point.unitId].activities[point.activityId]) {
          summary[point.unitId].activities[point.activityId] = {
            activityId: point.activityId,
            activityName: getActivityName(point.activityId),
            points: 0
          }
        }
        
        summary[point.unitId].activities[point.activityId].points += point.points
        summary[point.unitId].totalPoints += point.points
      })
      
      return Object.values(summary).map(unit => ({
        ...unit,
        activities: Object.values(unit.activities)
      })).sort((a, b) => b.totalPoints - a.totalPoints)
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
      newPoints,
      recentAwards,
      unitPointsSummary,
      showEditModal,
      editingPoints,
      awardPoints,
      clearRecentPoints,
      editActivityPoints,
      saveEditedPoints,
      cancelEdit,
      refreshUnitPoints,
      deleteActivity,
      deleteUnit,
      getUnitName,
      getActivityName,
      goToManagement,
      logout
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

input:focus,
select:focus,
button:focus {
  outline: none;
}

@media (max-width: 640px) {
  button, select, input {
    min-height: 44px;
  }
  
  .space-y-5 > * + * {
    margin-top: 1.25rem;
  }
  
  .gap-5 {
    gap: 1.25rem;
  }
}

@media (max-width: 480px) {
  .p-5 {
    padding: 1rem;
  }
  
  .space-y-5 > * + * {
    margin-top: 1rem;
  }
  
  .gap-5 {
    gap: 1rem;
  }
}
</style>