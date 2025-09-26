<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="fixed top-0 left-0 right-0 bg-red-800 shadow-lg z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- MCYM Logo -->
            <div class="flex items-center space-x-2">
              <img 
                src="./assets/mcym-logo.png" 
                alt="MCYM Logo" 
                class="h-10 w-10 rounded-full bg-white p-1"
              />
              <div class="text-white">
                <div class="text-sm font-medium">Malankara Catholic Youth Movement</div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-white hover:text-red-200 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </router-link>
            <!-- User Icon for Admin Login -->
            <router-link to="/login" class="text-white hover:text-red-200 p-2 rounded-full hover:bg-red-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#ffffff" fill="none">
    <path d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto py-6 px-4 mt-16">
      <router-view />
    </main>
  </div>
</template>

<style>
@import './assets/main.css';
</style>