<template>
  <div class="gtt-carousel">
    <div class="gtt-carousel-track" ref="track">
      <div
        class="gtt-carousel-slide"
        v-for="(slide, index) in slides"
        :key="index"
        v-show="index === currentSlide"
      >
        <slot name="slide" v-bind:slide="slide" v-bind:index="index">
          <img v-if="slide" v-bind:src="slide" alt />
          <img
            v-else
            src="../../../public/img/icopaq_alojamiento_black.svg"
            alt="placeholder"
          />
        </slot>
      </div>
    </div>
    <div class="gtt-carousel-dots" v-if="dots">
      <span
        v-for="(slide, index) in slides"
        :key="'dot-' + index"
        class="gtt-carousel-dot"
        :class="{ active: index === currentSlide }"
        @click="goTo(index)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    dots: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    autoplaySpeed: {
      type: Number,
      default: 3000
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentSlide: 0,
      autoplayTimer: null,
      isDragging: false,
      startX: 0,
      currentX: 0
    };
  },
  computed: {
    hasMultiple() {
      return this.slides.length > 1;
    }
  },
  watch: {
    slides: {
      immediate: true,
      handler() {
        this.resetAutoplay();
      }
    }
  },
  mounted() {
    if (this.autoplay && this.hasMultiple) {
      this.startAutoplay();
    }
    if (this.draggable) {
      this.setupDrag();
    }
  },
  beforeDestroy() {
    this.stopAutoplay();
    if (this.draggable) {
      this.teardownDrag();
    }
  },
  methods: {
    goTo(index) {
      this.currentSlide = index;
      this.resetAutoplay();
    },
    next() {
      if (this.currentSlide < this.slides.length - 1) {
        this.currentSlide++;
      } else {
        this.currentSlide = 0;
      }
    },
    startAutoplay() {
      this.autoplayTimer = setInterval(() => {
        this.next();
      }, this.autoplaySpeed);
    },
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },
    resetAutoplay() {
      if (this.autoplay && this.hasMultiple) {
        this.stopAutoplay();
        this.startAutoplay();
      }
    },
    setupDrag() {
      this._onMouseDown = e => {
        this.isDragging = true;
        this.startX = e.clientX || e.touches?.[0]?.clientX;
      };
      this._onMouseMove = e => {
        if (!this.isDragging) return;
        this.currentX = e.clientX || e.touches?.[0]?.clientX;
      };
      this._onMouseUp = () => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.next();
          } else if (this.currentSlide > 0) {
            this.currentSlide--;
          }
        }
        this.resetAutoplay();
      };
      const el = this.$refs.track;
      el.addEventListener("mousedown", this._onMouseDown);
      document.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("mouseup", this._onMouseUp);
      el.addEventListener("touchstart", this._onMouseDown, { passive: true });
      document.addEventListener("touchmove", this._onMouseMove, {
        passive: true
      });
      document.addEventListener("touchend", this._onMouseUp);
    },
    teardownDrag() {
      const el = this.$refs.track;
      if (el) {
        el.removeEventListener("mousedown", this._onMouseDown);
        el.removeEventListener("touchstart", this._onMouseDown);
      }
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      document.removeEventListener("touchmove", this._onMouseMove);
      document.removeEventListener("touchend", this._onMouseUp);
    }
  }
};
</script>

<style scoped>
.gtt-carousel {
  position: relative;
  width: 100%;
}
.gtt-carousel-track {
  position: relative;
  overflow: hidden;
  width: 100%;
}
.gtt-carousel-slide {
  width: 100%;
}
.gtt-carousel-slide img {
  width: 100%;
  display: block;
}
.gtt-carousel-dots {
  text-align: center;
  padding: 8px 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.gtt-carousel-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.gtt-carousel-dot.active {
  background: #fff;
}
</style>
