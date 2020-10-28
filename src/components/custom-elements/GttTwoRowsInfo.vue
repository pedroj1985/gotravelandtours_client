<template>
    <div>
        <div class="twoRowsDiv general-text-opt gtt-text-color hn-roman">
            <div class="tr-icon-wrapper">
                <slot name="tr-icon-slot">
                    <i class="mdi mdi-account"></i>
                </slot>
            </div>
            <div class="tr-info-wrapper">
                <div class="tr-info-name font12">
                    <slot name="tr-info-name">
                        Seleccione
                    </slot>
                </div>
                <div class="tr-info-value">
                    {{value}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            default: 'Aquí va su valor'
        }
    }
}
</script>
<style scoped>
    .twoRowsDiv{
        width: 100%;
        display: flex;
        padding: 15px;
        border: 2px solid #f5f5f5;
        border-radius: 10px;
    }
    .tr-icon-wrapper{
        align-self: center;
    }
    .tr-info-wrapper{
        margin-left: 5px;
    }
    .tr-info-value{
        font-size: 18px !important;
    }
</style>