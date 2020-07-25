<template>
    <Slick class="custom-margin hotel-carousel"
        ref="slick"
        :slidesToShow="4"
        :arrows="true"
        > 
        <div class="index-logged-hotel-wrapper" v-for="i in 5" :key="i">
            <div class="index-logged-hotel">
                <img :src="'img/home_destino_cienfuegos.jpg'" alt="">
                <div class="index-logged-hotel-content-container">
                </div>
            </div>
        </div>
    </Slick>
</template>

<script>
import Slick from 'vue-slick-carousel'

export default {
    components: {
        Slick
    },
}
</script>

<style scoped>
    .hotel-carousel{
        margin-top: 60px;
    }
    .index-logged-hotel{
        width: 18.75vw;
        height: 475px;
        border-radius: 10px;
    }
    .index-logged-hotel img{
        border-radius: 10px;
        width: 100%;
        height: 100%;
    }

</style>
<style>
    .hotel-carousel button.slick-arrow{
        z-index: 1;
        width: 45px;
        height: 45px;
    }
    .hotel-carousel button.slick-arrow::before{
        font-size: 45px;
    }
    .hotel-carousel button.slick-prev{
        left: 50px;
    }
    .hotel-carousel button.slick-next{
        right: 50px;
    }
</style>