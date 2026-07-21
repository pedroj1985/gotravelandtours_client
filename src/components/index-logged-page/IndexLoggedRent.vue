<template>
  <div id="index-logged-rent-wrapper">
    <IndexLoggedRentSearch></IndexLoggedRentSearch>
    <!--        <div id="rent-carousel-wrapper">
            <div class="carousel-absolute">
                <IndexLoggedRentCarousel></IndexLoggedRentCarousel>
            </div>
        </div>-->
  </div>
</template>

<script>
import IndexLoggedRentSearch from "../index-logged-page/IndexLoggedRentSearch";
import { scrollStore } from "../../stores/scrollStore";

export default {
  components: {
    IndexLoggedRentSearch
  },
  methods: {
    handleScroll() {
      let height = window.innerHeight;
      let top = this.$el.getBoundingClientRect().top;
      if (height * 0.25 > top && top > 0) {
        scrollStore.scrollTo("car-rent");
      }
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped>
#index-logged-rent-wrapper {
  width: 100%;
  margin-top: 120px;
  height: 1345px;
}
#rent-carousel-wrapper {
  position: relative;
  width: 100%;
}
@media (max-width: 1440px) {
  #index-logged-rent-wrapper {
    height: 950px;
  }
}
</style>
