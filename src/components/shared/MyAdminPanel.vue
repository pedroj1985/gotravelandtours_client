<template>
  <div id="my-admin-panel">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <div class="admin-panel-content custom-margin custom-padding-top-2-navbar">
      <div id="admin-panel-mini-nav">
        <div id="ap-nav-icon">
          <i class="mdi mdi-home-outline"></i>
        </div>
        <div id="ap-nav-content">
          <div
            id="ap-nav-text"
            class="general-text-opt antonio-regular font24 gtt-first-color"
          >
            Área exclusiva de la agencia
            <span class="antonio-bold">{{ user.clienteNombre }}</span
            >, te encuentras en:
            <span
              class="admin-display-section antonio-bold"
              style="color: #bcd01d"
              >{{ constructDisplaySection(currentChild) }}</span
            >
          </div>
          <div
            id="ap-nav-nav"
            class="general-text-opt hn-bdcn gtt-first-color font18"
          >
            <a href="#" class="ap-nav">Inicio</a>
            <a href="#" class="ap-nav">Mi cuenta</a>
            <a href="#" class="ap-nav">Mi perfil</a>
          </div>
        </div>
      </div>
      <div class="row" id="ap-content-wrapper">
        <div
          id="ap-side-menu"
          class="col-lg-2 col-md-5"
          style="height: 100%;"
          v-if="currentChild != 'reservation-detail'"
        >
          <div class="no-nav-user-photo text-center">
            <img :src="user.photo" v-if="user.photo" alt="" />
            <i v-else class="mdi mdi-account font48"></i>
          </div>
          <div
            class="gtt-first-color text-center general-text-opt antonio-light font24"
          >
            <span class="antonio-bold">{{ user.clienteNombre }}</span>
          </div>
          <div
            class="gtt-first-color text-center general-text-opt antonio-light font18"
          >
            <span>Bienvenido(a) </span
            ><span class="antonio-bold">{{ user.name }}</span>
          </div>
          <hr class="gtt-first-color gtt-separator-line" />
          <div id="ap-elements-wrapper" class="text-right">
            <ul id="ap-elements">
              <li
                class="gtt-first-color hn-roman to-uppercase"
                :class="{ selected: currentChild == item.code }"
                v-for="item in adminElements"
                :key="item.id"
              >
                <router-link :to="{ name: item.route }">
                  <span class="ap-name">
                    {{ item.displayName }}
                  </span>
                  <i class="mdi mdi-menu-right font18"></i>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div
          id="r-right-side"
          :class="{
            'col-lg-12': currentChild == 'reservation-detail',
            'col-lg-10 col-md-7': currentChild != 'reservation-detail',
          }"
        >
          <router-view
            :user="user"
            @adminPanelInfo="updateCurrentChild"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar2 from "../shared/NavBar2";
import { getUser } from "../../utils/auth";

export default {
  components: {
    NavBar2,
  },
  created() {
    this.user = getUser();
    console.log(this.user.name);
  },
  methods: {
    constructDisplaySection(item) {
      let text = "";
      switch (item) {
        case "reservation":
          text = "Mis reservaciones";
          break;

        default:
          text = "Mi perfil";
          break;
      }

      return text;
    },
    updateCurrentChild(value) {
      this.currentChild = value;
    },
  },
  data() {
    return {
      currentChild: "",
      user: null,
      menuLinks: [
        {
          name: "index",
          displayName: "Inicio",
          id: "home-logged-banner",
        },
        {
          name: "lodging",
          displayName: "alojamientos",
          id: "home-logged-banner",
        },
/*         {
          name: "car-rent",
          displayName: "renta de autos",
          id: "index-logged-rent-wrapper",
        }, */
/*        {
          name: "transfer",
          displayName: "traslados",
          id: "index-logged-transfer",
        },
        {
          name: "excursions",
          displayName: "Excursiones y actividades",
          id: "index-logged-excursion",
        },*/
      ],
      adminElements: [
        {
          displayName: "Reservaciones",
          code: "reservation",
          route: "myreservations",
        },
        {
          displayName: "Reportes",
          code: "report",
          route: "myreports",
        },
        {
          displayName: "Agenda",
          code: "agend",
          route: "myagend",
        },
        {
          displayName: "Facturas",
          code: "bill",
          route: "mybills",
        },
        {
          displayName: "Documentos",
          code: "document",
          route: "mydocs",
        },
      ],
    };
  },
};
</script>

<style scoped>
#admin-panel-mini-nav {
  display: flex;
  padding: 15px;
  background-color: #f5f5f5;
  margin-bottom: 30px;
  margin-top: 60px;
}
#ap-content-wrapper {
  margin-left: 15px;
  margin-right: 15px;
}
.admin-display-section {
  text-transform: uppercase;
}
#ap-nav-content {
  padding-top: 15px;
  padding-left: 15px;
}
#ap-nav-icon {
  font-size: 72px;
  color: #6d6d6d;
  line-height: 1;
}
#ap-nav-nav {
  display: flex;
}
.ap-nav {
  color: #212f3d;
  text-transform: uppercase;
  margin-right: 15px;
}
.ap-nav:hover {
  color: #6d6d6d;
}
#ap-side-menu {
  border: 1px solid #6d6d6d;
  border-radius: 10px;
  padding: 10px;
}
.no-nav-user-photo img {
  width: 150px;
}
ul#ap-elements {
  list-style: none;
}
ul#ap-elements a {
  color: #212f3d;
}
ul#ap-elements a:hover {
  color: #c4c4c4;
  text-decoration-line: none;
}
.selected a {
  color: #c4c4c4 !important;
}
@media (max-width: 1440px) {
  ul#ap-elements {
    font-size: 12px;
    padding-left: 5px;
  }
}
</style>
