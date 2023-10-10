<template>
  <div
    :style="[styles.background]"
    class="w-full h-screen flex flex-col gap-0 overflow-y-auto absolute top-0 left-0 z-10"
  >
    <div class="w-full text-center text-3xl" :style="[styles.hintTextColor]">
      ${{ selectedFlightOffer.price }}
    </div>
    <div
      v-if="flightFrom && flightTo"
      :style="[styles.border]"
      class="w-full flex flex-row items-center rounded-0l p-0 text-base border-b-[0px]"
    >
      <div class="w-full flex flex-col items-end rounded-0l-xl px-4 py-3 pl-0">
        <div class="">
          {{ flightFrom.name }}
        </div>
        <div :style="[styles.hintTextColor]">{{ flightFrom.iataCode }}</div>
      </div>
      <div
        class="h-1/2 w-[1px] bg-neutral-500"
        :style="[styles.secondaryBackground]"
      ></div>
      <div class="w-full flex flex-col items-start px-4 py-3 pr-0 rounded-r-xl">
        <div class="">
          {{ flightTo.name }}
        </div>
        <div :style="[styles.hintTextColor]">{{ flightTo.iataCode }}</div>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        class="rounded-x"
        :style="[styles.secondaryBackground]"
        v-for="(itinerary, index) in selectedFlightOffer.itineraries"
      >
        <div v-for="(segment, index2) in itinerary.segments" :key="index2">
          <div
            class="flex flex-row gap-3 items-center pl-3 border-b-[1px] py-3"
            :style="[styles.secondaryBorder]"
          >
            <div class="flex-none">
              <div
                class="w-8 h-8 rounded-lg flex justify-center items-center"
                :style="[styles.background]"
              >
                {{ segment.carrierCode }}
              </div>
            </div>
            <div class="w-full">
              <div>
                {{
                  flightOffersSearchResultDictionary["carriers"][
                    segment.carrierCode
                  ]
                }}
              </div>
              <div class="text-sm" :style="[styles.hintTextColor]">
                {{ segment.duration }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-0 pl-10 py-2">
            <div class="flex flex-row gap-3 items-center">
              <div class="w-4" :style="[styles.hintFill]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>airplane-takeoff</title>
                  <path
                    d="M2.5,19H21.5V21H2.5V19M22.07,9.64C21.86,8.84 21.03,8.36 20.23,8.58L14.92,10L8,3.57L6.09,4.08L10.23,11.25L5.26,12.58L3.29,11.04L1.84,11.43L3.66,14.59L4.43,15.92L6.03,15.5L11.34,14.07L15.69,12.91L21,11.5C21.81,11.26 22.28,10.44 22.07,9.64Z"
                  />
                </svg>
              </div>
              <div
                class="w-full flex flex-row gap-5 border-b-[1px] py-2"
                :style="[styles.secondaryBorder]"
              >
                <div class="flex-none w-20">
                  <div class="text-sm">
                    {{ formatDate(segment.departure.at, "LT") }}
                  </div>
                  <div class="text-sm" :style="[styles.hintTextColor]">
                    {{ formatDate(segment.departure.at, "DD MMM, ddd") }}
                  </div>
                </div>
                <div class="w-full">
                  <div class="text-sm">{{ segment.departure.iataCode }}</div>
                  <div class="text-sm" :style="[styles.hintTextColor]">
                    {{
                      flightOffersSearchResultDictionary["locations"][
                        segment.departure.iataCode
                      ].cityCode
                    }},
                    {{
                      flightOffersSearchResultDictionary["locations"][
                        segment.departure.iataCode
                      ].countryCode
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row gap-3 items-center">
              <div class="w-4" :style="[styles.hintFill]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>airplane-landing</title>
                  <path
                    d="M2.5,19H21.5V21H2.5V19M9.68,13.27L14.03,14.43L19.34,15.85C20.14,16.06 20.96,15.59 21.18,14.79C21.39,14 20.92,13.17 20.12,12.95L14.81,11.53L12.05,2.5L10.12,2V10.28L5.15,8.95L4.22,6.63L2.77,6.24V11.41L4.37,11.84L9.68,13.27Z"
                  />
                </svg>
              </div>
              <div class="w-full flex flex-row gap-5 py-2">
                <div class="flex-none w-20">
                  <div class="text-sm">
                    {{ formatDate(segment.arrival.at, "LT") }}
                  </div>
                  <div class="text-sm" :style="[styles.hintTextColor]">
                    {{ formatDate(segment.arrival.at, "DD MMM, ddd") }}
                  </div>
                </div>
                <div class="w-full">
                  <div class="text-sm">{{ segment.arrival.iataCode }}</div>
                  <div class="text-sm" :style="[styles.hintTextColor]">
                    {{
                      flightOffersSearchResultDictionary["locations"][
                        segment.arrival.iataCode
                      ].cityCode
                    }},
                    {{
                      flightOffersSearchResultDictionary["locations"][
                        segment.arrival.iataCode
                      ].countryCode
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- layover time/location display  -->
        <div class="p-2 hidden" v-if="itinerary.segments.length > 1">
          <div
            class="flex flex-row items-center gap-3 px-3 py-2 rounded-lg"
            :style="[styles.background]"
          >
            <div class="w-7 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>walk</title>
                <path
                  d="M14.12,10H19V8.2H15.38L13.38,4.87C13.08,4.37 12.54,4.03 11.92,4.03C11.74,4.03 11.58,4.06 11.42,4.11L6,5.8V11H7.8V7.33L9.91,6.67L6,22H7.8L10.67,13.89L13,17V22H14.8V15.59L12.31,11.05L13.04,8.18M14,3.8C15,3.8 15.8,3 15.8,2C15.8,1 15,0.2 14,0.2C13,0.2 12.2,1 12.2,2C12.2,3 13,3.8 14,3.8Z"
                />
              </svg>
            </div>
            <div>
              <div>
                Layover in
                <!--  -->
              </div>
              <div class="text-sm" :style="styles.hintTextColor">07h 25m</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import { useStyleStore } from "../stores/style";

export default {
  name: "flight-offer-detail",
  mounted() {
    window.Telegram.WebApp.MainButton.setText("Book Now");
    window.Telegram.WebApp.MainButton.setParams({
      color: this.themeParams.button_color,
      textColor: this.themeParams.button_text_color,
    });
    window.Telegram.WebApp.MainButton.show();
  },
  props: {
    selectedFlightOffer: {
      type: Object,
      default: null,
    },
    flightFrom: {
      type: Object,
      default: null,
    },
    flightTo: {
      type: Object,
      default: null,
    },
    flightOffersSearchResultDictionary: {
      type: Object,
      default: null,
    },
    formatDate: {
      type: Function,
      default: null,
    },
    setSelectFlightOffer: {
      type: Function,
      default: null,
    },
    showFlightSearchView: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(useStyleStore, ["styles", "themeParams"]),
  },
  method: {},
};
</script>
