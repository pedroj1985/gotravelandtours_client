<template>
  <div id="home-banner">
    <Slick
      class="home-carousel"
      :slidesToShow="1"
      :arrows="false"
      :dots="false"
      :autoplay="true"
      :swipe="true"
    >
      <div class="image-review">
        <img src="img/home_carrusel_01.jpg" alt="playa" />
        <!-- <div class="review custom-margin">
          <div class="home-banner-title antonio-bold">
            península de Hicacos "Varadero"
          </div>
          <div class="home-banner-description hn-roman">
            Con 30Km de extensión de los cuales 22Km son de playas. Una de las
            mejores playas del mundo para el snorkel y el buceo.
          </div>
          <div class="home-banner-location hn-ltcn">
            <i class="mdi mdi-map-marker"></i
            ><span class="home-location">Varadero, Cuba</span>
          </div>
          <div class="home-banner-weather hn-ltcn">
            <i class="mdi mdi-weather-sunny"></i
            ><span class="home-grade">32°C</span>
          </div>
        </div> -->
      </div>
      <div>
        <img src="img/home_carrusel_02.jpg" alt="hotel" />
      </div>
      <div>
        <img src="img/home_carrusel_03.jpg" alt="habana" />
      </div>
      <div>
        <img src="img/home_carrusel_04.jpg" alt="habana" />
      </div>
      <div>
        <img src="img/home_carrusel_05.jpg" alt="habana" />
      </div>
    </Slick>
    <div class="navs-wrapper">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
    </div>
    <div class="home-banner-login">
      <div class="form-login-container">
        <div class="form-logo">
          <img src="img/logo_colibri_colored.png" alt="Colibri Viajes" />
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
              <b-spinner
                small
                class="loading-spinner"
                label="Text Centered"
                v-else
              ></b-spinner>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar2 from "../shared/NavBar2";
import { eventBus } from "../../main";
import Slick from "vue-slick-carousel";
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
    Slick
  },
  data() {
    return {
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
      let user = {
        usuario: this.username,
        password: this.password
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
                eventBus.$emit("userLogin", uS);
                updateHeader(localStorage.getItem("token"));
                this.$eventCartBus.$emit("updateCart");
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
                eventBus.$emit("userLogin", u);
                updateHeader(localStorage.getItem("token"));
                this.$eventCartBus.$emit("updateCart");
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
        eventBus.$emit("componentScrolled", "index");
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
