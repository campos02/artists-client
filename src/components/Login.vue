<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useLoggedIn } from '../composables/loggedIn'

const requestUrl = import.meta.env.VITE_API_ENDPOINT
const email = ref("")
const password = ref("")
const { setLoggedIn } = useLoggedIn()

/**
 * Login in the API, if successful clear inputs and remove login screen
 */
async function login() {
    await axios.get(`${requestUrl}/sanctum/csrf-cookie`)
    await axios.post(`${requestUrl}/login`, {
        email: email.value,
        password: password.value,
        remember: true
    })
    
    email.value = ""
    password.value = ""
    setLoggedIn(true)
}

// Check if the user is logged in, remove login screen if so
axios.get(`${requestUrl}/api/user`).then(() => setLoggedIn(true))
</script>

<template>
    <h1 class="text-xl font-bold">App login</h1>
    <input v-model="email" @keyup.enter="login" class="bg-inherit outline-none border-2 rounded w-72 p-1 mb-6" placeholder="Email"/>
    <input type="password" v-model="password" @keyup.enter="login" class="bg-inherit outline-none border-2 rounded w-72 p-1 mb-6" placeholder="Password"/>
    <button @click="login" class="hover:text-white">Login</button>
</template>