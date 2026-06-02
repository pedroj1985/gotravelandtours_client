import {
  authSearchLodging,
  authSearchRoomsByLodging,
  authGetLodging,
  authGetImage,
  hotetecOpenSession
} from "./auth";
import { hotelecSessionService } from "./hotelecSessionService";
import { buildRoomCombo } from "./roomBuilder";
import { calculateRoomPrices } from "./roomPriceCalculator";
import { saveSearchResult, getSearchResults } from "./searchPersistenceService";

export async function searchResult(
  searchItem,
  combination,
  combinationV2,
  todosTipo,
  helpers
) {
  let currentHotelec = await hotelecSessionService.getOrCreateSession();
  let resultList = [];

  let resultadoAcomodacion = buildRoomCombo(combination, i =>
    helpers.habitacionPorCantidadPersonas(i, todosTipo)
  );

  const { data } = await authSearchLodging(searchItem);

  await Promise.all(
    data.map(async i => {
      if (i.Alojamiento.ReferenciaHotetecId !== null) {
        const rooms = await authSearchRoomsByLodging(i.Alojamiento.ProductoId);
        const img = await authGetImage(i.Alojamiento.ProductoId);
        const fullLodging = await authGetLodging(i.Alojamiento.ProductoId);

        let listadoPrecios = await calculateRoomPrices(
          rooms,
          fullLodging,
          searchItem,
          currentHotelec,
          resultadoAcomodacion,
          i
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
      console.error(
        "Error occurred while fetching or processing data:",
        error.message
      );
    }
  }

  console.log("resultList", resultList);
  return resultList;
}

export async function searchPreviousResult() {
  await hotelecSessionService.getOrCreateSession();
  return await getSearchResults();
}
