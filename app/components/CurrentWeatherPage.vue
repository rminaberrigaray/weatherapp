<template>
  <Page :class="pageClass">
    <ActionBar title class="transparent" flat="true"></ActionBar>
    <LocationDetails v-if="hasLocation" :location="location" :saveWeather="true" v-model="pageClass" />
    <Label v-else-if="noInformation" class="app-error">
      <FormattedString>
        <Span :text="String.fromCharCode(0xf071)" class="fas"></Span>
        <Span text="  No hay información para mostrar"></Span>
      </FormattedString>
    </Label>
    <ActivityIndicator v-else busy="true" />
  </Page>
</template>

<script>
import * as Geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import LocationDetails from "./LocationDetails";
var dialogs = require("tns-core-modules/ui/dialogs");

export default {
  components: {
    LocationDetails
  },

  data() {
    return {
      location: null,
      hasLocation: false,
      pageClass: "default",
      noInformation: false
    };
  },

  created() {
    this.getCurrentWeather();
  },

  computed: {},

  methods: {
    async getCurrentWeather() {
      let isEnabled = await Geolocation.isEnabled();
      if (!isEnabled) {
        try {
          await Geolocation.enableLocationRequest();
        } catch (e) {
          dialogs.alert({
            title: "Ocurrió un error",
            message:
              "La aplicación no posee permisos para obtener la ubicación. " +
              "Para poder ver el clima local debe habilitar dicho permiso desde la configuración del sistema. \n\n" +
              "Se mostrará el clima de la última ubicación disponible.",
            okButtonText: "Aceptar"
          });
          this.showLastInformation();
          return;
        }
      }

      try {
        let loc = await Geolocation.getCurrentLocation({
          desiredAccuracy: Accuracy.high,
          updateDistance: 0.1,
          timeout: 20000
        });

        if (loc) {
          this.location = loc;
          this.hasLocation = true;
        }
      } catch (error) {
        dialogs.alert({
          title: "Ocurrió un error",
          message: "No se pudo obtener la ubicación actual.",
          okButtonText: "Aceptar"
        });
        this.showLastInformation();
      }
    },
    showLastInformation() {
      let weather = this.$store.getters.lastWeather;
      if(weather) {
        this.location = {
          latitude: weather.city.latitude,
          longitude: weather.city.longitude
        };
        this.hasLocation = true;
      } else {
        this.noInformation = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
