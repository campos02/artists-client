<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'

const requestUrl = import.meta.env.VITE_API_ENDPOINT
const props = defineProps(['artist'])
const newAlbum = ref("")

/**
 * Show or hide an artist's albums
 */
function listAlbums()
{    
    if (props.artist.show) {
        props.artist.show = !props.artist.show
    }
    else
    {
        props.artist.show = ref(true)
    }
}

/**
 * Add an album to an artist's list on the endpoint and, if successful, to its albums array
 */
async function addAlbum() {
    if (newAlbum.value === "") {
        return
    }

    await axios.post(`${requestUrl}/api/artists/${props.artist.id}/albums`, {
        album: newAlbum.value
    }).then((response) => {
        const data = response.data
        props.artist.albums.push({
            id: data.id,
            artist_name: data.artist_name,
            album: data.album,
            artist_id: data.artist_id
        })
        newAlbum.value = ""
    })
}

/**
 * Remove an artist's album from the endpoint and, if successful, from its albums array
 *
 * @param album 
 */
async function removeAlbum(album) {
    await axios.delete(`${requestUrl}/api/artists/${props.artist.id}/albums`, {
        data: { album: album.album }
    }).then(() => {
        props.artist.albums.splice(props.artist.albums.indexOf(album), 1)
    })
}
</script>

<template>
    <button @click="listAlbums()">
        <ChevronDownIcon class="w-4 h-4"/>
    </button>
    <Transition>
        <div class="flex justify-center" v-if="props.artist.show">
            <div class="p-1">
                <h4 class="font-bold text-center" v-if="props.artist.albums">Favorite albums:</h4>
                <ul class="space-y-2">
                    <li v-for="album in props.artist.albums" class="text-start grid place-items-center">
                        <div class="border-2 rounded w-60 p-1 flex justify-between">
                            {{ album.album }}
                            <button @click="removeAlbum(album)">
                                <XMarkIcon class="w-5 h-5"/>
                            </button>
                        </div>
                    </li>
                    <li class="text-start grid place-items-center">
                        <input type="text" v-model="newAlbum" @keyup.enter="addAlbum()" class="bg-inherit outline-none border-2 rounded w-60 p-1 mb-6" placeholder="Add new album"/>
                    </li>
                </ul>
            </div>
        </div>
    </Transition>
</template>

<style>
/* Modify bottom margin value while making the element invisible */
.v-enter-active,
.v-leave-active {
    transition: all 0.2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    margin-bottom: -100%;
    opacity: 0;
}
</style>