<template>
  <div id="content">
    <IndexBanner @userLogin="emitUserLogin"></IndexBanner>
    <Destinies></Destinies>
    <IndexServices></IndexServices>
    <IndexPackages></IndexPackages>
    <IndexOtherServices></IndexOtherServices>
    <IndexWhoAreWe></IndexWhoAreWe>
  </div>
</template>

<script>
import IndexBanner from "./IndexBanner";
import Destinies from "./Destinies";
import IndexServices from "./IndexServices";
import IndexPackages from "./IndexPackages";
import IndexOtherServices from "./IndexOtherServices";
import IndexWhoAreWe from "./IndexWhoAreWe";

export default {
  name: "Index",
  components: {
    IndexBanner,
    Destinies,
    IndexServices,
    IndexPackages,
    IndexOtherServices,
    IndexWhoAreWe,
  },
  methods: {
    emitUserLogin(value) {
      this.$emit("userLogin", value);
      this.$router.go();
    },
  },
};
</script>
