<template>
  <div class="modal-backdrop" id="register">
    <div class="c-modal custom-margin">
      <div class="c-modal-body">
        <div class="home-banner-register">
          <div class="form-register-container">
            <div class="form-logo">
              <img src="img/logo_colibri_colored.png" alt="Colibri Viajes" />
              <hr />
              <div class="form-inicio-sesion-text antonio-bold">Registro</div>
            </div>
            <form action="/Register" method="POST">
              <div class="form-group inputs-container hn-roman">
                <div class="test-error" v-if="testErrorVisible">
                  {{ testError }}
                </div>
                <ValidationObserver
                  ref="observer"
                  tag="form"
                  @submit.prevent="submit()"
                >
                  <ValidationProvider
                    name="usuario"
                    rules="required|alpha_num"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="username"
                      type="text"
                      class="form-control"
                      name="username"
                      id="username-input"
                      placeholder="Usuario"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="teléfono"
                    rules="required|numeric"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="phone"
                      type="text"
                      class="form-control"
                      name="phone"
                      id="phone-input"
                      placeholder="Teléfono"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="email"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="email"
                      type="email"
                      class="form-control"
                      name="email"
                      id="email-input"
                      placeholder="Correo electrónico"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="contraseña"
                    rules="required|confirmed:confirm|min:8"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="password"
                      type="password"
                      class="form-control"
                      name="password"
                      id="password-input"
                      placeholder="Contraseña"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="confirm password"
                    vid="confirm"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="confirm_password"
                      type="password"
                      class="form-control"
                      name="confirm_password"
                      id="confirm-password-input"
                      placeholder="Confirme la contraseña"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                </ValidationObserver>
              </div>
              <div class="form-password-forgotten hn-roman">
                ¿Ya tienes una cuenta? <a href="#">Inicia Sesión</a>
              </div>
              <div class="home-actions antonio-regular">
                <button
                  class="btn home-sign-up"
                  type="button"
                  @click="submit()"
                >
                  <template v-if="!loading">registrarse</template>
                  <b-spinner
                    small
                    class="loading-spinner"
                    label="Text Centered"
                    v-else
                  ></b-spinner>
                </button>
                <button class="btn home-sign-up" type="button" @click="close">
                  cerrar
                </button>
              </div>
            </form>
            <div class="terms-of-use hn-roman">
              Al iniciar sesión o al crear una cuenta, acepta nuestros Términos
              de uso y la Declaración de privacidad
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authRegister } from "../../utils/auth";
import { storageService } from "../../utils/storageService";
import logger from "../../utils/logger";

export default {
  data() {
    return {
      loading: false,
      username: "",
      phone: "",
      email: "",
      password: "",
      confirm_password: "",
      testErrorVisible: false,
      testError: ""
    };
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    async submit() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        let user = {
          username: this.username.trim(),
          password: this.password.trim(),
          telefono: this.phone.trim(),
          correo: this.email.trim().toLowerCase(),
          clienteId: localStorage.getItem("cliente"),
          rolId: 3
        };
        this.loading = true;
        authRegister(user, {
          Authorization: `Bearer ${storageService.getToken()}`
        })
          .then(({ data }) => {
            logger.log(data);
            this.$toasted.show(
              `El cliente "${data.Username}" se registró con éxito. A espera de su activación.`,
              {
                type: "success"
              }
            );
            this.loading = false;
            this.close();
          })
          .catch(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>
