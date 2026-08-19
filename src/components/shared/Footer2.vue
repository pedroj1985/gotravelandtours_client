<template>
  <div id="footer2">
    <div class="footer2-container hn-roman custom-margin">
      <div class="left-part">
        <img src="/img/logo_colibri_white.png" alt="Colibri Viajes" />
        <div class="all-rights">
          © 2020 Colibri Viajes. Todos los derechos reservados.
          <router-link to="/booking-conditions">Términos de uso </router-link>|
          <router-link to="/privacy-policy"
            >Declaración de privacidad y Cookies </router-link
          >| <a href="#">Mapa del Sitio</a>
        </div>
        <div class="no-honoraries">
          Colibri Viajes no cobra honorarios por sus servicios a los usuarios
          del sitio
        </div>
        <div class="no-responsability">
          Colibri Viajes no se responsabiliza del contenido de sitios web
          externos.
        </div>
      </div>
      <div class="right-part">
        <a href="#" class="mdi mdi-twitter"></a>
        <a href="#" class="mdi mdi-pinterest"></a>
        <a href="#" class="mdi mdi-facebook"></a>
        <a href="#" class="mdi mdi-youtube"></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "Footer2" });
</script>

<style lang="scss" scoped>
#footer2 {
  background: var(--color-text-primary);
  color: var(--color-text-light);
  padding: var(--spacing-xl) 0;
}

.footer2-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left-part {
  flex: 1;
}

.left-part img {
  max-width: 150px;
  height: auto;
  margin-bottom: var(--spacing-md);
}

.right-part {
  display: flex;
  gap: var(--spacing-md);
  font-size: 24px;
}

.right-part a {
  color: var(--color-text-light);
  text-decoration: none;
}

@media (max-width: 768px) {
  .footer2-container {
    flex-direction: column;
    text-align: center;
  }
  .right-part {
    margin-top: var(--spacing-lg);
    justify-content: center;
  }
  .all-rights {
    font-size: var(--font-size-xs);
    line-height: 1.6;
  }
}
</style>
