<template>
  <div class="gtt__button_modal">
    <div
      class="gtt__button"
      :class="classToButton"
      ref="buttonModal"
      @click="toggleClicked"
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
import { ref } from "vue"
import { useRouter } from "vue-router"
import { clickOutside as vClickOutside } from "@/directives/clickOutside"
import { closeSession as closeSessionUtil } from "../../utils/auth"
import RegisterModal from "../shared/Register.vue"
import { useAuthStore } from "../../stores/authStore"

defineProps<{ classToButton?: string; value?: any; arrow?: any; user?: any }>()

const router = useRouter()
const isVisible = ref(false)
const modalActive = ref(false)

function toggleClicked() {
  isVisible.value = !isVisible.value
}

function handleFocusOut() {
  isVisible.value = false
}

function activeRegisterModal() {
  handleFocusOut()
  return (modalActive.value = !modalActive.value)
}

function closeSession() {
  handleFocusOut()
  useAuthStore().logout()
  closeSessionUtil({ $router: router })
}
</script>

<style lang="scss" scoped>
.gtt__button_modal {
  position: relative;
}

.gtt__list_area_wrapper {
  position: absolute;
  left: -20px;
  right: auto;
  min-width: 100%;
  border-radius: var(--border-radius-lg);
  z-index: var(--z-dropdown);
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
  min-height: 100px;
  max-height: 300px;
  min-width: 300px;
  list-style: none;
  text-align: left;
  border-radius: var(--border-radius-lg);
  overflow: auto;
  padding: var(--spacing-lg);
  background-color: var(--color-background-white);
  margin-bottom: 0;
  color: var(--color-text-primary);
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
}

@media (max-width: 1440px) {
  .arrow {
    top: -12px;
  }

  .gtt__list_area {
    font-size: 10px;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
