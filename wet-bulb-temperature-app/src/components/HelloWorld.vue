<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      citiesAndLatLon: [],
      selectedCity: '',
      wetBulbTemp: null,
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
      
      // Convert wet bulb temperature from Celsius to Fahrenheit
      return Math.round((twcNew * 9 / 5) + 32);
    }
  },
};
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center justify-center fill-height">

      <!-- <div class="text-body-2 font-weight-bold mb-1">What's the</div>

      <h1 class="text-h2 font-weight-bold">Wet bulb temp</h1> -->

      <div class="py-10"></div>

      <!-- New component for displaying wet bulb temperature -->
      <v-card class="d-flex align-center mb-15 justify-center bg-primaryvariant elevation-3 wet-bulb-card">
        <v-card-title>
          <span class="font-weight-bold text-h1">{{ wetBulbTemp }}</span>°F
        </v-card-title>
      </v-card>

      <v-row class="d-flex align-center justify-center">
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
  .wet-bulb-card {
    max-width: 200px;
    justify-content: center;
    margin: 0 auto;
  }
</style>
