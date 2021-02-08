<template>
    <div></div>
</template>

<script>
export default {
    created(){
        let temp = this.$route.params['searchResult']
        this.$router.push(
                    {
                        name: 'resultLodging',
                        key: 'changed',
                        params: {
                            searchResult: temp,
                        }
                    }
        )
    }
}
</script>

<style>

</style>