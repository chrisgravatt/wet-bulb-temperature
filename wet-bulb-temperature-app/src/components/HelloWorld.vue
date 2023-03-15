<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    searchCities(event) {
      const query = event.target.value;
      console.log(`Searching for ${query}...`);
      axios
        .get('https://api.geoapify.com/v1/geocode/autocomplete', {
          params: {
            text: query,
            apiKey: '4e00f90907e84583b46a589565b8cb5c',
            type: 'city', // Limit results to cities
            limit: 5, // Limit to 5 results
          },
        })
        .then(response => {
          // Extract the city names from the API response
          console.log('this is the response data:')
          console.log(response.data);
          const cities = response.data.features.map(feature => {
            const { city, state } = feature.properties;
            return `${city}, ${state}`;
          }).filter(Boolean);

          // Set the city names as the autocomplete items
          this.items = cities;
          console.log(`these are the cities: ${cities}`)
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
};
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center justify-center fill-height">

      <div class="text-body-2 font-weight-light mb-n1">Enter your</div>

      <h1 class="text-h2 font-weight-bold">Location</h1>

      <div class="py-14" />
      <v-row class="d-flex align-center justify-center autocomplete-container">
        <v-autocomplete
          class="my-autocomplete"
          clearable
          label="Location"
          :items="items"
          @input="searchCities"
          no-data-text=""
          item-value="city"
          item-text="display_name"
          v-model="selectedCity"
        ></v-autocomplete>

      </v-row>
    </v-responsive>
  </v-container>
</template>

<style>
  .my-autocomplete {
    max-width: 600px;
    justify-content: center;
  }
</style>