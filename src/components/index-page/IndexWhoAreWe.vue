<template>
    <div id="who-we-are" class="custom-margin">

      <h2>Descubre Nuevos Horizontes con Viajes Colibrí</h2>
      <p>
        Embárcate en una aventura única y vive una experiencia inolvidable con <strong>Viajes Colibrí</strong>. Nuestra misión es ayudarte a descubrir destinos fascinantes y vivir momentos memorables en cada rincón del mundo.
      </p>
      <h3>Tu Viaje, Nuestra Pasión</h3>
      <p>
        Selecciona el destino de tus sueños y deja que nosotros nos encarguemos del resto. Te ofrecemos las mejores excursiones, los hoteles más acogedores y una experiencia gastronómica que deleitará tus sentidos. Nuestro equipo se dedica a crear itinerarios personalizados que se adapten a tus intereses y necesidades, garantizando una experiencia de viaje sin igual.
      </p>
      <h3>Experiencias Valiosas en Cada Destino</h3>
      <p>
        En <strong>Viajes Colibrí</strong>, creemos que viajar es más que visitar lugares; es crear recuerdos que perduran para siempre. Por eso, te llevamos a:
      </p>
      <ul>
        <li><strong>Centros vacacionales de ensueño:</strong> Relájate y disfruta de instalaciones de primera clase en los destinos más exclusivos.</li>
        <li><strong>Ciudades emblemáticas:</strong> Explora metrópolis vibrantes y llenas de historia que dejarán una marca indeleble en tu memoria.</li>
        <li><strong>Parajes naturales impresionantes:</strong> Conéctate con la naturaleza en escenarios que te dejarán sin aliento.</li>
        <li><strong>Encuentros culturales:</strong> Sumérgete en las costumbres locales y conoce a personas que enriquecerán tu perspectiva del mundo.</li>
      </ul>
      <p>
        Nuestro compromiso es hacer que cada viaje sea una aventura única, llena de descubrimientos y experiencias enriquecedoras.
      </p>
      <h3>Tu Viaje, Nuestro Compromiso</h3>
      <p>
        Con <strong>Viajes Colibrí</strong>, cada detalle de tu viaje es importante. Nos esforzamos por ofrecerte un servicio excepcional, asegurándonos de que cada momento de tu aventura sea perfecto. Ya sea que busques una escapada relajante, una exploración cultural o una aventura emocionante, estamos aquí para hacer realidad tus sueños de viaje.
      </p>
      <p>
        Únete a nosotros y descubre el mundo de una manera que nunca imaginaste. Con <strong>Viajes Colibrí</strong>, tu próximo destino está a solo un clic de distancia.
      </p>
    </div>
</template>

<script>
import { eventBus } from '../../main'; 
export default {
    name: 'IndexWhoAreWe',
    methods: {
        handleScroll(){
            let height = window.innerHeight
            if(height*0.25 > this.$el.getBoundingClientRect().top
                && height*0 < this.$el.getBoundingClientRect().top)
            {
                eventBus.$emit('componentScrolled', this.$el.id)
            }
        }
    },
    created () {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>