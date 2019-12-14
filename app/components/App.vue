<template>
  <Page actionBarHidden="true">
    <DockLayout>
        <Label v-if="!connection" dock="bottom" class="bottom-message" text="Sin conexión"></Label>
        <BottomNavigation>
          <TabStrip>
            <TabStripItem>
              <Label text="Inicio"></Label>
              <Image :src="homeIcon" class="fas"></Image>
            </TabStripItem>
            <TabStripItem>
              <Label text="Buscar"></Label>
              <Image :src="searchIcon" class="fas"></Image>
            </TabStripItem>
            <TabStripItem>
              <Label text="Favoritos"></Label>
              <Image :src="favoritesIcon" class="fas"></Image>
            </TabStripItem>
          </TabStrip>
          <TabContentItem>
            <Frame>
              <CurrentWeatherPage />
            </Frame>
          </TabContentItem>
          <TabContentItem>
            <Frame id="search-page">
              <SearchPage />
            </Frame>
          </TabContentItem>
          <TabContentItem>
            <Frame id="favorites-page">
              <FavoritesPage />
            </Frame>
          </TabContentItem>
        </BottomNavigation>
    </DockLayout>
  </Page>
</template>

<script>
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from "tns-core-modules/connectivity";
import { mapGetters } from "vuex";
import CurrentWeatherPage from "./CurrentWeatherPage";
import SearchPage from "./SearchPage";
import FavoritesPage from "./FavoritesPage";

export default {
  components: {
    CurrentWeatherPage,
    SearchPage,
    FavoritesPage
  },

  created() {
    const type = getConnectionType();

    if (type == connectionType.none) {
      this.$store.dispatch("updateConnectionStatus", false);
    }

    startMonitoring((newConnectionType) => {
      switch (newConnectionType) {
            case connectionType.none:
                this.$store.dispatch("updateConnectionStatus", false);
                break;
            case connectionType.wifi:
                this.$store.dispatch("updateConnectionStatus", true);
                break;
            case connectionType.mobile:
                this.$store.dispatch("updateConnectionStatus", true);
                break;
            case connectionType.ethernet:
                this.$store.dispatch("updateConnectionStatus", true);
                break;
            default:
                break;
        }
    });
  },

  data() {
    return {};
  },

  computed: {
    homeIcon() {
      const imageString = String.fromCharCode(0xf015);
      return `font://${imageString}`;
    },
    searchIcon() {
      const imageString = String.fromCharCode(0xf002);
      return `font://${imageString}`;
    },
    favoritesIcon() {
      const imageString = String.fromCharCode(0xf005);
      return `font://${imageString}`;
    },
    ...mapGetters(["connection"])
  },
  

  methods: {
  }
};
</script>

<style lang="scss" scoped>

.bottom-message {
  text-align: center;
  font-size: 15;
  width: 100%;
  color: black;
  background-color: darken(white, 5%);
  .ns-dark & {
    color: white;
    background-color: lighten(black, 23%);
  }
}
</style>
