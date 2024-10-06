<script setup>
import { ref } from 'vue'
import { useLoggedIn } from './composables/loggedIn'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import ArtistList from './components/ArtistList.vue'
import Login from './components/Login.vue'
import axios from 'axios'

const requestUrl = import.meta.env.VITE_API_ENDPOINT
const category = ref("listening")
const { loggedIn, setLoggedIn } = useLoggedIn()
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

// Check if the user is logged in, remove login screen if so
axios.get(`${requestUrl}/api/user`).then(() => setLoggedIn(true))

/**
 * Logout and go back to login screen if successful
 */
async function logout() {
  await axios.get(`${requestUrl}/logout`).then(() => setLoggedIn(false))
}

/**
 * Set artists category
 *
 * @param cat Category to be set
 */
function setCategory(cat) {
  category.value = cat
}
</script>

<template>
  <div class="grid h-screen">
    <button @click="logout" class="p-2 hover:bg-neutral-700 justify-self-end self-start" v-if="loggedIn">
      <ArrowRightOnRectangleIcon class="w-5 h-5"/>
    </button>
    <div class="flex flex-col text-center space-y-3 justify-self-center" :class="[{'self-center': !loggedIn}, {'self-start': loggedIn}]">
      <Login v-if="!loggedIn"/>
      <div v-if="loggedIn" class="space-y-3">
        <div class="flex justify-evenly border-neutral-600 border-b">
          <button @click="setCategory('listening')" :class="['p-2', 'hover:bg-neutral-700', {'bg-neutral-700': category === 'listening'}]">Listening</button>
          <button @click="setCategory('other')" :class="['p-2', 'hover:bg-neutral-700', {'bg-neutral-700': category === 'other'}]">Other</button>
        </div>
        <ArtistList :category="category"/>
      </div>
    </div>
  </div>
</template>