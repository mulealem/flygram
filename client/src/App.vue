<template>
  <div class="w-full h-screen bg-geen-400 select-none relative overflow-hidden">
    <div
      class="w-full h-full flex justify-center items-center"
      v-if="isValidating"
    >
      <div
        class="w-16 h-16 p-3 bg-opacity-40 bg-blue-500 fill-white animate-pulse rounded-full bg-gradient-to-r from-blue-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>airplane</title>
          <path
            d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"
          />
        </svg>
      </div>
    </div>
    <div
      class="w-full h-full"
      v-else-if="!isValidating && isValidTelegramWebApp"
    >
      <router-view />
    </div>
    <div
      v-else
      class="w-full h-full flex justify-center items-center text-center"
    >
      <div>
        Please access this application exclusively through Telegram Web.
      </div>
    </div>
  </div>
</template>
<script>
import { useStyleStore } from "@/stores/style";
import { useChatStore } from "@/stores/chat";
import { mapActions } from "pinia";

const API_URL = import.meta.env.VITE_SERVER_API;

export default {
  name: "App",
  mounted() {
    window.Telegram.WebApp.ready();
    console.log("telegramInitData:", window.Telegram.WebApp.initData);
    this.isValidating = true;
    fetch(API_URL + "/validate", {
      method: "GET",
      headers: {
        telegramInitData: window.Telegram.WebApp.initData,
      },
    })
      .then(async (res) => {
        // console.log("res", await res.json());
        var validationRes = await res.json();
        this.validationRes = validationRes;
        this.setChatId(validationRes.chat_id);
        this.isValidTelegramWebApp = validationRes.isValid;
        this.isValidating = false;
      })
      .catch((err) => {
        console.log("err", err);
        this.validationRes = err;
        this.isValidating = false;
      });

    this.setThemeParams(window.Telegram.WebApp.themeParams);
    this.setWebAppColorScheme(window.Telegram.WebApp.colorScheme);

    window.Telegram.WebApp.onEvent("themeChanged", (event) => {
      this.setThemeParams({
        ...window.Telegram.WebApp.themeParams,
      });
    });
  },
  data() {
    return {
      isValidTelegramWebApp: false,
      isValidating: false,
      validationRes: {},
    };
  },
  methods: {
    ...mapActions(useStyleStore, ["setThemeParams", "setWebAppColorScheme"]),
    ...mapActions(useChatStore, ["setChatId"]),
  },
};
</script>
