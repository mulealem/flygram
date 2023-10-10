<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full h-full flex flex-col gap-3">
      <div class="w-full h-full">
        <div class="w-full">
          <lottie-player
            autoplay
            loop
            mode="normal"
            :src="baseUrl + 'animation_lnhokrx3.json'"
          >
          </lottie-player>
        </div>
      </div>

      <div class="text-2xl px-3">Search Flight</div>
      <div class="flex gap-3 text-sm px-3">
        <div
          @click="selectFlightOption(flightOption)"
          class="flex flex-col gap-[6px] cursor-pointer"
          v-for="(flightOption, index) in flightOptions"
          :key="index"
        >
          <div>{{ flightOption.name }}</div>
          <div
            v-if="flightOption.selected"
            class="w-2/3 h-1 rounded-t-full"
            :style="[styles.buttonColor, styles.buttonTextColor]"
          ></div>
        </div>
      </div>
      <div class="">
        <div
          :style="[styles.secondaryBackground]"
          class="p-0 rounded-0xl flex flex-col"
        >
          <div
            class="flex flex-row items-center gap-3 p-4 pb-1 rounded-t-0xl"
            v-wave
            @click="showLocationSelector(setFlightFrom, 'Where from?')"
          >
            <div class="w-5 flex-none" :style="[styles.hintFill]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>airplane-takeoff</title>
                <path
                  d="M2.5,19H21.5V21H2.5V19M22.07,9.64C21.86,8.84 21.03,8.36 20.23,8.58L14.92,10L8,3.57L6.09,4.08L10.23,11.25L5.26,12.58L3.29,11.04L1.84,11.43L3.66,14.59L4.43,15.92L6.03,15.5L11.34,14.07L15.69,12.91L21,11.5C21.81,11.26 22.28,10.44 22.07,9.64Z"
                />
              </svg>
            </div>
            <div class="w-full">
              <div class="text-xs" :style="[styles.textButtonColor]">From</div>
              <div>
                <span v-if="flightFrom">{{ flightFrom.name }}</span>
                <span v-else :style="[styles.hintTextColor]">Where from?</span>
              </div>
            </div>
            <div class="text-sm" v-if="flightFrom">
              {{ flightFrom.iataCode }}
            </div>
          </div>
          <div class="pl-12">
            <hr class="w-full" :style="[styles.secondaryBorder]" />
          </div>
          <div
            class="flex flex-row items-center gap-3 p-4 pt-1 rounded-b-0xl"
            v-wave
            @click="showLocationSelector(setFlightTo, 'Your destination')"
          >
            <div class="w-5 flex-none" :style="[styles.hintFill]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>airplane-landing</title>
                <path
                  d="M2.5,19H21.5V21H2.5V19M9.68,13.27L14.03,14.43L19.34,15.85C20.14,16.06 20.96,15.59 21.18,14.79C21.39,14 20.92,13.17 20.12,12.95L14.81,11.53L12.05,2.5L10.12,2V10.28L5.15,8.95L4.22,6.63L2.77,6.24V11.41L4.37,11.84L9.68,13.27Z"
                />
              </svg>
            </div>
            <div class="w-full cursor-pinter border-t-[0px]">
              <div class="text-xs" :style="[styles.textButtonColor]">To</div>
              <div class="">
                <span v-if="flightTo">{{ flightTo.name }}</span>
                <span v-else :style="[styles.hintTextColor]"
                  >Your destination</span
                >
              </div>
            </div>
            <div class="text-sm" v-if="flightTo">{{ flightTo.iataCode }}</div>
          </div>
        </div>
      </div>
      <div class="w-full px-3">
        <div class="py-1">Continue your search</div>
        <div class="flex overflow-x-auto bg-bue-400 gap-3 h-32 py-1">
          <div
            v-for="(popularDestination, i) in popularDestinations"
            @click="setFlightTo(popularDestination)"
            :key="i"
            :style="[styles.secondaryBackground]"
            class="flex items-end bg-cover w-56 flex-none p-3 rounded-lg cursor-pointer"
            v-wave
          >
            <div>
              <div>{{ popularDestination.name }}</div>
              <div class="text-xs">
                {{ popularDestination.address.countryName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- TODO Add previous booking and search tab separate -->
    <!-- WIP -->
    <div class="w-full flex-row bordert text-sm hidden">
      <div class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center p-2">
          <div class="w-7 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>airplane-search</title>
              <path
                d="M9.55 9.63L10.9 12.22C11.5 11.17 12.41 10.31 13.5 9.74L12.73 6.45L16.62 2.56C17.2 1.97 17.2 1 16.62 .438S15.08-.148 14.5 .438L10.61 4.33L1.41 2.21L0 3.62L7.43 7.5L3.54 11.4L1.06 11.05L0 12.11L3.18 13.87L4.95 17.06L6 16L5.66 13.5L9.55 9.63M16.5 11C19 11 21 13 21 15.5C21 16.38 20.75 17.21 20.31 17.9L23.39 21L22 22.39L18.88 19.32C18.19 19.75 17.37 20 16.5 20C14 20 12 18 12 15.5S14 11 16.5 11M16.5 13C15.12 13 14 14.12 14 15.5S15.12 18 16.5 18 19 16.88 19 15.5 17.88 13 16.5 13"
              />
            </svg>
          </div>
          <div>Search</div>
        </div>
      </div>
      <div class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center p-2">
          <div class="w-7 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <title>cards-variant</title>
              <path
                d="M5,2H19A1,1 0 0,1 20,3V13A1,1 0 0,1 19,14H5A1,1 0 0,1 4,13V3A1,1 0 0,1 5,2M6,4V12H18V4H6M20,17A1,1 0 0,1 19,18H5A1,1 0 0,1 4,17V16H20V17M20,21A1,1 0 0,1 19,22H5A1,1 0 0,1 4,21V20H20V21Z"
              />
            </svg>
          </div>
          <div>Bookings</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "@/stores/search";
import { useStyleStore } from "@/stores/style";

export default {
  name: "main",
  props: {
    showLocationSelector: {
      type: Function,
      required: true,
    },
    flightFrom: {
      type: Object,
      default: {},
    },
    flightTo: {
      type: Object,
      default: {},
    },
    setFlightFrom: {
      type: Function,
      required: true,
    },
    setFlightTo: {
      type: Function,
      required: true,
    },
  },
  mounted() {},
  components: {},
  computed: {
    ...mapState(useSearchStore, ["flightOptions", "popularDestinations"]),
    ...mapState(useStyleStore, ["styles"]),
    baseUrl() {
      return import.meta.env.BASE_URL;
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(useSearchStore, ["selectFlightOption"]),
  },
};
</script>
