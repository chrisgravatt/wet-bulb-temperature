// Utilities
import { defineStore } from 'pinia'

export const useTemperatureUnitStore = defineStore({
  id: 'temperatureUnit',
  state: () => ({
    unit: 'celsius',
  }),
  actions: {
    setUnit(unit) {
      this.unit = unit;
    },
  },
  getters: {
    getUnit() {
      return this.unit;
    },
  },
});

export const useDynamicBackgroundStore = defineStore({
  id: 'dynamicBackground',
  state: () => ({
    backgroundColor: 'linear-gradient(to bottom, #00bfff 69%, #fcff9f)',
  }),
  actions: {
    setBackgroundColor(color) {
      this.backgroundColor = color
    },
  },
  getters: {
    getBackgroundColor() {
      return this.backgroundColor;
    },
  },
})
