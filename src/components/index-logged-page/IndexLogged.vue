<template>
  <div id="content">
      <IndexLoggedBanner></IndexLoggedBanner>
<!--      <IndexLoggedRent></IndexLoggedRent>-->
  </div>
</template>

<script>
import IndexLoggedBanner from "./IndexLoggedBanner";
import IndexLoggedRent from "./IndexLoggedRent";

export default {
    name: 'IndexLogged',
    components: {
        IndexLoggedBanner,
        IndexLoggedRent,
        }
}
</script>