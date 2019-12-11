<template>
  <Page :class="pageClass">
    <ActionBar title class="transparent" flat="true"></ActionBar>
    <LocationDetails v-if="hasLocation" :location="location" v-model="pageClass" />
    <ActivityIndicator v-else busy="true" />
  </Page>
</template>

<script>
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import LocationDetails from "./LocationDetails";

export default {
  components: {
    LocationDetails
  },

  data() {
    return {
      location: null,
      hasLocation: false,
      pageClass: "default"
    };
  },

  created() {
    this.getCurrentWeather();
  },

  computed: {},

  methods: {
    async getCurrentWeather() {
      Geolocation.enableLocationRequest();
      Geolocation.getCurrentLocation({
        desiredAccuracy: Accuracy.high,
        updateDistance: 0.1,
        timeout: 20000
      }).then(
        async loc => {
          if (loc) {
            this.location = loc;
            this.hasLocation = true;
          }
        },
        function(e) {
          console.log(e);
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
