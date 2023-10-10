<template>
  <div class="w-full h-full flex flex-col gap-3 overflow-y-auto relative">
    <div class="relative h-28 flex-none overflow-hidden hidden">
      <lottie-player
        autoplay
        loop
        mode="normal"
        :src="baseUrl + 'animation_lng16xmz.json'"
      >
      </lottie-player>
      <div
        :style="[
          'background-image:' +
            'linear-gradient(to top, ' +
            themeParams.bg_color +
            ', transparent);',
        ]"
        class="w-full h-full absolute top-0 left-0 z-10 bg-opacity-90 px-12 flex items-center"
      ></div>
    </div>
    <div
      :style="[styles.background]"
      class="sticky top-0 z-10 py-3 flex flex-col gap-2"
    >
      <div class="px-3">
        <div class="text-sm py-1" :style="[styles.hintTextColor]">
          Book me a flight from
        </div>
        <div class="text-xl">
          {{ flightFrom.name }} ({{ flightFrom.iataCode }})
          <span class="" :style="[styles.hintTextColor]"> to </span>
          {{ flightTo.name }} ({{ flightTo.iataCode }})
          <span class="" :style="[styles.hintTextColor]">on</span>
          {{ formatDate(departDate, "MMM DD, YYYY") }},
          <span class="" :style="[styles.hintTextColor]" v-if="returnDate"
            >returning
          </span>
          <span v-if="returnDate">
            {{ formatDate(returnDate, "MMM DD, YYYY") }}</span
          >
          <span class="" :style="[styles.hintTextColor]"> for</span>
          {{ travelersString }}
        </div>
      </div>
      <div
        :style="[styles.hintTextColor]"
        class="flex justify-between items-center px-3 fill-neutral-400 text-sm"
      >
        <div>Showing {{ flightOffersSearchResults.length }} results</div>
        <div v-wave class="flex items-center gap-1 cursor-pointer">
          Filter
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>filter-outline</title>
            <path
              d="M15,19.88C15.04,20.18 14.94,20.5 14.71,20.71C14.32,21.1 13.69,21.1 13.3,20.71L9.29,16.7C9.06,16.47 8.96,16.16 9,15.87V10.75L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L15,10.75V19.88M7.04,5L11,10.06V15.58L13,17.58V10.05L16.96,5H7.04Z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-1 shadow">
      <div
        @click="selectFlightOffer(flightOffersSearchResult)"
        v-wave
        v-for="(
          flightOffersSearchResult, index
        ) in flightOffersSearchResultsForDisplay"
        :key="index"
        :style="[styles.secondaryBackground]"
      >
        <div>
          <div
            class="px-3 py-2 border-b-[1px]"
            :style="[styles.secondaryBorder, styles.textButtonColor]"
          >
            ${{ flightOffersSearchResult.price }}
          </div>
          <div class="px-3 flex flex-col gap-0">
            <div
              class="flex flex-row items-center gap-2"
              v-for="(
                itinerary, index2
              ) in flightOffersSearchResult.displayItineraries"
              :key="index2"
            >
              <div class="flex-none">
                <div
                  :style="[styles.background]"
                  class="w-8 h-8 rounded-lg flex justify-center items-center"
                >
                  {{ itinerary.carrierCodes[0] }}
                </div>
              </div>
              <div
                :style="[
                  index2 != flightOffersSearchResult.itineraries.length - 1
                    ? styles.secondaryBorder
                    : 'border-width: 0px;',
                ]"
                class="w-full flex flex-row items-center gap-2 py-3 border-b-[1px]"
              >
                <div class="flex-none">
                  <div>
                    {{ formatDate(itinerary.departureDateTime, "hh:mm A") }}
                  </div>
                  <div>{{ itinerary.departureAirport }}</div>
                </div>
                <div class="w-full flex flex-col gap-1">
                  <div
                    class="text-center text-sm"
                    :style="[styles.hintTextColor]"
                    v-if="itinerary.stops > 0"
                  >
                    {{ itinerary.stops }} Stop
                  </div>
                  <div class="relative">
                    <hr :style="[styles.hintBorder]" />
                    <div class="w-full -top-1 absolute flex justify-between">
                      <div
                        v-if="itinerary.stops > 0"
                        class="w-2 h-2 rounded-full border-[1px]"
                        :style="[styles.secondaryBackground, styles.hintBorder]"
                      ></div>
                      <div
                        v-if="itinerary.stops > 0"
                        class="w-2 h-2 rounded-full border-[0px]"
                        :style="[
                          styles.secondaryBackground,
                          styles.hintBackground,
                        ]"
                      ></div>
                      <div
                        v-if="itinerary.stops > 0"
                        class="w-2 h-2 rounded-full border-[1px]"
                        :style="[styles.secondaryBackground, styles.hintBorder]"
                      ></div>
                    </div>
                  </div>

                  <div
                    class="text-center text-xs"
                    :style="[styles.hintTextColor]"
                  >
                    {{ itinerary.duration }}
                  </div>
                </div>
                <div class="flex-none">
                  <div>
                    {{ formatDate(itinerary.arrivalDateTime, "hh:mm A") }}
                  </div>
                  <div>{{ itinerary.arrivalAirport }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useStyleStore } from "@/stores/style";
import { mapState } from "pinia";
import { useSearchStore } from "../stores/search";

export default {
  name: "FlightSearch",
  props: {
    baseUrl: {
      type: String,
      required: true,
    },
    flightFrom: {
      type: Object,
      required: true,
    },
    flightTo: {
      type: Object,
      required: true,
    },
    flightOffersSearchResults: {
      type: Array,
      required: true,
    },
    selectFlightOffer: {
      type: Function,
      required: true,
    },
    flightOffersSearchResultsForDisplay: {
      type: Array,
      required: true,
    },
    formatDate: {
      type: Function,
      required: true,
    },
    showSearchView: {
      type: Function,
      required: true,
    },
  },
  components: {},
  mounted() {},
  data() {
    return {};
  },
  computed: {
    ...mapState(useStyleStore, ["styles", "themeParams"]),
    ...mapState(useSearchStore, [
      "travelersString",
      "departDate",
      "returnDate",
    ]),
  },
  methods: {},
};
</script>
