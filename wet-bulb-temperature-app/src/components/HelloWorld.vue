<script>
import { LOW_TEMP_BOUNDARY, MEDIUM_TEMP_BOUNDARY, HIGH_TEMP_BOUNDARY } from '@/constants';
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      citiesAndLatLon: [],
      selectedCity: '',
      wetBulbTemp: null,
      lowTempBoumdary: LOW_TEMP_BOUNDARY,
      mediumTempBoundary: MEDIUM_TEMP_BOUNDARY,
      highTempBoumdary: HIGH_TEMP_BOUNDARY,
    };
  },
  computed: {
    // change the background color based on the hazard level of the wet bulb temperature
    bgColor() {
      if (this.wetBulbTemp < LOW_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #00bfff 69%, #fcff9f)';
      } else if (this.wetBulbTemp >= LOW_TEMP_BOUNDARY && this.wetBulbTemp < MEDIUM_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #14cc14 69%, #fcff9f)';
      } else if (this.wetBulbTemp >= MEDIUM_TEMP_BOUNDARY && this.wetBulbTemp < HIGH_TEMP_BOUNDARY) {
        return 'linear-gradient(to bottom, #ff8c00 69%, #fcff9f)';
      } else {
        return 'linear-gradient(to bottom, #ff0000 69%, #fcff9f)';
      }
    }
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
      const API_KEY = '263099b102ec4a5bb11191701231603';
      const API_URL = 'https://api.weatherapi.com/v1/current.json';

      axios.get(API_URL, {
        params: {
          key: API_KEY,
          q: `${lat},${lon}`,
        },
      })
      .then(response => {
        const { temp_f, humidity } = response.data.current;
        console.log(`Temperature: ${temp_f}°F`);
        console.log(`Humidity: ${humidity}%`);
        // the big kahuna!!
        this.wetBulbTemp = this.getWetBulbTemp(temp_f, humidity)
        console.log(`the wet bulb temp is ${this.wetBulbTemp}`)
      })
      .catch(error => {
        console.error(error);
      });
    },
    // Get the Wet Bulb Temperature using the Stull formula // right now I think it's inaccurate but we can adjust it later
    getWetBulbTemp(temp_f, humidity) {
      // Convert temperature from Fahrenheit to Celsius
      const tempC = (temp_f - 32) * 5 / 9;
      
      // Calculate saturation vapor pressure
      const svp = 6.112 * Math.exp((17.67 * tempC) / (tempC + 243.5));
      
      // Calculate vapor pressure
      const vp = svp * humidity / 100;
      
      // Set initial values for wet bulb temperature
      let twc = tempC;
      let twcNew = 0;
      let iterationCount = 0;
      
      // Iterate until convergence is reached (or 100 iterations)
      do {
        twcNew = (tempC * Math.atan(0.151977 * Math.pow(vp + 8.313659, 0.5)) +
                  Math.atan(twc + vp) -
                  Math.atan(vp - 1.676331) +
                  0.00391838 * Math.pow(vp, 1.5) * Math.atan(0.023101 * vp) -
                  4.686035);
        
        if (Math.abs(twcNew - twc) < 0.001 || iterationCount > 100) {
          break;
        }
        
        twc = twcNew;
        iterationCount++;
      } while (true);
      
      // Convert wet bulb temperature from Celsius to Fahrenheit.
      return Math.round((twcNew * 9 / 5) + 32);
    }
  },
};
</script>

<template>
  <v-app :style="{ background: bgColor }">
    <v-container class="fill-height">
      <v-responsive class="d-flex align-center text-center justify-center fill-height">

        <!-- Display wetBulbTemp as text only -->
        <div v-if="wetBulbTemp" class="d-flex align-center mb-8 justify-center">
          <div class="font-weight-bold text-h1" style="color: white">{{ wetBulbTemp }}</div>
          <div class="font-weight-bold text-h1" style="color: white">&deg;F</div>
        </div>

        <!-- Blurb about what the wet bulb temperature means -->
        <div v-if="wetBulbTemp" class="d-flex text-h6 align-center mb-12 justify-center" style="color: white">
          <template v-if="wetBulbTemp < lowTempBoumdary">
            There is no risk of heat stress at this temperature
          </template>
          <template v-else-if="wetBulbTemp >= lowTempBoumdary && wetBulbTemp < mediumTempBoundary">
            The wet bulb temperature is at a comfortable level
          </template>
          <template v-else-if="wetBulbTemp >= mediumTempBoundary && wetBulbTemp < highTempBoumdary">
            There is a high risk of heat stress at this temperature
          </template>
          <template v-else-if="wetBulbTemp >= highTempBoumdary">
            At this temperature your body is no longer able to cool itself via sweating. Take shelter immediately
          </template>
          <template v-else>
            No text
          </template>
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
          ></v-autocomplete>
        </v-row>

      </v-responsive>
    </v-container>
  </v-app>
</template>

<style>
  .my-autocomplete {
    max-width: 340px;
    justify-content: center;
  }

  .v-list {
    backdrop-filter: blur(20px) !important;
    background-color: rgba(37, 37, 37, 0.2) !important;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25) !important;
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
  }

  .v-list-item {
    color: white !important;
  }

  .v-autocomplete {
    /* border-color: white;
    border-style: solid;
    border-width: 2px;
    border-radius: 20px; */
    color: white;
  }

</style>
