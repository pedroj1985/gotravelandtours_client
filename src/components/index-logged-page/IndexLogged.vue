<template>
  <div id="content">
      <IndexLoggedBanner></IndexLoggedBanner>
      <IndexLoggedHotels></IndexLoggedHotels>
      <IndexLoggedRent></IndexLoggedRent>
  </div>
</template>

<script>
import IndexLoggedBanner from "./IndexLoggedBanner";
import IndexLoggedHotels from "./IndexLoggedHotels";
import IndexLoggedRent from "./IndexLoggedRent";

export default {
    name: 'IndexLogged',
    components: {
        IndexLoggedBanner,
        IndexLoggedHotels,
        IndexLoggedRent
        }
}
</script>