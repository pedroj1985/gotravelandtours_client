<template>
  <div id="content">
      <IndexLoggedBanner></IndexLoggedBanner>
      <IndexLoggedHotels></IndexLoggedHotels>
      <IndexLoggedRent></IndexLoggedRent>
      <IndexLoggedTransfer></IndexLoggedTransfer>
  </div>
</template>

<script>
import IndexLoggedBanner from "./IndexLoggedBanner";
import IndexLoggedHotels from "./IndexLoggedHotels";
import IndexLoggedRent from "./IndexLoggedRent";
import IndexLoggedTransfer from "./IndexLoggedTransfer";

export default {
    name: 'IndexLogged',
    components: {
        IndexLoggedBanner,
        IndexLoggedHotels,
        IndexLoggedRent,
        IndexLoggedTransfer,
        }
}
</script>