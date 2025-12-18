import { AvailabilityMap, Player, OracleSuggestion } from "../types";

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

  // 2️⃣ Resolver nomes dos jogadores
  const playerNames = availability[bestDate]
    .map(id => players.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(", ");

  // 3️⃣ Criar o prompt
  const prompt = `
  Você é um oráculo místico do mundo de Faerûn.

  RETORNE APENAS UM JSON VÁLIDO.
  NÃO inclua explicações, introduções ou texto fora do JSON.

  Formato obrigatório:
  {
    "oracleMessage": "texto do presságio"
  }

  Regras do texto:
  - Curto (2 a 4 frases)
  - Poético
  - Em português
  - Escolha UMA categoria:
    - SORTE (Tymora)
    - AZAR (Beshaba ou Talos)
    - NEUTRO (Oghma ou Helm)
    - MELHOR NÃO SABER (Shar ou Cyric)

  Contexto:
  Data: ${bestDate}
  Jogadores: ${playerNames}
  `;

  // 4️⃣ Chamar a API (backend)
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro vindo da API:", data);
      throw new Error(data?.details || data?.error || "Erro ao consultar o Oráculo");
    }

    return {
      bestDate,
      playerCount: maxCount,
      oracleMessage: data.text
    };
  } catch (error) {
    console.error("Erro ao consultar o Oráculo:", error);
    return null;
  }
};
