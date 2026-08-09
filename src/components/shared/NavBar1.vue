<template>
  <div id="first-nav" aria-label="Navegación principal">
    <div id="first-nav-content" class="custom-margin">
      <router-link to="/" id="logo_link" aria-label="Ir a la página principal">
        <img
          class="logo"
          src="/img/logo_colibri_white.png"
          alt="Colibri Viajes"
        />
      </router-link>
      <button class="hamburger-toggle hide-desktop" @click="menuOpen = !menuOpen" aria-label="Menú de navegación"><i :class="menuOpen ? 'mdi mdi-close' : 'mdi mdi-menu'"></i></button>
      <div class="right-side-navbar" :class="{ 'mobile-open': menuOpen }">
        <div class="auth-user-menu" v-if="isUserLogged">
          <div class="user-name-hello">
            <div class="hello antonio-light">Buenas tardes</div>
            <div class="user-name antonio-bold">
              <span>{{ user.name }}</span
              ><span class="antonio-light"> de </span
              ><span>{{ user.clienteNombre }}</span>
            </div>
          </div>
          <GttButtonModal :user="user" :classToButton="'user-photo'">
          </GttButtonModal>
          <div class="vl"></div>
          <div class="reservations hn-roman">
            <router-link :to="{ name: 'myreservations' }">
              Mis reservas <i class="mdi mdi-timetable"></i>
            </router-link>
          </div>
          <!-- <div class="bills hn-roman">
            <a href="#"
              >Mis facturas <i class="mdi mdi-file-document-outline"></i
            ></a>
          </div> -->
          <div class="shopping-cart">
            <router-link :to="{ name: 'reservation' }" :aria-label="`Carrito de compras (${itemsInCart} artículos)`">
              <div class="shopping-cart-wrapper">
                <i class="mdi mdi-cart"></i>
                <GttBubbleNotification
                  :count="itemsInCart"
                ></GttBubbleNotification>
              </div>
            </router-link>
          </div>
        </div>
        <div id="language_selector">
          <i class="mdi mdi-web"></i><span class="l_letters hn-roman">ES</span>
        </div>
        <!-- <div class="search" v-if="isUserLogged">
          <i class="mdi mdi-magnify"></i>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import GttButtonModal from "../custom-elements/GttButtonModal.vue";
import GttBubbleNotification from "../custom-elements/GttBubbleNotification.vue";

export default {
  components: {
    GttButtonModal,
    GttBubbleNotification
  },
  name: "NavBar1",
  props: {
    itemsInCart: {
      type: Number,
      default: 0
    },
    user: Object,
    isUserLogged: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      menuOpen: false
    };
  },
  methods: {
    emitUserLogin(value) {
      this.$emit("userLogin", value);
    }
  }
};
</script>

<style lang="scss" scoped>
#first-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.shopping-cart-wrapper {
  position: relative;
}

.right-side-navbar {
  display: flex;
  float: right;
  height: 100%;
}

.auth-user-menu {
  display: flex;
}

.vl {
  height: 100%;
  border-left: 1px solid var(--color-border);
}

.user-name-hello {
  margin-top: var(--spacing-sm);
}

.hello,
.user-name {
  padding: 0;
  line-height: var(--line-height-tight);
  text-align: right;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

#language_selector {
  margin-top: 18px;
  color: var(--color-border);
  line-height: var(--line-height-tight);
  float: right;
  font-size: 24px;
  padding-right: var(--spacing-xl);
}

.reservations {
  padding-left: var(--spacing-md);
}

.reservations,
.bills,
.shopping-cart,
.search {
  padding-right: var(--spacing-xl);
  line-height: var(--line-height-tight);
  margin-top: 18px;
}

.reservations i,
.bills i,
.shopping-cart i,
.search i {
  font-size: 24px;
}

.search {
  color: var(--color-border);
}

.reservations a,
.bills a,
.shopping-cart a {
  text-transform: uppercase;
  color: var(--color-border);
  font-size: var(--font-size-md);
}

@media (max-width: 1440px) {
  .hello,
  .user-name {
    font-size: var(--font-size-sm);
  }

  .reservations i,
  .bills i,
  .shopping-cart i,
  .search i {
    font-size: var(--font-size-sm);
  }

  .reservations a,
  .bills a,
  .shopping-cart a {
    font-size: var(--font-size-sm);
  }

  #language_selector {
    font-size: var(--font-size-sm);
  }
}

// Hamburger toggle
.hamburger-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-size: 28px;
  cursor: pointer;
  padding: var(--spacing-sm);
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

@media (max-width: 768px) {
  .hamburger-toggle {
    display: block;
  }

  .right-side-navbar {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-text-primary);
    flex-direction: column;
    padding: var(--spacing-lg);
    z-index: 1000;
    box-shadow: var(--shadow-lg);

    &.mobile-open {
      display: flex;
    }
  }

  .auth-user-menu {
    flex-direction: column;
    width: 100%;
  }

  .user-name-hello {
    text-align: left;
    margin-bottom: var(--spacing-md);
  }

  .reservations, .shopping-cart, .vl {
    padding: var(--spacing-sm) 0;
    margin: 0;
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  #language_selector {
    margin-top: var(--spacing-md);
    float: none;
  }
}

@media (min-width: 769px) {
  .right-side-navbar {
    display: flex !important;
  }
}
</style>
