<template>
  <StackLayout padding="5">
    <RadAutoCompleteTextView
      ref="autocomplete"
      displayMode="Plain"
      suggestMode="Suggest"
      hint="Buscar localidad"
      noResultsText="No se encontraron resultados"
      :items="cities"
      @didAutoComplete="onDidAutoComplete"
    >
      <SuggestionView ~suggestionView suggestionViewHeight="300">
        <StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
          <v-template>
            <Label :text="item"></Label>
          </v-template>
        </StackLayout>
      </SuggestionView>
    </RadAutoCompleteTextView>
  </StackLayout>
</template>

<script>
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { CityModel } from "../classes/CityModel";
import WeatherService from "./../services/Weather";
import LocationWeatherPage from "./LocationWeatherPage";

export default {
  data() {
    return {
      isLoading: true,
      title: "Buscar",
      cities: new ObservableArray(),
      countries: [],
      totalCalls: 0
    };
  },

  computed: {},

  mounted() {
    this.loadCountries();
    this.startAutocomplete();
  },

  methods: {
    async loadCountries() {
      this.countries = await WeatherService.getCountries();
    },
    startAutocomplete() {
      this.$refs.autocomplete.setLoadSuggestionsAsync(text => {
        const promise = new Promise(async (resolve, reject) => {
          try {
            // Guardo la cantidad de llamadas a la API
            this.totalCalls++;
            let currentCalls = this.totalCalls;

            let cts = await WeatherService.findCities(text);

            // Si hay llamadas nuevas, descarto la actual
            if (this.totalCalls > currentCalls) {
              reject();
              return;
            }

            const items = new Array();
            for (let i = 0; i < cts.length; i++) {
              items.push(
                new CityModel(
                  cts[i].id,
                  cts[i].name,
                  this.getCountryName(cts[i].country),
                  cts[i].coord_lon,
                  cts[i].coord_lat
                )
              );
            }
            resolve(items);
          } catch (error) {
            const message = `Error al obtener la información desde ${jsonUrl}: ${err.message}`;
            console.log(message);
            alert(message);
            reject();
          }
        });

        return promise;
      });
    },
    async onDidAutoComplete({ token }) {
      // Para limpiar el campo luego del evento didAutocomplete
      setTimeout(() => {
        this.$refs.autocomplete.resetAutoComplete();
      }, 0);

      this.$navigateTo(LocationWeatherPage, {
        frame: "search-page",
        props: {
          city: token
        }
      });
    },
    getCountryName(countryCode) {
      let country = this.countries.find(c => c.alpha2Code == countryCode);
      return country.name || '';
    }
  }
};
</script>

<style scoped>
</style>
