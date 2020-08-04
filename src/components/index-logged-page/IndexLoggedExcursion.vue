<template>
  <div id="index-logged-excursion">
      <IndexLoggedExcursionSearch></IndexLoggedExcursionSearch>
      <div id="index-logged-excursion-wrapper" >
        <div class="carousel-absolute">
            <IndexServicesCarousel></IndexServicesCarousel>
        </div>
      </div>
  </div>
</template>

<script>
import IndexLoggedExcursionSearch from './IndexLoggedExcursionSearch'
import IndexServicesCarousel from '../index-page/IndexServicesCarousel'
import { eventBus } from '../../main';

export default {
    components: {
        IndexLoggedExcursionSearch,
        IndexServicesCarousel
    },
    methods: {
        handleScroll(){
            let height = window.innerHeight
            if(height*0.25 > this.$el.getBoundingClientRect().top
                && height*0 < this.$el.getBoundingClientRect().top)
            {
                eventBus.$emit('componentScrolled', 'excursions')
            }
        }
    },
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
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
    @media(max-width: 1440px)
    {
        #index-logged-excursion{
            height: 900px;
        }
    }
</style>