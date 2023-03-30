<template>
  <v-app-bar flat class="bg-secondary elevation-3 d-flex align-center justify-between custom-app-bar">
    <v-app-bar-title style="color: white">
      <v-icon icon="mdi-sun-thermometer-outline" />
      Find Your Local Wet Bulb Temperature
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-temperature-celsius"></v-btn>
      <v-btn icon="mdi-temperature-fahrenheit"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
  //
</script>

<style>
  .custom-app-bar {
    /* height: 50px; TODO */
  }
</style>