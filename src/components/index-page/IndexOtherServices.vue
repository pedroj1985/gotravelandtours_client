<template>
 <div id="other-services" class="custom-margin">
    <div class="other-services-title section-title hn-bdcn">Otros servicios</div>
    <div id="other-services-carousel">
        <div :key="oService.id" class="other-services-container" v-for="oService in oServices">
            <img :src="'img/'+oService.image" alt="">
            <div class="other-service-content">
                <hr>
                <div class="other-service-text hn-roman">{{oService.name}}</div>
            </div>
        </div>
    </div>
 </div> 
</template>

<script>
export default {
    name: "IndexOtherServices",
    data(){
        return {
            oServices: [
            {
                name: 'Buceo',
                image: 'home_otrosservicios_buceo.jpg'
            },
            {
                name: 'Senderismo',
                image: 'home_otrosservicios_senderismo.jpg'
            },
            {
                name: 'Torcedor de tabaco',
                image: 'home_otrosservicios_tabaco.jpg'
            },
            {
                name: 'Senderismo',
                image: 'home_otrosservicios_senderismo.jpg'
            }
        ]
        }
    }
}
</script>

<style>

</style>