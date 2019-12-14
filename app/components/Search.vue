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
      color="black"
    >
      <SuggestionView ~suggestionView suggestionViewHeight="300">
        <StackLayout v-suggestionItemTemplate orientation="vertical" padding="10">
          <v-template>
            <StackLayout>
              <Label class="suggestion-item" :text="item"></Label>
              <Label class="divider" />
            </StackLayout>
          </v-template>
        </StackLayout>
      </SuggestionView>
    </RadAutoCompleteTextView>
  </StackLayout>
</template>

<script>
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { CityModel } from "../classes/CityModel";
import LocationWeatherPage from "./LocationWeatherPage";
import WeatherService from "../services/Weather";

export default {
  data() {
    return {
      isLoading: true,
      title: "Buscar",
      cities: new ObservableArray(),
      totalCalls: 0
    };
  },

  computed: {},

  mounted() {
    this.startAutocomplete();
  },

  methods: {
    startAutocomplete() {
      this.$refs.autocomplete.setLoadSuggestionsAsync(text => {
        const promise = new Promise(async (resolve, reject) => {
          // Guardo la cantidad de llamadas a la API
          this.totalCalls++;
          let currentCalls = this.totalCalls;
          let cts;
          try {
            cts = await WeatherService.findCities(text);
          } catch (error) {
            resolve([]);
          }

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
                this.$store.getters["countryName"](cts[i].country),
                cts[i].coord_lon,
                cts[i].coord_lat
              )
            );
          }
          resolve(items);
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
      return this.$store.getters["countryName"](countryCode);
    }
  }
};
</script>

<style lang="scss" scoped>

.suggestion-item {
    font-size: 15;
    padding: 10;
  }

  RadAutoCompleteTextView {
    background-color: white;
    font-size: 15;
  }

  .divider {
    height: 0.5;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    .ns-dark & {
      background-color: rgba(255, 255, 255, 0.2);
    }
}


</style>
