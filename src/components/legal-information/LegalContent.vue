<template>
  <div
    class="hn-roman custom-margin"
  >
    <header>
      <h1>Información Legal</h1>
      <p>De acuerdo con la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), proporcionamos a continuación los datos de identificación de nuestra empresa.</p>
    </header>

    <section>
      <h3>Responsable</h3>
      <p>Denominación Social: CARVEL MERCANCÍAS Y SERVICIOS TURÍSTICOS S.L.</p>
      <p>Nombre Comercial: VIAJES COLIBRÍ</p>
      <p>Domicilio Social: Calle Campos Elíseos 49, Sevilla, España, 41020</p>
      <p>Responsable de Seguridad: Yunier XXXX XXXX (<a href="mailto:xxxxx@viajescolibri.es">xxxxx@viajescolibri.es</a>)</p>
      <p>CIF / NIF: B70917695</p>
    </section>

    <section>
      <h3>Contacto</h3>
      <p>Teléfono: <a href="tel:614105566">614 10 55 66</a></p>
      <p>Email: <a href="mailto:ventas@viajescolibri.es">ventas@viajescolibri.es</a></p>
      <p>Formulario de contacto online: <a href="https://viajescolibri.es/contacto.htm">https://viajescolibri.es/contacto.htm</a></p>
      <p>Redes sociales: <a href="https://www.facebook.com">Facebook</a>, <a href="https://twitter.com/">Twitter</a>, <a href="https://plus.google.com/">Google+</a>, <a href="https://www.linkedin.com/">LinkedIn</a>, <a href="https://www.youtube.com">YouTube</a>, Instagram</p>
    </section>

    <section>
      <h3>Registros</h3>
      <p>Registro Mercantil de Sevilla: Inscripción realizada el 05 de abril de 2024, Hoja SE-144099, IRUS: 1000385430975, Tomo 7563, Folio 163, Inscripción 1.</p>
      <p>Registro de Tratamientos conforme al RGPD: Clientes/Proveedores, Listas de Correo, Empleados, Selección de Personal, Vídeovigilancia, Agenda y Usuarios Web.</p>
    </section>

    <section>
      <h3>Objeto</h3>
      <p>Este documento tiene por objeto establecer las condiciones generales de uso del sitio web propiedad de CARVEL MERCANCIAS Y SERVICIOS TURISTICOS S.L.</p>
    </section>

    <section>
      <h3>Protección de Datos</h3>
      <p>Nos adherimos a las normativas españolas de protección de datos, garantizando un uso adecuado y seguro de los datos personales de nuestros usuarios.</p>
      <p>Más detalles en nuestra <a href="https://viajescolibri.es/politica-de-privacidad">Política de Privacidad</a>.</p>
    </section>

    <section>
      <h3>Propiedad Intelectual</h3>
      <p>El contenido de este sitio web es propiedad de CARVEL MERCANCIAS Y SERVICIOS TURISTICOS S.L. y está protegido por las leyes de propiedad intelectual e industrial.</p>
    </section>
  </div>

</template>

<script>
import { eventBus } from "../../main";

export default {
  name: "cookies-content",
  methods: {
    handleScroll() {
      let height = window.innerHeight;
      if (
        height * 0.25 > this.$el.getBoundingClientRect().top &&
        height * 0 < this.$el.getBoundingClientRect().top
      ) {
        eventBus.$emit("componentScrolled", this.$el.id);
      }
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
