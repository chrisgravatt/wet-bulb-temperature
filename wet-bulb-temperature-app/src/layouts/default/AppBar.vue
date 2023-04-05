<template>
  <v-app-bar flat class="bg-secondary elevation-3 d-flex align-center justify-between custom-app-bar">
    <v-app-bar-title style="color: white">
      <v-icon icon="mdi-sun-thermometer-outline" />
      Find Your Local Wet Bulb Temperature
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn @click="$router.push('/')">Home</v-btn>
      <v-btn @click="$router.push('/learnmore')">Learn More</v-btn>
      <v-btn icon="mdi-temperature-celsius" @click="changeTemperatureUnit('celsius')"></v-btn>
      <v-btn icon="mdi-temperature-fahrenheit" @click="changeTemperatureUnit('fahrenheit')"></v-btn>
    </template>
  </v-app-bar>
</template>

<script>
  import { computed } from 'vue';
  import { useTemperatureUnitStore } from '@/store/app.js';

  export default {
    setup() {
      const temperatureUnitStore = useTemperatureUnitStore();

      const temperatureUnit = computed({
        get: () => temperatureUnitStore.unit,
        set: (value) => temperatureUnitStore.setUnit(value),
      });

      const changeTemperatureUnit = (unit) => {
        temperatureUnit.value = unit;
        console.log(`temp unit has been set to ${temperatureUnit.value}`)
      }

      return {
        temperatureUnit,
        changeTemperatureUnit,
      };
    },
  };

</script>

<style>
  .custom-app-bar {
    /* height: 50px; TODO */
  }
</style>