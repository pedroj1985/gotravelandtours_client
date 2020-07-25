<template>
  <div id="content">
      <IndexLoggedBanner></IndexLoggedBanner>
      <IndexLoggedHotels></IndexLoggedHotels>
  </div>
</template>

<script>
import IndexLoggedBanner from "./IndexLoggedBanner";
import IndexLoggedHotels from "./IndexLoggedHotels";

export default {
    name: 'IndexLogged',
    components: {
        IndexLoggedBanner,
        IndexLoggedHotels
        }
}
</script>