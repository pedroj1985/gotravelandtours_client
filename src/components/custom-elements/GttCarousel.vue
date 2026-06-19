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
          <img v-if="slide" v-bind:src="slide" alt="" />
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"

const props = withDefaults(defineProps<{
  slides?: any[]
  dots?: boolean
  autoplay?: boolean
  autoplaySpeed?: number
  draggable?: boolean
}>(), {
  slides: () => [],
  dots: false,
  autoplay: false,
  autoplaySpeed: 3000,
  draggable: false
})

const currentSlide = ref(0)
const autoplayTimer = ref<ReturnType<typeof setInterval> | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)
const track = ref<HTMLElement | null>(null)

let _onMouseDown: ((e: any) => void) | null = null
let _onMouseMove: ((e: any) => void) | null = null
let _onMouseUp: (() => void) | null = null

const hasMultiple = computed(() => props.slides!.length > 1)

watch(() => props.slides, () => {
  resetAutoplay()
}, { immediate: true })

onMounted(() => {
  if (props.autoplay && hasMultiple.value) {
    startAutoplay()
  }
  if (props.draggable) {
    setupDrag()
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (props.draggable) {
    teardownDrag()
  }
})

function goTo(index: number) {
  currentSlide.value = index
  resetAutoplay()
}

function next() {
  if (currentSlide.value < props.slides!.length - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

function startAutoplay() {
  autoplayTimer.value = setInterval(() => {
    next()
  }, props.autoplaySpeed)
}

function stopAutoplay() {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

function resetAutoplay() {
  if (props.autoplay && hasMultiple.value) {
    stopAutoplay()
    startAutoplay()
  }
}

function setupDrag() {
  _onMouseDown = (e: any) => {
    isDragging.value = true
    startX.value = e.clientX || e.touches?.[0]?.clientX
  }
  _onMouseMove = (e: any) => {
    if (!isDragging.value) return
    currentX.value = e.clientX || e.touches?.[0]?.clientX
  }
  _onMouseUp = () => {
    if (!isDragging.value) return
    isDragging.value = false
    const diff = startX.value - currentX.value
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next()
      } else if (currentSlide.value > 0) {
        currentSlide.value--
      }
    }
    resetAutoplay()
  }
  const el = track.value
  if (el) {
    el.addEventListener("mousedown", _onMouseDown)
    document.addEventListener("mousemove", _onMouseMove)
    document.addEventListener("mouseup", _onMouseUp)
    el.addEventListener("touchstart", _onMouseDown, { passive: true })
    document.addEventListener("touchmove", _onMouseMove, { passive: true })
    document.addEventListener("touchend", _onMouseUp)
  }
}

function teardownDrag() {
  const el = track.value
  if (el) {
    el.removeEventListener("mousedown", _onMouseDown!)
    el.removeEventListener("touchstart", _onMouseDown!)
  }
  document.removeEventListener("mousemove", _onMouseMove!)
  document.removeEventListener("mouseup", _onMouseUp!)
  document.removeEventListener("touchmove", _onMouseMove!)
  document.removeEventListener("touchend", _onMouseUp!)
}
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
