<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      citiesAndLatLon: [],
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
          const citiesAndLatLon = response.data.features.map(feature => {
            const { formatted, lat, lon } = feature.properties;
            return {
              formattedCity: formatted,
              lat: lat,
              lon: lon
            };
          }).filter(Boolean);

          // Save the city names and lat/lon to this.citiesAndLatLon
          this.citiesAndLatLon = citiesAndLatLon;

          // Set the city names as the autocomplete items
          this.items = citiesAndLatLon.map(city => city.formattedCity);
          console.log(`the items are ${this.items}`)
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

      // Find the city object in citiesAndLatLon that matches the selected city name
      const selectedCity = this.citiesAndLatLon.find(city => city.formattedCity === selectedCityName);

      if (!selectedCity) {
        console.error(`Could not find lat/lon for ${selectedCityName}`);
        return;
      }

      // Extract the lat and lon from the selected city object
      const { lat, lon } = selectedCity;

      console.log(`Selected city: ${selectedCityName}`);
      console.log(`Latitude: ${lat}`);
      console.log(`Longitude: ${lon}`);

      // Use the lat/lon to make another API call to a weather API here
      // ...
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
          item-text="formatted" 
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
