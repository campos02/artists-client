<script setup>
import AlbumList from './AlbumList.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref, watch } from 'vue'
import axios from 'axios'
import requestUrl from '../composables/requestUrl'

const props = defineProps(['category'])
let artists = ref([])
const newArtist = ref("")

async function updateArtists(category) {
    await axios.get(`${requestUrl}/api/artists/${category}`).then((response) => {artists.value = response.data.data})
    await artists.value.forEach(artist => {
        artist.albums = axios.get(`${requestUrl}/api/artists/${artist.id}/albums`).then((response) => {artist.albums = response.data.data})
    });
}

async function addArtist() {
    if (newArtist.value === "") {
        return
    }

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

async function removeArtist(artist) {
    await axios.delete(`${requestUrl}/api/artists`, {
        data: { name: artist.name }
    }).then(() => {
        artists.value.splice(artists.value.indexOf(artist), 1)
        artist.show = !artist.show
    })
}

watch(() => props.category, () => {
    updateArtists(props.category)
})

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