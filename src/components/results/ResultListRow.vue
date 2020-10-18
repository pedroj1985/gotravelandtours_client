<template>
        <div class="item-children">
            <div class="children-wrapper">
                <div class="item-children-header">
                    <div class="item-children-info-btn">
                        <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'info'}" @click="selectInfo('info')"><i class="mdi mdi-clipboard-text"></i></button>
                    </div>
                    <div class="item-children-name hn-roman">
                        {{child.name}}
                    </div>
                    <slot name="item-children" v-bind:child="child">
                            <div class="item-children-section hn-roman">
                                <div class="item-children-section-item">AD</div>
                                <div class="item-children-section-item item-children-section-icon"><i class="mdi mdi-phone-check"></i></div>
                                <div class="item-children-section-item item-children-section-icon item-children-info-btn">
                                    <button type="button" class="btn-children-info" :class="{'selected': selectedInfo == 'roomLayout'}" @click="selectInfo('roomLayout')">
                                        <i class="mdi mdi-floor-plan"></i>
                                    </button>
                                </div>
                            </div>
                    </slot>
                    <div class="item-children-right-part">
                        <div class="item-children-price hn-roman">
                            {{ styledPrice(child.price.value).intPart}}.<sup>{{ styledPrice(child.price.value).decimalPart}}</sup> {{child.price.currency}}
                        </div>
                        <div class="item-children-reserve form-actions">
                            <button type="submit" class="antonio-regular inverse btn-cart"><i class="mdi mdi-cart"></i></button>
                            <button type="submit" class="antonio-regular">Reservar</button>
                        </div>
                    </div>
                </div>
                <div class="item-children-content hn-roman">
                    <div class="item-children-content-info" v-if="selectedInfo == 'info'">
                        <pre class="hn-roman">{{child.info}}</pre>
                    </div>
                    <slot name="item-room-layout" v-bind:roomLayout="child.roomLayout">
                        <div class="item-children-content-info" v-if="selectedInfo == 'roomLayout'">
                            <pre class="hn-roman">{{child.roomLayout}}</pre>
                        </div>
                    </slot>
                </div>

            </div>
        </div>
</template>

<script>
export default {
    data(){
        return {
            selectedInfo: '',
        }
    },
    props: {
        child: Object
    },
    methods: {
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
        selectInfo(section)
        {
            if(this.selectedInfo == section)
            {
                this.selectedInfo = ''
            }
            else{
                this.selectedInfo = section
            }
        }
    }
}
</script>

<style scoped>
    .btn-cart{
        margin-right: 5px;
        width: 50px;
    }
    .children-wrapper{
        border-bottom: 1px solid #c4c4c4;
    }
    .item-children-header{
        padding-bottom: 5px;
        display: flex;
    }
    .item-children-content{
        padding-right: 230px;
        padding-left: 60px;
    }
    .item-children-content pre{
        font-size: 16px;
        color: #6d6d6d;
        white-space: pre-wrap;
    }
    .item-children{
        /* display: flex; */
    }
    .item-children-name{
        margin-right: auto;
        color: #6d6d6d;
        font-size: 16px;
        width: 15%;
    }
    .item-children-section{
        color: #6d6d6d;
        font-size: 24px;
        display: flex;
    }

    .item-children-section-item{
        padding-right: 25px;
        align-self: center;
        font-size: 30px !important;
    }
    .item-children-section-icon{
        font-size: 30px !important;
        color: #212f3d;
        align-self: center;
    }
    .item-children-right-part{
        margin-left: auto;
        display: flex;
    }
    .item-children-price{
        padding-right: 60px;
        color: #6d6d6d;
        font-size: 24px;
    }
    .item-children-info-btn{
        font-size: 24px;
        color: #212f3d;
        padding-right: 20px;
    }
    .item-children-info-btn button{
        border: none;
        background-color: transparent;
    }
    .item-children-info-btn button:hover{
        cursor: pointer;
    }
    .item-children-info-btn button:focus{
        border: none;
        outline: none;
    }
    .item-children-name, .item-children-section, .item-children-price, .item-children-info-btn{
        align-self: center;
    }
    .selected{
        color: #c4c4c4;
    }
</style>