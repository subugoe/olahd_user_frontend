<template>
  <div>
    <app-showcase></app-showcase>
    <app-feature-detail></app-feature-detail>
  </div>
</template>

<script>
import Showcase from "@/components/home/Showcase";
import FeatureDetail from "@/components/home/FeatureDetail";

export default {
  components: {
    appShowcase: Showcase,
    appFeatureDetail: FeatureDetail,
  },
};
</script>