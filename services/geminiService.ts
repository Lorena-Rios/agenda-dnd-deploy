import { AvailabilityMap, Player, OracleSuggestion } from "../types";
import { drawDivineSilence } from "../constants";

export const consultTheOracle = async (
  availability: AvailabilityMap,
  players: Player[]
): Promise<OracleSuggestion | null> => {

  // 1️⃣ Encontrar a data com mais jogadores
  let bestDate = "";
  let maxCount = -1;

  Object.entries(availability).forEach(([date, ids]) => {
    if (ids.length > maxCount) {
      maxCount = ids.length;
      bestDate = date;
    }
  });

  if (!bestDate || maxCount === 0) return null;

  // 2️⃣ Retornar diretamente uma mensagem divina local
  return {
    bestDate,
    playerCount: maxCount,
    oracleMessage: drawDivineSilence()
  };
};
