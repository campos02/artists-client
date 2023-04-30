import { ref } from 'vue'

const loggedIn = ref(false)

export function useLoggedIn() {
    const setLoggedIn = (value) => {
        loggedIn.value = value
    }
    return { loggedIn, setLoggedIn }
}