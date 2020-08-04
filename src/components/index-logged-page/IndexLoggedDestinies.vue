<template>
    <div id="index-logged-destinies">
        <div class="custom-margin">
            <Destinies :arrows="true" :dots="false">
            </Destinies>
        </div>
    </div>
</template>

<script>
import Destinies from '../shared/DestiniesCarousel'

export default {
    components: {
        Destinies
    }
}
</script>

<style scoped>
    #index-logged-destinies{
        width: 100%;
        margin-top: 60px;
    }
</style>