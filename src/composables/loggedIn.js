import { ref } from 'vue'

const loggedIn = ref(false)

/**
 * Export a logged in variable for state across multiple components
 */
export function useLoggedIn() {
    const setLoggedIn = (value) => {
        loggedIn.value = value
    }
    return { loggedIn, setLoggedIn }
}