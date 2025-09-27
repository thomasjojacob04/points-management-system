<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 bg-white rounded-lg shadow p-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Units & Activities Management</h2>
        <p class="text-sm text-gray-600">Add, edit, and manage all units and activities</p>
      </div>
      <button
        @click="goBackToAdmin"
        class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
      >
        Back to Admin
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Units Management Section -->
      <div class="space-y-6">
        <!-- Add/Edit Unit Form -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-bold mb-4 text-blue-700">
            {{ editingUnit ? 'Edit Unit' : 'Add New Unit' }}
          </h3>
          <form @submit.prevent="editingUnit ? updateUnit() : addUnit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unit Name</label>
              <input
                v-model="unitForm.name"
                type="text"
                placeholder="Enter unit name"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div class="flex gap-2">
              <button 
                type="submit" 
                :class="editingUnit ? 
                  'bg-yellow-600 hover:bg-yellow-700' : 
                  'bg-blue-600 hover:bg-blue-700'"
                class="flex-1 text-white py-3 rounded-lg transition-colors"
              >
                {{ editingUnit ? 'Update Unit' : 'Add Unit' }}
              </button>
              <button
                v-if="editingUnit"
                type="button"
                @click="cancelUnitEdit"
                class="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Units List -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-blue-700">Units</h3>
            <div class="text-sm text-gray-500">
              {{ units.length }} unit{{ units.length !== 1 ? 's' : '' }}
            </div>
          </div>

          <!-- Units Search -->
          <div class="mb-4">
            <input
              v-model="unitsSearchQuery"
              type="text"
              placeholder="Search units..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Units List -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="unit in filteredUnits" 
              :key="unit.id"
              class="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div>
                <span class="font-medium text-gray-900">{{ unit.name }}</span>
                <div class="text-xs text-gray-500">
                  Created: {{ formatDate(unit.createdAt) }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editUnit(unit)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteUnit(unit.id, unit.name)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State for Units -->
          <div v-if="filteredUnits.length === 0 && unitsSearchQuery" class="text-center py-6">
            <div class="text-gray-400 mb-2">No units found</div>
            <div class="text-gray-500 text-sm">Try adjusting your search query</div>
          </div>

          <div v-if="units.length === 0" class="text-center py-6">
            <div class="text-gray-400 mb-2">No units added yet</div>
            <div class="text-gray-500 text-sm">Add your first unit using the form above</div>
          </div>
        </div>
      </div>

      <!-- Activities Management Section -->
      <div class="space-y-6">
        <!-- Add/Edit Activity Form -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-bold mb-4 text-green-700">
            {{ editingActivity ? 'Edit Activity' : 'Add New Activity' }}
          </h3>
          <form @submit.prevent="editingActivity ? updateActivity() : addActivity()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
              <input
                v-model="activityForm.name"
                type="text"
                placeholder="Enter activity name"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div class="flex gap-2">
              <button 
                type="submit" 
                :class="editingActivity ? 
                  'bg-yellow-600 hover:bg-yellow-700' : 
                  'bg-green-600 hover:bg-green-700'"
                class="flex-1 text-white py-3 rounded-lg transition-colors"
              >
                {{ editingActivity ? 'Update Activity' : 'Add Activity' }}
              </button>
              <button
                v-if="editingActivity"
                type="button"
                @click="cancelActivityEdit"
                class="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Activities List -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-green-700">Activities</h3>
            <div class="text-sm text-gray-500">
              {{ activities.length }} activit{{ activities.length !== 1 ? 'ies' : 'y' }}
            </div>
          </div>

          <!-- Activities Search -->
          <div class="mb-4">
            <input
              v-model="activitiesSearchQuery"
              type="text"
              placeholder="Search activities..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Activities List -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="activity in filteredActivities" 
              :key="activity.id"
              class="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div>
                <span class="font-medium text-gray-900">{{ activity.name }}</span>
                <div class="text-xs text-gray-500">
                  Created: {{ formatDate(activity.createdAt) }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editActivity(activity)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteActivity(activity.id, activity.name)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State for Activities -->
          <div v-if="filteredActivities.length === 0 && activitiesSearchQuery" class="text-center py-6">
            <div class="text-gray-400 mb-2">No activities found</div>
            <div class="text-gray-500 text-sm">Try adjusting your search query</div>
          </div>

          <div v-if="activities.length === 0" class="text-center py-6">
            <div class="text-gray-400 mb-2">No activities added yet</div>
            <div class="text-gray-500 text-sm">Add your first activity using the form above</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase/config'

export default {
  setup() {
    const router = useRouter()
    const auth = getAuth()
    
    // Data refs
    const units = ref([])
    const activities = ref([])
    const unitForm = ref({ name: '' })
    const activityForm = ref({ name: '' })
    const editingUnit = ref(null)
    const editingActivity = ref(null)
    const unitsSearchQuery = ref('')
    const activitiesSearchQuery = ref('')

    // Computed properties
    const filteredUnits = computed(() => {
      if (!unitsSearchQuery.value) return units.value
      return units.value.filter(unit => 
        unit.name.toLowerCase().includes(unitsSearchQuery.value.toLowerCase())
      )
    })

    const filteredActivities = computed(() => {
      if (!activitiesSearchQuery.value) return activities.value
      return activities.value.filter(activity => 
        activity.name.toLowerCase().includes(activitiesSearchQuery.value.toLowerCase())
      )
    })

    // Fetch data functions
    const fetchUnits = async () => {
      try {
        const unitsSnapshot = await getDocs(collection(db, 'units'))
        units.value = unitsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })).sort((a, b) => a.name.localeCompare(b.name))
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    const fetchActivities = async () => {
      try {
        const activitiesSnapshot = await getDocs(collection(db, 'activities'))
        activities.value = activitiesSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })).sort((a, b) => a.name.localeCompare(b.name))
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    const fetchData = async () => {
      await Promise.all([fetchUnits(), fetchActivities()])
    }

    // Units CRUD operations
    const addUnit = async () => {
      if (unitForm.value.name.trim()) {
        try {
          await addDoc(collection(db, 'units'), {
            name: unitForm.value.name.trim(),
            createdAt: serverTimestamp()
          })
          unitForm.value.name = ''
          await fetchUnits()
        } catch (error) {
          console.error('Error adding unit:', error)
          alert('Error adding unit. Please try again.')
        }
      }
    }

    const editUnit = (unit) => {
      editingUnit.value = unit
      unitForm.value.name = unit.name
    }

    const updateUnit = async () => {
      if (unitForm.value.name.trim() && editingUnit.value) {
        try {
          await updateDoc(doc(db, 'units', editingUnit.value.id), {
            name: unitForm.value.name.trim(),
            updatedAt: serverTimestamp()
          })
          cancelUnitEdit()
          await fetchUnits()
        } catch (error) {
          console.error('Error updating unit:', error)
          alert('Error updating unit. Please try again.')
        }
      }
    }

    const cancelUnitEdit = () => {
      editingUnit.value = null
      unitForm.value.name = ''
    }

    const deleteUnit = async (unitId, unitName) => {
      if (confirm(`Are you sure you want to delete the unit "${unitName}"?\n\nThis action cannot be undone and may affect existing point records.`)) {
        try {
          await deleteDoc(doc(db, 'units', unitId))
          await fetchUnits()
        } catch (error) {
          console.error('Error deleting unit:', error)
          alert('Error deleting unit. Please try again.')
        }
      }
    }

    // Activities CRUD operations
    const addActivity = async () => {
      if (activityForm.value.name.trim()) {
        try {
          await addDoc(collection(db, 'activities'), {
            name: activityForm.value.name.trim(),
            createdAt: serverTimestamp()
          })
          activityForm.value.name = ''
          await fetchActivities()
        } catch (error) {
          console.error('Error adding activity:', error)
          alert('Error adding activity. Please try again.')
        }
      }
    }

    const editActivity = (activity) => {
      editingActivity.value = activity
      activityForm.value.name = activity.name
    }

    const updateActivity = async () => {
      if (activityForm.value.name.trim() && editingActivity.value) {
        try {
          await updateDoc(doc(db, 'activities', editingActivity.value.id), {
            name: activityForm.value.name.trim(),
            updatedAt: serverTimestamp()
          })
          cancelActivityEdit()
          await fetchActivities()
        } catch (error) {
          console.error('Error updating activity:', error)
          alert('Error updating activity. Please try again.')
        }
      }
    }

    const cancelActivityEdit = () => {
      editingActivity.value = null
      activityForm.value.name = ''
    }

    const deleteActivity = async (activityId, activityName) => {
      if (confirm(`Are you sure you want to delete the activity "${activityName}"?\n\nThis action cannot be undone and may affect existing point records.`)) {
        try {
          await deleteDoc(doc(db, 'activities', activityId))
          await fetchActivities()
        } catch (error) {
          console.error('Error deleting activity:', error)
          alert('Error deleting activity. Please try again.')
        }
      }
    }

    // Navigation function
    const goBackToAdmin = () => {
      router.push('/admin')
    }

    // Helper function
    const formatDate = (timestamp) => {
      if (!timestamp) return 'Unknown'
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return date.toLocaleDateString()
      } catch (error) {
        return 'Invalid date'
      }
    }

    // Auth state listener
    onAuthStateChanged(auth, (user) => {
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

    return {
      units,
      activities,
      unitForm,
      activityForm,
      editingUnit,
      editingActivity,
      unitsSearchQuery,
      activitiesSearchQuery,
      filteredUnits,
      filteredActivities,
      addUnit,
      editUnit,
      updateUnit,
      cancelUnitEdit,
      deleteUnit,
      addActivity,
      editActivity,
      updateActivity,
      cancelActivityEdit,
      deleteActivity,
      goBackToAdmin,
      formatDate
    }
  }
}
</script>