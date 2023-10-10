<template>
  <div
    :style="[styles.background]"
    class="w-full h-full flex flex-col overflow-hidden absolute top-0 left-0 z-10"
  >
    <div
      :style="[styles.border]"
      class="flex flex-row items-center border-b-[1px] py-1"
    >
      <div class="p-2.5 flex-none bg-reen-700 opacity-40">
        <svg class="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>magnify</title>
          <path
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
      </div>
      <input
        type="text"
        ref="locationInput"
        v-model="locationQuery"
        @keyup="searchLocations"
        :placeholder="placeholder"
        class="w-full h-full px-2 bg-transparent text-sm focus:ring-0 focus:outline-none"
      />
    </div>
    <div class="w-full h-full overflow-y-auto" v-if="isRecentLocationsVisible">
      <div
        class="px-3 py-1 border-b-[1px]"
        :style="[
          styles.secondaryBackground,
          styles.secondaryBorder,
          styles.hintTextColor,
        ]"
      >
        Recent
      </div>
      <div
        @click="locationOnSelect(recentLocation)"
        v-wave
        class="flex flex-row items-center gap-0 hover:opacity-90 cursor-pointer"
        v-for="(recentLocation, index) in recentLocations"
        :key="index"
      >
        <div
          class="w-11 p-3 opacity-40 flex items-center justify-center bg-gren-500"
        >
          <svg
            v-if="recentLocation.subType === 'CITY'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>map-marker</title>
            <path
              d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>airplane</title>
            <path
              d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"
            />
          </svg>
        </div>
        <div class="w-full border-b-[1px] py-2" :style="[styles.border]">
          <div class="text-base">{{ recentLocation.name }}</div>
          <div class="text-xs opacity-60">
            {{ recentLocation.address.cityName }},
            {{ recentLocation.address.countryName }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-full overflow-y-auto"
      v-if="locationSearchResults && locationSearchResults.length > 0"
    >
      <div
        @click="locationOnSelect(searchResult)"
        v-wave
        class="flex flex-row items-center gap-0 hover:opacity-90 cursor-pointer"
        v-for="(searchResult, index) in locationSearchResults"
        :key="index"
      >
        <div
          class="w-11 p-3 opacity-40 flex items-center justify-center bg-gren-500"
        >
          <svg
            v-if="searchResult.subType === 'CITY'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>map-marker</title>
            <path
              d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"
            />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>airplane</title>
            <path
              d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z"
            />
          </svg>
        </div>
        <div class="w-full border-b-[1px] py-2" :style="[styles.border]">
          <div class="text-base">{{ searchResult.name }}</div>
          <div class="text-xs opacity-60">
            {{ searchResult.address.cityName }},
            {{ searchResult.address.countryName }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full opacity-60" v-if="isLocationsLoading">
      <div class="flex flex-row gap-0" v-for="i in 3" :key="i">
        <div
          class="w-11 p-3 opacity-40 flex items-center justify-center bg-gren-500"
        >
          <div class="w-5 h-5 bg-neutral-500 animate-pulse rounded-full"></div>
        </div>
        <div
          class="w-full border-b-[1px] py-2 flex flex-col gap-2"
          :style="[styles.border]"
        >
          <div
            class="text-base h-5 w-48 bg-neutral-600 animate-pulse rounded-full"
          ></div>
          <div
            class="text-xs opacity-60 h-4 w-60 bg-neutral-600 animate-pulse rounded-full"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const API_URL = import.meta.env.VITE_SERVER_API;

export default {
  name: "location-selector",
  props: {
    placeholder: {
      type: String,
      default: "Search",
    },
    styles: {
      type: Object,
      default: () => ({}),
    },
    locationOnSelect: {
      type: Function,
      default: () => {},
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.locationInput.focus();
    });
    window.Telegram.WebApp.BackButton.show();

    window.Telegram.WebApp.CloudStorage.getItem(
      "recent_locations",
      (err, res) => {
        // console.log("recent_locations::::::::::::", JSON.stringify(res));
        if (res) {
          this.recentLocations = JSON.parse(res);
          console.log("this.recentLocations>>>>>>>>", this.recentLocations);
          this.isRecentLocationsVisible = true;
        }
      }
    );
  },
  data() {
    return {
      locationQuery: "",
      locationSearchResults: [],
      recentLocations: [],
      isRecentLocationsVisible: false,
      isLocationsLoading: false,
    };
  },
  methods: {
    searchLocations() {
      console.log("searchLocations");
      this.isRecentLocationsVisible = false;

      console.log("this.locationQuery", this.locationQuery);
      this.locationSearchResults = [];
      if (this.locationQuery.length > 2) {
        this.isLocationsLoading = true;
        fetch(API_URL + "/citySearch?keyword=" + this.locationQuery, {
          method: "GET",
          headers: {
            telegramInitData: window.Telegram.WebApp.initData,
          },
        })
          .then(async (res) => {
            var resData = await res.json();
            this.locationSearchResults = resData.data;
            window.Telegram.WebApp.MainButton.hide();
            this.isLocationsLoading = false;
          })
          .catch((err) => {
            console.log("err", err);
            this.isLocationsLoading = false;
          });
      }
    },
  },
};
</script>
