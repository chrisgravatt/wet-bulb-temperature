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
