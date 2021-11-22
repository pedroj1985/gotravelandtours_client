import { authSearchLodging, authSearchRoomsByLodging, authGetLodging, authGetRoomPrice, authGetImage, authGetLodgingEatingPlanOne } from "../utils/auth";
import _ from "lodash"

export const lodgingUtilsMixin = {
    methods: {
        roomCombination(adults, kids = 0){

            let result = null;

            if(kids == 0)
            {
                result['kids'] = 0
                if(adults / 2 >= 1){
                    if(adults % 2 == 0){
                        result = {
                            dobles: Math.floor(adults / 2),
                            triples: 0,
                            sencillas: 0
                        }
                    }
                    else if(adults % 2 == 1){
                        result = {
                            dobles: Math.floor(adults / 2) - 1,
                            triples: 1,
                            sencillas: 0
                        }
                    }
                    else if(adults % 2 == 3){
                        result = {
                            dobles: Math.floor(adults / 2),
                            triples: 1,
                            sencillas: 0
                        }
                    }
                }

                result = {
                    dobles: 0,
                    triples: 0,
                    sencillas: 1
                }
            }
            else{
                result['kids'] = kids
                if(kids <= this.getTotalRooms(result)){
                    return result
                }
                else{

                    let doblesRest = Math.abs(adults - (kids * 2))
                    let tDobles = kids - doblesRest
                    let tSencillas = doblesRest

                    result = {
                        dobles: tDobles,
                        triples: 0,
                        sencillas: tSencillas
                    }

                }
            }

            return result
        },
        getTotalRooms(obj){
            let totalDobles = obj.dobles
            let totalTriples = obj.triples
            let totalSencillas = obj.sencillas

            return totalDobles +
                   totalTriples +
                   totalSencillas
        },
        recursiveBuildRoom(list, kids){

            let pos = 0
            let stop = false
            let tempKids = kids

            while(pos < list.length && !stop){
                let hab = list[pos]
                if(tempKids != 0)
                {
                    hab.kids += 1

                    tempKids--
                    pos++
                }
                else{
                    stop = true
                }

            }

            if(tempKids>0){
                this.recursiveBuildRoom(list, tempKids)
            }

            return true;

        },
        buildRoomComboV2(roomLayout){
            let result = []
            let d = this.$helpers.habitacionPorCantidadPersonas(2, this.todosTipo)
            for(let i = 0; i < roomLayout.dobles; i++)
            {
                result.push({
                    hab: d.Nombre,
                    code: d.Nombre+'-'+0,
                    habId: d.TipoHabitacionId,
                    kids: 0,
                    adults: 2,
                })
            }
            let s = this.$helpers.habitacionPorCantidadPersonas(1, this.todosTipo)
            for(let i = 0; i < roomLayout.sencillas; i++)
            {
                result.push({
                    hab: s.Nombre,
                    code: s.Nombre+'-'+0,
                    habId: s.TipoHabitacionId,
                    adults: 1,
                    kids: 0
                })
            }

            if(roomLayout.kids > 0){
                let k = roomLayout.kids
                this.recursiveBuildRoom(result, k)
            }

            console.log(result)
            console.log('version2')
        },
        buildRoomCombo(roomLayout){
            let result = []
            let d = this.$helpers.habitacionPorCantidadPersonas(2, this.todosTipo)
            for(let i = 0; i < roomLayout.dobles; i++)
            {
                result.push({
                    hab: d.Nombre,
                    code: d.Nombre+'-'+0,
                    habId: d.TipoHabitacionId,
                    kids: 0,
                    adults: 2,
                })
            }
            let s = this.$helpers.habitacionPorCantidadPersonas(1, this.todosTipo)
            for(let i = 0; i < roomLayout.sencillas; i++)
            {
                result.push({
                    hab: s.Nombre,
                    code: s.Nombre+'-'+0,
                    habId: s.TipoHabitacionId,
                    adults: 1,
                    kids: 0
                })
            }
            let t = this.$helpers.habitacionPorCantidadPersonas(3, this.todosTipo)
            for(let i = 0; i < roomLayout.triples; i++)
            {
                result.push({
                    hab: t.Nombre,
                    code: t.Nombre+'-'+0,
                    habId: t.TipoHabitacionId,
                    adults: 3,
                    kids: 0
                })
            }
            if(roomLayout.kids > 0)
            {
                if(!roomLayout.kids2Room){
                    for(let i = 0; i < roomLayout.kids; i++){
                        result[i]['kids'] = 1
                        result[i]['code'] = result[i].hab+'-'+1
                    }
                }
                else{
                    let pos = 0
                    for(pos; pos < roomLayout.totalkids2RoomFill; pos++){
                        result[pos]['kids'] = 2
                        result[pos]['code'] = result[pos].hab+'-'+2
                    }
                    let fill = result.length - roomLayout.totalkids2RoomFill
                    for(pos; pos <= fill; pos++){
                        result[pos]['kids'] = 1
                        result[pos]['code'] = result[pos].hab+'-'+1
                    }
                }
            }

            result = _.groupBy(result, function(i){
                return i.code
            })
            let temp = []
            Object.entries(result).forEach(([k,v]) => {
                temp.push(
                    {
                        hab: v[0].hab,
                        code: k,
                        habId: v[0].habId,
                        kids: v[0].kids,
                        adults: v[0].adults,
                        cantidad: v.length
                    }
                )
            })
            result = temp
            console.log(result)
            console.log('result')
            return result
        },
        buildRoomIdCombo(roomLayout){
            let result = []; 
            if(roomLayout.sencillas > 0){
                let i = this.$helpers.habitacionPorCantidadPersonas(1, this.todosTipo)
                if(i){
                    result.push({
                        hab: i.Nombre,
                        habId: i.TipoHabitacionId,
                        cantidad: roomLayout.sencillas
                    })
                }
            }
            if(roomLayout.dobles > 0){
                let i = this.$helpers.habitacionPorCantidadPersonas(2, this.todosTipo)
                if(i){
                    result.push({
                        hab: i.Nombre,
                        habId: i.TipoHabitacionId,
                        cantidad: roomLayout.dobles
                    })
                }
            }
            if(roomLayout.triples > 0){
                let i = this.$helpers.habitacionPorCantidadPersonas(3, this.todosTipo)
                if(i){
                    result.push({
                        hab: i.Nombre,
                        habId: i.TipoHabitacionId,
                        cantidad: roomLayout.triples
                    })
                }
            }

            return result
        },
        existenCombinacionesEnHabitacion(acomodacion, combinaciones){

            let existe = true
            let pos = 0
            let tam = acomodacion.length
            while(existe && pos < tam){

                let acomodacionExiste = this.existeAcomodacion(acomodacion[pos], combinaciones)
                if(!acomodacionExiste){
                    existe = false
                }

                pos++
            }

            return existe
        },
        existeAcomodacion(item, list){
            
            let ca = 1
            if(item.hab == 'Doble')
                ca = 2
            if(item.hab == 'Triple')
                ca = 3

            let porHabitacion = list.filter( i => {
                return i.CantAdult == ca
            })

            if(porHabitacion.length > 0){
                let porNinos = porHabitacion.filter( i => {
                    return i.CantNino == item.kids
                })

                if(porNinos.length > 0){
                    return true
                }
            }

            return false

        },
        async searchResult(searchItem, combination, combinationV2 = null){
            let resultList = []
            let resultadoAcomodacion = this.buildRoomCombo(combination)
            // eslint-disable-next-line no-unused-vars
            let rAV2 = this.buildRoomComboV2(combinationV2)
            let { data } = await authSearchLodging(searchItem);
            await Promise.all(
            data.map( async i => {
                let rooms = await authSearchRoomsByLodging(i.Alojamiento.ProductoId);
                let img = await authGetImage(i.Alojamiento.ProductoId)
                let fullLodging = await authGetLodging(i.Alojamiento.ProductoId);
                // let tipo = this.habitacionPorCantidadPersonas(this.selectedRoomLayout.adults.value)
                // let habitaciones = []
                let listadoPrecios = []
                await Promise.all(rooms.data.map( async j => {
                    let todasCombinaciones = j.ListaCombinacionesDisponibles
                    let puedeAcomodarse = this.existenCombinacionesEnHabitacion(resultadoAcomodacion, todasCombinaciones)
                    if(puedeAcomodarse){
                        await Promise.all(
                            fullLodging.data.ListaPlanesAlimenticios.map( async lpa => {
                                    let r = resultadoAcomodacion
                                    let listadoPorTipo = []
                                    let temp = []
                                    let noPrice = false
                                    await Promise.all(
                                        r.map ( async k => {
                                            for(let index = 0; index<k.cantidad; index++){
                                                let ca = 1
                                                if(k.hab == 'Doble')
                                                    ca = 2
                                                else if(k.hab == 'Triple')
                                                    ca = 3
                                                let roomPriceSearchObj = {
                                                    Cliente: {ClienteId: localStorage.getItem("cliente")},
                                                    PlanAlimenticio: {PlanesAlimenticiosId: lpa.PlanesAlimenticiosId},
                                                    Alojamiento: {ProductoId: i.Alojamiento.ProductoId},
                                                    TipoHabitacion: {TipoHabitacionId: k.habId},
                                                    CantidadAdultos: ca,
                                                    CantidadMenores: k.kids,
                                                    CantidadInfantes: 0,
                                                    CantidadHabitaciones: 1,
                                                    Habitacion: {HabitacionId: j.HabitacionId},
                                                    Entrada: searchItem.Entrada,
                                                    Salida: searchItem.Salida
                                                }
                                                try{
                                                    let precioA = await authGetRoomPrice(roomPriceSearchObj)
                                                    if(precioA.data.length != 0 
                                                                // && precioA.data[0].OrdenAlojamientoId != -1 
                                                                && precioA.data[0].PrecioOrden != 0
                                                                ){
                                                        temp.push(
                                                            {
                                                                cantidad: 1,
                                                                precioObjOne: precioA.data[0] || -1,
                                                                price: {
                                                                    value: precioA.data[0].PrecioOrden,
                                                                    currency: "USD"
                                                                },
                                                                tipoHabitacion: k.habId,
                                                                tipoHabitacionNombre: k.hab,
                                                                cantidadMenoresPorHabitacion: k.kids,
                                                                planAlimenticio: lpa.PlanesAlimenticiosId
                                                            }
                                                        )
                                                    }
                                                    else{
                                                        noPrice = true
                                                    }
                                                }
                                                catch(e){
                                                    noPrice = true
                                                }
                                            }
                                        })
                                    )
                                    if(!noPrice){
                                        listadoPorTipo = temp
                                    }
                                    if(listadoPorTipo.length != 0)
                                    {
                                        let totalPrice = 0
                                        let display = ''
                                        listadoPorTipo.forEach(element => {
                                            totalPrice = totalPrice + element.price.value
                                            display = display+`${element.cantidad}x${element.tipoHabitacionNombre} | `
                                        });
                                        let planA = await authGetLodgingEatingPlanOne(lpa.PlanesAlimenticiosId)
                                        listadoPrecios.push({
                                            name: j.Nombre,
                                            habitacion: j,
                                            planAlimenticioCodigo: planA.data.Codigo,
                                            planAlimenticioNombre: planA.data.Nombre,
                                            planAlimenticio: lpa.PlanesAlimenticiosId,
                                            combinacion: {
                                                total: totalPrice,
                                                display: display,
                                                listado: listadoPorTipo
                                            }
                                        })
                                    }
                                })
                            )
                    }
                    })
                )
                    let ro = {
                        tipo: 'lodging',
                        entrada: searchItem.Entrada,
                        salida: searchItem.Salida,
                        name: fullLodging.data.Nombre,
                        stars: fullLodging.data.NumeroEstrellas,
                        location: fullLodging.data.Direccion,
                        images: [img.data.ImageContent],
                        acomodation: resultadoAcomodacion,
                        habitaciones: _.orderBy(listadoPrecios, function(e){
                            return e.combinacion.total
                        }, 'asc'),
                        planesAlimenticios: fullLodging.data.ListaPlanesAlimenticios,
                        lodging: i.Alojamiento
                    }
                    resultList.push(ro)
                // }
            })
            )

            resultList = resultList.filter( i => {
                return i.habitaciones.length > 0
            })

            return _.orderBy(resultList, function(e){
                return e.habitaciones[0].combinacion.total
            }, 'asc')
        },
        visitantesToAcomodation(visitantes){
            let result = []
            visitantes.forEach(i => {
                let a = i.layout.find(j => {
                    return j.code == 'adults'
                })
                let k = i.layout.find(j => {
                    return j.code == 'kids'
                })
                let tipoHab = ''
                switch (a.value) {
                    case 1:
                        tipoHab = 'Sencilla'
                        break;
                    case 2:
                        tipoHab = 'Doble'
                        break;
                    default:
                        tipoHab = 'Triple'
                        break;
                }
                let obj = {
                    adults: a.value,
                    kids: k.value,
                    habId: a.value,
                    hab: tipoHab,
                    code: `${tipoHab}-${k.value}`
                }
                result.push(obj)
            })

            result = _.groupBy(result, function(i){
                return i.code
            })

            let temp = []
            Object.entries(result).forEach(([k,v]) => {
                temp.push(
                    {
                        hab: v[0].hab,
                        code: k,
                        habId: v[0].habId,
                        kids: v[0].kids,
                        adults: v[0].adults,
                        cantidad: v.length
                    }
                )
            })
            result = temp
            return result

        }
    }
}