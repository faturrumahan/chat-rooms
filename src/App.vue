<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRooms } from './stores/rooms'

const route = useRoute()
const rooms = useRooms()

onMounted(() => {
  rooms.fetchData()
})
</script>

<template>
  <header class="w-1/3 max-h-screen overflow-y-scroll hide-scroll px-3">
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/chat/asd">chat</RouterLink>
        <RouterLink to="/chat/dsa">chat</RouterLink>
      </nav>
    </div> -->
    <nav>
      <div v-if="rooms.loading">Loading...</div>
      <div v-else-if="rooms.error">Error: {{ rooms.error.message }}</div>
      <ul v-else-if="rooms.data">
        <li
          v-for="item in rooms.data.data.customer_rooms"
          :key="item.room_id"
          :class="
            item.room_id == route.params.roomId
              ? 'bg-[#393E46] rounded-lg'
              : 'hover:bg-[#393e4686] rounded-lg'
          "
        >
          <RouterLink :to="`/chat/${item.room_id}`" class="block w-full h-full px-4 py-2">
            <div class="flex gap-3 items-center">
              <img
                :src="item.user_avatar_url"
                :alt="item.name + ' avatar'"
                class="w-10 h-10 rounded-full"
              />
              <div>
                <p :class="item.room_id == route.params.roomId && 'font-bold'">{{ item.name }}</p>
                <p class="text-gray-500 italic text-sm">{{ item.user_id }}</p>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
      <p v-else>No data available.</p>
    </nav>
  </header>

  <div class="flex-1 bg-[#222831] rounded-lg p-5">{{ route.params.roomId || 'welcome' }}</div>

  <!-- <RouterView /> -->
</template>

<style>
.hide-scroll::-webkit-scrollbar {
  display: none;
}

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
