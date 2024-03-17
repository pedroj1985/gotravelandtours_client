<template>
  <div class="info-row gtt-text-color hn-roman">
    <div class="ir-text-wrapper font18">
      <i class="mdi mdi-account"></i>
      <span class="ir-text">
        <slot name="ir-text"> Información pasajero principal </slot>
      </span>
    </div>

    <div class="ir-inputs-wrapper general-text-opt">
      <div ref="gttName" class="cleft flex-wrapper input-left ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-account"></i>
        </div>
        <div class="input-two-rows ">
          <div class=" ir-info-name  font14 required-field">Nombre(s)</div>
          <input
            :disabled="!editable"
            type="text"
            :value="name"
            @input="$emit('inputName', $event.target.value)"
            class="ir-input  font18"
            placeholder="Su(s) nombre(s)"
          />
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>

      <div
        ref="gttApellido"
        class="flex-wrapper input-right ir-text-input"
        v-if="!onlyOne"
      >
        <div class="input-icon font18">
          <i class="mdi mdi-account"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14 required-field">Apellidos</div>
          <input
            type="text"
            :disabled="!editable"
            :value="lastname"
            @input="$emit('inputLastname', $event.target.value)"
            class="ir-input font18"
            placeholder="Sus apellidos"
          />
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>
    </div>

    <div class="ir-inputs-wrapper general-text-opt">
      <div ref="gttPasaporte" class="flex-wrapper input-left ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-card-account-details-outline"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14 required-field">Pasaporte</div>
          <input
            type="text"
            :disabled="!editable"
            :value="pasaporte"
            @input="$emit('inputPasaporte', $event.target.value)"
            class="ir-input font18"
            placeholder="# Pasaporte"
          />
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>
      <div v-if="!hasCar" ref="gttPhone" class="flex-wrapper input-right ir-text-input">
        <div class="input-icon font18">
          <i class="mdi mdi-card-account-details-outline"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14 required-field">Teléfono</div>
          <input
            type="text"
            :disabled="!editable"
            :value="phone"
            @input="$emit('inputPhone', $event.target.value)"
            class="ir-input font18"
            placeholder="# Teléfono"
          />
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>

      <div
        v-if="hasCar"
        ref="gttNacimiento"
        class="flex-wrapper input-right ir-text-input"
      >
        <div class="input-icon font18">
          <i class="mdi mdi-card-account-details-outline"></i>
        </div>
        <div class="input-two-rows">
          <div class="ir-info-name font14 required-field">
            Fecha de Nacimiento
          </div>
          <input
            type="date"
            :disabled="!editable"
            :value="nacimiento"
            @input="$emit('inputNacimiento', $event.target.value)"
            class="ir-input font18"
          />
          <span slot="error" class="gtt-errors"></span>
        </div>
      </div>
    </div>
    <p
      v-if="(age >= 21 && age <= 24) || (age >= 76 && age <= 80)"
      v-bind:class="[
        (age >= 21 && age <= 24) || (age >= 76 && age <= 80) ? 'show' : 'hide',
      ]"
      class="ir-info-name"
    >
      <IconAlert /> Aviso: Para personas de 21 a 24 años y de 76 a 80 años
      pagarán una tasa adicional consistente en el 50% del valor del relevo de
      responsabilidad.
    </p>
    <p
      v-else-if="age > 80 || age < 21"
      v-bind:class="[age > 80 || age < 21 ? 'show' : 'hide']"
      class="ir-info-name"
    >
      <IconAlert />
      Aviso: No es permitida la renta para personas de edades menores de 21 años
      o mayores de 80.
    </p>
  </div>
</template>

<script>
import IconAlert from "../icons/IconAlert.vue";

export default {
  props: {
    name: {
      type: String,
    },
    lastname: {
      type: String,
      default: "",
    },
    pasaporte: {
      type: String,
    },
    phone: {
      type: String,
    },
    hasCar: {
      type: Boolean,
    },
    nacimiento: {
      type: String,
    },
    onlyOne: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    age: function() {
      var temp = this.nacimiento.split("-");
      var date = new Date(temp[0], temp[1], temp[2]);
      var cur = new Date();
      var diff = cur - date;
      var currentAge = Math.floor(diff / 31557600000);
      return currentAge;
    },
  },
  components: { IconAlert },
};
</script>

<style scoped>
.show {
  opacity: 100;
}

.hide {
  opacity: 0;
}
p.ir-info-name {
  margin-top: 10px;
  color: red;
  font-size: 14px !important;
}
.info-row {
  width: 100%;
  margin-bottom: 20px;
}
.input-two-rows {
  width: 100%;
}
.ir-inputs-wrapper {
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
}
.input-icon {
  align-self: center;
  margin-right: 5px;
}
.input-left {
  margin-right: auto;
  margin-right: 30px;
}
.input-right {
  margin-left: auto;
}
.ir-text-input {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: white;
  width: 50%;
  border-radius: 10px;
  border: 1px solid #6d6d6d;
}
.ir-input {
  border: none;
  width: 100%;
}
.ir-input:focus {
  /* border-bottom: 1px solid #f5f5f5; */
  outline: none;
}
.ir-input:disabled {
  background-color: rgb(255, 255, 255);
  color: #b3b2b2;
}
@media (max-width: 1440px) {
  .ir-text-wrapper {
    font-size: 12px;
  }
  .ir-inputs-wrapper {
    margin-top: 10px;
  }
  .ir-info-name {
    font-size: 10px;
  }
  .ir-input {
    font-size: 12px;
  }
  .input-icon {
    font-size: 12px;
  }
}
</style>
