<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      selectedCity: '',
    };
  },
  methods: {
    searchCities(event) {
      const query = event.target.value.replace(/\s+/g, ''); // remove spaces
      console.log(`Searching for ${query}...`);
      axios
        .get('https://api.geoapify.com/v1/geocode/autocomplete', {
          params: {
            text: query,
            apiKey: '4e00f90907e84583b46a589565b8cb5c',
            type: 'city', 
            limit: 5, 
          },
        })
        .then(response => {
          // Extract the city names from the API response
          console.log(response.data);
          const cities = response.data.features.map(feature => {
            const { formatted } = feature.properties;
            return `${formatted}`;
          }).filter(Boolean);
          // TODO figure out how to return the formatted city
          // TODO but then also save the lat/lon in the data, but not display it
          // TODO and then search for it in onCitySelect

          // Set the city names as the autocomplete items
          this.items = cities;
        })
        .catch(error => {
          console.error(error);
        });
    },
    onCitySelect() {
      if (!this.selectedCity) {
        return;
      }

      const selectedCityName = this.selectedCity;
      console.log(`Selected city: ${selectedCityName}`);

      // Find the feature object in the API response that matches the selected city
      const selectedCityFeature = this.items.find(feature => {
        const { city, state } = feature.properties;
        return `${city}, ${state}` === selectedCityName;
      });

      if (!selectedCityFeature) {
        console.error(`Could not find feature for ${selectedCityName}`);
        return;
      }

      // Extract the properties from the selected city feature
      const { city, state, lat, lon } = selectedCityFeature.properties;
      console.log(`Selected city: ${city}, ${state}`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);
    }
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
          label=" Location"
          :items="items"
          @input="searchCities"
          no-data-text=""
          v-model="selectedCity"
          @change="onCitySelect"
          no-filter
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
