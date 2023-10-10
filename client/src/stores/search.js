import { defineStore } from "pinia";

export const useSearchStore = defineStore("search", {
  state: () => ({
    cabinClasses: [
      {
        name: "Economy",
        abbreviation: "ECONOMY",
        description: "Most affordable, with limited flexibility",
        selected: true,
      },
      {
        name: "Premium",
        abbreviation: "PREMIUM_ECONOMY",
        description: "More legroom and priority boarding",
        selected: false,
      },
      {
        name: "Business",
        abbreviation: "BUSINESS",
        description: "Priority boarding, lounge access and more",
        selected: false,
      },
      {
        name: "First",
        abbreviation: "FIRST",
        description: "Priority boarding, lounge access and more",
        selected: false,
      },
    ],
    flightStops: [
      {
        name: "Any",
        description: "Show all flights",
        selected: true,
      },
      {
        name: "Non-stop",
        description: "Show only non-stop flights",
        selected: false,
      },
      {
        name: "1 Stop",
        description: "Show only 1 stop flights",
        selected: false,
      },
      {
        name: "2+ Stops",
        description: "Show only 2+ stops flights",
        selected: false,
      },
    ],
    travlerOptions: [
      {
        name: "Adults",
        description: "Over age 11",
        count: 1,
      },
      {
        name: "Children",
        description: "Ages 2 to 11",
        count: 0,
      },
      {
        name: "Infants",
        description: "Under age 2",
        count: 0,
      },
    ],
    popularDestinations: [
      {
        type: "location",
        subType: "CITY",
        name: "PARIS",
        detailedName: "PARIS/FR",
        id: "CPAR",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CPAR",
          methods: ["GET"],
        },
        timeZoneOffset: "+02:00",
        iataCode: "PAR",
        geoCode: {
          latitude: 48.85334,
          longitude: 2.34889,
        },
        address: {
          cityName: "PARIS",
          cityCode: "PAR",
          countryName: "FRANCE",
          countryCode: "FR",
          regionCode: "EUROP",
        },
        analytics: {
          travelers: {
            score: 68,
          },
        },
      },

      {
        type: "location",
        subType: "CITY",
        name: "NEW YORK",
        detailedName: "NEW YORK/NY/US",
        id: "CNYC",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CNYC",
          methods: ["GET"],
        },
        timeZoneOffset: "-04:00",
        iataCode: "NYC",
        geoCode: {
          latitude: 40.71417,
          longitude: -74.00583,
        },
        address: {
          cityName: "NEW YORK",
          cityCode: "NYC",
          countryName: "UNITED STATES OF AMERICA",
          countryCode: "US",
          stateCode: "NY",
          regionCode: "NAMER",
        },
        analytics: {
          travelers: {
            score: 76,
          },
        },
      },

      {
        type: "location",
        subType: "CITY",
        name: "LONDON",
        detailedName: "LONDON/GB",
        id: "CLON",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CLON",
          methods: ["GET"],
        },
        timeZoneOffset: "+01:00",
        iataCode: "LON",
        geoCode: {
          latitude: 51.5,
          longitude: -0.16666,
        },
        address: {
          cityName: "LONDON",
          cityCode: "LON",
          countryName: "UNITED KINGDOM",
          countryCode: "GB",
          regionCode: "EUROP",
        },
        analytics: {
          travelers: {
            score: 100,
          },
        },
      },
      {
        type: "location",
        subType: "CITY",
        name: "CHICAGO",
        detailedName: "CHICAGO/IL/US",
        id: "CCHI",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CCHI",
          methods: ["GET"],
        },
        timeZoneOffset: "-05:00",
        iataCode: "CHI",
        geoCode: {
          latitude: 41.85,
          longitude: -87.65,
        },
        address: {
          cityName: "CHICAGO",
          cityCode: "CHI",
          countryName: "UNITED STATES OF AMERICA",
          countryCode: "US",
          stateCode: "IL",
          regionCode: "NAMER",
        },
        analytics: {
          travelers: {
            score: 62,
          },
        },
      },
      {
        type: "location",
        subType: "CITY",
        name: "LAS VEGAS",
        detailedName: "LAS VEGAS/NV/US",
        id: "CLAS",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CLAS",
          methods: ["GET"],
        },
        timeZoneOffset: "-07:00",
        iataCode: "LAS",
        geoCode: {
          latitude: 36.08001,
          longitude: -115.1522,
        },
        address: {
          cityName: "LAS VEGAS",
          cityCode: "LAS",
          countryName: "UNITED STATES OF AMERICA",
          countryCode: "US",
          stateCode: "NV",
          regionCode: "NAMER",
        },
        analytics: {
          travelers: {
            score: 27,
          },
        },
      },
      {
        type: "location",
        subType: "CITY",
        name: "ROME",
        detailedName: "ROME/IT",
        id: "CROM",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CROM",
          methods: ["GET"],
        },
        timeZoneOffset: "+02:00",
        iataCode: "ROM",
        geoCode: {
          latitude: 41.89195,
          longitude: 12.51139,
        },
        address: {
          cityName: "ROME",
          cityCode: "ROM",
          countryName: "ITALY",
          countryCode: "IT",
          regionCode: "EUROP",
        },
        analytics: {
          travelers: {
            score: 29,
          },
        },
      },
      {
        type: "location",
        subType: "CITY",
        name: "FRANKFURT",
        detailedName: "FRANKFURT/DE",
        id: "CFRA",
        self: {
          href: "https://test.api.amadeus.com/v1/reference-data/locations/CFRA",
          methods: ["GET"],
        },
        timeZoneOffset: "+02:00",
        iataCode: "FRA",
        geoCode: {
          latitude: 50.04056,
          longitude: 8.55612,
        },
        address: {
          cityName: "FRANKFURT",
          cityCode: "FRA",
          countryName: "GERMANY",
          countryCode: "DE",
          regionCode: "EUROP",
        },
        analytics: {
          travelers: {
            score: 38,
          },
        },
      },
    ],
    flightFrom: null,
    flightTo: null,
    departDate: null,
    returnDate: null,
    flightOptions: [
      {
        name: "Return",
        description: "Return flight",
        selected: true,
      },
      {
        name: "One-Way",
        description: "One way flight",
        selected: false,
      },
    ],
    flightOffersSearchResults: [],
  }),
  getters: {
    selectedFlightStop: (state) => {
      return state.flightStops.find((stop) => stop.selected);
    },
    selectedCabinClass: (state) => {
      return state.cabinClasses.find((cabin) => cabin.selected);
    },
    totalTravlers: (state) => {
      return state.travlerOptions.reduce((acc, curr) => {
        return acc + curr.count;
      }, 0);
    },
    travelersString: (state) => {
      let travelers = [];

      state.travlerOptions.forEach((travler) => {
        if (travler.count > 0) {
          travelers.push(travler.count + " " + travler.name);
        }
      });

      return travelers.join(", ");
    },
    selectedFlightOption: (state) => {
      return state.flightOptions.find((flightOption) => flightOption.selected);
    },
  },
  actions: {
    selectCabinClass(index, hideCabinclassSelector) {
      this.cabinClasses.forEach((cabinClass, i) => {
        if (i == index) {
          cabinClass.selected = true;
        } else {
          cabinClass.selected = false;
        }
      });
      hideCabinclassSelector();
    },
    selectFlightStop(index, hideFlightStopSelector) {
      this.flightStops.forEach((flightStop, i) => {
        if (i == index) {
          flightStop.selected = true;
        } else {
          flightStop.selected = false;
        }
      });
      hideFlightStopSelector();
    },
    addTravelerCount(index) {
      if (this.totalTravlers < 9) {
        this.travlerOptions[index].count++;
      }
    },
    removeTravelerCount(index) {
      if (this.travlerOptions[index].count == 0) {
        return;
      }
      this.travlerOptions[index].count--;
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
    setDepartDate(date) {
      this.departDate = date;
    },
    setReturnDate(date) {
      this.returnDate = date;
    },
  },
});
