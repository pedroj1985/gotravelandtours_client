import { authGetRoomPrice, authGetLodgingEatingPlanOne } from "./auth";
import { storageService } from "./storageService";

export function buildPriceSearchObj({
  planAlimenticioId,
  productoId,
  habId,
  ca,
  kids,
  currentHotelec,
  habitacionId,
  entrada,
  isSinContrato,
  salida
}) {
  return {
    Cliente: {
      ClienteId: storageService.getItem("cliente") || null
    },
    PlanAlimenticio: {
      PlanesAlimenticiosId: planAlimenticioId
    },
    Alojamiento: {
      ProductoId: productoId
    },
    TipoHabitacion: { TipoHabitacionId: habId },
    CantidadAdultos: ca,
    CantidadMenores: kids,
    CantidadInfantes: 0,
    CantidadHabitaciones: 1,
    HotetecIdeses: currentHotelec,
    Habitacion: { HabitacionId: habitacionId },
    Entrada: entrada,
    IsSinContrato: isSinContrato,
    Salida: salida
  };
}

export async function calculateRoomPrices(
  rooms,
  fullLodging,
  searchItem,
  currentHotelec,
  resultadoAcomodacion,
  lodgingItem
) {
  let listadoPrecios = [];

  await Promise.all(
    rooms.data.map(async j => {
      let puedeAcomodarse = true;
      if (resultadoAcomodacion && resultadoAcomodacion.length > 0) {
        puedeAcomodarse = true;
      }

      if (puedeAcomodarse) {
        await Promise.all(
          fullLodging.data.ListaPlanesAlimenticios.map(async lpa => {
            let r = resultadoAcomodacion;
            let listadoPorTipo = [];
            let temp = [];
            let hotelecData = null;
            let noPrice = false;

            await Promise.all(
              r.map(async k => {
                for (let index = 0; index < k.cantidad; index++) {
                  let ca = 1;
                  if (k.hab == "Doble") ca = 2;
                  else if (k.hab == "Triple") ca = 3;

                  let roomPriceSearchObj = buildPriceSearchObj({
                    planAlimenticioId: lpa.PlanesAlimenticiosId,
                    productoId: lodgingItem.Alojamiento.ProductoId,
                    habId: k.habId,
                    ca: ca,
                    kids: k.kids,
                    currentHotelec: currentHotelec,
                    habitacionId: j.HabitacionId,
                    entrada: searchItem.Entrada,
                    isSinContrato: lodgingItem.IsSinContrato,
                    salida: searchItem.Salida
                  });

                  try {
                    let precioA = await authGetRoomPrice(roomPriceSearchObj);

                    if (
                      precioA.data.length != 0 &&
                      precioA.data[0].PrecioOrden != 0
                    ) {
                      hotelecData = {
                        HotetecInfoHabId: precioA.data[0].HotetecInfoHabId,
                        HotetecInfoHotelId: precioA.data[0].HotetecInfoHotelId,
                        HotetecIdeses: precioA.data[0].HotetecIdeses,
                        HotetecIsAvailable: precioA.data[0].HotetecIsAvailable
                      };
                      if (hotelecData.HotetecIsAvailable) {
                        temp.push({
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
                        });
                      }
                    } else {
                      noPrice = true;
                    }
                  } catch (e) {
                    noPrice = true;
                  }
                }
              })
            );

            if (!noPrice) {
              listadoPorTipo = temp;
            }

            if (listadoPorTipo.length != 0) {
              let totalPrice = 0;
              let display = "";
              listadoPorTipo.forEach(element => {
                totalPrice += element.price.value;
                display += `${element.cantidad}x${element.tipoHabitacionNombre} | `;
              });

              let planA = await authGetLodgingEatingPlanOne(
                lpa.PlanesAlimenticiosId
              );
              listadoPrecios.push({
                name: j.Nombre,
                habitacion: j,
                planAlimenticioCodigo: planA.data.Codigo,
                planAlimenticioNombre: planA.data.Nombre,
                planAlimenticio: lpa.PlanesAlimenticiosId,
                hotelecData: hotelecData,
                IsSinContrato: lodgingItem.IsSinContrato,
                combinacion: {
                  total: totalPrice,
                  display: display,
                  listado: listadoPorTipo
                }
              });
            }
          })
        );
      }
    })
  );

  return listadoPrecios;
}
