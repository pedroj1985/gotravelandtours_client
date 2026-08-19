import {
  authSearchLodging,
  authSearchRoomsByLodging,
  authGetLodging,
  authGetImage,
  hotetecOpenSession
} from "./auth";
import { hotelecSessionService } from "./hotelecSessionService";
import { buildRoomCombo } from "./roomBuilder";
import type { RoomLayout, RoomTypeInfo } from "../types/visitor";
import { calculateRoomPrices } from "./roomPriceCalculator";
import { saveSearchResult, getSearchResults } from "./searchPersistenceService";

export async function searchResult(
  searchItem: Record<string, unknown>,
  combination: RoomLayout | null,
  combinationV2: unknown,
  todosTipo: unknown,
  helpers: { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined }
) {
  let currentHotelec = await hotelecSessionService.getOrCreateSession();
  const resultList: Array<Record<string, unknown>> = [];

  const resultadoAcomodacion = combination ? buildRoomCombo(combination, (i: number) =>
    helpers.habitacionPorCantidadPersonas(i, todosTipo)
  ) : [];

  const { data } = await authSearchLodging(searchItem);

  await Promise.all(
    (data as Array<Record<string, unknown>>).map(async i => {
      if ((i.Alojamiento as Record<string, unknown>).ReferenciaHotetecId !== null) {
        const rooms = await authSearchRoomsByLodging((i.Alojamiento as Record<string, unknown>).ProductoId as number);
        const img = await authGetImage((i.Alojamiento as Record<string, unknown>).ProductoId as number);
        const fullLodging = await authGetLodging((i.Alojamiento as Record<string, unknown>).ProductoId as number);

        const listadoPrecios = await calculateRoomPrices(
          rooms,
          fullLodging,
          searchItem,
          currentHotelec,
          resultadoAcomodacion,
          i
        );

        const ro = {
          tipo: "lodging",
          entrada: searchItem.Entrada,
          salida: searchItem.Salida,
          name: (fullLodging.data as Record<string, unknown>).Nombre,
          stars: (fullLodging.data as Record<string, unknown>).NumeroEstrellas,
          location: (fullLodging.data as Record<string, unknown>).Direccion,
          images: [(img.data as Record<string, unknown>).ImageContent],
          acomodation: resultadoAcomodacion,
          habitaciones: listadoPrecios,
          planesAlimenticios: (fullLodging.data as Record<string, unknown>).ListaPlanesAlimenticios,
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
        currentHotelec = response.data.Ideses as string;
        localStorage.setItem("currentHotelecIds", currentHotelec);
      }
    } catch (error) {
      console.error(
        "Error occurred while fetching or processing data:",
        (error as Error).message
      );
    }
  }

  if (import.meta.env.DEV) { console.log("resultList", resultList); }
  return resultList;
}

export async function searchPreviousResult() {
  await hotelecSessionService.getOrCreateSession();
  return await getSearchResults();
}
