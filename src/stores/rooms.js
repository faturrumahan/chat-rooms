import { defineStore } from 'pinia'

export const useRooms = defineStore('rooms', {
  state: () => ({
    data: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchData() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/list_rooms.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.data = await response.json()
      } catch (e) {
        this.error = e
      } finally {
        this.loading = false
      }
    },
  },
})
