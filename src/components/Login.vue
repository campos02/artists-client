<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useLoggedIn } from '../composables/loggedIn'

const requestUrl = import.meta.env.VITE_API_ENDPOINT
const email = ref("")
const password = ref("")
const { setLoggedIn } = useLoggedIn()
const remember = ref(false)

/**
 * Login in the API, if successful clear inputs and remove login screen
 */
async function login() {
    await axios.get(`${requestUrl}/sanctum/csrf-cookie`)
    await axios.post(`${requestUrl}/login`, {
        email: email.value,
        password: password.value,
        remember: remember.value
    })
    
    email.value = ""
    password.value = ""
    setLoggedIn(true)
}
</script>

<template>
    <h1 class="text-xl font-bold">Client Login</h1>
    <input v-model="email" @keyup.enter="login" class="bg-inherit outline-none border-2 rounded w-72 p-1 mb-6" placeholder="Email"/>
    <input type="password" v-model="password" @keyup.enter="login" class="bg-inherit outline-none border-2 rounded w-72 p-1 mb-6" placeholder="Password"/>
    <div>
        <input type="checkbox" id="remembercheckbox" v-model="remember" class="m-1 mb-0"/>
        <label for="remembercheckbox">Remember Me</label>
    </div>
    <button @click="login" class="hover:text-white border-2 py-1 px-2 rounded self-center">Login</button>
</template>