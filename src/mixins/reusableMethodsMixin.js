export const reusableMethodsMixin = {
    methods: {
        constructSpacedVal(f, s, separator=' '){
            return `${f}${separator}${s}`
        },
        calculatePrice(value){
            this.priceTotal = value.reduce(
                (total, item) => {
                    return total+item.precio
                }, 0
            )
        },
        styledPrice(number){
            let intPart = Math.floor(number)
            let decimalPart = (number - intPart).toFixed(2) * 100

            if(decimalPart == 0)
                decimalPart = '00'

            return {intPart: intPart,
                    decimalPart: decimalPart}
        },
        overflowText(text, l = 30){
            if(text.length > l){
                return `${text.substring(0, l)}...`
            }
            return text
        },
    }
}