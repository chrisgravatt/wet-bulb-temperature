<script>
import { LOW_TEMP_BOUNDARY, MEDIUM_TEMP_BOUNDARY, HIGH_TEMP_BOUNDARY } from '@/constants';
import axios from 'axios';
import { useTemperatureUnitStore } from '@/store/app.js';

export default {

  data() {
    return {
      items: [],
      citiesAndLatLon: [],
      selectedCity: '',
      wetBulbTempF: null,
      wetBulbTempC: null,
      lowTempBoumdary: LOW_TEMP_BOUNDARY,
      mediumTempBoundary: MEDIUM_TEMP_BOUNDARY,
      highTempBoumdary: HIGH_TEMP_BOUNDARY,
    };
  },
  computed: {
    // change the background color based on the hazard level of the wet bulb temperature
    bgColor() {
      if (this.wetBulbTempF < LOW_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #00bfff 69%, #fcff9f)';
      } else if (this.wetBulbTempF >= LOW_TEMP_BOUNDARY && this.wetBulbTempF < MEDIUM_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #14cc14 69%, #fcff9f)';
      } else if (this.wetBulbTempF >= MEDIUM_TEMP_BOUNDARY && this.wetBulbTempF < HIGH_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #ff8c00 69%, #fcff9f)';
      } else {
        return 'linear-gradient(to bottom, #ff0000 69%, #fcff9f)';
      }
    },
    // get the temperature unit from the store
    temperatureUnit() {
      const temperatureUnitStore = useTemperatureUnitStore();
      return temperatureUnitStore.getUnit;
    },
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

      // Find the city object in citiesAndLatLon that matches the selected city name
      const selectedCity = this.citiesAndLatLon.find(city => city.formattedCity === selectedCityName);

      if (!selectedCity) {
        console.error(`Could not find lat/lon for ${selectedCityName}`);
        return;
      }

      // Extract the lat and lon from the selected city object
      const { lat, lon } = selectedCity;

      // Use the lat/lon to make another API call to a weather API here
      const API_KEY = '263099b102ec4a5bb11191701231603';
      const API_URL = 'https://api.weatherapi.com/v1/current.json';

      axios.get(API_URL, {
        params: {
          key: API_KEY,
          q: `${lat},${lon}`,
        },
      })
      .then(response => {
        const { temp_c, humidity } = response.data.current;
        console.log(`the temperature is ${temp_c}`)
        console.log(`the humidity is ${humidity}`)

        // the big kahuna!!
        this.wetBulbTempC = this.getWetBulbTemp(temp_c, humidity)
        this.wetBulbTempF = Math.round((this.wetBulbTempC * 9 / 5) + 32);
      })
      .catch(error => {
        console.error(error);
      });
    },
    getWetBulbTemp(temp_c, humidity) {
      const T = temp_c
      const H = humidity

      const wet_bulb_temp = T * Math.atan(0.151977 * Math.pow(H + 8.313659, 0.5)) + Math.atan(T + H) - Math.atan(H - 1.676331) + 0.00391838 * Math.pow(H, 1.5) * Math.atan(0.023101 * H) - 4.686035;

      return Math.round(wet_bulb_temp);
    }
  },
};
</script>

<template>
  <v-app :style="{ background: bgColor, 'background-attachment': 'fixed', 'overflow-y': 'hidden', 'overscroll-behavior-y': 'none'}">
    <v-container class="fill-height" :style="{ 'overflow-y': 'hidden', 'overscroll-behavior-y': 'none' }">
      <v-responsive class="d-flex align-center text-center justify-center fill-height" :style="{ 'overflow-y': 'scroll' }">

        <!-- Display wetBulbTemp as text only -->
        <div v-if=wetBulbTempF>
          <div v-if="temperatureUnit === 'fahrenheit'" class="d-flex align-center justify-center">
            <div class="temperature-display" style="color: white">{{ wetBulbTempF }}</div>
            <div class="temperature-display" style="color: white">&deg;F</div>
          </div>

          <div v-if="temperatureUnit === 'celsius'" class="d-flex align-center justify-center">
            <div class="temperature-display" style="color: white">{{ wetBulbTempC }}</div>
            <div class="temperature-display" style="color: white">&deg;C</div>
          </div>
        </div>
        <!-- Blurb about what the wet bulb temperature means -->
        <div v-if="wetBulbTempF" class="d-flex text-h6 align-center mb-12 justify-center blurb" style="color: white">
          <div v-if="wetBulbTempF < lowTempBoumdary" class="blurb">
            There is no risk of heat stress at this temperature
          </div>
          <div v-else-if="wetBulbTempF >= lowTempBoumdary && wetBulbTempF < mediumTempBoundary" class="blurb">
            The wet bulb temperature is at a comfortable level
          </div>
          <div v-else-if="wetBulbTempF >= mediumTempBoundary && wetBulbTempF < highTempBoumdary" class="blurb">
            There is a high risk of heat stress at this temperature
          </div>
          <div v-else-if="wetBulbTempF >= highTempBoumdary" class="blurb">
            At this temperature your body is no longer able to cool itself via sweating. Take shelter immediately
          </div>
          <div v-else>
            No text
          </div>
        </div>

        <!-- Autocomplete text box -->
        <v-row class="d-flex align-center justify-center">
          <v-autocomplete
            class="my-autocomplete"
            clearable
            label=""
            placeholder="Enter your location"
            :items="items"
            item-text="formatted"
            @input="searchCities"
            no-data-text=""
            v-model="selectedCity"
            @click:option="onCitySelect"
            @update:model-value="onCitySelect"
            no-filter
            close-on-click
            autofocus
            variant="solo"
          ></v-autocomplete>
        </v-row>

      </v-responsive>
    </v-container>
  </v-app>
</template>

<style>
  .my-autocomplete {
    max-width: 600px !important;
    justify-content: center;
    margin-left: 20px !important;
    margin-right: 20px !important;
  }

  .temperature-display {
    font-weight: bold;
    font-size: clamp(4rem, 20svw, 7rem);
  }

  .blurb {
    font-size: clamp(1.1rem, 3.6svw, 1.5rem);
    margin-bottom: 75px;
  }

  .v-list {
    background-color: rgba(0, 0, 0, 0.15) !important;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25) !important;
    border-color: white !important;
    border-style: solid !important;
    border-width: 0.5px !important;
    border-radius: 5px !important;
  }

  .v-list-item {
    color: white !important;
  }

  .v-autocomplete {
    color: white;
    opacity: 100%;
    margin-bottom: 100px;
  }

  .v-field {
    color: rgb(39, 39, 39) !important;
    border-color: black !important;
    border-style: solid !important;
    border-width: 0.5px !important;
    border-radius: 15px !important;
    background-color: rgba(255, 255, 255, 0.8) !important;
    font-size: clamp(0.7rem, 3.5svw, 1rem) !important;
    /* height: clamp(3rem, 13svw, 3.5rem) !important; */
    text-align: center !important;
  }

</style>
