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
import { eventUserBus } from "../../main"

export default {
    name: 'IndexLogged',
    //Este código es solo de ejemplo
    created(){
      eventUserBus.$emit('userLogin',{
        name: 'Mary Jean Tours',
      })
    },
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