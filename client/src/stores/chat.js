import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", {
  state: () => ({
    chat_id: null,
  }),
  getters: {},
  actions: {
    setChatId(id) {
      this.chat_id = id;
    },
  },
});
