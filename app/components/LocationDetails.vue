<template>
  <Label v-if="error" class="app-error">
    <FormattedString>
      <Span :text="String.fromCharCode(0xf071)" class="fas"></Span>
      <Span text="  Ocurrió un error al recuperar los datos"></Span>
    </FormattedString>
  </Label>
  <GridLayout rows="auto" v-else-if="!isLoading">
    <StackLayout row="0">
      <GridLayout rows="auto" columns="*">
        <Label
          row="0"
          horizontalAlignment="left"
          verticalAlignment="center"
          marginLeft="10"
          class="bold"
          :text="weather.city.name"
        />
        <Label
          row="0"
          horizontalAlignment="right"
          verticalAlignment="center"
          class="fas"
          @tap="toggleCityFromFavorites"
          :class="{ active: isFavorite, inactive: !isFavorite }"
          marginRight="15"
        >
          <FormattedString>
            <Span :text="String.fromCharCode(0xf005)" class="fas"></Span>
          </FormattedString>
        </Label>
      </GridLayout>
      <GridLayout rows="auto" columns="*">
        <Label
          row="0"
          verticalAlignment="center"
          marginLeft="10"
          class="small pull-left"
          :text="weather.date"
        />
        <Label
          row="0"
          verticalAlignment="center"
          marginRight="10"
          class="small pull-right"
          :text="weather.time"
        />
      </GridLayout>

      <GridLayout class="weather-box" columns="1*,1*" rows="auto,auto,auto">
        <Label row="0" colSpan="2" class="summary" :text="weather.summary" />
        <Label row="1" colSpan="2" class="small">
          <FormattedString>
            <Span :text="String.fromCharCode(0xf051)" class="wi"></Span>
            <Span text=" " class></Span>
            <Span :text="weather.sunrise" class></Span>
            <Span text="  " class></Span>
            <Span :text="String.fromCharCode(0xf052)" class="wi"></Span>
            <Span text=" " class></Span>
            <Span :text="weather.sunset" class></Span>
          </FormattedString>
        </Label>
        <Label col="0" row="2" class="weather-icon">
          <FormattedString>
            <Span :text="String.fromCharCode(weather.unicodeIcon)" class="wi"></Span>
          </FormattedString>
        </Label>
        <Label col="1" row="2" class="large" :text="weather.currentTemperature" />
      </GridLayout>

      <Label class="small" horizontalAlign="center" :text="`Últ. actualización: ${weather.lastUpdate}`" />

      <GridLayout class="m-t-30" columns="1*,1*" rows="auto, auto, auto">
        <StackLayout col="0" row="0">
          <Label class="small" text="Mínima/máxima" />
          <Label :text="weather.minTemperature + '/ ' + weather.maxTemperature" />
        </StackLayout>
        <StackLayout col="1" row="0">
          <Label class="small" text="Humedad" />
          <Label :text="weather.humidity + '%'" />
        </StackLayout>
        <Label row="1" colSpan="2" class="divider" />
        <StackLayout col="0" row="2">
          <Label class="small" text="Viento" />
          <Label :text="weather.windSpeed + ' km/h'" />
        </StackLayout>
        <StackLayout col="1" row="2">
          <Label class="small" text="Presión" />
          <Label :text="weather.pressure + ' hPa'" />
        </StackLayout>
      </GridLayout>
    </StackLayout>
  </GridLayout>
  <ActivityIndicator v-else busy="true" />
</template>

<script>
import WeatherService from "./../services/Weather";
import FavoritesService from "./../services/Favorites";

export default {
  data() {
    return {
      error: false,
      isLoading: true,
      weather: null
    };
  },

  props: [
    "location",
    "owmId",
    "currentWeather",
    "value" // Por defecto se bindea value al v-model del padre
  ],

  computed: {
    isFavorite() {
      return this.$store.getters["isFavorite"](this.weather.city.owmId);
    }
  },
  created() {
    this.getWeather();
  },
  methods: {
    async getWeather() {
      if(this.currentWeather && ! this.$store.getters.connection && this.$store.getters.lastWeather) {
        this.weather = this.$store.getters.lastWeather;
      }
      else {
        try {
          if(this.owmId) {
            this.weather = await WeatherService.getWeatherById(this.owmId);
          }
          else {
            this.weather = await WeatherService.getWeatherByGeolocation(this.location);
          }
        } catch (error) {
          this.error = true;
          return;
        }

        if(this.currentWeather) {
          this.$store.dispatch("updateLastWeather", this.weather);
        }
      }
      
      // El evento input actualiza automáticamente el v-model del padre
      this.$emit("input", `color-${this.weather.icon}`);
      this.isLoading = false;
    },
    toggleCityFromFavorites() {
      this.$store.dispatch("toggleFavorite", this.weather.city);
    }
  }
};
</script>

<style lang="scss" scoped>
label.active {
  color: orange;
}

label.inactive {
  color: rgba(0, 0, 0, 0.7)
}

label {
  margin: 0 0;
  font-family: "Titillium Web", "TitilliumWeb-Regular";
  font-size: 20;
  text-transform: none;
  text-align: center;
}

.bold {
  font-family: "Titillium Web", "TitilliumWeb-Bold";
  font-weight: bold;
}

.small {
  font-family: "Titillium Web", "TitilliumWeb-Light";
  font-size: 15;
  margin: 0;
}

.weather-box {
  margin-top: 50;
}

.summary {
  font-size: 20;
}

.large {
  font-size: 80;
  vertical-align: center;
  horizontal-align: left;
  margin-left: 15;
}

.weather-icon {
  font-size: 90;
  vertical-align: center;
  horizontal-align: right;
  margin-right: 15;
}

.divider {
  height: 0.5;
  margin: 5 0;
  width: 85%;
}
</style>
