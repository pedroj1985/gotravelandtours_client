<template>
    <div></div>
</template>

<script>
export default {
    created(){
        let f = this.$route.params['filters']
        let temp = this.$route.params['searchResult']
        
        this.$router.push(
                    {
                        name: 'resultRent',
                        key: 'changed',
                        params: {
                            searchResult: temp,
                            filters: f                        }
                    }
        )
    }
}
</script>

<style>

</style>