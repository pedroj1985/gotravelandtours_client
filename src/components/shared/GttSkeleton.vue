<template>
  <div class="gtt-skeleton" :class="[type, `w-${width}`]" :style="{ height }">
    <div class="gtt-skeleton-pulse"></div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "GttSkeleton" });

withDefaults(defineProps<{
  type?: string
  width?: number
  height?: string
}>(), {
  type: "text",
  width: 100,
  height: "1em"
});
</script>

<style scoped>
.gtt-skeleton {
  position: relative;
  overflow: hidden;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.gtt-skeleton.circle {
  border-radius: 50%;
}

.gtt-skeleton.rect {
  border-radius: 6px;
}

.gtt-skeleton.w-10 { width: 10%; }
.gtt-skeleton.w-20 { width: 20%; }
.gtt-skeleton.w-25 { width: 25%; }
.gtt-skeleton.w-30 { width: 30%; }
.gtt-skeleton.w-40 { width: 40%; }
.gtt-skeleton.w-50 { width: 50%; }
.gtt-skeleton.w-60 { width: 60%; }
.gtt-skeleton.w-70 { width: 70%; }
.gtt-skeleton.w-75 { width: 75%; }
.gtt-skeleton.w-80 { width: 80%; }
.gtt-skeleton.w-90 { width: 90%; }
.gtt-skeleton.w-100 { width: 100%; }

.gtt-skeleton-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: gtt-shimmer 1.5s infinite;
}

@keyframes gtt-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
