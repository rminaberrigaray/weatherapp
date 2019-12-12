<template>
  <Page>
    <ActionBar title flat="true" class="transparent"></ActionBar>
      <Label v-if="favorites.length == 0" class="app-error">
        <FormattedString>
          <Span :text="String.fromCharCode(0xf05a)" class="fas"></Span>
          <Span text="  Aún no hay favoritos"></Span>
        </FormattedString>
      </Label>
      <ListView v-else for="f in favorites" class="list-group" @itemTap="goToLocationWeather">
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <Label class="list-group-item" :text="favoriteText(f)" />
        </v-template>
      </ListView>
  </Page>
</template>

<script>
import { mapGetters } from "vuex";
import LocationWeatherPage from "./LocationWeatherPage";

export default {
  components: {},

  data() {
    return {};
  },

  created() {
    this.$store.dispatch("loadFavorites");
  },

  computed: {
    ...mapGetters(["favorites"])
  },

  methods: {
    goToLocationWeather(event) {
      this.$navigateTo(LocationWeatherPage, {
        frame: "favorites-page",
        props: {
          city: event.item
        }
      });
    },
    favoriteText(f) {
      return `${f.name}, ${this.$store.getters["countryName"](f.country)}`;
    }
  }
};
</script>

<style scoped>
.list-group-item {
  font-size: 15;
  padding: 10 0;
}
</style>
