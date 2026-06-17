<template>
  <div id="home-banner">
    <swiper
      class="home-carousel"
      :slides-per-view="1"
      :navigation="false"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      :modules="swiperModules"
    >
      <swiper-slide class="image-review">
        <img src="/img/home_carrusel_01.jpg" alt="playa" />
      </swiper-slide>
      <swiper-slide>
        <img src="/img/home_carrusel_02.jpg" alt="hotel" />
      </swiper-slide>
      <swiper-slide>
        <img src="/img/home_carrusel_03.jpg" alt="habana" />
      </swiper-slide>
      <swiper-slide>
        <img src="/img/home_carrusel_04.jpg" alt="habana" />
      </swiper-slide>
      <swiper-slide>
        <img src="/img/home_carrusel_05.jpg" alt="habana" />
      </swiper-slide>
    </swiper>
    <div class="navs-wrapper">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
    </div>
    <div class="home-banner-login">
      <div class="form-login-container">
        <div class="form-logo">
          <img src="/img/logo_colibri_colored.png" alt="Colibri Viajes" />
          <hr />
          <div class="form-inicio-sesion-text antonio-bold">
            inicio de sesión para agencias
          </div>
        </div>
        <form action="/login" method="POST">
          <div class="form-group inputs-container hn-roman">
            <div class="test-error" v-if="testErrorVisible">
              {{ testError }}
            </div>
            <input
              v-model="username"
              type="text"
              class="form-control"
              name="username"
              id="username-input"
              placeholder="Usuario"
            />
            <input
              v-model="password"
              type="password"
              class="form-control"
              name="password"
              id="password-input"
              placeholder="Contraseña"
            />
          </div>
          <div class="form-password-forgotten hn-roman">
            ¿Has olvidado tu <a href="#">contraseña</a>?
          </div>
          <div class="home-actions antonio-regular">
            <!-- <button class="btn home-sign-up" type="button">registrarse</button> -->
            <button class="btn home-login-btn" @click="login" type="button">
              <template v-if="!loading">entrar</template>
              <span
                class="gtt-spinner gtt-spinner-sm loading-spinner"
                v-else
              ></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar2 from "../shared/NavBar2";
import { authStore } from "../../stores/authStore";
import { cartStore } from "../../stores/cartStore";
import { scrollStore } from "../../stores/scrollStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import {
  authLogin,
  updateHeader,
  authGetUser,
  authLog
} from "../../utils/auth";
import { authConfig } from "../../../public/js/auth_config";
import { codes } from "../../utils/codes";
import moment from "moment";
import { storageService } from "../../utils/storageService";

export default {
  name: "IndexBanner",
  components: {
    NavBar2,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperModules: [Navigation, Pagination, Autoplay],
      loading: false,
      testError: "",
      testErrorVisible: false,
      username: "",
      password: "",
      menuLinks: [
        {
          name: "index",
          displayName: "Inicio",
          id: "content"
        },
        {
          name: "who-we-are",
          displayName: "Colibri viajes",
          id: "who-we-are"
        }
      ]
    };
  },
  methods: {
    login() {
      if (!this.username.trim() || !this.password.trim()) {
        this.$toasted.show("Usuario y contraseña son requeridos", {
          type: "error"
        });
        return;
      }
      let user = {
        usuario: this.username.trim(),
        password: this.password.trim()
      };
      this.loading = true;
      authLogin(user)
        .then(({ data }) => {
          const { rol } = data;

          if (rol == "Cliente") {
            storageService.setToken(data.token);
            localStorage.setItem("nombre", data.nombre);
            localStorage.setItem("userid", data.Id);
            localStorage.setItem("cliente", data.clienteId);
            localStorage.setItem("fecha_exp", data.fechaF);
            authLog({
              Fecha: moment().format(),
              FuncionCreador: "Login",
              FuncionParam: JSON.stringify(user),
              Usuario: data.nombre,
              Tipo: "Info"
            });
            authGetUser(data.clienteId)
              .then(r => {
                let u = r.data;
                let userToSave = {
                  name: data.nombre,
                  clienteId: data.clienteId,
                  clienteNombre: u.Nombre,
                  clienteCorreo: u.Correo,
                  photo: u.ImageContent
                };
                let uEncode = JSON.stringify(userToSave);
                localStorage.setItem("usuarioObjeto", uEncode);
                this.loading = false;
                let uS = JSON.parse(localStorage.getItem("usuarioObjeto"));
                authStore.login(uS);
                updateHeader(localStorage.getItem("token"));
                cartStore.refresh();
                this.$router.push({ name: "indexLogged" });
              })
              .catch(() => {
                localStorage.setItem(
                  "usuarioObjeto",
                  JSON.stringify({
                    name: data.nombre,
                    clienteId: data.clienteId
                  })
                );
                let uS = JSON.parse(localStorage.getItem("usuarioObjeto"));
                let u = uS;
                authStore.login(u);
                updateHeader(localStorage.getItem("token"));
                cartStore.refresh();
                this.$router.push({ name: "indexLogged" });
              });
          } else {
            window.location.replace(
              authConfig.externalURL +
                "?" +
                authConfig.userParam +
                "=" +
                user.usuario +
                "&" +
                authConfig.passParam +
                "=" +
                user.password
            );
          }
        })
        .catch(({ response }) => {
          this.loading = false;
          const { status } = response;
          if (status == codes.invalidCredentials) {
            authLog({
              Fecha: moment().format(),
              FuncionCreador: "Login",
              Tipo: "Error",
              FuncionParam: JSON.stringify(user)
            });
            this.$toasted.show(
              `Lo sentimos, usuario y/o contraseña incorrectos.`,
              {
                type: "error"
              }
            );
            // this.testError = 'Credenciales inválidas'
            this.cleanInputs();
            // this.testErrorVisible = true
            // setTimeout(()=>this.testErrorVisible = false,3000)
          }
        });
    },
    handleScroll() {
      let height = window.innerHeight;
      if (
        height * 0.25 > this.$el.getBoundingClientRect().top &&
        height * 0 < this.$el.getBoundingClientRect().top
      ) {
        scrollStore.scrollTo("index");
      }
    },
    cleanInputs() {
      this.username = "";
      this.password = "";
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
