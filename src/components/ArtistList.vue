<script setup>
import AlbumList from './AlbumList.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import axios from 'axios'

const requestUrl = import.meta.env.VITE_API_ENDPOINT
const props = defineProps(['category'])
let artists = ref([])
const newArtist = ref("")

/**
 * Get artists data from the API again
 *
 * @param category
 */
async function updateArtists(category) {
    await axios.get(`${requestUrl}/api/artists/${category}`).then((response) => {artists.value = response.data.data})
    await artists.value.forEach(artist => {
        artist.albums = axios.get(`${requestUrl}/api/artists/${artist.id}/albums`).then((response) => {artist.albums = response.data.data})
    });
}

/**
 * Add a new artist to the endpoint and, if successful, push the data received to the artists array
 */
async function addArtist() {
    if (newArtist.value === "") {
        return
    }

    // Capitalize the first letter for the API
    const category = props.category.charAt(0).toUpperCase() + props.category.slice(1)

    await axios.post(`${requestUrl}/api/artists`, {
        name: newArtist.value,
        category: category
    }).then((response) => {
        const data = response.data
        artists.value.push({
            id: data.id,
            name: data.name,
            category: data.category,
            albums: []
        })
        newArtist.value = ""
    })
}

/**
 * Remove an artist from the endpoint and, if successful, from the artists array
 *
 * @param artist 
 */
async function removeArtist(artist) {
    await axios.delete(`${requestUrl}/api/artists`, {
        data: { name: artist.name }
    }).then(() => {
        artists.value.splice(artists.value.indexOf(artist), 1)
        artist.show = !artist.show
    })
}

/**
 * Request artists again if a new category is selected
 */
watch(() => props.category, () => {
    updateArtists(props.category)
})

// Request data from the API on first render
updateArtists(props.category)
</script>

<template>
    <h1 class="text-2xl font-bold">Artists</h1>
    <ul v-if="artists" class="space-y-1">
        <li v-for="artist in artists" class="text-start p-1 grid place-items-center">
            <div class="border-2 rounded w-72 p-1 flex justify-between flex-row">
                {{ artist.name }}
                <button @click="removeArtist(artist)">
                    <XMarkIcon class="w-5 h-5"/>
                </button>
            </div>
            <AlbumList :artist="artist"/>
        </li>
        <li class="text-start p-1 grid place-items-center">
            <input v-model="newArtist" @keyup.enter="addArtist()" class="bg-inherit outline-none border-2 rounded w-72 p-1 mb-6" placeholder="Add new artist"/>
        </li>
    </ul>
</template>