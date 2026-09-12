import { authGetRoomPrice, authGetLodgingEatingPlanOne } from "./auth";
import { storageService } from "./storageService";
import type { PriceSearchObj } from "../types/api";

interface BuildPriceSearchInput {
  planAlimenticioId: number | string;
  productoId: number | string;
  habId: number | string;
  ca: number;
  kids: number;
  currentHotelec: string | null;
  habitacionId: number | string;
  entrada: string;
  isSinContrato: boolean;
  salida: string;
}

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
}: BuildPriceSearchInput): PriceSearchObj {
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
    HotetecIdeses: currentHotelec ?? "",
    Habitacion: { HabitacionId: habitacionId },
    Entrada: entrada,
    IsSinContrato: isSinContrato,
    Salida: salida
  };
}

export async function calculateRoomPrices(
  rooms: { data: Array<Record<string, unknown>> },
  fullLodging: { data: { ListaPlanesAlimenticios: Array<Record<string, unknown>>; Nombre: string; NumeroEstrellas: number; Direccion: string } },
  searchItem: Record<string, unknown>,
  currentHotelec: string | null,
  resultadoAcomodacion: Array<{ cantidad: number; hab: string; habId: number | string; kids: number }>,
  lodgingItem: Record<string, unknown>
) {
  const listadoPrecios: Array<Record<string, unknown>> = [];

  await Promise.all(
    rooms.data.map(async j => {
      let puedeAcomodarse = true;
      if (resultadoAcomodacion && resultadoAcomodacion.length > 0) {
        puedeAcomodarse = true;
      }

      if (puedeAcomodarse) {
        await Promise.all(
          fullLodging.data.ListaPlanesAlimenticios.map(async lpa => {
            const r = resultadoAcomodacion;
            let listadoPorTipo: Array<Record<string, unknown>> = [];
            const temp: Array<Record<string, unknown>> = [];
            let hotelecData: Record<string, unknown> | null = null;
            let noPrice = false;

            await Promise.all(
              r.map(async k => {
                for (let index = 0; index < k.cantidad; index++) {
                  let ca = 1;
                  if (k.hab == "Doble") ca = 2;
                  else if (k.hab == "Triple") ca = 3;

                  const roomPriceSearchObj = buildPriceSearchObj({
                    planAlimenticioId: lpa.PlanesAlimenticiosId as number | string,
                    productoId: (lodgingItem.Alojamiento as Record<string, unknown>).ProductoId as number | string,
                    habId: k.habId,
                    ca: ca,
                    kids: k.kids,
                    currentHotelec: currentHotelec,
                    habitacionId: j.HabitacionId as number | string,
                    entrada: searchItem.Entrada as string,
                    isSinContrato: lodgingItem.IsSinContrato as boolean,
                    salida: searchItem.Salida as string
                  });

                  try {
                    const precioA = await authGetRoomPrice(
                      roomPriceSearchObj as unknown as Record<string, unknown>
                    );

                    if (
                      (precioA.data as Array<Record<string, unknown>>).length != 0 &&
                      (precioA.data as Array<Record<string, unknown>>)[0].PrecioOrden != 0
                    ) {
                      hotelecData = {
                        HotetecInfoHabId: (precioA.data as Array<Record<string, unknown>>)[0].HotetecInfoHabId,
                        HotetecInfoHotelId: (precioA.data as Array<Record<string, unknown>>)[0].HotetecInfoHotelId,
                        HotetecIdeses: (precioA.data as Array<Record<string, unknown>>)[0].HotetecIdeses,
                        HotetecIsAvailable: (precioA.data as Array<Record<string, unknown>>)[0].HotetecIsAvailable
                      };
                      if ((hotelecData.HotetecIsAvailable as boolean)) {
                        temp.push({
                          cantidad: 1,
                          precioObjOne: (precioA.data as Array<Record<string, unknown>>)[0] || -1,
                          price: {
                            value: (precioA.data as Array<Record<string, unknown>>)[0].PrecioOrden,
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
                  } catch (_e) {
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
                totalPrice += (element.price as { value: number }).value;
                display += `${element.cantidad}x${element.tipoHabitacionNombre} | `;
              });

              try {
                const planA = await authGetLodgingEatingPlanOne(
                  lpa.PlanesAlimenticiosId as number | string
                );
                listadoPrecios.push({
                  name: j.Nombre,
                  habitacion: j,
                  planAlimenticioCodigo: (planA.data as Record<string, unknown>).Codigo,
                  planAlimenticioNombre: (planA.data as Record<string, unknown>).Nombre,
                  planAlimenticio: lpa.PlanesAlimenticiosId,
                  hotelecData: hotelecData,
                  IsSinContrato: lodgingItem.IsSinContrato,
                  combinacion: {
                    total: totalPrice,
                    display: display,
                    listado: listadoPorTipo
                  }
                });
              } catch (_e) {
                if (import.meta.env.DEV) {
                  console.error(
                    "Error obteniendo plan alimenticio:",
                    lpa.PlanesAlimenticiosId
                  );
                }
              }
            }
          })
        );
      }
    })
  );

  return listadoPrecios;
}
