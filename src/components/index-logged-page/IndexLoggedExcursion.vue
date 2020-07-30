<template>
  <div id="index-logged-excursion">
      <IndexLoggedExcursionSearch></IndexLoggedExcursionSearch>
      <div id="index-logged-excursion-wrapper" >
        <div class="carousel-absolute">
            <IndexServicesCarousel class="custom-margin"></IndexServicesCarousel>
        </div>
      </div>
  </div>
</template>

<script>
import IndexLoggedExcursionSearch from './IndexLoggedExcursionSearch'
import IndexServicesCarousel from '../index-page/IndexServicesCarousel'

export default {
    components: {
        IndexLoggedExcursionSearch,
        IndexServicesCarousel
    }
}
</script>

<style scoped>
    #index-logged-excursion{
        position: relative;
        width: 100%;
        margin-top: 120px;
        height: 1315px;
        margin-bottom: 30px;
    }

    #index-logged-excursion-wrapper{
        position: relative;
        width: 100%;
    }
    #index-logged-excursion .carousel-absolute{
        position: absolute;
        top: -107px;
        z-index: 2;
        width: 100%;
    }
</style>