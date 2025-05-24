<script setup>
import { RouterLink } from 'vue-router'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRooms } from './stores/rooms'

const route = useRoute()
const rooms = useRooms()

onMounted(async () => {
  await rooms.fetchData()

  if (rooms.data?.data?.customer_rooms) {
    allMessages.value = rooms.data.data.customer_rooms
  }
})

const allMessages = ref([])
const messages = ref([])

const lastSendMessage = ref('')
const message = ref('')
const messageContainer = ref(null)

function handleSendMessage() {
  if (message.value.trim() !== '') {
    lastSendMessage.value = message.value
    messages.value.push({ name: null, message: message.value })
    message.value = ''
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    const el = messageContainer.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

watch(
  () => route.params.roomId,
  (roomId) => {
    if (roomId) {
      lastSendMessage.value = ''
      messages.value = rooms.data.data.customer_rooms
        .filter((item) => item.room_id == roomId && item.last_customer_comment_text)
        .map((item) => ({
          name: item.name,
          message: item.last_customer_comment_text,
        }))
    }
  },
  { immediate: true },
)
</script>

<template>
  <header class="w-1/3 max-h-screen overflow-y-scroll hide-scroll px-3">
    <nav>
      <div v-if="rooms.loading">Loading...</div>
      <div v-else-if="rooms.error">Error: {{ rooms.error.message }}</div>
      <ul v-else-if="rooms.data">
        <li
          v-for="item in allMessages"
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
                <p class="text-gray-500 italic text-sm">
                  {{
                    route.params.roomId == item.room_id
                      ? lastSendMessage || item.last_comment_text || item.last_customer_comment_text
                      : item.last_comment_text || item.last_customer_comment_text
                  }}
                </p>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
      <p v-else>No data available.</p>
    </nav>
  </header>

  <div class="flex-1 bg-[#222831] rounded-lg p-5">
    <div v-if="route.params.roomId" class="flex flex-col h-full gap-3">
      <div class="h-fit px-5 py-3 bg-[#DFD0B8] rounded-lg text-[#222831] flex gap-3 items-center">
        <img
          :src="allMessages.find((item) => item.room_id == route.params.roomId)?.user_avatar_url"
          :alt="allMessages.find((item) => item.room_id == route.params.roomId)?.name + ' avatar'"
          class="w-10 h-10 rounded-full border"
        />
        <div>
          <p class="font-bold">
            {{ allMessages.find((item) => item.room_id == route.params.roomId)?.name }}
          </p>
          <p class="text-gray-500 italic text-xs">
            {{ allMessages.find((item) => item.room_id == route.params.roomId)?.user_id }}
          </p>
        </div>
      </div>
      <div class="flex-1 overflow-y-scroll hide-scroll" ref="messageContainer">
        <div class="flex flex-col justify-end">
          <ul>
            <li
              v-for="(msg, index) in messages"
              :key="index"
              :class="['flex', msg.name == null ? 'justify-end' : 'justify-start']"
            >
              <div class="px-5 py-3 rounded-lg bg-slate-950 mb-1">
                <p class="text-gray-500 italic text-sm">
                  {{ msg.name || 'You' }}
                </p>
                <p>{{ msg.message }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <form
        @submit.prevent="handleSendMessage"
        class="h-fit px-5 py-3 bg-slate-950 rounded-lg flex justify-between items-center gap-3"
      >
        <input
          v-model="message"
          type="text"
          class="flex-1 focus:outline-hidden"
          placeholder="Type your message..."
        />
        <button
          type="button"
          class="bg-[#393E46] rounded-lg px-3 py-1 hover:cursor-pointer hover:bg-[#393e4686]"
          @click="handleSendMessage"
        >
          send
        </button>
      </form>
    </div>
    <div v-else class="flex w-full h-full items-center justify-center font-bold">
      Welcome To Chat Room
    </div>
  </div>

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
