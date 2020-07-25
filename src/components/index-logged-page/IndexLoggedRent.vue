<template>
    <div id="index-logged-rent-wrapper">
        <IndexLoggedRentSearch></IndexLoggedRentSearch>
    </div>
</template>

<script>
import IndexLoggedRentSearch from '../index-logged-page/IndexLoggedRentSearch'

export default {
    components: {
        IndexLoggedRentSearch
    }
}
</script>

<style scoped>
    #index-logged-rent-wrapper{
        width: 100%;
        margin-top: 120px;
    }
</style>