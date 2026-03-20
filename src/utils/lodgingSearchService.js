import {
  authSearchLodging,
  authSearchRoomsByLodging,
  authGetLodging,
  authGetRoomPrice,
  authGetImage,
  authGetLodgingEatingPlanOne,
  hotetecOpenSession
} from "./auth";
import { hotelecSessionService } from "./hotelecSessionService";
import { storageService } from "./storageService";
import { openDB } from "idb";
import _ from "lodash";
import {
  buildRoomCombo,
  buildRoomComboV2
} from "./roomBuilder";

const dbPromise = openDB("searchResultDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("searchResults")) {
      db.createObjectStore("searchResults", { keyPath: "id", autoIncrement: true });
    }
  }
});

export async function searchResult(searchItem, combination, combinationV2, todosTipo, helpers) {
  let currentHotelec = await hotelecSessionService.getOrCreateSession();
  let resultList = [];

  let resultadoAcomodacion = buildRoomCombo(combination, i => helpers.habitacionPorCantidadPersonas(i, todosTipo));
  let rAV2 = buildRoomComboV2(combinationV2, i => helpers.habitacionPorCantidadPersonas(i, todosTipo));

  const { data } = await authSearchLodging(searchItem);

  await Promise.all(
    data.map(async i => {
      if (i.Alojamiento.ReferenciaHotetecId !== null) {
        const rooms = await authSearchRoomsByLodging(i.Alojamiento.ProductoId);
        const img = await authGetImage(i.Alojamiento.ProductoId);
        const fullLodging = await authGetLodging(i.Alojamiento.ProductoId);

        let listadoPrecios = [];

        await Promise.all(
          rooms.data.map(async j => {
            let todasCombinaciones = j.ListaCombinacionesDisponibles;
            let puedeAcomodarse = true;
            if (resultadoAcomodacion && resultadoAcomodacion.length > 0) {
              // cuando se usa la validación externa, no forzamos aquí
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

                        let roomPriceSearchObj = {
                          Cliente: {
                            ClienteId: storageService.getItem("cliente") || null
                          },
                          PlanAlimenticio: {
                            PlanesAlimenticiosId: lpa.PlanesAlimenticiosId
                          },
                          Alojamiento: {
                            ProductoId: i.Alojamiento.ProductoId
                          },
                          TipoHabitacion: { TipoHabitacionId: k.habId },
                          CantidadAdultos: ca,
                          CantidadMenores: k.kids,
                          CantidadInfantes: 0,
                          CantidadHabitaciones: 1,
                          HotetecIdeses: currentHotelec,
                          Habitacion: { HabitacionId: j.HabitacionId },
                          Entrada: searchItem.Entrada,
                          IsSinContrato: i.IsSinContrato,
                          Salida: searchItem.Salida
                        };

                        try {
                          let precioA = await authGetRoomPrice(roomPriceSearchObj);

                          if (precioA.data.length != 0 && precioA.data[0].PrecioOrden != 0) {
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

                    let planA = await authGetLodgingEatingPlanOne(lpa.PlanesAlimenticiosId);
                    listadoPrecios.push({
                      name: j.Nombre,
                      habitacion: j,
                      planAlimenticioCodigo: planA.data.Codigo,
                      planAlimenticioNombre: planA.data.Nombre,
                      planAlimenticio: lpa.PlanesAlimenticiosId,
                      hotelecData: hotelecData,
                      IsSinContrato: i.IsSinContrato,
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

        let ro = {
          tipo: "lodging",
          entrada: searchItem.Entrada,
          salida: searchItem.Salida,
          name: fullLodging.data.Nombre,
          stars: fullLodging.data.NumeroEstrellas,
          location: fullLodging.data.Direccion,
          images: [img.data.ImageContent],
          acomodation: resultadoAcomodacion,
          habitaciones: listadoPrecios,
          planesAlimenticios: fullLodging.data.ListaPlanesAlimenticios,
          lodging: i.Alojamiento
        };

        resultList.push(ro);
      }
    })
  );

  if (resultList.length > 0) {
    await saveSearchResult(resultList);
  }

  if (!currentHotelec) {
    try {
      const response = await hotetecOpenSession();
      if (response && response.data && response.data.Ideses) {
        currentHotelec = response.data.Ideses;
        localStorage.setItem("currentHotelecIds", currentHotelec);
      }
    } catch (error) {
      console.error("Error occurred while fetching or processing data:", error.message);
    }
  }

  console.log("resultList", resultList);
  return resultList;
}

export async function searchPreviousResult() {
  await hotelecSessionService.getOrCreateSession();
  return await getSearchResults();
}

export async function saveSearchResult(result) {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readwrite");
  const store = tx.objectStore("searchResults");
  await store.add(result);
  await tx.done;
}

export async function getSearchResults() {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readonly");
  const store = tx.objectStore("searchResults");
  const results = await store.getAll();
  await tx.done;
  return results[0];
}

export async function clearSearchResults() {
  const db = await dbPromise;
  const tx = db.transaction("searchResults", "readwrite");
  const store = tx.objectStore("searchResults");
  await store.clear();
  await tx.done;
}

export async function deleteDatabase() {
  const db = await dbPromise;
  await db.delete();
}

export async function performSearch(query) {
  // Placeholder helper matching mixin contract.
  const searchResult = { query, results: ["Result 1", "Result 2", "Result 3"] };
  await saveSearchResult(searchResult);
  return searchResult;
}

