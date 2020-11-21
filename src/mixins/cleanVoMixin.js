export const cleanVoMixin = {
    methods: {
        cleanVO(order, pickUpPlace = this.selectedPickUpPlace, DeliveryPlace = this.selectedDeliveryPlace) {
            order.DistribuidorId = order.Distribuidor.DistribuidorId;
            order.Distribuidor = {
                DistribuidorId: order.Distribuidor.DistribuidorId
            };
            order.Vehiculo = {
                ProductoId: order.Vehiculo.ProductoId
            };
            order.Sobreprecio = {
                SobreprecioId: order.Sobreprecio.SobreprecioId
            };
            if (pickUpPlace) {
                order.LugarRecogida = {
                nombre: pickUpPlace.nombre,
                PuntoInteresId: pickUpPlace.puntointeresid
                };
            }
            if (DeliveryPlace) {
                order.LugarEntrega = {
                nombre: DeliveryPlace.nombre,
                PuntoInteresId: DeliveryPlace.puntointeresid
                };
            }
            let arrLPRA = new Array();
            order.ListaPreciosRentaAutos.forEach(item => {
                item.PrecioRentaAutos = {
                PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
                };
                arrLPRA.push({
                PrecioRentaAutos: {
                    PrecioRentaAutosId: item.PrecioRentaAutos.PrecioRentaAutosId
                }
                });
            });
            order.ListaPreciosRentaAutos = arrLPRA;
        },
    }
}