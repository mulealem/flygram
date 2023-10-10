<template>
  <div class="w-full h-full flex flex-col justify-start gap-[1px] p-0">
    <div class="flex gap-3 text-sm px-3 py-3 pt-2">
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
    <div
      :style="[styles.secondaryBackground]"
      class="w-full flex flex-row items-center rounded-0l p-0 text-base"
    >
      <div
        class="w-full flex flex-col items-start rounded-0l-xl px-4 py-3 pr-0"
        v-wave
        @click="showLocationSelector(setFlightFrom, 'Where From?')"
      >
        <div class="text-sm" :style="[styles.textButtonColor]">From</div>
        <div>{{ flightFrom.iataCode }}</div>
      </div>
      <div
        class="h-1/2 w-[1px] bg-neutral-500"
        :style="[styles.background]"
      ></div>
      <div
        class="w-full flex flex-col items-end px-4 py-3 pl-0 rounded-r-xl"
        v-wave
        @click="showLocationSelector(setFlightTo, 'Your destination')"
      >
        <div class="text-sm" :style="[styles.textButtonColor]">To</div>
        <div class="bg-re-500 text-truncate" v-if="flightTo">
          {{ flightTo.iataCode }}
        </div>
      </div>
    </div>
    <div
      :style="[styles.secondaryBackground]"
      class="w-full rounded-0xl text-base"
    >
      <div
        v-if="
          departDate &&
          (selectedFlightOption.name === 'Return' ? returnDate : true)
        "
        @click="enterDates()"
        v-wave
        class="w-full h-full flex flex-row items-center cursor-pointer max-h-20"
      >
        <div class="w-full flex flex-col items-start px-4 py-3 pr-0">
          <div class="text-sm" :style="[styles.textButtonColor]">Depart</div>
          <div>{{ formatDate(departDate, "ll") }}</div>
        </div>
        <div
          class="h-1/2 w-[1px] bg-green-200"
          :style="[styles.background]"
          v-if="selectedFlightOption.name === 'Return'"
        ></div>
        <div
          v-if="selectedFlightOption.name === 'Return'"
          class="w-full flex flex-col items-end px-4 py-3 pl-0"
        >
          <div class="text-sm" :style="[styles.textButtonColor]">Return</div>
          <div>{{ formatDate(returnDate, "ll") }}</div>
        </div>
      </div>

      <div class="w-full flex flex-row items-center p-3 pb-0" v-else>
        {{ datePickerTitle }}
      </div>
      <div
        class="w-full pb-3 custom-calendar"
        v-if="isDatePickerOpen || departDate === null || returnDate === null"
        id="customCalendar"
        ref="calendarRef"
      >
        <VueDatePicker
          :min-date="new Date()"
          :dark="colorScheme == 'dark'"
          range
          v-model="dateValues"
          v-if="selectedFlightOption.name === 'Return'"
          :style="[styles.secondaryBackground, 'border-radius: 0px;']"
          menu-class-name="!bg-transparent !rounded-l !border-0"
          @range-start="updateDepartDate"
          @range-end="updateReturnDate"
          calendar-cell-class-name="!rounded-xl"
          auto-apply
          :enable-time-picker="false"
          :inline="{ input: false }"
        ></VueDatePicker>
        <VueDatePicker
          :min-date="new Date()"
          :dark="colorScheme == 'dark'"
          v-else
          v-model="dateValue"
          :style="[styles.secondaryBackground, 'border-radius: 0px;']"
          menu-class-name="!bg-transparent !rounded-l !border-0"
          @date-update="updateDepartDate"
          calendar-cell-class-name="!rounded-xl"
          auto-apply
          :enable-time-picker="false"
          :inline="{ input: false }"
        ></VueDatePicker>
      </div>
    </div>
    <div
      :style="[styles.secondaryBackground]"
      class="w-full flex flex-col rounded-0xl text-base"
    >
      <div
        v-wave
        @click="isTravelerPickerOpen = true"
        class="flex flex-row justify-between items-center px-4 py-3"
        v-if="!isTravelerPickerOpen"
      >
        <div>{{ travelersString }}</div>
        <div class="w-7 h-7 p-1 rounded-full" :style="[styles.iconButtonColor]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>chevron-down</title>
            <path
              d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
            />
          </svg>
        </div>
      </div>
      <div class="w-full px-4 py-3" v-else>
        <div class="flex flex-row justify-between pb-1">
          <div>Who's going</div>
          <div
            :style="[styles.textButtonColor]"
            class="px-3 py-[2px] text-sm bg-transparent rounded-lg"
            v-wave
            @click="isTravelerPickerOpen = false"
          >
            Confirm
          </div>
        </div>

        <div>
          <div
            v-for="(travlerOption, index) in travlerOptions"
            :key="index"
            :style="[styles.secondaryBorder]"
            class="flex flex-row items-center border-b-[1px] last:border-b-0 py-2"
          >
            <div class="w-full">
              <div>{{ travlerOption.name }}</div>
              <div class="text-xs opacity-75">
                {{ travlerOption.description }}
              </div>
            </div>
            <div
              :style="[styles.background]"
              class="flex flex-row gap-2 p-1 rounded-full items-center shadow"
            >
              <button
                @click="removeTravelerCount(index)"
                v-wave
                :style="[styles.buttonColor, styles.buttonTextColor]"
                class="w-7 h-7 shadow rounded-full flex justify-center items-center cursor-pointer"
              >
                -
              </button>
              <div>{{ travlerOption.count }}</div>
              <button
                @click="addTravelerCount(index)"
                v-wave
                :style="[styles.buttonColor, styles.buttonTextColor]"
                class="w-7 h-7 shadow rounded-full flex justify-center items-center cursor-pointer select-none"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="px-4 py-3"
      :style="[styles.secondaryBackground]"
      v-wave
      @click="showCabinclassSelector"
    >
      <div class="w-full flex justify-between items-center">
        <div>Cabin class</div>
        <div class="text-sm" :style="[styles.textButtonColor]">
          {{ selectedCabinClass.name }}
        </div>
      </div>
    </div>
    <div
      v-if="isCabinClassSelectorOpen"
      @click="hideCabinclassSelector"
      class="w-full h-full opacity-5 absolute z-10"
      :style="[styles.background]"
    ></div>
    <div
      v-if="isCabinClassSelectorOpen"
      class="w-full h-full absolute z-10 flex items-center justify-center"
    >
      <div
        class="w-2/3 rounded-lg p-3 px-0 shadow"
        :style="[styles.background]"
      >
        <div class="pb-2 px-3 border-b-[1px]" :style="[styles.border]">
          Cabin class
        </div>
        <div>
          <div
            class="flex items-center gap-3 px-[1px]"
            v-for="(cabinClass, index) in cabinClasses"
            @click="selectCabinClass(index, hideCabinclassSelector)"
            v-wave
          >
            <label
              :style="[
                cabinClass.selected ? styles.buttonColor : styles.background,
              ]"
              class="w-full cursor-pointer select-none font-light px-5 py-2"
              :for="cabinClass.name"
            >
              {{ cabinClass.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <div
      class="px-4 py-3"
      :style="[styles.secondaryBackground]"
      v-wave
      @click="showFlightStopSelector"
    >
      <div class="w-full flex justify-between items-center">
        <div>Stops</div>
        <div class="text-sm" :style="[styles.textButtonColor]">
          {{ selectedFlightStop.name }}
        </div>
      </div>
    </div>
    <div
      v-if="isFlightStopSelectorOpen"
      @click="hideFlightStopSelector"
      class="w-full h-full opacity-5 absolute z-10"
      :style="[styles.background]"
    ></div>
    <div
      class="w-full h-full absolute z-10 flex items-center justify-center"
      v-if="isFlightStopSelectorOpen"
    >
      <div
        class="w-2/3 rounded-lg p-3 px-0 shadow"
        :style="[styles.background, styles.border]"
      >
        <div class="pb-2 px-3 border-b-[1px]" :style="[styles.border]">
          Stops
        </div>
        <div>
          <div
            class="flex items-center gap-3 px-[1px]"
            v-for="(flightStop, index) in flightStops"
            :key="flightStop.name"
            @click="selectFlightStop(index, hideFlightStopSelector)"
          >
            <label
              :style="[
                flightStop.selected ? styles.buttonColor : styles.background,
              ]"
              class="w-full cursor-pointer select-none font-light px-5 py-2"
              :for="flightStop.name"
            >
              {{ flightStop.name }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "pinia";
import { useStyleStore } from "@/stores/style";
import { useSearchStore } from "@/stores/search";
export default {
  name: "Search",
  props: {
    formatDate: {
      type: Function,
      required: true,
    },
    showLocationSelector: {
      type: Function,
      required: true,
    },
    flightFrom: {
      type: Object,
      required: true,
    },
    setFlightFrom: {
      type: Function,
      required: true,
    },
    flightTo: {
      type: Object,
      required: true,
    },
    setFlightTo: {
      type: Function,
      required: true,
    },
    searchFlightOffers: {
      type: Function,
      required: true,
    },
    showMainView: {
      type: Function,
      required: true,
    },
  },
  mounted() {},
  data() {
    return {
      dateValues: [],
      dateValue: null,
      datePickerTitle: "When are you traveling?",
      isDatePickerOpen: false,
      isTravelerPickerOpen: false,
      isCabinClassSelectorOpen: false,
      isFlightStopSelectorOpen: false,
    };
  },
  computed: {
    ...mapState(useStyleStore, ["styles", "colorScheme", "themeParams"]),
    ...mapState(useSearchStore, [
      "travlerOptions",
      "cabinClasses",
      "flightStops",
      "flightOptions",
      "travelersString",
      "selectedCabinClass",
      "selectedFlightStop",
      "selectedFlightOption",
      "departDate",
      "returnDate",
    ]),
  },
  methods: {
    ...mapActions(useSearchStore, [
      "addTravelerCount",
      "removeTravelerCount",
      "selectCabinClass",
      "selectFlightStop",
      "selectFlightOption",
      "setDepartDate",
      "setReturnDate",
    ]),
    showCabinclassSelector() {
      this.isCabinClassSelectorOpen = true;
    },
    hideCabinclassSelector() {
      this.isCabinClassSelectorOpen = false;
    },
    showFlightStopSelector() {
      this.isFlightStopSelectorOpen = true;
    },
    hideFlightStopSelector() {
      this.isFlightStopSelectorOpen = false;
    },
    enterDates() {
      this.setDepartDate(null);
      this.setReturnDate(null);
      this.isDatePickerOpen = true;
    },
    updateDepartDate(date) {
      this.setDepartDate(date);
      this.datePickerTitle = "When are you returning?";
      console.log("updateDepartDate: ", date, this.selectedFlightOption.name);
      if (this.selectedFlightOption.name.toLowerCase() === "one-way") {
        this.isDatePickerOpen = false;
      }
      if (
        (this.selectedFlightOption.name === "One-Way" && this.departDate) ||
        (this.departDate && this.returnDate)
      ) {
        this.showSearchButton();
      }
    },
    updateReturnDate(date) {
      this.setReturnDate(date);
      this.datePickerTitle = "When are you traveling?";
      this.isDatePickerOpen = false;

      if (this.departDate && this.returnDate) {
        this.showSearchButton();
      }
    },
    showSearchButton() {
      window.Telegram.WebApp.MainButton.setText("Search");
      window.Telegram.WebApp.MainButton.setParams({
        color: this.themeParams.button_color,
        textColor: this.themeParams.button_text_color,
      });
      window.Telegram.WebApp.MainButton.show();
    },
  },
};
</script>
