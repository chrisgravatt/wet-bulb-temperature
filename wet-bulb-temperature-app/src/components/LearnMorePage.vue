<template>
  <v-app :style="{ background: bgColor, 'background-attachment': 'fixed', 'overflow-y': 'hidden', 'overscroll-behavior-y': 'none'}">
    <v-container class="fill-height">
      <div class="d-flex text-h6 align-center mb-12 justify-center" style="color: white">
        Are you wondering just wtf a "wet bulb" temperature is? You've come to the right place.
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