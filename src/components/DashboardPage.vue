<template>
  <div class="min-h-screen bg-red-25 p-3 sm:p-4 lg:p-6">
    <!-- Header -->
    <div class="text-center mb-6">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-700 mb-2">
        TIRUVALLA MEKHALA KALOLSAVAM 2K25
      </h1>
      <div class="w-20 h-0.5 bg-red-500 mx-auto rounded-full"></div>
    </div>

    <div class="space-y-6 max-w-5xl mx-auto">
      <!-- Leaderboard -->
      <div class="bg-white rounded-lg shadow-sm border border-red-100">
        <div class="bg-red-600 p-4">
          <h2 class="text-lg sm:text-xl font-semibold text-white mb-1">
            Units Leaderboard
          </h2>
          <p class="text-red-100 text-sm">Click on any unit name to view details</p>
        </div>
        
        <div class="p-4">
          <div class="space-y-3">
            <div
              v-for="(unit, index) in rankedUnits"
              :key="unit.id"
              @click="selectUnit(unit.id)"
              class="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium bg-red-500 text-white">
                  {{ index + 1 }}
                </div>
                <span class="font-medium text-sm sm:text-base text-gray-800">{{ unit.name }}</span>
              </div>
              <span class="text-lg sm:text-xl font-bold text-red-600">{{ unit.totalPoints }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Unit Details -->
      <div class="bg-white rounded-lg shadow-sm border border-red-100">
        <div class="bg-red-600 p-4">
          <h3 class="text-lg sm:text-xl font-semibold text-white">
            Unit Details
          </h3>
        </div>

        <div class="p-4">
          <select
            v-model="selectedUnitId"
            class="w-full p-3 border border-red-200 rounded-lg mb-4 bg-white focus:border-red-400 focus:ring-1 focus:ring-red-200 text-sm sm:text-base"
          >
            <option value="">Select a unit to view details</option>
            <option v-for="unit in units" :key="unit.id" :value="unit.id">
              {{ unit.name }}
            </option>
          </select>

          <div v-if="selectedUnitDetails" class="space-y-4">
            <div class="bg-red-500 rounded-lg p-4 text-white">
              <h4 class="text-base sm:text-lg font-semibold">
                {{ selectedUnitDetails.name }}
              </h4>
              <p class="text-red-100 text-sm">Activity Breakdown</p>
            </div>
            
            <div class="space-y-2">
              <div
                v-for="activity in selectedUnitDetails.activities"
                :key="activity.id"
                class="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
              >
                <span class="text-sm sm:text-base text-gray-700">{{ activity.name }}</span>
                <span class="font-semibold text-sm sm:text-base text-red-600">{{ activity.points }}</span>
              </div>
            </div>
            
            <div class="border-t border-red-200 pt-4">
              <div class="bg-red-100 rounded-lg p-4">
                <div class="flex justify-between items-center">
                  <span class="text-base sm:text-lg font-semibold text-gray-800">Total Points:</span>
                  <span class="text-xl sm:text-2xl font-bold text-red-600">{{ selectedUnitDetails.totalPoints }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

export default {
  name: 'DashboardPage',
  setup() {
    const units = ref([])
    const activities = ref([])
    const points = ref([])
    const selectedUnitId = ref('')

    const fetchData = async () => {
      // Fetch units
      const unitsSnapshot = await getDocs(collection(db, 'units'))
      units.value = unitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Fetch activities
      const activitiesSnapshot = await getDocs(collection(db, 'activities'))
      activities.value = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Fetch points
      const pointsSnapshot = await getDocs(collection(db, 'points'))
      points.value = pointsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const rankedUnits = computed(() => {
      return units.value.map(unit => {
        const unitPoints = points.value.filter(point => point.unitId === unit.id)
        const totalPoints = unitPoints.reduce((sum, point) => sum + point.points, 0)
        return { ...unit, totalPoints }
      }).sort((a, b) => b.totalPoints - a.totalPoints)
    })

    const selectedUnitDetails = computed(() => {
      if (!selectedUnitId.value) return null
      
      const unit = units.value.find(u => u.id === selectedUnitId.value)
      const unitPoints = points.value.filter(point => point.unitId === selectedUnitId.value)
      
      const activityBreakdown = activities.value.map(activity => {
        const activityPoints = unitPoints.filter(point => point.activityId === activity.id)
        const totalActivityPoints = activityPoints.reduce((sum, point) => sum + point.points, 0)
        return {
          id: activity.id,
          name: activity.name,
          points: totalActivityPoints
        }
      }).filter(activity => activity.points > 0)

      const totalPoints = activityBreakdown.reduce((sum, activity) => sum + activity.points, 0)

      return {
        ...unit,
        activities: activityBreakdown,
        totalPoints
      }
    })

    const selectUnit = (unitId) => {
      selectedUnitId.value = unitId
      // Smooth scroll to unit details section
      setTimeout(() => {
        const detailsSection = document.querySelector('.bg-white:last-child')
        if (detailsSection) {
          detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }

    onMounted(fetchData)

    return {
      units,
      rankedUnits,
      selectedUnitId,
      selectedUnitDetails,
      selectUnit
    }
  }
}
</script>