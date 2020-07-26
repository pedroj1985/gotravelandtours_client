<template>
    <div id="index-logged-rent-wrapper">
        <IndexLoggedRentSearch></IndexLoggedRentSearch>
        <div id="rent-carousel-wrapper">
            <div class="carousel-absolute">
                <IndexLoggedRentCarousel></IndexLoggedRentCarousel>
            </div>
        </div>
    </div>
</template>

<script>
import IndexLoggedRentSearch from '../index-logged-page/IndexLoggedRentSearch'
import IndexLoggedRentCarousel from './IndexLoggedRentCarousel'

export default {
    components: {
        IndexLoggedRentSearch,
        IndexLoggedRentCarousel
    }
}
</script>

<style scoped>
    #index-logged-rent-wrapper{
        width: 100%;
        margin-top: 120px;
        height: 1345px;
    }
    #rent-carousel-wrapper{
        position: relative;
        width: 100%;
    }
    .carousel-absolute{
        /* position: absolute;
        top: -45px;
        z-index: 100; */
    }
</style>