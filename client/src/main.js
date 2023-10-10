import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import VWave from "v-wave";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VWave, {
  color: "Black",
  initialOpacity: 0.1,
  easing: "ease-in",
  duration: 0.2,
});

app.component("VueDatePicker", VueDatePicker);

app.mount("#app");
