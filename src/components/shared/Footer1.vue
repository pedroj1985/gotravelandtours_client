<template>
  <div id="footer1">
    <div class="footer1-content custom-margin">
      <div class="question hn-roman">
        ¿Quieres recibir ofertas exclusivas de hoteles? ¡Suscríbete a nuestro
        boletín de noticias!
      </div>
      <Form class="form-inline" @submit="sendSubsPetition">
        <Field name="correo" rules="required" v-slot="{ field, errors }">
          <div class="form-group">
            <input
              v-bind="field"
              type="email"
              class="form-control hn-roman"
              placeholder="Dirección de correo"
            />
          </div>
          <div>{{ errors[0] }}</div>
        </Field>
        <button type="submit" class="btn antonio-regular">
          <template v-if="!loading">suscribirse</template>
          <span
            class="gtt-spinner gtt-spinner-sm loading-spinner"
            v-else
          ></span>
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { subscribe } from "../../utils/auth";
import { toast } from "vue3-toastify";

defineOptions({ name: "Footer1" });

const loading = ref(false);

async function sendSubsPetition(values: any) {
  try {
    loading.value = true;
    await subscribe(values.correo);
    loading.value = false;
    toast(
      "Su petición se suscripción ha sido enviada con éxito. La administración pronto contactará con usted",
      {
        type: "success"
      }
    );
  } catch (error) {
    console.log(error);
    loading.value = false;
    toast(
      "El servicio no está disponible en estos momentos",
      {
        type: "error"
      }
    );
  }
}
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
