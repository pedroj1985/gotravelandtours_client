<template>
  <div id="footer1">
    <div class="footer1-content custom-margin">
      <div class="question hn-roman">
        ¿Quieres recibir ofertas exclusivas de hoteles? ¡Suscríbete a nuestro
        boletín de noticias!
      </div>
      <ValidationObserver
        class="form-inline"
        ref="observer"
        tag="form"
        @submit.prevent="sendSubsPetition"
      >
        <ValidationProvider name="correo" rules="required" v-slot="{ errors }">
          <div class="form-group">
            <input
              type="email"
              v-model="email"
              class="form-control hn-roman"
              placeholder="Dirección de correo"
            />
          </div>
          <div>{{ errors[0] }}</div>
        </ValidationProvider>
        <button type="submit" class="btn antonio-regular">
          <template v-if="!loading">suscribirse</template>
          <b-spinner
            small
            class="loading-spinner"
            label="Text Centered"
            v-else
          ></b-spinner>
        </button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { subscribe } from "../../utils/auth";

export default {
  data() {
    return {
      loading: false,
      email: ""
    };
  },
  methods: {
    clearInput() {
      this.email = "";
    },
    async sendSubsPetition() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        try {
          this.loading = true;
          await subscribe(this.email);
          this.loading = false;
          this.$toasted.show(
            "Su petición se suscripción ha sido enviada con éxito. La administración pronto contactará con usted",
            {
              type: "success"
            }
          );
        } catch (error) {
          console.log(error);
          this.loading = false;
          this.$toasted.show(
            "El servicio no está disponible en estos momentos",
            {
              type: "error"
            }
          );
        }
      }
      this.clearInput();
    }
  }
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .footer1-content {
    flex-direction: column;
    text-align: center;
  }
  .footer1-content .form-inline {
    flex-direction: column;
    width: 100%;
  }
  .footer1-content .form-group {
    width: 100%;
    margin-bottom: var(--spacing-md);
  }
  .footer1-content input {
    width: 100%;
  }
}
</style>
