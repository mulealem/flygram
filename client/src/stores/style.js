import { defineStore } from "pinia";

export const useStyleStore = defineStore("style", {
  state: () => ({
    themeParams: {},
    webAppColorScheme: null,
  }),
  getters: {
    styles: (state) => {
      return {
        background: {
          "background-color": state.themeParams.bg_color,
        },
        textColor: {
          color: state.themeParams.text_color,
        },
        fill: {
          fill: state.themeParams.text_color,
        },
        buttonColor: {
          "background-color": state.themeParams.button_color,
        },
        iconButtonColor: {
          fill: state.themeParams.button_color,
        },
        textButtonColor: {
          color: state.themeParams.button_color,
        },
        buttonTextColor: {
          color: state.themeParams.button_text_color,
        },
        secondaryBackground: {
          "background-color": state.themeParams.secondary_bg_color,
        },
        hintBackground: {
          "background-color": state.themeParams.hint_color,
        },
        hintTextColor: {
          color: state.themeParams.hint_color,
        },
        hintFill: {
          fill: state.themeParams.hint_color,
        },
        linkTextColor: {
          color: state.themeParams.link_color,
        },
        backgroundGradientToTop: {
          "background-image":
            "linear-gradient(to top, " +
            state.themeParams.bg_color +
            ", transparent);",
        },
        border: {
          "border-color": state.themeParams.secondary_bg_color,
        },
        hintBorder: {
          "border-color": state.themeParams.hint_color,
        },
        secondaryBorder: {
          "border-color": state.themeParams.bg_color,
        },
      };
    },
    colorScheme: (state) => {
      return state.webAppColorScheme;
    },
  },
  actions: {
    setThemeParams(themeParams) {
      this.themeParams = themeParams;
    },
    setWebAppColorScheme(colorScheme) {
      this.webAppColorScheme = colorScheme;
    },
  },
});
