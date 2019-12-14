<template>
  <Page :class="pageClass">
    <ActionBar title="" class="transparent" flat="true">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onNavigationButtonTap"></NavigationButton>
    </ActionBar>
    <LocationDetails :owmId="city.owmId"
      v-model="pageClass"
      />
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
      pageClass: ""
    };
  },

  props: ["city"],

  computed: {},

  methods: {
    onNavigationButtonTap() {
      Frame.topmost().goBack();
    }
  }
};
</script>

<style scoped>
</style>
