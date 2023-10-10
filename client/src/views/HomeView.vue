<template>
  <div
    class="w-full h-full bg-geen-400 select-none relative overflow-auto"
    :style="[styles.background, styles.textColor, styles.fill]"
  >
    <MainView
      v-if="currentPage == 0"
      :showLocationSelector="showLocationSelector"
      :setFlightTo="setFlightTo"
      :key="currentPage"
      :setFlightFrom="setFlightFrom"
      :flightFrom="flightFrom"
      :flightTo="flightTo"
    />
    <SearchView
      v-if="currentPage == 1"
      :formatDate="formatDate"
      :key="currentPage"
      :showLocationSelector="showLocationSelector"
      :flightFrom="flightFrom"
      :setFlightFrom="setFlightFrom"
      :flightTo="flightTo"
      :setFlightTo="setFlightTo"
      :searchFlightOffers="searchFlightOffers"
      :showMainView="showMainView"
    />
    <FlightSearch
      v-if="currentPage == 2"
      :styles="styles"
      :baseUrl="baseUrl"
      :flightFrom="flightFrom"
      :flightTo="flightTo"
      :flightOffersSearchResults="flightOffersSearchResults"
      :selectFlightOffer="selectFlightOffer"
      :flightOffersSearchResultsForDisplay="flightOffersSearchResultsForDisplay"
      :formatDate="formatDate"
      :showSearchView="showSearchView"
    />
    <LocationSelector
      v-if="isLocationSelectorOpen"
      :styles="styles"
      :placeholder="locationSearchPlaceholder"
      :locationOnSelect="locationOnSelect"
      :close="hideLocationSelector"
    />

    <FlightOfferDetail
      v-if="selectedFlightOffer"
      :key="currentPage"
      :formatDate="formatDate"
      :selectedFlightOffer="selectedFlightOffer"
      :flightFrom="flightFrom"
      :flightTo="flightTo"
      :flightOffersSearchResultDictionary="flightOffersSearchResultDictionary"
      :setSelectFlightOffer="setSelectFlightOffer"
      :showFlightSearchView="showFlightSearchView"
    />
  </div>
</template>
<script>
import * as LottiePlayer from "@lottiefiles/lottie-player";
import moment from "moment";
import LocationSelector from "@/components/LocationSelector.vue";
import FlightSearch from "./FlightSearch.vue";
import { useStyleStore } from "../stores/style";
const API_URL = import.meta.env.VITE_SERVER_API;

