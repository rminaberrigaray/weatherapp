<template>
  <Page>
    <ActionBar title flat="true"></ActionBar>
    <Label v-if="favorites.length == 0" text="Aún no hay favoritos" />
      <ListView v-else for="f in favorites" class="list-group" @itemTap="goToLocationWeather">
        <v-template>
          <!-- Shows the list item label in the default color and style. -->
          <Label class="list-group-item" :text="`${f.name}, ${f.country}`" />
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
    }
  }
};
</script>

<style scoped>
</style>
