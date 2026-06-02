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
                    rules="required"
                    v-slot="{ errors, valid }"
                  >
                    <input
                      v-model="username"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors[0] }"
                      name="username"
                      id="username-input"
                      placeholder="Usuario"
                    />
                    <span class="validation-error" v-show="errors[0]">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="teléfono"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="phone"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors[0] }"
                      name="phone"
                      id="phone-input"
                      placeholder="Teléfono"
                    />
                    <span class="validation-error" v-show="errors[0]">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="email"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors[0] }"
                      name="email"
                      id="email-input"
                      placeholder="Correo electrónico"
                    />
                    <span class="validation-error" v-show="errors[0]">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider
                    name="contraseña"
                    rules="required|confirmed:confirm"
                    v-slot="{ errors }"
                  >
                    <input
                      v-model="password"
                      type="password"
                      class="form-control"
                      :class="{ 'is-invalid': errors[0] }"
                      name="password"
                      id="password-input"
                      placeholder="Contraseña"
                    />
                    <span class="validation-error" v-show="errors[0]">{{ errors[0] }}</span>
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
                      :class="{ 'is-invalid': errors[0] }"
                      name="confirm_password"
                      id="confirm-password-input"
                      placeholder="Confirme la contraseña"
                    />
                    <span class="validation-error" v-show="errors[0]">{{ errors[0] }}</span>
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
          username: this.username,
          password: this.password,
          telefono: this.phone,
          correo: this.email,
          clienteId: localStorage.getItem("cliente"),
          rolId: 3
        };
        this.loading = true;
        authRegister(user, {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        })
          .then(({ data }) => {
            console.log(data);
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

<style scoped>
.validation-error {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}
</style>
