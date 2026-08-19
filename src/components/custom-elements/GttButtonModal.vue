<template>
  <div class="gtt__button_modal" ref="root">
    <div
      class="gtt__button"
      :class="classToButton"
      ref="buttonModal"
      @click.stop="toggleClicked"
    >
      <i class="mdi mdi-account"></i>
    </div>

    <div
      class="gtt__list_area_wrapper"
      :class="{ isVisible: isVisible }"
      v-click-outside="handleFocusOut"
    >
      <span class="arrow" v-if="arrow"></span>
      <div class="gtt__list_area">
        <div class="client-actions-wrapper">
          <div class="client-actions-item" @click="activeRegisterModal">
            Registrar cliente
          </div>
          <div class="button-close-session-wrapper">
            <button
              class="btn btn-danger button-close-session"
              type="button"
              @click="closeSession"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
    <RegisterModal
      v-if="modalActive"
      @closeModal="activeRegisterModal"
    ></RegisterModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { clickOutside as vClickOutside } from "@/directives/clickOutside";
import { closeSession as closeSessionUtil } from "../../utils/auth";
import RegisterModal from "../shared/Register.vue";
import { useAuthStore } from "../../stores/authStore";

const props = withDefaults(
  defineProps<{
    classToButton?: string;
    value?: any;
    arrow?: boolean;
    user?: any;
  }>(),
  {
    classToButton: "",
    arrow: true,
  },
);

const router = useRouter();
const isVisible = ref(false);
const modalActive = ref(false);
const root = ref<HTMLElement | null>(null);

function toggleClicked() {
  isVisible.value = !isVisible.value;
}

function handleFocusOut(event?: Event) {
  if (!event || !root.value?.contains(event.target as Node)) {
    isVisible.value = false;
  }
}

function activeRegisterModal() {
  handleFocusOut();
  return (modalActive.value = !modalActive.value);
}

function closeSession() {
  handleFocusOut();
  useAuthStore().logout();
  closeSessionUtil({ $router: router });
}
</script>

<style lang="scss" scoped>
.gtt__button_modal {
  position: relative;
}

.gtt__button {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 0;
}

.gtt__list_area_wrapper {
  position: absolute;
  left: -20px;
  right: auto;
  min-width: 240px;
  border-radius: var(--border-radius-lg);
  z-index: 1001;
  top: calc(100% + var(--spacing-xs));
  margin-top: 0;
  box-shadow: var(--shadow-lg);
  display: none;

  &.isVisible {
    display: block;
  }
}

.arrow {
  @include dropdown-arrow;
}

.gtt__list_area {
  min-height: 80px;
  max-height: 260px;
  min-width: 220px;
  max-width: 260px;
  list-style: none;
  text-align: left;
  border-radius: var(--border-radius-lg);
  overflow: auto;
  padding: 0.75rem;
  background-color: var(--color-background-white);
  margin-bottom: 0;
  color: var(--color-text-primary);
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
}

.client-actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.client-actions-item,
.button-close-session {
  font-size: 0.85rem;
}

.button-close-session {
  width: 100%;
  padding: 0.5rem 0.75rem;
}

@media (max-width: 1440px) {
  .arrow {
    top: -12px;
  }

  .gtt__list_area {
    font-size: 0.85rem;
    padding: 0.5rem;
    min-width: 200px;
    max-width: 240px;
  }
}
</style>
