import {helpers} from './helpers' 

export function gttIsValid(Validator){
  return Validator.map(element => {
        let passesArray = element.rules.map(item => {
            return passes(item, element.value)
        })
        let p = passesArray.filter(item => {
            return item.passes == false
        })

        if(p.length > 0){
            let pRequired = p.find(item => {
                return item.ruleName == 'required'
            })

            if(pRequired){
                element['isValid'] = false
                element['messages'] = [translateMessage('required', element.lang)]
                return element
            }

            element['isValid'] = false
            let p_messages = p.map(item => {
                return translateMessage(item.ruleName, element.lang)
            })
            element['messages'] = p_messages
            return element
        }

        element['isValid'] = true
        return element
    });
}

export function getValid(val){
    let r = val.find(i => {
        return i.isValid == false
    })

    return !r>0
}

function passes(ruleName, value){

    let result = {}

    switch (ruleName) {
        case 'required':
            result = {ruleName: ruleName, passes: value != null}
            break;
    }

    return result
}

function translateMessage(ruleName, lang){

    let result = ''
    switch (ruleName) {
        case 'required':
            result = helpers.traducir('ValidationRequired', lang)
            break;
    }

    return result
}

export function renderValid(Validator, vueInstance){
    Validator.forEach(element => {
        let ref = vueInstance.$refs[element.name]
        element.messages.forEach(item => {
            let div = ref.querySelector('.gtt-errors')
            div.innerHTML += item+'<br>'
        })
    });
}

// export function constructValidator(array){

// }