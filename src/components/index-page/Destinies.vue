<template>
  <div id="destinies" class="custom-margin">
    <div class="destiny-title section-title hn-bdcn">Destinos Cuba</div>
    <DestiniesCarousel :arrows="false" :dots="true"></DestiniesCarousel>
  </div>
</template>

<script>
import { scrollStore } from "../../stores/scrollStore";
import DestiniesCarousel from "../shared/DestiniesCarousel";
export default {
  name: "Destinies",
  components: {
    DestiniesCarousel
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
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
