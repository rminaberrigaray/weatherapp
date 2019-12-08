<template>
  <Page actionBarHidden="true">
    <StackLayout>
      <GridLayout>
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
      </GridLayout>
    </StackLayout>
  </Page>
</template>

<script>
import CurrentWeatherPage from "./CurrentWeatherPage";
import SearchPage from "./SearchPage";
import FavoritesPage from "./FavoritesPage";
import Theme from "@nativescript/theme";

export default {
  components: {
    CurrentWeatherPage,
    SearchPage,
    FavoritesPage
  },

  created() {
    Theme.setMode(Theme.Light);
  },

  data() {
    return {
      actionBarHidden: false
    };
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
    }
  },

  methods: {
    hideActionBar() {
      this.actionBarHidden = true;
    }
  }
};
</script>

<style scoped>
/*TabStripItem {
  background-color: whitesmoke;
  color: black;
}

TabStripItem:active {
  background-color: whitesmoke;
  color: blue;
}*/
</style>
