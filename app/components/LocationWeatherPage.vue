<template>
  <Page :class="pageClass">
    <ActionBar title="" class="transparent" flat="true">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onNavigationButtonTap"></NavigationButton>
    </ActionBar>
    <PullToRefresh class="refresh" @refresh="refreshWeather">
      <DockLayout>
        <LocationDetails
          :owmId="city.owmId"
          v-model="pageClass"
          :key="componentKey"
        />
      </DockLayout>
    </PullToRefresh>
  </Page>
</template>

<script>
import { Frame } from "tns-core-modules/ui/frame";
import LocationDetails from "./LocationDetails";

export default {
  components: {
    LocationDetails
  },

  data() {
    return {
      pageClass: "",
      componentKey: 0
    };
  },

  props: ["city"],

  computed: {},

  methods: {
    onNavigationButtonTap() {
      Frame.topmost().goBack();
    },
    async refreshWeather(args) {
      var pullRefresh = args.object;
      this.componentKey += 1;
      pullRefresh.refreshing = false;
    }
  }
};
</script>

<style scoped>
</style>
