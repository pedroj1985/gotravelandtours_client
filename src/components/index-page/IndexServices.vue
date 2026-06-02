<template>
  <div id="services-you-like" class="custom-margin">
    <div class="service-you-like-title section-title hn-bdcn">
      Servicios que te pueden interesar con GT&amp;T
    </div>
    <IndexServicesCarousel :customMargin="false"></IndexServicesCarousel>
  </div>
</template>

<script>
import { scrollStore } from "../../stores/scrollStore";
import IndexServicesCarousel from "./IndexServicesCarousel";

export default {
  components: {
    IndexServicesCarousel
  },
  methods: {
    handleScroll() {
      let height = window.innerHeight;
      if (
        height * 0.25 > this.$el.getBoundingClientRect().top &&
        height * 0 < this.$el.getBoundingClientRect().top
      ) {
        scrollStore.scrollTo(this.$el.id);
      }
    }
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
