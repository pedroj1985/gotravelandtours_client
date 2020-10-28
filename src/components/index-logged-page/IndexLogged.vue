<template>
  <div id="content">
      <IndexLoggedBanner></IndexLoggedBanner>
      <IndexLoggedHotels></IndexLoggedHotels>
      <IndexLoggedRent></IndexLoggedRent>
      <IndexLoggedTransfer></IndexLoggedTransfer>
      <IndexLoggedDestinies></IndexLoggedDestinies>
      <IndexLoggedExcursion></IndexLoggedExcursion>
  </div>
</template>

<script>
import IndexLoggedBanner from "./IndexLoggedBanner";
import IndexLoggedHotels from "./IndexLoggedHotels";
import IndexLoggedRent from "./IndexLoggedRent";
import IndexLoggedTransfer from "./IndexLoggedTransfer";
import IndexLoggedDestinies from "./IndexLoggedDestinies";
import IndexLoggedExcursion from "./IndexLoggedExcursion";

export default {
    name: 'IndexLogged',
    components: {
        IndexLoggedBanner,
        IndexLoggedHotels,
        IndexLoggedRent,
        IndexLoggedTransfer,
        IndexLoggedDestinies,
        IndexLoggedExcursion
        }
}
</script>