import { mapState, mapActions } from "pinia";
import SearchView from "./SearchView.vue";
import MainView from "./MainView.vue";
import { useSearchStore } from "../stores/search";
import FlightOfferDetail from "./FlightOfferDetail.vue";
export default {
  name: "app",
  components: {
    LocationSelector,
    FlightSearch,
    SearchView,
    MainView,
    FlightOfferDetail,
  },
  created() {},
  mounted() {
    window.Telegram.WebApp.BackButton.onClick(() => {
      if (this.currentPage == 0 && this.isLocationSelectorOpen) {
        this.isLocationSelectorOpen = false;
        window.Telegram.WebApp.BackButton.hide();
      } else if (this.currentPage == 1) {
        this.currentPage = 0;
        window.Telegram.WebApp.BackButton.hide();
        window.Telegram.WebApp.MainButton.hide();
        this.setFlightTo(null);
        this.setDepartDate(null);
        this.setReturnDate(null);
      } else if (this.currentPage == 1 && this.isLocationSelectorOpen) {
        this.isLocationSelectorOpen = false;
        window.Telegram.WebApp.MainButton.hide();
      } else if (this.currentPage == 2 && this.selectedFlightOffer === null) {
        this.currentPage = 1;
        this.showSearchButton();
      } else if (this.currentPage == 2 && this.selectedFlightOffer !== null) {
        this.setSelectFlightOffer(null);
        window.Telegram.WebApp.MainButton.hide();
      } else {
        window.Telegram.WebApp.MainButton.hide();
      }
    });

    window.Telegram.WebApp.MainButton.onClick(() => {
      window.Telegram.WebApp.MainButton.showProgress();
      if (this.currentPage == 1) {
        this.searchFlightOffers();
      } else if (this.currentPage == 2 && this.selectedFlightOffer !== null) {
        this.bookNow();
      }
    });
  },
  data() {
    return {
      selectedFlightOffer: null,
      currentPage: 0,
      flightFrom: null,
      flightTo: null,
      locationQuery: "",
      locationSearchPlaceholder: "Search",
      locationSearchResults: [],
      flightOffersSearchResults: [],
      flightOffersSearchResultDictionary: {},
      isLocationSelectorOpen: false,
      locationOnSelect: null,
      isFlightOfferLoading: false,
      isBookNowLoading: false,
    };
  },
  computed: {
    ...mapState(useStyleStore, ["styles", "colorScheme", "themeParams"]),
    ...mapState(useSearchStore, [
      "selectedFlightStop",
      "selectedCabinClass",
      "totalTravlers",
      "travelersString",
      "cabinClasses",
      "flightStops",
      "travlerOptions",
      "departDate",
      "returnDate",
    ]),

    baseUrl() {
      return import.meta.env.BASE_URL;
    },
    flightOffersSearchResultsForDisplay() {
      return this.flightOffersSearchResults.map((flightOffer) => {
        return {
          flightOffer: flightOffer,
          displayItineraries: flightOffer.itineraries.map((itinerary) => {
            return {
              departureDateTime: itinerary.segments[0].departure.at,
              departureAirport: itinerary.segments[0].departure.iataCode,
              arrivalDateTime:
                itinerary.segments[itinerary.segments.length - 1].arrival.at,
              arrivalAirport:
                itinerary.segments[itinerary.segments.length - 1].arrival
                  .iataCode,
              duration: itinerary.duration,
              stops: itinerary.segments.length,
              carrierCodes: [
                ...new Set(
                  itinerary.segments.map((segment) => segment.carrierCode)
                ),
              ],
            };
          }),
          price: flightOffer.price.total,
          currency: flightOffer.price.currency,
          itineraries: flightOffer.itineraries,
        };
      });
    },
  },
  methods: {
    ...mapActions(useStyleStore, ["setThemeParams"]),
    ...mapActions(useSearchStore, ["setDepartDate", "setReturnDate"]),
    showLocationSelector(locationOnSelect, placeholder = "Search") {
      this.isLocationSelectorOpen = true;
      this.locationOnSelect = locationOnSelect;
      this.locationSearchPlaceholder = placeholder;
    },
    hideLocationSelector() {
      this.isLocationSelectorOpen = false;
      this.locationQuery = "";
      this.locationSearchResults = [];
    },
    setFlightFrom(location) {
      this.flightFrom = location;
      this.hideLocationSelector();
      if (location && this.flightTo) {
        this.showSearchView();
        window.Telegram.WebApp.expand();
      }
      this.saveLocation(location);
    },
    setFlightTo(location) {
      this.flightTo = location;
      this.hideLocationSelector();
      if (location && this.flightFrom) {
        this.showSearchView();
        window.Telegram.WebApp.expand();
      }
      this.saveLocation(location);
    },
    saveLocation(location) {
      window.Telegram.WebApp.CloudStorage.getItem(
        "recent_locations",
        (err, res) => {
          if (!res) {
            window.Telegram.WebApp.CloudStorage.setItem(
              "recent_locations",
              JSON.stringify([location])
            );
          } else {
            let recentLocations = JSON.parse(res);
            if (
              !recentLocations.find((loc) => loc.iataCode == location.iataCode)
            ) {
              window.Telegram.WebApp.CloudStorage.setItem(
                "recent_locations",
                JSON.stringify([...recentLocations, location])
              );
            }
          }
        }
      );
    },
    showSearchButton() {
      window.Telegram.WebApp.MainButton.show();
    },
    selectFlightOption(flightOption) {
      this.flightOptions.forEach((option) => {
        if (option.name == flightOption.name) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      });
    },
    formatDate(date, format) {
      return moment(date).format(format);
    },
    searchFlightOffers() {
      if (this.isFlightOfferLoading) {
        return;
      }
      this.isFlightOfferLoading = true;
      this.flightOffersSearchResults = [];
      this.flightOffersSearchResultDictionary = {};

      let params = {
        originLocationCode: this.flightFrom.iataCode,
        destinationLocationCode: this.flightTo.iataCode,
        departureDate: this.formatDate(this.departDate, "YYYY-MM-DD"),
        returnDate: this.formatDate(this.returnDate, "YYYY-MM-DD"),
        adults: this.travlerOptions[0].count,
        children: this.travlerOptions[1].count,
        infants: this.travlerOptions[2].count,
        travelClass: this.selectedCabinClass.abbreviation,
        nonStop: this.selectedFlightStop.name.toLowerCase() === "non-stop",
      };

      fetch(API_URL + "/flightOffersSearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          telegramInitData: window.Telegram.WebApp.initData,
        },
        body: JSON.stringify(params),
      })
        .then(async (res) => {
          var resData = await res.json();
          window.Telegram.WebApp.MainButton.hideProgress();
          window.Telegram.WebApp.MainButton.hide();
          console.log("res", resData);
          if (!resData.data) {
            window.Telegram.WebApp.showAlert("No flights found", () => {
              console.log("No flights found>>>>>>>>>>>>>>");
            });
          }
          this.flightOffersSearchResults = resData.data;
          this.flightOffersSearchResultDictionary = resData.dictionaries;
          this.showFlightSearchView();
          this.isFlightOfferLoading = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.isFlightOfferLoading = false;
        });
    },
    setSelectFlightOffer(flightOffer) {
      this.selectedFlightOffer = flightOffer;
    },
    showMainView() {
      this.currentPage = 0;
      this.setFlightTo(null);
      this.setDepartDate(null);
      this.setReturnDate(null);
    },
    showSearchView() {
      this.currentPage = 1;
      window.Telegram.WebApp.BackButton.show();
      // reset all search params
    },
    showFlightSearchView() {
      this.currentPage = 2;
      this.selectedFlightOffer = null;

      window.Telegram.WebApp.BackButton.show();
    },
    selectFlightOffer(flightOffer) {
      this.selectedFlightOffer = flightOffer;
      window.Telegram.WebApp.BackButton.show();
    },
    bookNow() {
      if (this.isBookNowLoading) {
        return;
      }
      this.isBookNowLoading = true;
      fetch(API_URL + "/flightOfferBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          telegramInitData: window.Telegram.WebApp.initData,
        },
        body: JSON.stringify({
          flightOffer: this.selectedFlightOffer.flightOffer,
          flightFrom: this.flightFrom,
          flightTo: this.flightTo,
          departureDate: this.formatDate(this.departDate, "YYYY-MM-DD"),
        }),
      })
        .then(async (res) => {
          var resData = await res.json();
          console.log("res>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", resData);
          window.Telegram.WebApp.openInvoice(resData.invoiceLink);
          // window.Telegram.WebApp.MainButton.hide();
          window.Telegram.WebApp.MainButton.hideProgress();
          this.isBookNowLoading = false;
        })
        .catch((err) => {
          console.log("err", err);
          this.isBookNowLoading = false;
        });
    },
  },
};
</script>
