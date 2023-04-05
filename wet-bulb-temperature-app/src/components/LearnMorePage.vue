<template>
  <v-app :style="{ background: bgColor, 'background-attachment': 'fixed', 'overflow-y': 'hidden', 'overscroll-behavior-y': 'none'}">
    <v-container class="fill-height" :style="{ 'overflow-y': 'hidden', 'overscroll-behavior-y': 'none' }">
      <div class="d-flex text-h6 align-center mb-12 justify-center" style="color: white">
        Wet bulb temperature is a measurement of the temperature at which water evaporates into the air, taken using a thermometer with a wet wick over its bulb. This temperature is affected by the amount of moisture in the air and can provide information about humidity levels, which is important for understanding heat stress on humans, animals, and plants. Wet bulb temperature is often used in combination with dry bulb temperature to calculate other useful meteorological values, such as dew point and relative humidity. It is also used in HVAC systems to determine the cooling capacity needed for a space.
      </div>
    </v-container>
  </v-app>
</template>

<script>
  import { useDynamicBackgroundStore } from '@/store/app.js';

  export default {
  computed: {
      bgColor() {
      return useDynamicBackgroundStore().getBackgroundColor;
      },
    },
  };
</script>