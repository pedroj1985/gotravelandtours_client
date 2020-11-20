export const cleanVoMixin = {
    methods: {
        cleanVO(order) {
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
            if (this.selectedPickUpPlace) {
                order.LugarRecogida = {
                nombre: this.selectedPickUpPlace.nombre,
                PuntoInteresId: this.selectedPickUpPlace.puntointeresid
                };
            }
            if (this.selectedDeliveryPlace) {
                order.LugarEntrega = {
                nombre: this.selectedDeliveryPlace.nombre,
                PuntoInteresId: this.selectedDeliveryPlace.puntointeresid
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